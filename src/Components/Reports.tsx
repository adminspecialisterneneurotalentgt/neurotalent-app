import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

interface Report {
  id: number;
  candidato: string;
  evaluacion: string;
  fecha: string;
  puntaje: number;
  archivoUrl?: string | null;
}

const thStyle: React.CSSProperties = {
  backgroundColor: "#262d7d",
  color: "white",
  padding: "12px 15px",
  textAlign: "left",
  borderBottom: "2px solid #1b2568",
  cursor: "pointer",
  userSelect: "none",
};

const tdStyle: React.CSSProperties = {
  padding: "12px 15px",
  borderBottom: "1px solid #ddd",
  color: "#333",
};

const inputStyle: React.CSSProperties = {
  padding: "8px 12px",
  borderRadius: 6,
  border: "1px solid #ccc",
  marginRight: 10,
  marginBottom: 10,
  minWidth: 200,
  boxSizing: "border-box",
};

const buttonStyle: React.CSSProperties = {
  backgroundColor: "#262d7d",
  color: "white",
  border: "none",
  borderRadius: 6,
  padding: "10px 20px",
  margin: "0 10px 10px 0",
  cursor: "pointer",
  fontWeight: "bold",
};

const containerStyle: React.CSSProperties = {
  backgroundColor: "white",
  borderRadius: 16,
  padding: 30,
  maxWidth: 1000,
  margin: "auto",
  boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
  display: "flex",
  flexDirection: "column",
  position: "relative",
};

const pageStyle: React.CSSProperties = {
  backgroundColor: "#262d7d",
  minHeight: "100vh",
  padding: 40,
  color: "black",
  boxSizing: "border-box",
  position: "relative",
};

const logoStyle: React.CSSProperties = {
  position: "absolute",
  top: 30,
  right: 30,
  height: 140,
  objectFit: "contain",
};

export default function Reports() {
  const [reports, setReports] = useState<Report[]>([]);
  const [filteredReports, setFilteredReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [filterCandidato, setFilterCandidato] = useState("");
  const [filterEvaluacion, setFilterEvaluacion] = useState("");
  const [filterFecha, setFilterFecha] = useState("");

  const [sortField, setSortField] = useState<keyof Report | null>(null);
  const [sortAsc, setSortAsc] = useState(true);

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
    if (filterFecha)
      data = data.filter((r) =>
        r.fecha.toLowerCase().includes(filterFecha.toLowerCase())
      );

    if (sortField) {
      data.sort((a, b) => {
        let valA = a[sortField];
        let valB = b[sortField];
        if (valA == null) valA = ""; // evitar undefined/null
        if (valB == null) valB = "";
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
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
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
    }));
    const ws = XLSX.utils.json_to_sheet(wsData);
    XLSX.utils.book_append_sheet(wb, ws, "Reportes");
    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const blob = new Blob([wbout], { type: "application/octet-stream" });
    saveAs(blob, "reportes_evaluaciones.xlsx");
  };

  return (
    <div style={pageStyle}>
      <div style={containerStyle}>
        <h2
          style={{
            color: "#262d7d",
            textAlign: "center",
            marginBottom: 20,
            fontWeight: "bold",
            fontSize: 24,
          }}
        >
          Reporte General de Evaluaciones
        </h2>

        {/* Logo */}
        <img src="/logo.png" alt="Logo" style={logoStyle} />

        {/* Filtros */}
        <div
          style={{
            marginBottom: 20,
            display: "flex",
            flexWrap: "wrap",
            gap: 10,
          }}
        >
          <input
            style={inputStyle}
            type="text"
            placeholder="Filtrar por candidato"
            value={filterCandidato}
            onChange={(e) => setFilterCandidato(e.target.value)}
            autoComplete="off"
          />
          <input
            style={inputStyle}
            type="text"
            placeholder="Filtrar por evaluación"
            value={filterEvaluacion}
            onChange={(e) => setFilterEvaluacion(e.target.value)}
            autoComplete="off"
          />
          <input
            style={inputStyle}
            type="text"
            placeholder="Filtrar por fecha (ej: 2023-05-01)"
            value={filterFecha}
            onChange={(e) => setFilterFecha(e.target.value)}
            autoComplete="off"
          />
          <button
            style={{ ...buttonStyle, marginLeft: "auto" }}
            onClick={fetchReports}
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
              minWidth: 600,
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
            style={{ ...buttonStyle, opacity: page === 1 ? 0.5 : 1 }}
            disabled={page === 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            Anterior
          </button>
          <span style={{ margin: "0 15px", fontWeight: "bold" }}>
            Página {page} de {totalPages || 1}
          </span>
          <button
            style={{ ...buttonStyle, opacity: page === totalPages ? 0.5 : 1 }}
            disabled={page === totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          >
            Siguiente
          </button>
        </div>

        {/* Botón exportar */}
        <div style={{ marginTop: 25, textAlign: "center" }}>
          <button
            style={buttonStyle}
            onClick={exportToExcel}
            title="Exportar reportes a Excel"
          >
            Exportar a Excel
          </button>
        </div>
      </div>
    </div>
  );
}
