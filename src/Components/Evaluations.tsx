import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

interface Evaluation {
  id: number;
  titulo: string;
  descripcion: string;
  candidato: string;
  evaluador: string;
  fecha: string;
  tipo: string;
  estado: string;
  documentoUrl?: string;
}

const thStyle: React.CSSProperties = {
  backgroundColor: "#262d7d",
  color: "white",
  padding: "12px",
  textAlign: "left",
  whiteSpace: "nowrap",
  border: "1px solid #ccc",
};

const tdStyle: React.CSSProperties = {
  padding: "10px",
  verticalAlign: "top",
  border: "1px solid #ccc",
};

const inputStyle: React.CSSProperties = {
  padding: "10px",
  borderRadius: "6px",
  border: "1px solid #ccc",
  width: "100%",
};

const buttonStyle: React.CSSProperties = {
  backgroundColor: "#262d7d",
  color: "white",
  padding: "10px",
  border: "none",
  borderRadius: "6px",
  fontWeight: "bold",
  width: "100%",
};

export default function Evaluations() {
  const navigate = useNavigate();
  const role = "admin";
  const canEdit = role === "admin" || role === "supervisor";
  const canDelete = role === "admin";
  const canExport = role === "admin";

  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [form, setForm] = useState<Omit<Evaluation, "id" | "documentoUrl">>({
    titulo: "",
    descripcion: "",
    candidato: "",
    evaluador: "",
    fecha: "",
    tipo: "",
    estado: "Pendiente",
  });
  const [documento, setDocumento] = useState<File | null>(null);
  const [editId, setEditId] = useState<number | null>(null);
  const [filtros, setFiltros] = useState({
    tipo: "",
    estado: "",
    fecha: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleDocumentoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === "application/pdf") {
      setDocumento(file);
    } else {
      alert("Solo se permiten archivos PDF");
      e.target.value = "";
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canEdit) return;

    const { titulo, descripcion, candidato, evaluador, fecha, tipo, estado } =
      form;

    if (
      !titulo ||
      !descripcion ||
      !candidato ||
      !evaluador ||
      !fecha ||
      !tipo ||
      !estado
    ) {
      alert("Por favor, completa todos los campos.");
      return;
    }

    const newEvaluation: Evaluation = {
      id: Date.now(),
      ...form,
      documentoUrl: documento ? URL.createObjectURL(documento) : undefined,
    };

    if (editId !== null) {
      setEvaluations((prev) =>
        prev.map((ev) =>
          ev.id === editId ? { ...newEvaluation, id: ev.id } : ev
        )
      );
      setEditId(null);
    } else {
      setEvaluations([...evaluations, newEvaluation]);
    }

    setForm({
      titulo: "",
      descripcion: "",
      candidato: "",
      evaluador: "",
      fecha: "",
      tipo: "",
      estado: "Pendiente",
    });
    setDocumento(null);
    const inputFile = document.getElementById("docInput") as HTMLInputElement;
    if (inputFile) inputFile.value = "";
  };

  const handleEdit = (id: number) => {
    if (!canEdit) return;
    const evalToEdit = evaluations.find((ev) => ev.id === id);
    if (evalToEdit) {
      const { titulo, descripcion, candidato, evaluador, fecha, tipo, estado } =
        evalToEdit;
      setForm({
        titulo,
        descripcion,
        candidato,
        evaluador,
        fecha,
        tipo,
        estado,
      });
      setDocumento(null);
      setEditId(id);
    }
  };

  const handleDelete = (id: number) => {
    if (!canDelete) return;
    if (confirm("¿Eliminar esta evaluación?")) {
      setEvaluations((prev) => prev.filter((ev) => ev.id !== id));
    }
  };

  const exportarExcel = () => {
    if (!canExport) return;
    const datos = evaluations.map((ev) => ({
      Título: ev.titulo,
      Candidato: ev.candidato,
      Evaluador: ev.evaluador,
      Tipo: ev.tipo,
      Estado: ev.estado,
      Fecha: ev.fecha,
      Descripción: ev.descripcion,
    }));

    const ws = XLSX.utils.json_to_sheet(datos);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Evaluaciones");

    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(blob, "Evaluaciones.xlsx");
  };

  return (
    <div
      style={{
        maxWidth: "1000px",
        margin: "0 auto",
        marginBottom: "10px",
        position: "relative",
      }}
    >
      {/* Regresar */}
      <div
        style={{ position: "fixed", top: "20px", left: "20px", zIndex: 1000 }}
      >
        <button
          onClick={() => navigate("/dashboard")}
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
        Asignación de Evaluaciones
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

      {/* Formulario */}
      <form
        onSubmit={handleSubmit}
        style={{
          pointerEvents: canEdit ? "auto" : "none",
          opacity: canEdit ? 1 : 0.5,
        }}
      >
        <div
          style={{
            backgroundColor: "#f9f9f9",
            padding: "20px",
            borderRadius: "10px",
            marginBottom: "30px",
            boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
          }}
        >
          <label style={{ fontWeight: "bold" }}>Título de evaluación</label>
          <input
            name="titulo"
            value={form.titulo}
            onChange={handleChange}
            style={inputStyle}
          />

          <label style={{ fontWeight: "bold", marginTop: "10px" }}>
            Candidato asignado
          </label>
          <input
            name="candidato"
            value={form.candidato}
            onChange={handleChange}
            style={inputStyle}
          />

          <label style={{ fontWeight: "bold", marginTop: "10px" }}>
            Evaluador asignado
          </label>
          <input
            name="evaluador"
            value={form.evaluador}
            onChange={handleChange}
            style={inputStyle}
          />

          <label style={{ fontWeight: "bold", marginTop: "10px" }}>
            Fecha de evaluación
          </label>
          <input
            type="date"
            name="fecha"
            value={form.fecha}
            onChange={handleChange}
            style={inputStyle}
          />

          <label style={{ fontWeight: "bold", marginTop: "10px" }}>
            Tipo de evaluación
          </label>
          <select
            name="tipo"
            value={form.tipo}
            onChange={handleChange}
            style={inputStyle}
          >
            <option value="">Selecciona tipo</option>
            <option value="Lógica">Lógica</option>
            <option value="Memoria">Memoria</option>
            <option value="Atención">Atención</option>
            <option value="Razonamiento">Razonamiento</option>
          </select>

          <label style={{ fontWeight: "bold", marginTop: "10px" }}>
            Estado
          </label>
          <select
            name="estado"
            value={form.estado}
            onChange={handleChange}
            style={inputStyle}
          >
            <option value="Pendiente">Pendiente</option>
            <option value="En proceso">En proceso</option>
            <option value="Completada">Completada</option>
          </select>

          <label
            htmlFor="docInput"
            style={{ fontWeight: "bold", marginTop: "10px" }}
          >
            Documento de la prueba (PDF)
          </label>
          <input
            type="file"
            id="docInput"
            accept=".pdf"
            onChange={handleDocumentoChange}
            style={inputStyle}
          />

          <label style={{ fontWeight: "bold", marginTop: "10px" }}>
            Descripción
          </label>
          <textarea
            name="descripcion"
            value={form.descripcion}
            onChange={handleChange}
            rows={3}
            style={inputStyle}
          />

          <button type="submit" style={{ ...buttonStyle, marginTop: "10px" }}>
            {editId !== null ? "Actualizar" : "Agregar"}
          </button>
        </div>
      </form>

      {/* Búsqueda por filtros */}
      <h3
        style={{
          textAlign: "center",
          color: "#262d7d",
          marginBottom: "10px",
          fontSize: "20px",
          fontWeight: "bold",
        }}
      >
        Búsqueda por filtros
      </h3>

      <div
        style={{
          display: "flex",
          gap: "20px",
          flexWrap: "wrap",
          marginBottom: "20px",
          justifyContent: "center",
          alignItems: "flex-start",
          textAlign: "left",
          width: "100%",
        }}
      >
        <div style={{ flex: "1 1 300px" }}>
          <label style={{ fontWeight: "bold", color: "#262d7d" }}>
            Filtrar por tipo
          </label>
          <select
            value={filtros.tipo}
            onChange={(e) => setFiltros({ ...filtros, tipo: e.target.value })}
            style={inputStyle}
          >
            <option value="">Selecciona tipo</option>
            <option value="Lógica">Lógica</option>
            <option value="Memoria">Memoria</option>
            <option value="Atención">Atención</option>
            <option value="Razonamiento">Razonamiento</option>
          </select>
        </div>

        <div style={{ flex: "1 1 300px" }}>
          <label style={{ fontWeight: "bold", color: "#262d7d" }}>
            Filtrar por estado
          </label>
          <select
            value={filtros.estado}
            onChange={(e) => setFiltros({ ...filtros, estado: e.target.value })}
            style={inputStyle}
          >
            <option value="">Selecciona estado</option>
            <option value="Pendiente">Pendiente</option>
            <option value="En proceso">En proceso</option>
            <option value="Completada">Completada</option>
          </select>
        </div>

        <div style={{ flex: "1 1 300px" }}>
          <label style={{ fontWeight: "bold", color: "#262d7d" }}>
            Filtrar por fecha
          </label>
          <input
            type="date"
            value={filtros.fecha}
            onChange={(e) => setFiltros({ ...filtros, fecha: e.target.value })}
            style={inputStyle}
          />
        </div>
      </div>

      {/* Tabla */}
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          backgroundColor: "white",
        }}
      >
        <thead>
          <tr>
            <th style={thStyle}>Título</th>
            <th style={thStyle}>Candidato</th>
            <th style={thStyle}>Evaluador</th>
            <th style={thStyle}>Tipo</th>
            <th style={thStyle}>Fecha</th>
            <th style={thStyle}>Estado</th>
            <th style={thStyle}>Documento</th>
            <th style={thStyle}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {evaluations
            .filter(
              (ev) =>
                (!filtros.tipo || ev.tipo === filtros.tipo) &&
                (!filtros.estado || ev.estado === filtros.estado) &&
                (!filtros.fecha || ev.fecha === filtros.fecha)
            )
            .map((ev) => (
              <tr key={ev.id}>
                <td style={tdStyle}>{ev.titulo}</td>
                <td style={tdStyle}>{ev.candidato}</td>
                <td style={tdStyle}>{ev.evaluador}</td>
                <td style={tdStyle}>{ev.tipo}</td>
                <td style={tdStyle}>{ev.fecha}</td>
                <td
                  style={{
                    ...tdStyle,
                    fontWeight: "bold",
                    color: getEstadoColor(ev.estado),
                  }}
                >
                  {ev.estado}
                </td>
                <td style={tdStyle}>
                  {ev.documentoUrl ? (
                    <a
                      href={ev.documentoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: "#262d7d", textDecoration: "underline" }}
                    >
                      Ver PDF
                    </a>
                  ) : (
                    "No adjunto"
                  )}
                </td>
                <td style={tdStyle}>
                  {canEdit && (
                    <button onClick={() => handleEdit(ev.id)}>Editar</button>
                  )}
                  {canDelete && (
                    <button
                      onClick={() => handleDelete(ev.id)}
                      style={{
                        color: "red",
                        marginLeft: canEdit ? "10px" : "0",
                      }}
                    >
                      Eliminar
                    </button>
                  )}
                </td>
              </tr>
            ))}
          {evaluations.length === 0 && (
            <tr>
              <td
                colSpan={8}
                style={{ textAlign: "center", padding: "20px", color: "#888" }}
              >
                No hay evaluaciones registradas.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {canExport && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "30px",
          }}
        >
          <button
            onClick={exportarExcel}
            style={{ ...buttonStyle, width: "200px" }}
          >
            Exportar a Excel
          </button>
        </div>
      )}
    </div>
  );
}

function getEstadoColor(estado: string) {
  switch (estado) {
    case "Pendiente":
      return "#e67e22";
    case "En proceso":
      return "#f1c40f";
    case "Completada":
      return "#2ecc71";
    default:
      return "#333";
  }
}
