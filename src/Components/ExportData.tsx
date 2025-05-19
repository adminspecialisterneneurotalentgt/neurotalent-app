import React, { useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

interface Report {
  id: number;
  candidato: string;
  evaluacion: string;
  fecha: string;
  puntaje: number;
}

export default function ExportData() {
  const [reports, setReports] = useState<Report[]>([]);

  const agregarEjemplo = () => {
    const nuevo: Report = {
      id: Date.now(),
      candidato: "Ejemplo",
      evaluacion: "Razonamiento",
      fecha: new Date().toISOString().split("T")[0],
      puntaje: Math.floor(Math.random() * 100),
    };
    setReports((prev) => [...prev, nuevo]);
  };

  const exportToPDF = () => {
    if (reports.length === 0) {
      alert("No hay datos para exportar.");
      return;
    }

    const doc = new jsPDF();
    doc.text("Reporte de Evaluaciones", 14, 16);
    autoTable(doc, {
      head: [["Candidato", "Evaluación", "Fecha", "Puntaje"]],
      body: reports.map((r) => [
        r.candidato,
        r.evaluacion,
        r.fecha,
        r.puntaje.toString(),
      ]),
      startY: 20,
    });
    doc.save("reporte-evaluaciones.pdf");
  };

  const exportToExcel = () => {
    if (reports.length === 0) {
      alert("No hay datos para exportar.");
      return;
    }

    const ws = XLSX.utils.json_to_sheet(reports);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Evaluaciones");
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, "reporte-evaluaciones.xlsx");
  };

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
          Exportar Reporte de Evaluaciones
        </h2>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "20px",
            marginBottom: "30px",
            flexWrap: "wrap",
          }}
        >
          <button onClick={agregarEjemplo} style={buttonStyle}>
            Agregar Ejemplo
          </button>
          <button onClick={exportToPDF} style={buttonStyle}>
            Exportar a PDF
          </button>
          <button onClick={exportToExcel} style={buttonStyle}>
            Exportar a Excel
          </button>
        </div>

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
                  No hay datos para exportar.
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

// ✅ Estilos
const buttonStyle: React.CSSProperties = {
  padding: "10px 20px",
  backgroundColor: "#262d7d",
  color: "white",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
};

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
