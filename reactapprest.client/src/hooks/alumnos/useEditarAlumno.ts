import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import type { IAlumno } from '../../interfaces/IAlumno';
import type { IGrado } from '../../interfaces/IGrado';
import { alumnoService } from '../../services/alumnoService';
import { gradoService } from '../../services/gradoService';

// Estado inicial del alumno
const initialAlumno: IAlumno = {
  caAlumnNId: 0,
  caAlumnTNombre: '',
  caAlumnTApellidoPaterno: '',
  caAlumnTApellidoMaterno: '',
  caAlumnTTelefono: '',
  caGradNId: 0,
  caAlumnBActivo: true,
};

export const useEditarAlumno = () => {
  const { id } = useParams<{ id: string }>();
  const [alumno, setAlumno] = useState<IAlumno>(initialAlumno);
  const [grados, setGrados] = useState<IGrado[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  // Cargar grados
  const cargarGrados = useCallback(async () => {
    try {
      const data = await gradoService.obtenerTodos();
      setGrados(data);
    } catch (error) {
      console.error('Error al cargar grados:', error);
      Swal.fire('Error', 'No se pudieron cargar los grados', 'error');
    }
  }, []);

  // Cargar alumno por ID
  const cargarAlumno = useCallback(async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      const alumnoData = await alumnoService.obtenerPorId(parseInt(id));
      setAlumno(alumnoData);
    } catch (error) {
      console.error('Error al cargar alumno:', error);
      Swal.fire('Error', 'No se pudo cargar el alumno', 'error');
      navigate('/');
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  // Efecto para cargar datos iniciales
  useEffect(() => {
    const cargarDatos = async () => {
      await Promise.all([cargarGrados(), cargarAlumno()]);
    };
    
    cargarDatos();
  }, [cargarGrados, cargarAlumno]);

  // Manejar cambios en inputs de texto
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setAlumno(prev => ({ ...prev, [name]: value }));
  };

  // Manejar cambios en el select de grados
  const handleSelectChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAlumno(prev => ({ ...prev, caGradNId: parseInt(event.target.value) }));
  };

  // CORREGIDO: Manejar cambio de estado activo/inactivo
  const toggleEstado = (event: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = event.target.checked;
    setAlumno(prev => ({ 
      ...prev, 
      caAlumnBActivo: isChecked 
    }));
  };

  // Validar formulario
  const validarFormulario = (): boolean => {
    const { caAlumnTNombre, caAlumnTApellidoPaterno, caGradNId } = alumno;
    
    if (!caAlumnTNombre.trim()) {
      Swal.fire('Error', 'El nombre es obligatorio', 'warning');
      return false;
    }
    
    if (!caAlumnTApellidoPaterno.trim()) {
      Swal.fire('Error', 'El apellido paterno es obligatorio', 'warning');
      return false;
    }
    
    if (caGradNId === 0) {
      Swal.fire('Error', 'Debe seleccionar un grado', 'warning');
      return false;
    }
    
    return true;
  };

  // Guardar cambios del alumno
  const guardarCambios = async () => {
    if (!validarFormulario()) return;

    try {
      setSaving(true);
      await alumnoService.editar(alumno);
      
      Swal.fire({
        title: '¡Éxito!',
        text: 'Alumno actualizado correctamente',
        icon: 'success',
        confirmButtonColor: '#1e3a8a',
        background: '#f8fafc'
      });
      
      navigate('/');
    } catch (error) {
      console.error('Error al editar alumno:', error);
      Swal.fire('Error', 'No se pudo actualizar el alumno', 'error');
    } finally {
      setSaving(false);
    }
  };

  // Volver a la lista
  const volverALista = () => {
    navigate('/');
  };

  return {
    alumno,
    grados,
    loading,
    saving,
    handleInputChange,
    handleSelectChange,
    toggleEstado,
    guardarCambios,
    volverALista
  };
};