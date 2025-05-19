import React from "react";

const containerStyle: React.CSSProperties = {
  backgroundColor: "white",
  color: "#262d7d",
  borderRadius: 16,
  padding: 30,
  maxWidth: 800,
  margin: "auto",
  boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
};

const pageStyle: React.CSSProperties = {
  backgroundColor: "#262d7d",
  minHeight: "100vh",
  padding: 40,
  color: "white",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
};

const titleStyle: React.CSSProperties = {
  textAlign: "center",
  fontWeight: "bold",
  fontSize: 22,
  marginBottom: 24,
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
  const resultados: Resultado[] = []; // Aquí se conectará backend luego

  return (
    <div style={pageStyle}>
      <div style={containerStyle}>
        <h2 style={titleStyle}>Resultados de Evaluaciones</h2>

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
    </div>
  );
}
