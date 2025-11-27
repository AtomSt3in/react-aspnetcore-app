import { useState } from "react";
import { Button } from "reactstrap";

type Mapping = Record<string, string | null>;

type Props = {
  rows: Record<string, any>[];
  mapping: Mapping;
  errors: { index: number; messages: string[] }[];
  onBack: () => void;
  onConfirm: () => Promise<void>;
};

export default function ConfirmStep({
  rows,
  errors,
  onBack,
  onConfirm,
}: Props) {
  const [sending, setSending] = useState(false);

  const handleConfirm = async () => {
    if (errors.length) {
      if (
        !confirm("Hay errores detectados. ¿Deseas continuar de todas formas?")
      )
        return;
    }
    setSending(true);
    await onConfirm();
    setSending(false);
    alert("Carga finalizada. Revisa la lista de alumnos.");
  };

  return (
    <div>
      <p className="text-muted">
        Último paso: se enviarán {rows.length} registros (se respetarán los
        mapeos realizados).
      </p>

      <div className="mb-3">
        <strong>Errores detectados:</strong>
        <ul>
          {errors.slice(0, 10).map((e) => (
            <li key={e.index}>
              Fila {e.index + 1}: {e.messages.join(", ")}
            </li>
          ))}
        </ul>
      </div>

      <div className="d-flex justify-content-between mt-3">
        <Button color="secondary" onClick={onBack} outline>
          ← Atrás
        </Button>
        <Button color="primary" onClick={handleConfirm} disabled={sending}>
          {sending ? "Enviando..." : "Enviar carga"}
        </Button>
      </div>
    </div>
  );
}
