import React, { useState, type ChangeEvent } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export default function Results() {
  const [resultados, setResultados] = useState<
    {
      id: number;
      nombre: string;
      evaluacion: string;
      puntaje: number;
      fecha: string;
      archivoPDF?: File | null;
      comentarios: string;
    }[]
  >([]);
  const [editId, setEditId] = useState<number | null>(null);

  const [nombre, setNombre] = useState("");
  const [evaluacion, setEvaluacion] = useState("");
  const [puntaje, setPuntaje] = useState("");
  const [fecha, setFecha] = useState("");
  const [archivoPDF, setArchivoPDF] = useState<File | null>(null);
  const [comentarios, setComentarios] = useState("");

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

  const limpiarFormulario = () => {
    setNombre("");
    setEvaluacion("");
    setPuntaje("");
    setFecha("");
    setArchivoPDF(null);
    setComentarios("");
    const inputFile = document.getElementById(
      "archivoInput"
    ) as HTMLInputElement | null;
    if (inputFile) inputFile.value = "";
    setEditId(null);
  };

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
      limpiarFormulario();
    } else {
      const nuevo = {
        id: Date.now(),
        nombre,
        evaluacion,
        puntaje: puntajeNum,
        fecha,
        archivoPDF,
        comentarios,
      };
      setResultados([...resultados, nuevo]);
      limpiarFormulario();
    }
  };

  const handleEliminar = (id: number) => {
    if (confirm("¿Estás seguro de eliminar este resultado?")) {
      setResultados((prev) => prev.filter((r) => r.id !== id));
      if (editId === id) limpiarFormulario();
    }
  };

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

  // Estilos del componente, igual que en Evaluations
  const pageStyle: React.CSSProperties = {
    maxWidth: "1000px",
    margin: "0 auto",
    marginBottom: "10px",
    position: "relative",
  };

  const containerStyle: React.CSSProperties = {
    backgroundColor: "#f9f9f9",
    padding: "20px",
    borderRadius: "10px",
    marginBottom: "30px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
  };

  const labelStyle: React.CSSProperties = {
    fontWeight: "bold",
    marginBottom: 6,
    display: "block",
    color: "#262d7d",
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    marginBottom: 15,
    fontSize: 16,
    boxSizing: "border-box",
    color: "#333",
    backgroundColor: "white",
  };

  const textareaStyle: React.CSSProperties = {
    ...inputStyle,
    resize: "vertical",
    minHeight: 70,
  };

  const buttonStyle: React.CSSProperties = {
    backgroundColor: "#262d7d",
    color: "white",
    padding: "14px 0",
    width: "100%",
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: 18,
    marginTop: 10,
  };

  const tableStyle: React.CSSProperties = {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: 16,
    borderRadius: 8,
    overflow: "hidden",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
  };

  const thStyle: React.CSSProperties = {
    backgroundColor: "#262d7d",
    color: "white",
    padding: "12px 15px",
    textAlign: "left",
    borderBottom: "2px solid #1b2568",
  };

  const tdStyle: React.CSSProperties = {
    padding: "12px 15px",
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

  return (
    <div style={pageStyle}>
      {/* Regresar */}
      <div
        style={{ position: "fixed", top: "20px", left: "20px", zIndex: 1000 }}
      >
        <button
          onClick={() => window.history.back()}
          style={{
            background: "none",
            border: "none",
            color: "#262d7d",
            fontWeight: "bold",
            fontSize: "16px",
            cursor: "pointer",
            textDecoration: "underline",
          }}
        >
          ← Regresar a Dashboard
        </button>
      </div>

      <h2
        style={{
          textAlign: "center",
          color: "#262d7d",
          marginTop: "60px",
          fontSize: "28px",
        }}
      >
        Resultados de Evaluaciones
      </h2>

      {/* Contenedor formulario */}
      <div style={containerStyle}>
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
          style={{ marginBottom: 20 }}
        />

        <label style={labelStyle}>Comentarios adicionales</label>
        <textarea
          value={comentarios}
          onChange={(e) => setComentarios(e.target.value)}
          style={textareaStyle}
          placeholder="Comentarios o notas adicionales"
        />

        <button style={buttonStyle} onClick={handleAgregar}>
          {editId !== null ? "Actualizar" : "Agregar"}
        </button>
      </div>

      {/* Tabla resultados */}
      <div style={containerStyle}>
        <table
          style={{
            ...tableStyle,
            minWidth: "900px", // ancho mínimo para que no se comprima
            maxWidth: "100%", // para que no se salga del contenedor
            margin: "0 auto", // para centrar horizontalmente
          }}
        >
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

        {/* Botón exportar */}
        <div style={{ marginTop: 20, textAlign: "center" }}>
          <button
            style={{ ...buttonStyle, maxWidth: 250 }}
            onClick={exportarExcel}
          >
            Exportar a Excel
          </button>
        </div>
      </div>
    </div>
  );
}
