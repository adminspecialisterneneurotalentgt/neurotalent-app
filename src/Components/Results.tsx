import { useState, useEffect } from "react";
import type { ChangeEvent } from "react"; // Importa solo tipo
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

type Resultado = {
  id: number;
  nombre: string;
  evaluacion: string | EvaluacionObj; // Puede ser string o objeto
  puntaje: number;
  fecha: string;
  archivoPDF?: string | null; // URL del archivo en backend
  comentarios: string;
};

type EvaluacionObj = {
  titulo?: string;
};

function isEvaluacionObj(obj: any): obj is EvaluacionObj {
  return obj && typeof obj === "object" && "titulo" in obj;
}

export default function Results() {
  const [resultados, setResultados] = useState<Resultado[]>([]);
  const [editId, setEditId] = useState<number | null>(null);

  // Opciones para sugerencias
  const [candidateOptions, setCandidateOptions] = useState<string[]>([]);
  const [evaluationOptions, setEvaluationOptions] = useState<string[]>([]);

  // Campos del formulario
  const [nombre, setNombre] = useState("");
  const [evaluacion, setEvaluacion] = useState("");
  const [puntaje, setPuntaje] = useState("");
  const [fecha, setFecha] = useState("");
  const [archivoPDF, setArchivoPDF] = useState<File | null>(null);
  const [comentarios, setComentarios] = useState("");

  // Paginacion
  const [paginaActual, setPaginaActual] = useState(1);
  const resultadosPorPagina = 5;
  const totalPaginas = Math.ceil(resultados.length / resultadosPorPagina);
  const inicio = (paginaActual - 1) * resultadosPorPagina;
  const fin = inicio + resultadosPorPagina;
  const resultadosPagina = resultados.slice(inicio, fin);

  // Función para cargar resultados desde backend
  const fetchResultados = () => {
    fetch("/api/results")
      .then((res) => res.json())
      .then((data) => setResultados(data))
      .catch(() => setResultados([]));
  };

  // Cargar resultados y opciones al montar el componente
  useEffect(() => {
    fetchResultados();

    fetch("/api/evaluations")
      .then((res) => res.json())
      .then((data: any[]) => {
        const titles = data.map((e) => e.titulo);
        setEvaluationOptions(titles);
      })
      .catch(() => setEvaluationOptions([]));

    fetch("/api/candidates")
      .then((res) => res.json())
      .then((data: any[]) => {
        const names = data.map((c) => `${c.firstName} ${c.lastName}`);
        setCandidateOptions(names);
      })
      .catch(() => setCandidateOptions([]));
  }, []);

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
    setEditId(null);
    const inputFile = document.getElementById(
      "archivoInput"
    ) as HTMLInputElement | null;
    if (inputFile) inputFile.value = "";
  };

  // Agregar o actualizar resultado en backend
  const handleAgregar = async () => {
    if (!nombre || !evaluacion || !puntaje || !fecha) {
      alert("Por favor completa todos los campos obligatorios.");
      return;
    }
    if (!archivoPDF && editId === null) {
      alert("Por favor selecciona un archivo PDF.");
      return;
    }
    const puntajeNum = Number(puntaje);
    if (isNaN(puntajeNum) || puntajeNum < 0 || puntajeNum > 100) {
      alert("Puntaje debe ser un número entre 0 y 100.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("nombre", nombre);
      formData.append("evaluacion", evaluacion.toString());
      formData.append("puntaje", puntajeNum.toString());
      formData.append("fecha", fecha);
      formData.append("comentarios", comentarios);
      if (archivoPDF) formData.append("archivoPDF", archivoPDF);

      let response: Response;

      if (editId !== null) {
        response = await fetch(`/api/results/${editId}`, {
          method: "PUT",
          body: formData,
        });
      } else {
        response = await fetch("/api/results", {
          method: "POST",
          body: formData,
        });
      }

      if (!response.ok) throw new Error("Error guardando resultado");

      // Actualizar la lista con los datos frescos
      fetchResultados();

      limpiarFormulario();
    } catch (error) {
      alert("Error al guardar resultado");
      console.error(error);
    }
  };

  const handleEliminar = async (id: number) => {
    if (confirm("¿Estás seguro de eliminar este resultado?")) {
      try {
        const response = await fetch(`/api/results/${id}`, {
          method: "DELETE",
        });
        if (!response.ok) throw new Error("Error eliminando resultado");
        fetchResultados();
        if (editId === id) limpiarFormulario();
      } catch (error) {
        alert("Error al eliminar resultado");
        console.error(error);
      }
    }
  };

  const handleEditar = (id: number) => {
    const res = resultados.find((r) => r.id === id);
    if (!res) return;

    if (typeof res.evaluacion === "string") {
      setEvaluacion(res.evaluacion);
    } else if (isEvaluacionObj(res.evaluacion)) {
      setEvaluacion(res.evaluacion.titulo || "");
    } else {
      setEvaluacion("");
    }

    setEditId(id);
    setNombre(res.nombre);
    setPuntaje(res.puntaje.toString());
    setFecha(res.fecha);
    setComentarios(res.comentarios);
    setArchivoPDF(null);

    const inputFile = document.getElementById(
      "archivoInput"
    ) as HTMLInputElement | null;
    if (inputFile) inputFile.value = "";
  };

  return (
    <div
      style={{
        maxWidth: 1000,
        margin: "0 auto",
        marginBottom: 10,
        position: "relative",
      }}
    >
      {/* Botón Regresar */}
      <div style={{ position: "fixed", top: 20, left: 20, zIndex: 1000 }}>
        <button
          onClick={() => window.history.back()}
          style={{
            background: "none",
            border: "none",
            color: "#262d7d",
            fontWeight: "bold",
            fontSize: 16,
            cursor: "pointer",
            textDecoration: "underline",
          }}
        >
          ← Regresar a Dashboard
        </button>
      </div>

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

      <h2
        style={{
          textAlign: "center",
          color: "#262d7d",
          marginTop: 60,
          fontSize: 28,
        }}
      >
        Resultados de Evaluaciones
      </h2>

      {/* Formulario */}
      <div
        style={{
          backgroundColor: "#f9f9f9",
          padding: 20,
          borderRadius: 10,
          marginBottom: 30,
          boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
        }}
      >
        <label
          style={{
            fontWeight: "bold",
            marginBottom: 6,
            display: "block",
            color: "#000",
          }}
        >
          Nombre
        </label>
        <input
          list="candidate-list"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          style={{
            width: "100%",
            padding: 10,
            borderRadius: 6,
            border: "1px solid #ccc",
            marginBottom: 15,
            fontSize: 16,
            boxSizing: "border-box",
            color: "#333",
            backgroundColor: "white",
          }}
          placeholder="Nombre del candidato"
        />
        <datalist id="candidate-list">
          {candidateOptions.map((name) => (
            <option key={name} value={name} />
          ))}
        </datalist>

        <label
          style={{
            fontWeight: "bold",
            marginBottom: 6,
            display: "block",
            color: "#000",
          }}
        >
          Evaluación
        </label>
        <input
          list="evaluation-list"
          name="evaluacion"
          value={evaluacion}
          onChange={(e) => setEvaluacion(e.target.value)}
          style={{
            width: "100%",
            padding: 10,
            borderRadius: 6,
            border: "1px solid #ccc",
            marginBottom: 15,
            fontSize: 16,
            boxSizing: "border-box",
            color: "#333",
            backgroundColor: "white",
          }}
          placeholder="Nombre de la evaluación"
        />
        <datalist id="evaluation-list">
          {evaluationOptions.map((title) => (
            <option key={title} value={title} />
          ))}
        </datalist>

        <label
          style={{
            fontWeight: "bold",
            marginBottom: 6,
            display: "block",
            color: "#000",
          }}
        >
          Puntaje
        </label>
        <input
          type="number"
          value={puntaje}
          onChange={(e) => setPuntaje(e.target.value)}
          style={{
            width: "100%",
            padding: 10,
            borderRadius: 6,
            border: "1px solid #ccc",
            marginBottom: 15,
            fontSize: 16,
            boxSizing: "border-box",
            color: "#333",
            backgroundColor: "white",
          }}
          placeholder="0 - 100"
          min={0}
          max={100}
        />

        <label
          style={{
            fontWeight: "bold",
            marginBottom: 6,
            display: "block",
            color: "#000",
          }}
        >
          Fecha
        </label>
        <input
          type="date"
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
          style={{
            width: "100%",
            padding: 10,
            borderRadius: 6,
            border: "1px solid #ccc",
            marginBottom: 15,
            fontSize: 16,
            boxSizing: "border-box",
            color: "#333",
            backgroundColor: "white",
          }}
        />

        <label
          style={{
            fontWeight: "bold",
            marginBottom: 6,
            display: "block",
            color: "#000",
          }}
        >
          Archivo PDF
        </label>
        <input
          id="archivoInput"
          type="file"
          accept="application/pdf"
          onChange={handleArchivoChange}
          style={{ marginBottom: 20 }}
        />

        <label
          style={{
            fontWeight: "bold",
            marginBottom: 6,
            display: "block",
            color: "#000",
          }}
        >
          Comentarios adicionales
        </label>
        <textarea
          value={comentarios}
          onChange={(e) => setComentarios(e.target.value)}
          style={{
            width: "100%",
            padding: 10,
            borderRadius: 6,
            border: "1px solid #ccc",
            marginBottom: 15,
            fontSize: 16,
            boxSizing: "border-box",
            color: "#333",
            backgroundColor: "white",
            resize: "vertical",
            minHeight: 70,
          }}
          placeholder="Comentarios o notas adicionales"
        />

        <button
          style={{
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
          }}
          onClick={handleAgregar}
        >
          {editId !== null ? "Actualizar" : "Agregar"}
        </button>
      </div>

      {/* Tabla resultados */}
      <div
        style={{
          backgroundColor: "#f9f9f9",
          padding: 20,
          borderRadius: 10,
          marginBottom: 30,
          boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
          minWidth: 900,
          maxWidth: "100%",
          margin: "0 auto",
        }}
      >
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            fontSize: 16,
            borderRadius: 8,
            overflow: "hidden",
            boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
          }}
        >
          <thead>
            <tr>
              <th
                style={{
                  backgroundColor: "#262d7d",
                  color: "white",
                  padding: "12px 15px",
                  textAlign: "left",
                  borderBottom: "2px solid #1b2568",
                }}
              >
                Nombre
              </th>
              <th
                style={{
                  backgroundColor: "#262d7d",
                  color: "white",
                  padding: "12px 15px",
                  textAlign: "left",
                  borderBottom: "2px solid #1b2568",
                }}
              >
                Evaluación
              </th>
              <th
                style={{
                  backgroundColor: "#262d7d",
                  color: "white",
                  padding: "12px 15px",
                  textAlign: "left",
                  borderBottom: "2px solid #1b2568",
                }}
              >
                Puntaje
              </th>
              <th
                style={{
                  backgroundColor: "#262d7d",
                  color: "white",
                  padding: "12px 15px",
                  textAlign: "left",
                  borderBottom: "2px solid #1b2568",
                }}
              >
                Fecha
              </th>
              <th
                style={{
                  backgroundColor: "#262d7d",
                  color: "white",
                  padding: "12px 15px",
                  textAlign: "left",
                  borderBottom: "2px solid #1b2568",
                }}
              >
                Comentarios
              </th>
              <th
                style={{
                  backgroundColor: "#262d7d",
                  color: "white",
                  padding: "12px 15px",
                  textAlign: "left",
                  borderBottom: "2px solid #1b2568",
                }}
              >
                Archivos
              </th>
              <th
                style={{
                  backgroundColor: "#262d7d",
                  color: "white",
                  padding: "12px 15px",
                  textAlign: "left",
                  borderBottom: "2px solid #1b2568",
                }}
              >
                Acciones
              </th>
            </tr>
          </thead>
          <tbody>
            {resultados.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  style={{
                    textAlign: "center",
                    fontStyle: "italic",
                    color: "#888",
                    padding: "12px 15px",
                  }}
                >
                  No hay resultados registrados.
                </td>
              </tr>
            ) : (
              resultadosPagina.map((res) => (
                <tr key={res.id}>
                  <td
                    style={{
                      padding: "12px 15px",
                      borderBottom: "1px solid #ddd",
                      color: "#333",
                      verticalAlign: "top",
                    }}
                  >
                    {res.nombre}
                  </td>
                  <td
                    style={{
                      padding: "12px 15px",
                      borderBottom: "1px solid #ddd",
                      color: "#333",
                      verticalAlign: "top",
                    }}
                  >
                    {typeof res.evaluacion === "string"
                      ? res.evaluacion
                      : res.evaluacion.titulo || ""}
                  </td>
                  <td
                    style={{
                      padding: "12px 15px",
                      borderBottom: "1px solid #ddd",
                      color: "#333",
                      verticalAlign: "top",
                    }}
                  >
                    {res.puntaje}
                  </td>
                  <td
                    style={{
                      padding: "12px 15px",
                      borderBottom: "1px solid #ddd",
                      color: "#333",
                      verticalAlign: "top",
                    }}
                  >
                    {res.fecha ? res.fecha.substring(0, 10) : ""}
                  </td>
                  <td
                    style={{
                      padding: "12px 15px",
                      borderBottom: "1px solid #ddd",
                      color: "#333",
                      verticalAlign: "top",
                    }}
                  >
                    {res.comentarios}
                  </td>
                  <td
                    style={{
                      padding: "12px 15px",
                      borderBottom: "1px solid #ddd",
                      color: "#333",
                      verticalAlign: "top",
                    }}
                  >
                    {res.archivoPDF ? (
                      <a
                        href={res.archivoPDF}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          color: "#262d7d",
                          fontWeight: "bold",
                          textDecoration: "underline",
                        }}
                      >
                        Ver PDF
                      </a>
                    ) : (
                      "Sin archivo"
                    )}
                  </td>
                  <td
                    style={{
                      padding: "12px 15px",
                      borderBottom: "1px solid #ddd",
                      color: "#333",
                      verticalAlign: "top",
                    }}
                  >
                    <div style={{ display: "flex", gap: "10px" }}>
                      <button
                        style={{
                          marginRight: 10,
                          padding: "6px 12px",
                          borderRadius: 6,
                          border: "none",
                          cursor: "pointer",
                          fontWeight: "bold",
                          backgroundColor: "#3498db",
                          color: "white",
                          flex: "1",
                        }}
                        onClick={() => handleEditar(res.id)}
                      >
                        Editar
                      </button>
                      <button
                        style={{
                          marginRight: 10,
                          padding: "6px 12px",
                          borderRadius: 6,
                          border: "none",
                          cursor: "pointer",
                          fontWeight: "bold",
                          backgroundColor: "#e74c3c",
                          color: "white",
                          flex: "1",
                        }}
                        onClick={() => handleEliminar(res.id)}
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Botón exportar */}
        <div style={{ marginTop: 20, textAlign: "center" }}>
          <button
            style={{
              backgroundColor: "#262d7d",
              color: "white",
              padding: "14px 0",
              width: 250,
              border: "none",
              borderRadius: 6,
              cursor: "pointer",
              fontWeight: "bold",
              fontSize: 18,
            }}
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
          gap: 20,
          marginTop: 30,
        }}
      >
        <button
          onClick={() => setPaginaActual((prev) => Math.max(prev - 1, 1))}
          disabled={paginaActual === 1}
          style={{
            backgroundColor: "#262d7d",
            color: "white",
            padding: "14px 0",
            width: 120,
            border: "none",
            borderRadius: 6,
            cursor: paginaActual === 1 ? "not-allowed" : "pointer",
            opacity: paginaActual === 1 ? 0.5 : 1,
            fontWeight: "bold",
            fontSize: 18,
          }}
        >
          ⬅ Anterior
        </button>
        <span style={{ fontSize: 16, fontWeight: "bold", color: "#262d7d" }}>
          Página {paginaActual} de {totalPaginas}
        </span>
        <button
          onClick={() =>
            setPaginaActual((prev) => Math.min(prev + 1, totalPaginas))
          }
          disabled={paginaActual === totalPaginas || totalPaginas === 0}
          style={{
            backgroundColor: "#262d7d",
            color: "white",
            padding: "14px 0",
            width: 120,
            border: "none",
            borderRadius: 6,
            cursor:
              paginaActual === totalPaginas || totalPaginas === 0
                ? "not-allowed"
                : "pointer",
            opacity:
              paginaActual === totalPaginas || totalPaginas === 0 ? 0.5 : 1,
            fontWeight: "bold",
            fontSize: 18,
          }}
        >
          Siguiente ➡
        </button>
      </div>
    </div>
  );

  function exportarExcel() {
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
  }
}
