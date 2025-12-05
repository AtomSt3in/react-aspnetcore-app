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

export default function ConfirmStep({ rows, errors, onBack, onConfirm }: Props) {
  const [sending, setSending] = useState(false);

  const handleConfirm = async () => {
    if (errors.length) {
      if (!confirm("Hay errores detectados. ¿Deseas continuar de todas formas?")) return;
    }
    setSending(true);
    try {
      await onConfirm();
    } finally {
      setSending(false);
    }
  };

  return (
    <div>
      <p className="text-muted">Último paso: se enviarán {rows.length} registros (se respetarán los mapeos realizados).</p>

      <div className="d-flex justify-content-between mt-3">
        <Button color="secondary" onClick={onBack} outline>← Atrás</Button>
        <Button color="primary" onClick={handleConfirm} disabled={sending}>
          {sending ? "Enviando..." : "Enviar carga"}
        </Button>
      </div>
    </div>
  );
}
