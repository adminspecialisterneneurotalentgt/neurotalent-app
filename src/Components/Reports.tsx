import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

interface Report {
  id: number;
  candidato: string;
  evaluacion: string;
  fecha: string;
  puntaje: number;
  archivoUrl?: string;
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
  const [filteredReports, setFilteredReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // filtros
  const [filterCandidato, setFilterCandidato] = useState("");
  const [filterEvaluacion, setFilterEvaluacion] = useState("");
  const [filterFecha, setFilterFecha] = useState("");

  // orden
  const [sortField, setSortField] = useState<keyof Report | null>(null);
  const [sortAsc, setSortAsc] = useState(true);

  // paginación
  const [page, setPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(filteredReports.length / itemsPerPage);

  const fetchReports = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/reports");
      if (!response.ok) throw new Error("Error al cargar los reportes");
      const data: Report[] = await response.json();
      setReports(data);
    } catch (e: any) {
      setError(e.message || "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  useEffect(() => {
    let data = [...reports];

    if (filterCandidato)
      data = data.filter((r) =>
        r.candidato.toLowerCase().includes(filterCandidato.toLowerCase())
      );
    if (filterEvaluacion)
      data = data.filter((r) =>
        r.evaluacion.toLowerCase().includes(filterEvaluacion.toLowerCase())
      );
    if (filterFecha) data = data.filter((r) => r.fecha === filterFecha);

    if (sortField) {
      data.sort((a, b) => {
        let valA = a[sortField] ?? "";
        let valB = b[sortField] ?? "";

        if (typeof valA === "string" && typeof valB === "string") {
          valA = valA.toLowerCase();
          valB = valB.toLowerCase();
        }
        if (valA < valB) return sortAsc ? -1 : 1;
        if (valA > valB) return sortAsc ? 1 : -1;
        return 0;
      });
    }

    setFilteredReports(data);
    setPage(1);
  }, [
    reports,
    filterCandidato,
    filterEvaluacion,
    filterFecha,
    sortField,
    sortAsc,
  ]);

  const paginatedReports = filteredReports.slice(
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

  const exportToExcel = () => {
    const wb = XLSX.utils.book_new();
    const wsData = filteredReports.map((r) => ({
      Candidato: r.candidato,
      Evaluacion: r.evaluacion,
      Fecha: r.fecha,
      Puntaje: r.puntaje,
      Archivo: r.archivoUrl || "Sin archivo",
    }));
    const ws = XLSX.utils.json_to_sheet(wsData);
    XLSX.utils.book_append_sheet(wb, ws, "Reportes");
    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const blob = new Blob([wbout], { type: "application/octet-stream" });
    saveAs(blob, "reportes_evaluaciones.xlsx");
  };

  return (
    <div
      style={{
        backgroundColor: "#f9f9f9",
        minHeight: "100vh",
        padding: "40px 20px",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          borderRadius: 16,
          padding: 30,
          maxWidth: 1000,
          margin: "auto",
          boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
          display: "flex",
          flexDirection: "column",
          position: "relative",
        }}
      >
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
            color: "#262d7d",
            textAlign: "center",
            marginBottom: 30,
            fontWeight: "bold",
            fontSize: 24,
          }}
        >
          Reporte General de Evaluaciones
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
        {/* Filtros con etiquetas */}
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
              htmlFor="filterCandidato"
              style={{ fontWeight: "bold", marginBottom: 6, color: "#262d7d" }}
            >
              Filtrar por candidato
            </label>
            <input
              id="filterCandidato"
              type="text"
              placeholder="Filtrar por candidato"
              value={filterCandidato}
              onChange={(e) => setFilterCandidato(e.target.value)}
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
              style={{ fontWeight: "bold", marginBottom: 6, color: "#262d7d" }}
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
              style={{ fontWeight: "bold", marginBottom: 6, color: "#262d7d" }}
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
            style={{ ...buttonStyle, flex: "0 0 120px", alignSelf: "flex-end" }}
            onClick={() => fetchReports()}
            title="Refrescar reportes"
          >
            Refrescar
          </button>
        </div>

        {/* Tabla con scroll horizontal */}
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
                <th style={thStyle} onClick={() => handleSort("candidato")}>
                  Candidato{" "}
                  {sortField === "candidato" ? (sortAsc ? "▲" : "▼") : ""}
                </th>
                <th style={thStyle} onClick={() => handleSort("evaluacion")}>
                  Evaluación{" "}
                  {sortField === "evaluacion" ? (sortAsc ? "▲" : "▼") : ""}
                </th>
                <th style={thStyle} onClick={() => handleSort("fecha")}>
                  Fecha {sortField === "fecha" ? (sortAsc ? "▲" : "▼") : ""}
                </th>
                <th style={thStyle} onClick={() => handleSort("puntaje")}>
                  Puntaje {sortField === "puntaje" ? (sortAsc ? "▲" : "▼") : ""}
                </th>
                <th style={thStyle}>Archivo</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: "center", padding: 20 }}>
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
                    style={{ textAlign: "center", padding: 20, color: "#888" }}
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
                    <td style={tdStyle}>{r.candidato}</td>
                    <td style={tdStyle}>{r.evaluacion}</td>
                    <td style={tdStyle}>{r.fecha}</td>
                    <td style={tdStyle}>{r.puntaje}</td>
                    <td style={tdStyle}>
                      {r.archivoUrl ? (
                        <a
                          href={r.archivoUrl}
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
        <div style={{ marginTop: 25 }}>
          <button style={buttonStyle} onClick={() => exportToExcel()}>
            Exportar a Excel
          </button>
        </div>
      </div>
    </div>
  );
}
