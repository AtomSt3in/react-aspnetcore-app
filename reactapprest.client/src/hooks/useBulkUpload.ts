import { useState } from "react";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import type { IAlumno } from "../interfaces/IAlumno";
import { alumnoService } from "../services/alumnoService";

type Mapping = Record<string, string | null>;

export default function useBulkUpload() {
  const [fileInfo, setFileInfo] = useState<{
    name: string;
    size: number;
  } | null>(null);
  const [rawRows, setRawRows] = useState<Record<string, any>[]>([]);
  const [parsedRows, setParsedRows] = useState<Record<string, any>[]>([]);
  const [mapping, setMapping] = useState<Mapping>({});
  const [errors, setErrors] = useState<{ index: number; messages: string[] }[]>(
    []
  );

  const reset = () => {
    setFileInfo(null);
    setRawRows([]);
    setParsedRows([]);
    setMapping({});
    setErrors([]);
  };

  const parseFile = async (file: File | null) => {
    if (!file) return reset();

    setFileInfo({ name: file.name, size: file.size });

    const ext = file.name.split(".").pop()?.toLowerCase();

    if (ext === "csv") {
      const text = await file.text();
      const result = Papa.parse<Record<string, any>>(text, {
        header: true,
        skipEmptyLines: true,
        dynamicTyping: false,
      });
      setRawRows(result.data as Record<string, any>[]);
      setParsedRows(result.data as Record<string, any>[]);
      // initialize mapping
      if (result.data.length) {
        const initialMapping: Mapping = {};
        Object.keys(result.data[0]).forEach((k) => (initialMapping[k] = null));
        setMapping(initialMapping);
      }
    } else if (ext === "xlsx" || ext === "xls") {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const json = XLSX.utils.sheet_to_json<Record<string, any>>(sheet, {
        defval: "",
      });
      setRawRows(json);
      setParsedRows(json);
      if (json.length) {
        const initialMapping: Mapping = {};
        Object.keys(json[0]).forEach((k) => (initialMapping[k] = null));
        setMapping(initialMapping);
      }
    } else if (ext === "json") {
      const text = await file.text();
      try {
        const json = JSON.parse(text) as Record<string, any>[];
        setRawRows(json);
        setParsedRows(json);
        if (json.length) {
          const initialMapping: Mapping = {};
          Object.keys(json[0]).forEach((k) => (initialMapping[k] = null));
          setMapping(initialMapping);
        }
      } catch (e) {
        throw new Error("JSON inválido");
      }
    } else {
      throw new Error("Formato no soportado");
    }

    // reset previous errors
    setErrors([]);
  };

  // Validate and create payload according to mapping
  const buildPayload = (): {
    payload: IAlumno[];
    errors: { index: number; messages: string[] }[];
  } => {
    const payload: IAlumno[] = [];
    const foundErrors: { index: number; messages: string[] }[] = [];

    rawRows.forEach((row, idx) => {
      const target: any = {};
      Object.entries(mapping).forEach(([col, field]) => {
        if (!field) return; // ignored column
        const value = row[col];
        switch (field) {
          case "caGradNId":
            // expect integer
            const n = Number(value);
            if (Number.isNaN(n) || !Number.isFinite(n)) {
              foundErrors.push({
                index: idx,
                messages: [`${field} espera número entero`],
              });
            } else {
              target[field] = Math.trunc(n);
            }
            break;
          case "caAlumnBActivo":
            // expect boolean
            if (typeof value === "boolean") target[field] = value;
            else if (
              String(value).toLowerCase() === "true" ||
              String(value) === "1"
            )
              target[field] = true;
            else if (
              String(value).toLowerCase() === "false" ||
              String(value) === "0"
            )
              target[field] = false;
            else {
              foundErrors.push({
                index: idx,
                messages: [`${field} espera booleano (true/false o 1/0)`],
              });
            }
            break;
          default:
            // string fields
            target[field] =
              value !== undefined && value !== null ? String(value).trim() : "";
        }
      });

      // Basic required validation
      if (!target.caAlumnTNombre || target.caAlumnTNombre.length === 0) {
        foundErrors.push({ index: idx, messages: ["Nombre requerido"] });
      }
      if (
        !target.caAlumnTApellidoPaterno ||
        target.caAlumnTApellidoPaterno.length === 0
      ) {
        foundErrors.push({
          index: idx,
          messages: ["Apellido paterno requerido"],
        });
      }
      if (typeof target.caGradNId !== "number" || target.caGradNId === 0) {
        foundErrors.push({
          index: idx,
          messages: ["caGradNId inválido o no mapeado"],
        });
      }

      payload.push(target as IAlumno);
    });

    return { payload, errors: foundErrors };
  };

  const uploadBulk = async () => {
    const { payload, errors: found } = buildPayload();
    setErrors(found);
    setParsedRows(payload as any);
    if (found.length) {
      // still allow upload but caller may decide; here we throw to force user to review
      throw new Error("Existen errores en los datos. Corrige antes de enviar.");
    }

    // call backend endpoint
    await alumnoService.crearMultiple(payload);
  };

  return {
    fileInfo,
    parsedRows,
    mapping,
    setMapping,
    errors,
    setFileInfo,
    parseFile,
    uploadBulk,
    reset,
  };
}
