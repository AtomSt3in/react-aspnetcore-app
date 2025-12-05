import { useEffect, useState, useCallback } from "react";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import type { IAlumno } from "../interfaces/IAlumno";
import { alumnoService } from "../services/alumnoService";

/* --- Types --- */
type Mapping = Record<string, string | null>;
type RowErrors = { index: number; messages: string[] };
type ErrorsByCell = Record<number, Record<string, string | null>>;

const SESSION_KEY = "bulkWizard_v3";

/* --- Helpers --- */
const normalize = (s: string) =>
  s
    .toString()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[\s_\-\.]/g, "");

function levenshtein(a: string, b: string) {
  // simple Levenshtein distance
  const m = a.length,
    n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () =>
    Array(n + 1).fill(0)
  );
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + cost
      );
    }
  }
  return dp[m][n];
}

/* Candidate target fields (from your IAlumno) */
const TARGET_FIELDS = [
  "caAlumnTNombre",
  "caAlumnTApellidoPaterno",
  "caAlumnTApellidoMaterno",
  "caAlumnTTelefono",
  "caGradNId",
  "caAlumnBActivo",
];

/* synonyms for auto mapping */
const MATCH_HINTS: Record<string, string[]> = {
  caAlumnTNombre: ["nombre", "name", "first", "nombres"],
  caAlumnTApellidoPaterno: [
    "apellido_paterno",
    "paterno",
    "lastname",
    "last",
  ],
  caAlumnTApellidoMaterno: [
    "apellido_materno",
    "materno",
    "secondlastname",
  ],
  caAlumnTTelefono: ["telefono", "phone", "celular", "mobile"],
  caGradNId: ["grado", "gradoid", "grade", "idgrado", "gradeid"],
  caAlumnBActivo: ["activo", "status", "enabled", "isactive"],
};

