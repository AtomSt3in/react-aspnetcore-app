import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import type { IAlumno } from '../../interfaces/IAlumno';
import type { IGrado } from '../../interfaces/IGrado';
import { alumnoService } from '../../services/alumnoService';
import { gradoService } from '../../services/gradoService';

// Estado inicial del alumno
const initialAlumno: IAlumno = {
  caAlumnTNombre: '',
  caAlumnTApellidoPaterno: '',
  caAlumnTApellidoMaterno: '',
  caAlumnTTelefono: '',
  caGradNId: 0,
  caAlumnBActivo: true,
};

export const useNuevoAlumno = () => {
  const [alumno, setAlumno] = useState<IAlumno>(initialAlumno);
  const [grados, setGrados] = useState<IGrado[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  // Cargar grados al inicializar el componente
  const cargarGrados = useCallback(async () => {
    try {
      setLoading(true);
      const data = await gradoService.obtenerTodos();
      setGrados(data);
    } catch (error) {
      console.error('Error al cargar grados:', error);
      Swal.fire('Error', 'No se pudieron cargar los grados', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    cargarGrados();
  }, [cargarGrados]);

  // Manejar cambios en inputs de texto
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setAlumno(prev => ({ ...prev, [name]: value }));
  };

  // Manejar cambios en el select de grados
  const handleSelectChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAlumno(prev => ({ ...prev, caGradNId: parseInt(event.target.value) }));
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

  // Guardar alumno
  const guardarAlumno = async () => {
    if (!validarFormulario()) return;

    try {
      setSaving(true);
      await alumnoService.crear(alumno);
      
      Swal.fire({
        title: '¡Éxito!',
        text: 'Alumno guardado correctamente',
        icon: 'success',
        confirmButtonColor: '#1e3a8a',
        background: '#f8fafc'
      });
      
      navigate('/');
    } catch (error) {
      console.error('Error al guardar alumno:', error);
      Swal.fire('Error', 'No se pudo guardar el alumno', 'error');
    } finally {
      setSaving(false);
    }
  };

  // Volver a la lista
  const volverALista = () => {
    navigate('/');
  };

  // Resetear formulario
  const resetearFormulario = () => {
    setAlumno(initialAlumno);
  };

  return {
    alumno,
    grados,
    loading,
    saving,
    handleInputChange,
    handleSelectChange,
    guardarAlumno,
    volverALista,
    resetearFormulario
  };
};