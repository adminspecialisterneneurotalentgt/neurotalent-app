import React, { useState } from "react";

const pageStyle: React.CSSProperties = {
  backgroundColor: "#262d7d",
  minHeight: "100vh",
  padding: 40,
  color: "white",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const containerStyle: React.CSSProperties = {
  backgroundColor: "white",
  color: "#262d7d",
  borderRadius: 16,
  padding: 30,
  maxWidth: 900,
  width: "100%",
  border: "2px solid #262d7d",
  display: "flex",
  gap: 30,
};

const leftPanelStyle: React.CSSProperties = {
  flex: 1,
};

const rightPanelStyle: React.CSSProperties = {
  width: 180,
  display: "flex",
  justifyContent: "center",
  alignItems: "flex-start",
};

const titleStyle: React.CSSProperties = {
  fontWeight: "bold",
  fontSize: 22,
  marginBottom: 24,
};

const backLinkStyle: React.CSSProperties = {
  display: "inline-block",
  marginBottom: 20,
  color: "#262d7d",
  cursor: "pointer",
  textDecoration: "underline",
};

const formStyle: React.CSSProperties = {
  marginBottom: 40,
};

const labelStyle: React.CSSProperties = {
  display: "block",
  marginBottom: 6,
  fontWeight: "600",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: 10,
  borderRadius: 6,
  border: "1px solid #ccc",
  marginBottom: 20,
  fontSize: 16,
  boxSizing: "border-box",
};

const buttonStyle: React.CSSProperties = {
  backgroundColor: "#262d7d",
  color: "white",
  padding: "12px 0",
  width: "100%",
  border: "none",
  borderRadius: 6,
  cursor: "pointer",
  fontWeight: "bold",
  fontSize: 16,
};

const tableStyle: React.CSSProperties = {
  width: "100%",
  borderCollapse: "collapse",
  fontSize: 16,
};

const thStyle: React.CSSProperties = {
  textAlign: "left",
  padding: "12px 15px",
  backgroundColor: "#f1f1f1",
  color: "#262d7d",
  fontWeight: "bold",
  borderBottom: "2px solid #ccc",
};

const tdStyle: React.CSSProperties = {
  padding: "12px 15px",
  borderBottom: "1px solid #ddd",
  color: "#444",
};

const emptyRowStyle: React.CSSProperties = {
  textAlign: "center",
  padding: 30,
  color: "#888",
  fontStyle: "italic",
};

interface Resultado {
  nombre: string;
  evaluacion: string;
  puntaje: number;
}

export default function Results() {
  // Estado para resultados guardados
  const [resultados, setResultados] = useState<Resultado[]>([]);

  // Estados para formulario de nuevo resultado
  const [nombre, setNombre] = useState("");
  const [evaluacion, setEvaluacion] = useState("");
  const [puntaje, setPuntaje] = useState("");

  // Función para agregar resultado desde formulario
  const handleAgregar = () => {
    if (!nombre || !evaluacion || !puntaje) {
      alert("Por favor completa todos los campos");
      return;
    }
    const puntajeNum = Number(puntaje);
    if (isNaN(puntajeNum) || puntajeNum < 0 || puntajeNum > 100) {
      alert("Puntaje debe ser un número entre 0 y 100");
      return;
    }
    setResultados([...resultados, { nombre, evaluacion, puntaje: puntajeNum }]);
    setNombre("");
    setEvaluacion("");
    setPuntaje("");
  };

  // Función para regresar a Dashboard
  const handleRegresar = () => {
    window.history.back();
  };

  return (
    <div style={pageStyle}>
      {/* Contenedor principal blanco con bordes azules */}
      <div style={containerStyle}>
        {/* Panel izquierdo: Formulario y tabla */}
        <div style={leftPanelStyle}>
          {/* Botón regresar */}
          <a style={backLinkStyle} onClick={handleRegresar}>
            ← Regresar a Dashboard
          </a>

          {/* Título */}
          <h2 style={titleStyle}>Resultados de Evaluaciones</h2>

          {/* Formulario para agregar resultado */}
          <div style={formStyle}>
            <label style={labelStyle}>Nombre</label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              style={inputStyle}
              placeholder="Nombre del candidato"
            />

            <label style={labelStyle}>Evaluación</label>
            <input
              type="text"
              value={evaluacion}
              onChange={(e) => setEvaluacion(e.target.value)}
              style={inputStyle}
              placeholder="Nombre de la evaluación"
            />

            <label style={labelStyle}>Puntaje</label>
            <input
              type="number"
              value={puntaje}
              onChange={(e) => setPuntaje(e.target.value)}
              style={inputStyle}
              placeholder="0 - 100"
              min={0}
              max={100}
            />

            <button style={buttonStyle} onClick={handleAgregar}>
              Agregar
            </button>
          </div>

          {/* Tabla con resultados */}
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>Nombre</th>
                <th style={thStyle}>Evaluación</th>
                <th style={thStyle}>Puntaje</th>
              </tr>
            </thead>
            <tbody>
              {resultados.length === 0 ? (
                <tr>
                  <td colSpan={3} style={emptyRowStyle}>
                    No hay resultados registrados.
                  </td>
                </tr>
              ) : (
                resultados.map((res, i) => (
                  <tr key={i}>
                    <td style={tdStyle}>{res.nombre}</td>
                    <td style={tdStyle}>{res.evaluacion}</td>
                    <td style={tdStyle}>{res.puntaje}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Panel derecho: Imagen logo */}
        <div style={rightPanelStyle}>
          <img
            src="/logo.png"
            alt="Logo Specialisterne"
            style={{ maxWidth: "100%", height: "auto" }}
          />
        </div>
      </div>
    </div>
  );
}
