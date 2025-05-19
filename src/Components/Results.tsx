import React from "react";

// ✅ ESTILOS TIPADOS
const thStyle: React.CSSProperties = {
  padding: "10px",
  borderBottom: "2px solid #ccc",
  textAlign: "left",
  backgroundColor: "#f1f1f1",
};

const tdStyle: React.CSSProperties = {
  padding: "10px",
  borderBottom: "1px solid #ddd",
};

interface Resultado {
  nombre: string;
  evaluacion: string;
  puntaje: number;
}

export default function Results() {
  // 🔹 Sin datos aún, quedará vacío hasta que se conecte a backend
  const resultados: Resultado[] = [];

  return (
    <div
      style={{
        backgroundColor: "#262d7d",
        minHeight: "100vh",
        padding: "40px",
        color: "white",
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          color: "#262d7d",
          borderRadius: "16px",
          padding: "30px",
          maxWidth: "800px",
          margin: "auto",
          boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
          Resultados de Evaluaciones
        </h2>

        <table style={{ width: "100%", borderCollapse: "collapse" }}>
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
                <td
                  colSpan={3}
                  style={{
                    textAlign: "center",
                    padding: "20px",
                    color: "#888",
                  }}
                >
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