export default function useBulkUpload() {
  const [fileInfo, setFileInfo] = useState<{ name: string; size: number } | null>(null);
  const [rawRows, setRawRows] = useState<Record<string, any>[]>([]);
  const [parsedRows, setParsedRows] = useState<Record<string, any>[]>([]);
  const [mapping, setMapping] = useState<Mapping>({});
  const [errors, setErrors] = useState<RowErrors[]>([]);
  const [errorsByCell, setErrorsByCell] = useState<ErrorsByCell>({});
  const [suggestedMapping, setSuggestedMapping] = useState<Mapping>({});

  /* --- session persistence --- */
  useEffect(() => {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (raw) {
      try {
        const s = JSON.parse(raw);
        if (s.fileInfo) setFileInfo(s.fileInfo);
        if (s.rawRows) {
          setRawRows(s.rawRows);
          setParsedRows(s.parsedRows || s.rawRows);
        }
        if (s.mapping) setMapping(s.mapping);
        if (s.step) {
          /* wizard step handled in WizardForm; we persist only data here */
        }
      } catch {}
    }
  }, []);

  useEffect(() => {
    const payload = { fileInfo, rawRows, parsedRows, mapping, suggestedMapping };
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(payload));
  }, [fileInfo, rawRows, parsedRows, mapping, suggestedMapping]);

  /* --- Auto map algorithm --- */
  const autoMapColumns = useCallback((columns: string[]) => {
    const map: Mapping = {};
    columns.forEach((col) => {
      const n = normalize(col);
      // direct hint match
      let found: string | null = null;
      for (const target of TARGET_FIELDS) {
        const hints = MATCH_HINTS[target] || [];
        if (hints.some((h) => n.includes(h))) {
          found = target;
          break;
        }
      }
      // if not found, fuzzy match by normalized name
      if (!found) {
        let best: { target: string; score: number } | null = null;
        for (const target of TARGET_FIELDS) {
          const tnorm = normalize(target);
          const d = levenshtein(n, tnorm);
          const score = 1 - d / Math.max(n.length, tnorm.length, 1);
          if (!best || score > best.score) best = { target, score };
        }
        if (best && best.score > 0.55) found = best.target; // threshold
      }
      map[col] = found;
    });
    setSuggestedMapping(map);
    return map;
  }, []);

  /* --- parsing --- */
  const reset = () => {
    setFileInfo(null);
    setRawRows([]);
    setParsedRows([]);
    setMapping({});
    setSuggestedMapping({});
    setErrors([]);
    setErrorsByCell({});
    sessionStorage.removeItem(SESSION_KEY);
  };

  const parseFile = async (file: File | null) => {
    if (!file) {
      reset();
      return;
    }

    setFileInfo({ name: file.name, size: file.size });

    const ext = file.name.split(".").pop()?.toLowerCase();

    try {
      if (ext === "csv" || ext === "txt") {
        const text = await file.text();
        const detectedJSON = text.trim().startsWith("{") || text.trim().startsWith("[");
        if (detectedJSON) {
          // fallback: user renamed .json as .csv
          const json = JSON.parse(text);
          if (Array.isArray(json)) {
            setRawRows(json as Record<string, any>[]);
            setParsedRows(json as Record<string, any>[]);
            const cols = Object.keys(json[0] || {});
            const auto = autoMapColumns(cols);
            const initial: Mapping = {};
            cols.forEach((c) => (initial[c] = auto[c] ?? null));
            setMapping(initial);
            setErrors([]);
            return;
          }
        }
        const result = Papa.parse<Record<string, any>>(text, {
          header: true,
          skipEmptyLines: true,
        });
        setRawRows(result.data as Record<string, any>[]);
        setParsedRows(result.data as Record<string, any>[]);
        if (result.data.length) {
          const cols = Object.keys(result.data[0]);
          const auto = autoMapColumns(cols);
          const initial: Mapping = {};
          cols.forEach((c) => (initial[c] = auto[c] ?? null));
          setMapping(initial);
        } else {
          setMapping({});
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
          const cols = Object.keys(json[0]);
          const auto = autoMapColumns(cols);
          const initial: Mapping = {};
          cols.forEach((c) => (initial[c] = auto[c] ?? null));
          setMapping(initial);
        } else {
          setMapping({});
        }
      } else if (ext === "json") {
        const text = await file.text();
        const json = JSON.parse(text) as Record<string, any>[];
        setRawRows(json);
        setParsedRows(json);
        if (json.length) {
          const cols = Object.keys(json[0]);
          const auto = autoMapColumns(cols);
          const initial: Mapping = {};
          cols.forEach((c) => (initial[c] = auto[c] ?? null));
          setMapping(initial);
        } else {
          setMapping({});
        }
      } else {
        throw new Error("Formato no soportado");
      }
    } catch (err) {
      reset();
      throw err;
    }

    setErrors([]);
    setErrorsByCell({});
  };

  /* --- validation --- */
  const validateRows = useCallback((rows: Record<string, any>[], map: Mapping) => {
    const rowErrors: RowErrors[] = [];
    const cellErrors: ErrorsByCell = {};

    rows.forEach((r, idx) => {
      const messages: string[] = [];
      cellErrors[idx] = {};

      const target: any = {};

      Object.entries(map).forEach(([col, field]) => {
        if (!field) return;
        const raw = r[col];

        switch (field) {
          case "caGradNId": {
            const n = Number(raw);
            if (Number.isNaN(n) || !Number.isFinite(n) || n <= 0) {
              messages.push("caGradNId inválido");
              cellErrors[idx][field] = "espera número entero";
            } else {
              target[field] = Math.trunc(n);
            }
            break;
          }
          case "caAlumnBActivo": {
            if (typeof raw === "boolean") target[field] = raw;
            else if (String(raw).toLowerCase() === "true" || String(raw) === "1") target[field] = true;
            else if (String(raw).toLowerCase() === "false" || String(raw) === "0") target[field] = false;
            else {
              messages.push("caAlumnBActivo inválido");
              cellErrors[idx][field] = "espera booleano (true/false o 1/0)";
            }
            break;
          }
          default:
            target[field] = raw !== undefined && raw !== null ? String(raw).trim() : "";
        }
      });

      // basic required
      if (!target.caAlumnTNombre || target.caAlumnTNombre.length === 0) {
        messages.push("Nombre requerido");
        cellErrors[idx]["caAlumnTNombre"] = "requerido";
      }
      if (!target.caAlumnTApellidoPaterno || target.caAlumnTApellidoPaterno.length === 0) {
        messages.push("Apellido paterno requerido");
        cellErrors[idx]["caAlumnTApellidoPaterno"] = "requerido";
      }
      if (typeof target.caGradNId !== "number" || !target.caGradNId) {
        messages.push("caGradNId inválido o no mapeado");
        cellErrors[idx]["caGradNId"] = "requerido";
      }

      if (messages.length) rowErrors.push({ index: idx, messages });
    });

    setErrors(rowErrors);
    setErrorsByCell(cellErrors);
    return { rowErrors, cellErrors };
  }, []);

  useEffect(() => {
    // revalidate when parsedRows or mapping changes
    if (parsedRows.length && Object.keys(mapping).length) {
      validateRows(parsedRows, mapping);
    } else {
      setErrors([]);
      setErrorsByCell({});
    }
  }, [parsedRows, mapping, validateRows]);

  /* --- update single cell from preview edits --- */
  const updateCell = (rowIndex: number, fieldOrCol: string, value: any) => {
    // fieldOrCol can be a mapped field name OR original column name.
    // We prefer to accept mapped field names (i.e. target), but Preview will call with target names.
    setParsedRows((prev) => {
      const next = prev.map((r, i) => (i === rowIndex ? { ...r, [fieldOrCol]: value } : r));
      // But if user edited target name cell (like caAlumnTNombre), we need to map back to original rawRows structure.
      // For simplicity: store edits on parsedRows and when building payload we use parsedRows as source.
      return next;
    });
  };

  /* --- build payload for backend (map parsedRows -> IAlumno[]) --- */
  const buildPayload = (): { payload: IAlumno[]; errorsFound: RowErrors[] } => {
    const payload: IAlumno[] = [];
    const found: RowErrors[] = [];

    // Use parsedRows (which can be edited). But parsedRows currently have original column keys.
    // We need to produce target objects by using mapping: for each raw column => field
    parsedRows.forEach((row, idx) => {
      const target: any = {};
      const rowMessages: string[] = [];

      Object.entries(mapping).forEach(([col, field]) => {
        if (!field) return;
        const value = row[col] ?? row[field]; // allow users that edited by field keys
        switch (field) {
          case "caGradNId": {
            const n = Number(value);
            if (Number.isNaN(n) || !Number.isFinite(n) || n <= 0) {
              rowMessages.push(`${field} espera número entero`);
            } else target[field] = Math.trunc(n);
            break;
          }
          case "caAlumnBActivo": {
            if (typeof value === "boolean") target[field] = value;
            else if (String(value).toLowerCase() === "true" || String(value) === "1") target[field] = true;
            else if (String(value).toLowerCase() === "false" || String(value) === "0") target[field] = false;
            else {
              rowMessages.push(`${field} espera booleano`);
            }
            break;
          }
          default:
            target[field] = value !== undefined && value !== null ? String(value).trim() : "";
        }
      });

      // basic required
      if (!target.caAlumnTNombre || target.caAlumnTNombre.length === 0) rowMessages.push("Nombre requerido");
      if (!target.caAlumnTApellidoPaterno || target.caAlumnTApellidoPaterno.length === 0) rowMessages.push("Apellido paterno requerido");
      if (typeof target.caGradNId !== "number" || !target.caGradNId) rowMessages.push("caGradNId inválido o no mapeado");

      if (rowMessages.length) found.push({ index: idx, messages: rowMessages });

      // default values
      if (target.caAlumnBActivo === undefined) target.caAlumnBActivo = true;
      payload.push(target as IAlumno);
    });

    return { payload, errorsFound: found };
  };

  const uploadBulk = async () => {
    const { payload, errorsFound } = buildPayload();
    setErrors(errorsFound);
    if (errorsFound.length) {
      // Do not upload if errors exist
      throw new Error("Existen errores en los datos. Corrige antes de enviar.");
    }

    await alumnoService.crearMultiple(payload);
    // after success
    reset();
  };

  return {
    fileInfo,
    rawRows,
    parsedRows,
    setParsedRows,
    mapping,
    setMapping,
    suggestedMapping,
    setSuggestedMapping,
    errors,
    errorsByCell,
    parseFile,
    autoMapColumns,
    updateCell,
    buildPayload,
    uploadBulk,
    reset,
  };
}
