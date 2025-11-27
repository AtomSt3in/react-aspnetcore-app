import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { AlumnoList } from "./components/alumnos/lista";
import { EditarAlumno } from "./components/alumnos/editarAlumno";
import "./styles/custom.css";
import { NuevoAlumno } from "./components/alumnos/nuevoAlumno";
import { Layout } from "./components/layout/layout";
import { GradoList } from "./components/grados/lista";
import WizardForm from "./components/wizard/wizardForm";
import { Login } from "./components/auth/login";
import { Registro } from "./components/auth/registrar";
import { useAuth } from "./hooks/auth/useAuth";

// Componente para proteger rutas
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { usuario, cargando } = useAuth();

  if (cargando) {
    return (
      <div className="loading-app">
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p className="text-muted">Verificando autenticación...</p>
        </div>
      </div>
    );
  }

  return usuario ? <>{children}</> : <Navigate to="/login" replace />;
}

// Componente para rutas públicas (login/registro) cuando ya está autenticado
function PublicRoute({ children }: { children: React.ReactNode }) {
  const { usuario, cargando } = useAuth();

  if (cargando) {
    return (
      <div className="loading-app">
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p className="text-muted">Cargando...</p>
        </div>
      </div>
    );
  }

  return !usuario ? <>{children}</> : <Navigate to="/" replace />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/login" element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        } />
        <Route path="/registro" element={
          <PublicRoute>
            <Registro />
          </PublicRoute>
        } />
        
        {/* Rutas protegidas */}
        <Route path="/" element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }>
          <Route index element={<AlumnoList />} />
          <Route path="/nuevoalumno" element={<NuevoAlumno />} />
          <Route path="/editaralumno/:id" element={<EditarAlumno />} />
          <Route path="/grados" element={<GradoList />} />
          <Route path="/importar" element={<WizardForm />} />
        </Route>

        {/* Ruta por defecto */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;