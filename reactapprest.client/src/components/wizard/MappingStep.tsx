import { Row, Col, FormGroup, Label, Input, Button } from 'reactstrap';


type Mapping = Record<string, string | null>;


type Props = {
sampleRow?: Record<string, any>;
mapping: Mapping;
setMapping: (m: Mapping) => void;
onNext: () => void;
onBack: () => void;
};


const TARGET_FIELDS = [
'caAlumnTNombre',
'caAlumnTApellidoPaterno',
'caAlumnTApellidoMaterno',
'caAlumnTTelefono',
'caGradNId',
'caAlumnBActivo'
];


export default function MappingStep({ sampleRow, mapping, setMapping, onNext, onBack }: Props) {
const columns = sampleRow ? Object.keys(sampleRow) : [];


const handleChange = (column: string, field: string | null) => {
setMapping({ ...mapping, [column]: field });
};


return (
<div>
<p className="text-muted">Mapea las columnas de tu archivo a los campos esperados por el sistema.</p>


{!columns.length && <div className="text-muted">No se detectaron columnas (sube un archivo válido).</div>}


{columns.map(col => (
<Row className="g-2 mb-2" key={col}>
<Col md={6}><div className="fw-semibold">{col}</div><div className="text-muted small">Ej: {String(sampleRow![col])}</div></Col>
<Col md={6}>
<FormGroup>
<Label for={`map-${col}`}>Campo destino</Label>
<Input id={`map-${col}`} type="select" value={mapping[col] ?? ''} onChange={(e) => handleChange(col, e.target.value || null)}>
<option value="">-- Ignorar --</option>
{TARGET_FIELDS.map(f => <option key={f} value={f}>{f}</option>)}
</Input>
</FormGroup>
</Col>
</Row>
))}


<div className="d-flex justify-content-between mt-3">
<Button color="secondary" onClick={onBack} outline>← Atrás</Button>
<Button color="primary" onClick={onNext}>Siguiente →</Button>
</div>
</div>
);
}