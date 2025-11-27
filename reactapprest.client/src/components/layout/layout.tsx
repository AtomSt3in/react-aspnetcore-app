import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "../../hooks/auth/useAuth";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "../../styles/custom.css";

export function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const sidebarRef = useRef<HTMLDivElement>(null);
  const { usuario, cargando, logout } = useAuth();

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  // Cerrar sidebar al hacer clic fuera
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (
        sidebarOpen &&
        sidebarRef.current &&
        !sidebarRef.current.contains(e.target as Node) &&
        !(e.target as Element)?.classList.contains("openbtn")
      ) {
        closeSidebar();
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [sidebarOpen]);

  // Cerrar al cambiar ruta
  useEffect(() => {
    closeSidebar();
  }, [location]);

  // Link activo
  const isActiveLink = (path: string) =>
    path === "/"
      ? location.pathname === "/"
      : location.pathname.startsWith(path);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (err) {
      console.error("Error al cerrar sesión:", err);
    }
  };

  // Loading
  if (cargando) {
    return (
      <div className="loading-app">
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" />
          <p className="text-muted">Cargando aplicación...</p>
        </div>
      </div>
    );
  }

  // No autenticado
  if (!usuario) {
    navigate("/login");
    return null;
  }

  return (
    <div className="d-flex">
      {/* Overlay móvil */}
      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={closeSidebar}></div>
      )}

      {/* Sidebar */}
      <aside
        ref={sidebarRef}
        className={`sidebar ${sidebarOpen ? "open" : ""}`}
      >
        <div className="sidebar-header user-info">
          <div className="d-flex align-items-center w-100">
            <div
              className="user-avatar rounded-circle d-flex align-items-center justify-content-center me-3"
              style={{
                width: "40px",
                height: "40px",
                background: "#3b82f6",
              }}
            >
              <i className="fas fa-user text-white"></i>
            </div>

            <div className="user-details flex-grow-1">
              <span className="user-name fw-semibold text-white">
                {usuario.NombreCompleto || usuario.Nombre}
              </span>
              <span className="user-email text-white opacity-75 d-block">
                {usuario.Email}
              </span>
            </div>
          </div>

          <button className="close-btn" onClick={closeSidebar}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        {/* Menú */}
        <nav className="sidebar-menu">
          <Link
            to="/"
            className={isActiveLink("/") ? "active" : ""}
            onClick={closeSidebar}
          >
            <i className="fas fa-user-graduate"></i> <span>Alumnos</span>
          </Link>

          <Link
            to="/grados"
            className={isActiveLink("/grados") ? "active" : ""}
            onClick={closeSidebar}
          >
            <i className="fas fa-layer-group"></i> <span>Grados</span>
          </Link>

          <Link
            to="/importar"
            className={isActiveLink("/importar") ? "active" : ""}
            onClick={closeSidebar}
          >
            <i className="fas fa-file-import"></i> <span>Importar Datos</span>
          </Link>

          <hr className="text-secondary mx-3" />

          <button className="logout-btn" onClick={handleLogout}>
            <i className="fas fa-sign-out-alt"></i> <span>Cerrar Sesión</span>
          </button>
        </nav>
      </aside>

      {/* Contenido principal */}
      <main className="content">
        {/* HEADER CORREGIDO */}
        <header className="content-header">
          <div className="header-inner">
            <button className="openbtn header-burger" onClick={toggleSidebar}>
              <i className="fas fa-bars"></i>
            </button>

            <h2 className="header-title">
              {location.pathname === "/" && "Alumnos"}
              {location.pathname.startsWith("/grados") && "Grados"}
              {location.pathname.startsWith("/importar") && "Importar Datos"}
              {location.pathname.startsWith("/reportes") && "Reportes"}
            </h2>
          </div>
        </header>

        {/* Contenido dinámico */}
        <section className="p-4">
          <Outlet />
        </section>
      </main>
    </div>
  );
}
