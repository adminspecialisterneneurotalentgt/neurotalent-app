import React, { useState } from "react";

interface Report {
  id: number;
  candidato: string;
  evaluacion: string;
  fecha: string;
  puntaje: number;
}

const thStyle: React.CSSProperties = {
  backgroundColor: "#f1f1f1",
  padding: "10px",
  textAlign: "left",
  borderBottom: "2px solid #ccc",
};

const tdStyle: React.CSSProperties = {
  padding: "10px",
  borderBottom: "1px solid #ddd",
};

export default function Reports() {
  const [reports] = useState<Report[]>([]); // SIN DATOS INICIALES, solo la variable usada

  return (
    <div
      style={{
        backgroundColor: "#262d7d",
        minHeight: "100vh",
        padding: "40px",
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "16px",
          padding: "30px",
          maxWidth: "1000px",
          margin: "auto",
          boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
        }}
      >
        <h2
          style={{
            color: "#262d7d",
            textAlign: "center",
            marginBottom: "20px",
          }}
        >
          Reporte General de Evaluaciones
        </h2>

        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={thStyle}>Candidato</th>
              <th style={thStyle}>Evaluación</th>
              <th style={thStyle}>Fecha</th>
              <th style={thStyle}>Puntaje</th>
            </tr>
          </thead>
          <tbody>
            {reports.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  style={{
                    textAlign: "center",
                    padding: "20px",
                    color: "#888",
                  }}
                >
                  No hay reportes registrados.
                </td>
              </tr>
            ) : (
              reports.map((r) => (
                <tr key={r.id}>
                  <td style={tdStyle}>{r.candidato}</td>
                  <td style={tdStyle}>{r.evaluacion}</td>
                  <td style={tdStyle}>{r.fecha}</td>
                  <td style={tdStyle}>{r.puntaje}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
