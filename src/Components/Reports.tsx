import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

interface Report {
  id: number;
  nombre: string; // del resultado
  evaluacion: string | { titulo?: string } | null;
  fecha: string;
  puntaje: number | null;
  archivoPDF?: string | null;
  comentarios?: string;
}

interface Candidate {
  id: number;
  firstName: string;
  lastName: string;
  fechaNacimiento?: string;
}

const thStyle: React.CSSProperties = {
  backgroundColor: "#262d7d",
  color: "white",
  padding: "12px 15px",
  textAlign: "left",
  borderBottom: "2px solid #1b2568",
  cursor: "pointer",
};

const tdStyle: React.CSSProperties = {
  padding: "12px 15px",
  borderBottom: "1px solid #ddd",
  color: "#333",
  verticalAlign: "top",
};

const buttonStyle: React.CSSProperties = {
  backgroundColor: "#262d7d",
  color: "white",
  border: "none",
  borderRadius: 6,
  padding: "14px 0",
  width: "100%",
  cursor: "pointer",
  fontWeight: "bold",
  fontSize: 18,
  marginTop: 10,
};

const inputStyle: React.CSSProperties = {
  padding: 10,
  borderRadius: 6,
  border: "1px solid #ccc",
  fontSize: 16,
  color: "#333",
  boxSizing: "border-box",
  width: "100%",
};

