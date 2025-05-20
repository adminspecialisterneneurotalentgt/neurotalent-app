import React, { useState, type ChangeEvent } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export default function Reports() {
  const [reports, setReports] = useState<
    {
      id: number;
      candidato: string;
      evaluacion: string;
      puntaje: number;
      fecha: string;
      archivoUrl?: string | null;
      comentarios: string;
    }[]
  >([]);
  const [paginaActual, setPaginaActual] = useState(1);
  const resultadosPorPagina = 5;

  const totalPaginas = Math.ceil(reports.length / resultadosPorPagina);
  const inicio = (paginaActual - 1) * resultadosPorPagina;
  const fin = inicio + resultadosPorPagina;
  const resultadosPagina = reports.slice(inicio, fin);

  const [editId, setEditId] = useState<number | null>(null);

  const [candidato, setCandidato] = useState("");
  const [evaluacion, setEvaluacion] = useState("");
  const [puntaje, setPuntaje] = useState("");
  const [fecha, setFecha] = useState("");
  const [archivoUrl, setArchivoUrl] = useState<string | null>(null);
  const [comentarios, setComentarios] = useState("");

  const handleArchivoChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      setArchivoUrl(null);
      return;
    }
    const file = e.target.files[0];
    if (file.type !== "application/pdf") {
      alert("Solo se permiten archivos PDF.");
      e.target.value = "";
      setArchivoUrl(null);
      return;
    }
    // En este ejemplo creamos URL local para previsualizar
    const url = URL.createObjectURL(file);
    setArchivoUrl(url);
  };

  const limpiarFormulario = () => {
    setCandidato("");
    setEvaluacion("");
    setPuntaje("");
    setFecha("");
    setArchivoUrl(null);
    setComentarios("");
    const inputFile = document.getElementById(
      "archivoInput"
    ) as HTMLInputElement | null;
    if (inputFile) inputFile.value = "";
    setEditId(null);
  };

  const handleAgregar = () => {
    if (!candidato || !evaluacion || !puntaje || !fecha) {
      alert("Por favor completa todos los campos obligatorios.");
      return;
    }
    if (!archivoUrl) {
      alert("Por favor selecciona un archivo PDF.");
      return;
    }
    const puntajeNum = Number(puntaje);
    if (isNaN(puntajeNum) || puntajeNum < 0 || puntajeNum > 100) {
      alert("Puntaje debe ser un número entre 0 y 100.");
      return;
    }

    if (editId !== null) {
      setReports((prev) =>
        prev.map((r) =>
          r.id === editId
            ? {
                id: editId,
                candidato,
                evaluacion,
                puntaje: puntajeNum,
                fecha,
                archivoUrl,
                comentarios,
              }
            : r
        )
      );
      limpiarFormulario();
    } else {
      const nuevo = {
        id: Date.now(),
        candidato,
        evaluacion,
        puntaje: puntajeNum,
        fecha,
        archivoUrl,
        comentarios,
      };
      setReports([...reports, nuevo]);
      limpiarFormulario();
    }
  };

  const handleEliminar = (id: number) => {
    if (confirm("¿Estás seguro de eliminar este reporte?")) {
      setReports((prev) => prev.filter((r) => r.id !== id));
      if (editId === id) limpiarFormulario();
    }
  };

  const handleEditar = (id: number) => {
    const rep = reports.find((r) => r.id === id);
    if (!rep) return;
    setEditId(id);
    setCandidato(rep.candidato);
    setEvaluacion(rep.evaluacion);
    setPuntaje(rep.puntaje.toString());
    setFecha(rep.fecha);
    setArchivoUrl(rep.archivoUrl || null);
    setComentarios(rep.comentarios);
  };

  const exportarExcel = () => {
    if (reports.length === 0) {
      alert("No hay reportes para exportar.");
      return;
    }
    const datos = reports.map(({ id, ...rest }) => rest);
    const ws = XLSX.utils.json_to_sheet(datos);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Reportes");
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, "ReportesEvaluaciones.xlsx");
  };

  // Estilos igual que Results
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
    color: "#000",
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
        Reportes de Evaluaciones
      </h2>

      {/* Logo */}
      <div style={{ position: "relative" }}>
        <img
          src="/logo.png"
          alt="Logo"
          style={{
            position: "absolute",
            top: "10px",
            right: "-450px",
            height: "350px",
            objectFit: "contain",
          }}
        />
      </div>

      {/* Contenedor formulario */}
      <div style={containerStyle}>
        <label style={labelStyle}>Candidato</label>
        <input
          type="text"
          value={candidato}
          onChange={(e) => setCandidato(e.target.value)}
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
            minWidth: "900px",
            maxWidth: "100%",
            margin: "0 auto",
          }}
        >
          <thead>
            <tr>
              <th style={thStyle}>Candidato</th>
              <th style={thStyle}>Evaluación</th>
              <th style={thStyle}>Puntaje</th>
              <th style={thStyle}>Fecha</th>
              <th style={thStyle}>Archivo</th>
              <th style={thStyle}>Comentarios</th>
              <th style={thStyle}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {reports.length === 0 ? (
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
                  No hay reportes registrados.
                </td>
              </tr>
            ) : (
              resultadosPagina.map((rep) => (
                <tr key={rep.id}>
                  <td style={tdStyle}>{rep.candidato}</td>
                  <td style={tdStyle}>{rep.evaluacion}</td>
                  <td style={tdStyle}>{rep.puntaje}</td>
                  <td style={tdStyle}>{rep.fecha}</td>
                  <td style={tdStyle}>
                    {rep.archivoUrl ? (
                      <a
                        href={rep.archivoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Ver archivo
                      </a>
                    ) : (
                      "Sin archivo"
                    )}
                  </td>
                  <td style={tdStyle}>{rep.comentarios}</td>
                  <td style={tdStyle}>
                    <button
                      style={{
                        ...actionButtonStyle,
                        backgroundColor: "#3498db",
                        color: "white",
                      }}
                      onClick={() => handleEditar(rep.id)}
                    >
                      Editar
                    </button>
                    <button
                      style={{
                        ...actionButtonStyle,
                        backgroundColor: "#e74c3c",
                        color: "white",
                      }}
                      onClick={() => handleEliminar(rep.id)}
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

      {/* Paginación */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "20px",
          marginTop: "30px",
        }}
      >
        <button
          onClick={() => setPaginaActual((prev) => Math.max(prev - 1, 1))}
          disabled={paginaActual === 1}
          style={{
            ...buttonStyle,
            opacity: paginaActual === 1 ? 0.5 : 1,
            cursor: paginaActual === 1 ? "not-allowed" : "pointer",
          }}
        >
          ⬅ Anterior
        </button>
        <span
          style={{ fontSize: "16px", fontWeight: "bold", color: "#262d7d" }}
        >
          Página {paginaActual} de {totalPaginas}
        </span>
        <button
          onClick={() =>
            setPaginaActual((prev) => Math.min(prev + 1, totalPaginas))
          }
          disabled={paginaActual === totalPaginas || totalPaginas === 0}
          style={{
            ...buttonStyle,
            opacity:
              paginaActual === totalPaginas || totalPaginas === 0 ? 0.5 : 1,
            cursor:
              paginaActual === totalPaginas || totalPaginas === 0
                ? "not-allowed"
                : "pointer",
          }}
        >
          Siguiente ➡
        </button>
      </div>
    </div>
  );
}
