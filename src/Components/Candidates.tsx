import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

interface Candidate {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  telefono: string;
  fechaNacimiento: string;
  direccion: string;
  interes: string;
  disponible: boolean;
  comentarios: string;
  estado: string;
  cvUrl?: string;
}

export default function Candidates() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [fechaNacimiento, setFechaNacimiento] = useState("");
  const [direccion, setDireccion] = useState("");
  const [interes, setInteres] = useState("");
  const [disponible, setDisponible] = useState(false);
  const [comentarios, setComentarios] = useState("");
  const [estado, setEstado] = useState("Postulado");
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [mensaje, setMensaje] = useState("");
  const [filtro, setFiltro] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);
  const candidatosPorPagina = 5;

  const navigate = useNavigate();

  const fetchCandidates = async () => {
    try {
      const res = await fetch("/api/candidates");
      const data = await res.json();
      setCandidates(data);
    } catch (err) {
      console.error("Error al cargar candidatos", err);
      setMensaje("Error al cargar candidatos");
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, []);
  const formatDateISO = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toISOString().slice(0, 10); // yyyy-MM-dd
  };
  const handleAddOrUpdate = async () => {
    console.log("handleAddOrUpdate invoked"); // <-- esto ayuda a saber si se llama la función
    if (!firstName || !lastName || !email) {
      return alert("Completa todos los campos");
    }
    if (!firstName || !lastName || !email)
      return alert("Completa todos los campos");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return alert("Correo inválido");

    const formData = new FormData();
    formData.append("firstName", firstName);
    formData.append("lastName", lastName);
    formData.append("email", email);
    formData.append("telefono", telefono);
    const fechaISO = formatDateISO(fechaNacimiento);
    formData.append("fechaNacimiento", fechaISO);
    formData.append("direccion", direccion);
    formData.append("interes", interes);
    formData.append("disponible", disponible.toString());
    formData.append("comentarios", comentarios);
    formData.append("estado", estado);
    if (cvFile) formData.append("cv", cvFile);

    try {
      const url =
        editingId !== null ? `/api/candidates/${editingId}` : "/api/candidates";
      const method = editingId !== null ? "PUT" : "POST";

      const res = await fetch(url, { method, body: formData });
      if (!res.ok) throw new Error("Error al guardar candidato");

      await fetchCandidates();
      setMensaje(
        editingId
          ? "Candidato actualizado correctamente."
          : "Candidato agregado correctamente."
      );
      setFirstName("");
      setLastName("");

      setEmail("");
      setTelefono("");
      setFechaNacimiento("");
      setDireccion("");
      setInteres("");
      setDisponible(false);
      setComentarios("");
      setEstado("Postulado");
      setCvFile(null);
      setEditingId(null);

      const inputCv = document.getElementById("cvInput") as HTMLInputElement;
      if (inputCv) inputCv.value = "";
    } catch (error) {
      console.error("Error guardando candidato", error);
      setMensaje("Error al guardar candidato");
    }
  };
  const handleEdit = (id: number) => {
    const c = candidates.find((c) => c.id === id);
    if (!c) return;
    setFirstName(c.firstName);
    setLastName(c.lastName);
    setEmail(c.email);
    setTelefono(c.telefono);
    setFechaNacimiento(c.fechaNacimiento);
    setDireccion(c.direccion);
    setInteres(c.interes);
    setDisponible(c.disponible);
    setComentarios(c.comentarios);
    setEstado(c.estado);
    setEditingId(id);
    setCvFile(null);
    setMensaje("");
  };

  const handleDelete = async (id: number) => {
    if (!confirm("¿Eliminar este candidato?")) return;
    try {
      const res = await fetch(`/api/candidates/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      await fetchCandidates();
      setMensaje("Candidato eliminado correctamente.");
    } catch (error) {
      console.error("Error eliminando candidato", error);
      setMensaje("Error al eliminar candidato");
    }
  };

  const handleCvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === "application/pdf") {
      setCvFile(file);
    } else {
      alert("Solo se permiten archivos PDF");
      e.target.value = "";
    }
  };

  const exportarExcel = () => {
    const datosExportar = candidates.map((c) => ({
      ID: c.id,
      Nombre: `${c.firstName} ${c.lastName}`,
      Correo: c.email,
      Teléfono: c.telefono,
      FechaNacimiento: c.fechaNacimiento,
      Dirección: c.direccion,
      Interés: c.interes,
      Disponible: c.disponible ? "Sí" : "No",
      Comentarios: c.comentarios,
      Estado: c.estado,
      CV: c.cvUrl || "No adjunto",
    }));

    const ws = XLSX.utils.json_to_sheet(datosExportar);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Candidatos");

    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(blob, "Candidatos.xlsx");
  };

  const candidatosFiltrados = candidates.filter((c) =>
    `${c.firstName} ${c.lastName} ${c.email}`
      .toLowerCase()
      .includes(filtro.toLowerCase())
  );
  const totalPaginas = Math.ceil(
    candidatosFiltrados.length / candidatosPorPagina
  );
  const inicio = (paginaActual - 1) * candidatosPorPagina;
  const fin = inicio + candidatosPorPagina;
  const candidatosPagina = candidatosFiltrados.slice(inicio, fin);

  return (
    <div
      style={{
        maxWidth: "800px",
        margin: "0 auto",
        marginBottom: "10px",
        position: "relative",
      }}
    >
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
        Candidatos
      </h2>

      <div style={{ position: "relative" }}>
        <img
          src="/logo.png"
          alt="Logo"
          style={{
            position: "absolute",
            top: "10px",
            right: "-600px", // Más a la derecha
            height: "350px", // Más grande
            objectFit: "contain",
          }}
        />
      </div>

      <p
        style={{
          textAlign: "center",
          fontSize: "16px",
          color: "#333",
          marginTop: "20px",
          marginBottom: "10px",
        }}
      >
        Por favor, ingresa los datos del candidato
      </p>

      {mensaje && (
        <div
          style={{
            backgroundColor: "#f0f0f0",
            color: "#444",
            padding: "10px",
            borderRadius: "6px",
            margin: "20px auto",
            maxWidth: "600px",
            textAlign: "center",
          }}
        >
          {mensaje}
        </div>
      )}
      {/* FORMULARIO */}
      <div
        style={{
          backgroundColor: "#f9f9f9",
          padding: "20px",
          borderRadius: "10px",
          marginBottom: "30px",
          maxWidth: "600px",
          marginInline: "auto",
          boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <label style={labelStyle}>Nombre</label>
          <input
            placeholder="Nombres"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            style={inputStyle}
          />

          <label style={labelStyle}>Apellido</label>
          <input
            placeholder="Apellidos"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            style={inputStyle}
          />

          <label style={labelStyle}>Correo</label>
          <input
            placeholder="Correo"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={inputStyle}
          />

          <label style={labelStyle}>Teléfono</label>
          <input
            placeholder="Teléfono"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
            style={inputStyle}
          />

          <label style={labelStyle}>Fecha de nacimiento</label>
          <input
            type="date"
            value={fechaNacimiento}
            onChange={(e) => setFechaNacimiento(e.target.value)}
            style={inputStyle}
          />

          <label style={labelStyle}>Dirección</label>
          <textarea
            value={direccion}
            onChange={(e) => setDireccion(e.target.value)}
            style={inputStyle}
            rows={2}
          />

          <label style={labelStyle}>Área de interés</label>
          <input
            value={interes}
            onChange={(e) => setInteres(e.target.value)}
            style={inputStyle}
          />

          <label style={labelStyle}>¿Disponible para trabajar?</label>
          <select
            value={disponible ? "Sí" : "No"}
            onChange={(e) => setDisponible(e.target.value === "Sí")}
            style={inputStyle}
          >
            <option>Sí</option>
            <option>No</option>
          </select>

          <label style={labelStyle}>Estado del candidato</label>
          <select
            value={estado}
            onChange={(e) => setEstado(e.target.value)}
            style={inputStyle}
          >
            <option>Postulado</option>
            <option>Evaluado</option>
            <option>Rechazado</option>
            <option>Contratado</option>
          </select>

          <label htmlFor="cvInput" style={labelStyle}>
            Escoja el CV del candidato
          </label>
          <input
            id="cvInput"
            type="file"
            accept=".pdf"
            onChange={handleCvChange}
            style={inputStyle}
          />

          <label style={labelStyle}>Comentarios extra</label>
          <textarea
            value={comentarios}
            onChange={(e) => setComentarios(e.target.value)}
            style={inputStyle}
            rows={3}
          />

          <button onClick={handleAddOrUpdate} style={buttonStyle}>
            {editingId ? "Actualizar" : "Agregar"}
          </button>
        </div>
      </div>

      {/* BARRA DE FILTRO */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "10px",
          marginBottom: "30px",
          maxWidth: "800px",
          marginInline: "auto",
        }}
      >
        <input
          type="text"
          placeholder="Buscar por nombre o correo"
          value={filtro}
          onChange={(e) => {
            setFiltro(e.target.value);
            setPaginaActual(1);
          }}
          style={{
            flex: "1",
            padding: "10px",
            borderRadius: "6px",
            border: "1px solid #ccc",
          }}
        />

        <button
          onClick={() => {
            const encontrados = candidates.filter((c) =>
              (c.firstName + c.lastName + c.email).toLowerCase()
            );

            if (encontrados.length === 0) {
              alert("No se han encontrado candidatos.");
            }

            setPaginaActual(1); // Reinicia a la primera página
          }}
          style={{
            backgroundColor: "#262d7d",
            color: "white",
            padding: "10px 16px",
            border: "none",
            borderRadius: "6px",
            fontWeight: "bold",
            cursor: "pointer",
            width: "100px",
          }}
        >
          Buscar
        </button>
      </div>

      {/* TABLA */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginBottom: "30px",
        }}
      >
        <table
          style={{
            width: "100%",
            maxWidth: "1300px", // Aumentado
            borderCollapse: "collapse",
            borderRadius: "8px",
            overflow: "hidden",
            boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
            backgroundColor: "white",
            textAlign: "center",
          }}
        >
          <thead style={{ backgroundColor: "#262d7d", color: "white" }}>
            <tr>
              <th style={thStyle}>Nombres</th>
              <th style={thStyle}>Apellidos</th>
              <th style={thStyle}>Correo</th>
              <th style={thStyle}>Teléfono</th>
              <th style={thStyle}>Fecha Nac.</th>
              <th style={thStyle}>Dirección</th>
              <th style={thStyle}>Interés</th>
              <th style={thStyle}>Disponible</th>
              <th style={thStyle}>Comentarios</th>
              <th style={thStyle}>Estado</th>
              <th style={thStyle}>Currículum</th>
              <th style={thStyle}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {candidatosPagina.length === 0 ? (
              <tr>
                <td
                  colSpan={13}
                  style={{ textAlign: "center", padding: "20px" }}
                >
                  No hay candidatos en esta página.
                </td>
              </tr>
            ) : (
              candidatosPagina.map((c) => (
                <tr key={c.id} style={{ borderBottom: "1px solid #eee" }}>
                  <td style={tdStyle}>{c.firstName}</td>
                  <td style={tdStyle}>{c.lastName}</td>
                  <td style={tdStyle}>{c.email}</td>
                  <td style={tdStyle}>{c.telefono}</td>
                  <td style={tdStyle}>{c.fechaNacimiento}</td>
                  <td style={tdStyle}>{c.direccion}</td>
                  <td style={tdStyle}>{c.interes}</td>
                  <td style={tdStyle}>{c.disponible ? "Sí" : "No"}</td>
                  <td style={tdStyle}>{c.comentarios}</td>
                  <td style={tdStyle}>{c.estado}</td>
                  <td style={tdStyle}>
                    {c.cvUrl ? (
                      <a
                        href={c.cvUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          color: "#262d7d",
                          textDecoration: "underline",
                        }}
                      >
                        Ver PDF
                      </a>
                    ) : (
                      "No adjunto"
                    )}
                  </td>
                  <td style={tdStyle}>
                    <button
                      onClick={() =>
                        confirm("¿Deseas editar este candidato?") &&
                        handleEdit(c.id)
                      }
                      style={editButtonStyle}
                    >
                      Editar
                    </button>
                    <button
                      onClick={() =>
                        confirm("¿Eliminar definitivamente este candidato?") &&
                        handleDelete(c.id)
                      }
                      style={deleteButtonStyle}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* BOTÓN CENTRADO DE EXPORTAR */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "20px",
          }}
        >
          <button
            onClick={exportarExcel}
            style={{
              backgroundColor: "#262d7d",
              color: "white",
              padding: "10px 25px",
              border: "none",
              borderRadius: "6px",
              fontWeight: "bold",
              cursor: "pointer",
              width: "200px", // Botón más corto y centrado
              textAlign: "center",
            }}
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

// === ESTILOS REUTILIZABLES ===
const inputStyle = {
  padding: "10px",
  borderRadius: "6px",
  border: "1px solid #ccc",
};

const buttonStyle = {
  backgroundColor: "#262d7d",
  color: "white",
  padding: "10px",
  border: "none",
  borderRadius: "6px",
  fontWeight: "bold",
};

const labelStyle = {
  fontSize: "14px",
  color: "#333",
  fontWeight: "bold",
};

const thStyle = {
  padding: "12px",
  textAlign: "left" as const,
  whiteSpace: "nowrap" as const,
};

const tdStyle = {
  padding: "10px",
  verticalAlign: "top" as const,
};

const editButtonStyle = {
  backgroundColor: "#3498db",
  color: "white",
  border: "none",
  padding: "6px 12px",
  borderRadius: "4px",
  marginBottom: "6px",
  width: "100%",
  cursor: "pointer",
};

const deleteButtonStyle = {
  backgroundColor: "#e74c3c",
  color: "white",
  border: "none",
  padding: "6px 12px",
  borderRadius: "4px",
  width: "100%",
  cursor: "pointer",
};