export default function Reports() {
  const [reports, setReports] = useState<Report[]>([]);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [filterNombre, setFilterNombre] = useState("");
  const [filterEvaluacion, setFilterEvaluacion] = useState("");
  const [filterFecha, setFilterFecha] = useState("");

  const [sortField, setSortField] = useState<keyof Report | null>(null);
  const [sortAsc, setSortAsc] = useState(true);

  const [page, setPage] = useState(1);
  const itemsPerPage = 5;

  const fetchReports = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/results");
      if (!res.ok) throw new Error("Error al cargar resultados");
      const data: Report[] = await res.json();
      setReports(data);
    } catch (e: any) {
      setError(e.message || "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  const fetchCandidates = async () => {
    try {
      const res = await fetch("/api/candidates");
      if (!res.ok) throw new Error("Error al cargar candidatos");
      const data: Candidate[] = await res.json();
      setCandidates(data);
    } catch {
      setCandidates([]);
    }
  };

  useEffect(() => {
    fetchReports();
    fetchCandidates();
  }, []);

  // TODOS los reportes + candidatos sin reportes (para que no falte nadie)
  const mergedData: Report[] = [
    ...reports, // TODOS los reportes sin cambios, repetidos incluidos
    ...candidates
      .filter(
        (c) =>
          !reports.some(
            (r) =>
              r.nombre.toLowerCase() ===
              `${c.firstName} ${c.lastName}`.toLowerCase()
          )
      )
      .map((c) => ({
        id: -c.id,
        nombre: `${c.firstName} ${c.lastName}`,
        evaluacion: null,
        fecha: c.fechaNacimiento || "",
        puntaje: null,
        archivoPDF: null,
        comentarios: "",
      })),
  ];

  // Filtros sobre TODOS los reportes
  let filteredData = [...mergedData];

  if (filterNombre)
    filteredData = filteredData.filter((r) =>
      r.nombre.toLowerCase().includes(filterNombre.toLowerCase())
    );

  if (filterEvaluacion)
    filteredData = filteredData.filter((r) =>
      getEvaluacionDisplay(r.evaluacion)
        .toLowerCase()
        .includes(filterEvaluacion.toLowerCase())
    );

  if (filterFecha)
    filteredData = filteredData.filter((r) => r.fecha === filterFecha);

  // Ordenar
  if (sortField) {
    filteredData.sort((a, b) => {
      let valA: any = a[sortField] ?? "";
      let valB: any = b[sortField] ?? "";

      if (sortField === "evaluacion") {
        valA = getEvaluacionDisplay(a.evaluacion).toLowerCase();
        valB = getEvaluacionDisplay(b.evaluacion).toLowerCase();
      }

      if (typeof valA === "string" && typeof valB === "string") {
        valA = valA.toLowerCase();
        valB = valB.toLowerCase();
      }

      if (valA < valB) return sortAsc ? -1 : 1;
      if (valA > valB) return sortAsc ? 1 : -1;
      return 0;
    });
  }

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedReports = filteredData.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const handleSort = (field: keyof Report) => {
    if (sortField === field) setSortAsc(!sortAsc);
    else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const exportarExcel = () => {
    const wb = XLSX.utils.book_new();
    const wsData = filteredData.map((r) => ({
      Nombre: r.nombre,
      Evaluacion: getEvaluacionDisplay(r.evaluacion),
      Fecha: r.fecha,
      Puntaje: r.puntaje ?? "Sin puntaje",
      Archivo: r.archivoPDF || "Sin archivo",
    }));
    const ws = XLSX.utils.json_to_sheet(wsData);
    XLSX.utils.book_append_sheet(wb, ws, "Reportes");
    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const blob = new Blob([wbout], { type: "application/octet-stream" });
    saveAs(blob, "reportes_evaluaciones.xlsx");
  };

  return (
    <>
      {/* Botón fijo regresar */}
      <div
        style={{
          position: "fixed",
          top: 20,
          left: 20,
          zIndex: 1000,
        }}
      >
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

      {/* Logo fijo */}
      <img
        src="/logo.png"
        alt="Logo"
        style={{
          position: "fixed",
          top: 40,
          right: 40,
          height: 350,
          objectFit: "contain",
          zIndex: 900,
        }}
      />

      {/* Contenedor principal */}
      <div
        style={{
          backgroundColor: "white",
          minHeight: "100vh",
          padding: "40px 20px",
          boxSizing: "border-box",
          maxWidth: 1000,
          margin: "auto",
        }}
      >
        <div
          style={{
            backgroundColor: "white",
            borderRadius: 16,
            padding: 30,
            boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
            display: "flex",
            flexDirection: "column",
            position: "relative",
          }}
        >
          <h2
            style={{
              color: "#262d7d",
              textAlign: "center",
              marginBottom: 30,
              fontWeight: "bold",
              fontSize: 24,
            }}
          >
            Reporte General de Evaluaciones
          </h2>

          {/* Filtros */}
          <div
            style={{
              marginBottom: 20,
              display: "flex",
              flexWrap: "wrap",
              gap: 20,
            }}
          >
            <div
              style={{
                flex: "1 1 200px",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <label
                htmlFor="filterNombre"
                style={{
                  fontWeight: "bold",
                  marginBottom: 6,
                  color: "#262d7d",
                }}
              >
                Filtrar por nombre
              </label>
              <input
                id="filterNombre"
                type="text"
                placeholder="Filtrar por nombre"
                value={filterNombre}
                onChange={(e) => setFilterNombre(e.target.value)}
                autoComplete="off"
                style={inputStyle}
              />
            </div>

            <div
              style={{
                flex: "1 1 200px",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <label
                htmlFor="filterEvaluacion"
                style={{
                  fontWeight: "bold",
                  marginBottom: 6,
                  color: "#262d7d",
                }}
              >
                Filtrar por evaluación
              </label>
              <input
                id="filterEvaluacion"
                type="text"
                placeholder="Filtrar por evaluación"
                value={filterEvaluacion}
                onChange={(e) => setFilterEvaluacion(e.target.value)}
                autoComplete="off"
                style={inputStyle}
              />
            </div>

            <div
              style={{
                flex: "1 1 200px",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <label
                htmlFor="filterFecha"
                style={{
                  fontWeight: "bold",
                  marginBottom: 6,
                  color: "#262d7d",
                }}
              >
                Filtrar por fecha
              </label>
              <input
                id="filterFecha"
                type="date"
                value={filterFecha}
                onChange={(e) => setFilterFecha(e.target.value)}
                autoComplete="off"
                style={inputStyle}
              />
            </div>

            <button
              style={{
                ...buttonStyle,
                flex: "0 0 120px",
                alignSelf: "flex-end",
              }}
              onClick={() => {
                fetchReports();
                fetchCandidates();
              }}
              title="Refrescar reportes"
            >
              Refrescar
            </button>
          </div>

          {/* Tabla */}
          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                minWidth: 700,
              }}
            >
              <thead>
                <tr>
                  <th style={thStyle} onClick={() => handleSort("nombre")}>
                    Nombre {sortField === "nombre" ? (sortAsc ? "▲" : "▼") : ""}
                  </th>
                  <th style={thStyle} onClick={() => handleSort("evaluacion")}>
                    Evaluación{" "}
                    {sortField === "evaluacion" ? (sortAsc ? "▲" : "▼") : ""}
                  </th>
                  <th style={thStyle} onClick={() => handleSort("fecha")}>
                    Fecha {sortField === "fecha" ? (sortAsc ? "▲" : "▼") : ""}
                  </th>
                  <th style={thStyle} onClick={() => handleSort("puntaje")}>
                    Puntaje{" "}
                    {sortField === "puntaje" ? (sortAsc ? "▲" : "▼") : ""}
                  </th>
                  <th style={thStyle}>Archivo</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td
                      colSpan={5}
                      style={{ textAlign: "center", padding: 20 }}
                    >
                      Cargando reportes...
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td
                      colSpan={5}
                      style={{ textAlign: "center", padding: 20, color: "red" }}
                    >
                      {error}
                    </td>
                  </tr>
                ) : paginatedReports.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      style={{
                        textAlign: "center",
                        padding: 20,
                        color: "#888",
                      }}
                    >
                      No hay reportes que coincidan.
                    </td>
                  </tr>
                ) : (
                  paginatedReports.map((r) => (
                    <tr
                      key={r.id}
                      style={{
                        cursor: "default",
                        transition: "background-color 0.3s",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.backgroundColor = "#e6f0ff")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor = "transparent")
                      }
                    >
                      <td style={tdStyle}>{r.nombre}</td>
                      <td style={tdStyle}>
                        {getEvaluacionDisplay(r.evaluacion)}
                      </td>
                      <td style={tdStyle}>
                        {r.fecha ? r.fecha.substring(0, 10) : ""}
                      </td>
                      <td style={tdStyle}>
                        {r.puntaje !== null ? r.puntaje : "Sin puntaje"}
                      </td>
                      <td style={tdStyle}>
                        {r.archivoPDF ? (
                          <a
                            href={r.archivoPDF}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ color: "#262d7d", fontWeight: "bold" }}
                          >
                            Ver archivo
                          </a>
                        ) : (
                          "Sin archivo"
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Paginación */}
          <div
            style={{
              marginTop: 20,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <button
              style={{
                ...buttonStyle,
                opacity: page === 1 ? 0.5 : 1,
                width: 120,
              }}
              disabled={page === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Anterior
            </button>
            <span style={{ margin: "0 15px", fontWeight: "bold" }}>
              Página {page} de {totalPages || 1}
            </span>
            <button
              style={{
                ...buttonStyle,
                opacity: page === totalPages ? 0.5 : 1,
                width: 120,
              }}
              disabled={page === totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              Siguiente
            </button>
          </div>

          {/* Exportar */}
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
    </>
  );

  function getEvaluacionDisplay(
    evaluacion: string | { titulo?: string } | null | undefined
  ): string {
    if (!evaluacion) return "Sin evaluación";
    if (typeof evaluacion === "string") return evaluacion;
    if ("titulo" in evaluacion && evaluacion.titulo) return evaluacion.titulo;
    return "Sin evaluación";
  }
}
