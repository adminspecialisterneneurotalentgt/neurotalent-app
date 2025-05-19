import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faUsers,
  faClipboardList,
  faFileAlt,
  faChartBar,
  faDownload,
  faChartPie,
  faCogs,
  faUsersCog,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

library.add(
  faUsers,
  faClipboardList,
  faFileAlt,
  faChartBar,
  faDownload,
  faChartPie,
  faCogs,
  faUsersCog
);

interface DashboardProps {
  role: string;
  onLogout: () => void;
  userEmail: string;
  userPhotoUrl?: string;
}

export default function Dashboard({
  role,
  onLogout,
  userEmail,
  userPhotoUrl,
}: DashboardProps) {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const isAdmin = role === "admin";
  const isTester = role === "tester";
  const isSupervisor = role === "supervisor";
  const isCandidate = role === "candidate";

  const getRoleLabel = () => {
    switch (role) {
      case "admin":
        return "Administrador";
      case "tester":
        return "Tester";
      case "supervisor":
        return "Supervisor";
      case "candidate":
        return "Candidato";
      default:
        return "Usuario";
    }
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);

  const DashboardButton = ({
    icon,
    label,
    onClick,
  }: {
    icon: any;
    label: string;
    onClick: () => void;
  }) => (
    <button
      onClick={onClick}
      style={{
        padding: "35px 25px",
        fontSize: "1.4rem",
        borderRadius: "12px",
        backgroundColor: "#1e2a72",
        color: "white",
        border: "none",
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "12px",
        transition: "background-color 0.3s ease",
        width: "100%",
        maxWidth: "250px",
        boxShadow: "0 4px 8px rgba(0,0,0,0.15)",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#FFD700")}
      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#1e2a72")}
    >
      <FontAwesomeIcon icon={icon} style={{ fontSize: "2.4rem" }} />
      {label}
    </button>
  );

  return (
    <div
      style={{
        height: "100vh",
        backgroundColor: "#262d7d",
        display: "flex",
        flexDirection: "column",
        color: "white",
        fontSize: "1.3rem",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* Logo arriba izquierda fijo */}
      <div
        style={{
          position: "fixed",
          top: 20,
          left: 30,
          zIndex: 999,
        }}
      >
        <img
          src="/logowhite.png"
          alt="Logo"
          style={{
            height: 240,
            objectFit: "contain",
          }}
        />
      </div>

      {/* Barra superior derecha */}
      <div
        style={{
          position: "fixed",
          top: 20,
          right: 40,
          display: "flex",
          alignItems: "center",
          gap: "12px",
          userSelect: "none",
          fontWeight: "bold",
          fontSize: "1rem",
          zIndex: 1000,
          cursor: "default",
        }}
        ref={menuRef}
      >
        {userPhotoUrl && (
          <img
            src={userPhotoUrl}
            alt="User profile"
            style={{
              width: 40,
              height: 40,
              fontSize: "18px",
              borderRadius: "50%",
              objectFit: "cover",
              cursor: "pointer",
            }}
            onClick={() => setMenuOpen(!menuOpen)}
          />
        )}

        <div
          onClick={() => setMenuOpen(!menuOpen)}
          style={{
            cursor: "pointer",
            color: "#262d7d",
            textShadow:
              "-1px -1px 0 white, 1px -1px 0 white, -1px 1px 0 white, 1px 1px 0 white",
            fontWeight: "bold",
          }}
        >
          {getRoleLabel()}
        </div>

        {menuOpen && (
          <div
            style={{
              position: "absolute",
              top: 50,
              right: 0,
              backgroundColor: "#fff",
              color: "#000",
              borderRadius: "6px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
              padding: "12px",
              minWidth: "220px",
              zIndex: 1000,
            }}
          >
            <p style={{ margin: 0, fontWeight: "bold" }}>{userEmail}</p>
            <button
              onClick={onLogout}
              style={{
                marginTop: "12px",
                width: "100%",
                padding: "10px",
                backgroundColor: "#4285f4",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontWeight: "bold",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "#e74c3c")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "#4285f4")
              }
            >
              Cerrar sesión
            </button>
          </div>
        )}
      </div>

      {/* Contenido general - ALINEADO ARRIBA */}
      <div
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          padding: "60px 20px 20px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            textAlign: "center",
            maxWidth: 1100,
            width: "100%",
          }}
        >
          <h2
            style={{
              marginBottom: "6px",
              fontSize: "2.2rem",
              fontWeight: "bold",
            }}
          >
            Panel Principal
          </h2>
          <p
            style={{
              marginBottom: "12px",
              fontSize: "1.4rem",
              fontWeight: "500",
            }}
          >
            Bienvenido, <strong>{getRoleLabel()}</strong>
          </p>
          <p
            style={{
              marginBottom: "30px",
              fontSize: "1.2rem",
              fontStyle: "italic",
              opacity: 0.85,
            }}
          >
            PUTAMADRE MIERDA DE PROGRAMACION a nuestro portal de gestiones. Aquí
            podrás administrar candidatos, evaluaciones, reportes y mucho más.
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "30px",
              justifyItems: "center",
              width: "100%",
            }}
          >
            {isAdmin && (
              <>
                <DashboardButton
                  icon={faUsers}
                  label="Candidatos"
                  onClick={() => navigate("/candidatos")}
                />
                <DashboardButton
                  icon={faClipboardList}
                  label="Evaluaciones"
                  onClick={() => navigate("/evaluaciones")}
                />
                <DashboardButton
                  icon={faChartBar}
                  label="Resultados"
                  onClick={() => navigate("/resultados")}
                />
                <DashboardButton
                  icon={faFileAlt}
                  label="Reportes"
                  onClick={() => navigate("/reportes")}
                />
                <DashboardButton
                  icon={faDownload}
                  label="Exportar Datos"
                  onClick={() => navigate("/exportar")}
                />
                <DashboardButton
                  icon={faChartPie}
                  label="Estadísticas"
                  onClick={() => navigate("/estadisticas")}
                />
                <DashboardButton
                  icon={faCogs}
                  label="Configuración"
                  onClick={() => navigate("/configuracion")}
                />
                <DashboardButton
                  icon={faUsersCog}
                  label="Usuarios"
                  onClick={() => navigate("/usuarios")}
                />
              </>
            )}

            {isTester && (
              <>
                <DashboardButton
                  icon={faClipboardList}
                  label="Evaluaciones"
                  onClick={() => navigate("/evaluaciones")}
                />
                <DashboardButton
                  icon={faChartBar}
                  label="Resultados"
                  onClick={() => navigate("/resultados")}
                />
              </>
            )}
            {isSupervisor && (
              <>
                <DashboardButton
                  icon={faFileAlt}
                  label="Reportes"
                  onClick={() => navigate("/reportes")}
                />
                <DashboardButton
                  icon={faChartPie}
                  label="Estadísticas"
                  onClick={() => navigate("/estadisticas")}
                />
              </>
            )}
            {isCandidate && (
              <DashboardButton
                icon={faChartBar}
                label="Resultados"
                onClick={() => navigate("/resultados")}
              />
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer
        style={{
          padding: "10px 0",
          color: "#ccc",
          fontSize: "0.8rem",
          textAlign: "center",
          width: "100%",
          borderTop: "1px solid rgba(255,255,255,0.2)",
        }}
      >
        &copy; {new Date().getFullYear()} Specialisterne NeuroTalent. Todos los
        derechos reservados.
      </footer>
    </div>
  );
}
