import React, { useState } from "react";
import type { ChangeEvent } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const pageStyle: React.CSSProperties = {
  backgroundColor: "#262d7d",
  minHeight: "100vh",
  padding: 40,
  color: "white",
  maxWidth: "1200px",
  margin: "0 auto",
  boxSizing: "border-box",
};

const backLinkStyle: React.CSSProperties = {
  color: "white",
  cursor: "pointer",
  textDecoration: "underline",
  marginBottom: 20,
  display: "inline-block",
  fontWeight: "bold",
};

const titleStyle: React.CSSProperties = {
  fontWeight: "bold",
  fontSize: 28,
  marginBottom: 24,
  color: "white",
};

const formStyle: React.CSSProperties = {
  backgroundColor: "#fff",
  padding: 30,
  borderRadius: 12,
  marginBottom: 40,
  color: "#262d7d",
  boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  marginBottom: 8,
  fontWeight: "600",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "14px 16px",
  borderRadius: 6,
  border: "1px solid #ccc",
  marginBottom: 24,
  fontSize: 16,
  boxSizing: "border-box",
};

const textareaStyle: React.CSSProperties = {
  ...inputStyle,
  resize: "vertical",
  minHeight: "60px",
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
  backgroundColor: "white",
  borderRadius: 12,
  overflow: "hidden",
};

const thStyle: React.CSSProperties = {
  backgroundColor: "#262d7d",
  color: "white",
  padding: "12px",
  textAlign: "left",
  borderBottom: "2px solid #ccc",
};

const tdStyle: React.CSSProperties = {
  padding: "12px",
  borderBottom: "1px solid #ddd",
  color: "#333",
  verticalAlign: "top",
};

const actionButtonStyle: React.CSSProperties = {
  marginRight: 10,
  padding: "6px 12px",
  borderRadius: 6,
  border: "none",
  cursor: "pointer",
  fontWeight: "bold",
};

interface Resultado {
  id: number;
  nombre: string;
  evaluacion: string;
  puntaje: number;
  fecha: string;
  archivoPDF?: File;
  comentarios: string;
}

export default function Results() {
  // Estados
  const [resultados, setResultados] = useState<Resultado[]>([]);
  const [editId, setEditId] = useState<number | null>(null);

  // Formulario
  const [nombre, setNombre] = useState("");
  const [evaluacion, setEvaluacion] = useState("");
  const [puntaje, setPuntaje] = useState("");
  const [fecha, setFecha] = useState("");
  const [archivoPDF, setArchivoPDF] = useState<File | null>(null);
  const [comentarios, setComentarios] = useState("");

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

  // Validar y agregar o actualizar resultado
  const handleAgregar = () => {
    if (!nombre || !evaluacion || !puntaje || !fecha) {
      alert("Por favor completa todos los campos obligatorios.");
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

    if (editId !== null) {
      // Actualizar
      setResultados((prev) =>
        prev.map((r) =>
          r.id === editId
            ? {
                id: editId,
                nombre,
                evaluacion,
                puntaje: puntajeNum,
                fecha,
                archivoPDF,
                comentarios,
              }
            : r
        )
      );
      setEditId(null);
    } else {
      // Nuevo
      const nuevo: Resultado = {
        id: Date.now(),
        nombre,
        evaluacion,
        puntaje: puntajeNum,
        fecha,
        archivoPDF,
        comentarios,
      };
      setResultados([...resultados, nuevo]);
    }

    limpiarFormulario();
  };

  const limpiarFormulario = () => {
    setNombre("");
    setEvaluacion("");
    setPuntaje("");
    setFecha("");
    setArchivoPDF(null);
    setComentarios("");
    // Limpiar input file manualmente si quieres:
    const inputFile = document.getElementById(
      "archivoInput"
    ) as HTMLInputElement | null;
    if (inputFile) inputFile.value = "";
  };

  // Eliminar resultado
  const handleEliminar = (id: number) => {
    if (confirm("¿Estás seguro de eliminar este resultado?")) {
      setResultados((prev) => prev.filter((r) => r.id !== id));
      if (editId === id) limpiarFormulario();
    }
  };

  // Editar resultado
  const handleEditar = (id: number) => {
    const res = resultados.find((r) => r.id === id);
    if (!res) return;
    setEditId(id);
    setNombre(res.nombre);
    setEvaluacion(res.evaluacion);
    setPuntaje(res.puntaje.toString());
    setFecha(res.fecha);
    setArchivoPDF(res.archivoPDF || null);
    setComentarios(res.comentarios);
  };

  // Exportar Excel
  const exportarExcel = () => {
    if (resultados.length === 0) {
      alert("No hay resultados para exportar.");
      return;
    }
    const datos = resultados.map(({ id, archivoPDF, ...rest }) => rest);
    const ws = XLSX.utils.json_to_sheet(datos);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Resultados");
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, "ResultadosEvaluaciones.xlsx");
  };

  // Regresar
  const handleRegresar = () => {
    window.history.back();
  };

  return (
    <div style={pageStyle}>
      <a style={backLinkStyle} onClick={handleRegresar}>
        ← Regresar a Dashboard
      </a>

      <h1 style={titleStyle}>Resultados de Evaluaciones</h1>

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
          id="archivoInput"
          type="file"
          accept="application/pdf"
          onChange={handleArchivoChange}
          style={{ marginBottom: 24 }}
        />

        <label style={labelStyle}>Comentarios adicionales</label>
        <textarea
          value={comentarios}
          onChange={(e) => setComentarios(e.target.value)}
          style={textareaStyle}
          placeholder="Comentarios o notas adicionales"
          rows={3}
        />

        <button style={buttonStyle} onClick={handleAgregar}>
          {editId !== null ? "Actualizar" : "Agregar"}
        </button>
      </div>

      {/* Tabla de resultados */}
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>Nombre</th>
            <th style={thStyle}>Evaluación</th>
            <th style={thStyle}>Puntaje</th>
            <th style={thStyle}>Fecha</th>
            <th style={thStyle}>Archivo</th>
            <th style={thStyle}>Comentarios</th>
            <th style={thStyle}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {resultados.length === 0 ? (
            <tr>
              <td
                colSpan={7}
                style={{
                  ...tdStyle,
                  textAlign: "center",
                  fontStyle: "italic",
                  color: "#888",
                }}
              >
                No hay resultados registrados.
              </td>
            </tr>
          ) : (
            resultados.map((res) => (
              <tr key={res.id}>
                <td style={tdStyle}>{res.nombre}</td>
                <td style={tdStyle}>{res.evaluacion}</td>
                <td style={tdStyle}>{res.puntaje}</td>
                <td style={tdStyle}>{res.fecha}</td>
                <td style={tdStyle}>
                  {res.archivoPDF ? res.archivoPDF.name : "Sin archivo"}
                </td>
                <td style={tdStyle}>{res.comentarios}</td>
                <td style={tdStyle}>
                  <button
                    style={{
                      ...actionButtonStyle,
                      backgroundColor: "#3498db",
                      color: "white",
                    }}
                    onClick={() => handleEditar(res.id)}
                  >
                    Editar
                  </button>
                  <button
                    style={{
                      ...actionButtonStyle,
                      backgroundColor: "#e74c3c",
                      color: "white",
                    }}
                    onClick={() => handleEliminar(res.id)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Botón Exportar */}
      <div style={{ marginTop: 30, textAlign: "center" }}>
        <button
          style={{ ...buttonStyle, maxWidth: 250 }}
          onClick={exportarExcel}
        >
          Exportar a Excel
        </button>
      </div>
    </div>
  );
}
