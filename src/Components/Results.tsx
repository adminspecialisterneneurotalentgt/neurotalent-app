import React, { useState, ChangeEvent } from "react";

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
  padding: "40px 50px",
  maxWidth: 1000,
  width: "100%",
  border: "2px solid #262d7d",
  display: "flex",
  gap: 40,
  boxSizing: "border-box",
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
  fontSize: 26,
  marginBottom: 32,
  lineHeight: 1.2,
};

const backLinkStyle: React.CSSProperties = {
  display: "inline-block",
  marginBottom: 20,
  color: "#262d7d",
  cursor: "pointer",
  textDecoration: "underline",
};

const formStyle: React.CSSProperties = {
  marginBottom: 50,
};

const labelStyle: React.CSSProperties = {
  display: "block",
  marginBottom: 6,
  fontWeight: "600",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "14px 16px",
  borderRadius: 8,
  border: "1px solid #ccc",
  marginBottom: 24,
  fontSize: 18,
  boxSizing: "border-box",
  lineHeight: 1.4,
};

const buttonStyle: React.CSSProperties = {
  backgroundColor: "#262d7d",
  color: "white",
  padding: "14px 0",
  width: "100%",
  border: "none",
  borderRadius: 8,
  cursor: "pointer",
  fontWeight: "bold",
  fontSize: 18,
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
  fecha: string;
  archivoPDF?: File;
}

export default function Results() {
  // Estado para resultados
  const [resultados, setResultados] = useState<Resultado[]>([]);

  // Estados formulario
  const [nombre, setNombre] = useState("");
  const [evaluacion, setEvaluacion] = useState("");
  const [puntaje, setPuntaje] = useState("");
  const [fecha, setFecha] = useState("");
  const [archivoPDF, setArchivoPDF] = useState<File | null>(null);

  // Manejar archivo PDF
  const handleArchivoChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      setArchivoPDF(null);
      return;
    }
    const file = e.target.files[0];
    if (file.type !== "application/pdf") {
      alert("Solo se permiten archivos PDF.");
      e.target.value = "";
      setArchivoPDF(null);
      return;
    }
    setArchivoPDF(file);
  };

  // Agregar resultado
  const handleAgregar = () => {
    if (!nombre || !evaluacion || !puntaje || !fecha) {
      alert("Por favor completa todos los campos.");
      return;
    }
    if (!archivoPDF) {
      alert("Por favor selecciona un archivo PDF.");
      return;
    }

    const puntajeNum = Number(puntaje);
    if (isNaN(puntajeNum) || puntajeNum < 0 || puntajeNum > 100) {
      alert("Puntaje debe ser un número entre 0 y 100.");
      return;
    }

    // Agregar resultado nuevo (archivo se guarda solo en estado, backend se implementa aparte)
    setResultados([
      ...resultados,
      { nombre, evaluacion, puntaje: puntajeNum, fecha, archivoPDF },
    ]);

    // Limpiar formulario
    setNombre("");
    setEvaluacion("");
    setPuntaje("");
    setFecha("");
    setArchivoPDF(null);
  };

  // Regresar a dashboard
  const handleRegresar = () => {
    window.history.back();
  };

  return (
    <div style={pageStyle}>
      <div style={containerStyle}>
        {/* Panel izquierdo: Formulario y tabla */}
        <div style={leftPanelStyle}>
          {/* Botón regresar */}
          <a style={backLinkStyle} onClick={handleRegresar}>
            ← Regresar a Dashboard
          </a>

          {/* Título */}
          <h2 style={titleStyle}>Resultados de Evaluaciones</h2>

          {/* Formulario */}
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

            <label style={labelStyle}>Fecha</label>
            <input
              type="date"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              style={inputStyle}
            />

            <label style={labelStyle}>Archivo PDF</label>
            <input
              type="file"
              accept="application/pdf"
              onChange={handleArchivoChange}
              style={{ marginBottom: 24 }}
            />

            <button style={buttonStyle} onClick={handleAgregar}>
              Agregar
            </button>
          </div>

          {/* Tabla */}
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>Nombre</th>
                <th style={thStyle}>Evaluación</th>
                <th style={thStyle}>Puntaje</th>
                <th style={thStyle}>Fecha</th>
                <th style={thStyle}>Archivo</th>
              </tr>
            </thead>
            <tbody>
              {resultados.length === 0 ? (
                <tr>
                  <td colSpan={5} style={emptyRowStyle}>
                    No hay resultados registrados.
                  </td>
                </tr>
              ) : (
                resultados.map((res, i) => (
                  <tr key={i}>
                    <td style={tdStyle}>{res.nombre}</td>
                    <td style={tdStyle}>{res.evaluacion}</td>
                    <td style={tdStyle}>{res.puntaje}</td>
                    <td style={tdStyle}>{res.fecha}</td>
                    <td style={tdStyle}>
                      {res.archivoPDF ? res.archivoPDF.name : "Sin archivo"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Panel derecho: Logo */}
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
