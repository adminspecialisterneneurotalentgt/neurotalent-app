import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { useNavigate } from "react-router-dom";

// Aquí ajusta la ruta del logo según tu proyecto
import logoSpecialisterne from "../assets/logoSpecialisterne.png";

interface Report {
  id: number;
  candidato: string;
  evaluacion: string;
  fecha: string;
  puntaje: number;
  archivoUrl?: string;
}

const thStyle: React.CSSProperties = {
  backgroundColor: "#2c2f69",
  color: "white",
  padding: "10px",
  textAlign: "left",
  borderBottom: "none",
  fontWeight: "bold",
  fontSize: 14,
  userSelect: "none",
};

const tdStyle: React.CSSProperties = {
  padding: "10px",
  borderBottom: "1px solid #e2e2e2",
  fontSize: 14,
  color: "#444",
};

const inputStyle: React.CSSProperties = {
  padding: "8px 12px",
  borderRadius: 6,
  border: "1px solid #ddd",
  marginRight: 10,
  marginBottom: 10,
  minWidth: 150,
  fontSize: 14,
  color: "#333",
};

const buttonPrimaryStyle: React.CSSProperties = {
  backgroundColor: "#2c2f69",
  color: "white",
  border: "none",
  borderRadius: 6,
  padding: "12px 25px",
  fontWeight: "bold",
  cursor: "pointer",
  fontSize: 14,
  marginRight: 10,
  marginTop: 10,
};

const containerStyle: React.CSSProperties = {
  backgroundColor: "white",
  borderRadius: 12,
  padding: 30,
  maxWidth: 900,
  margin: "40px auto",
  boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
  boxSizing: "border-box",
};

export default function Reports() {
  const [reports, setReports] = useState<Report[]>([]);
  const [filteredReports, setFilteredReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [filterCandidato, setFilterCandidato] = useState("");
  const [filterEvaluacion, setFilterEvaluacion] = useState("");
  const [filterFecha, setFilterFecha] = useState("");
  const [filterPuntajeMin, setFilterPuntajeMin] = useState("");
  const [filterPuntajeMax, setFilterPuntajeMax] = useState("");

  const [sortField, setSortField] = useState<keyof Report | null>(null);
  const [sortAsc, setSortAsc] = useState(true);

  const [page, setPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(filteredReports.length / itemsPerPage);

  const navigate = useNavigate();

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
    if (filterPuntajeMin) {
      const min = Number(filterPuntajeMin);
      if (!isNaN(min)) data = data.filter((r) => r.puntaje >= min);
    }
    if (filterPuntajeMax) {
      const max = Number(filterPuntajeMax);
      if (!isNaN(max)) data = data.filter((r) => r.puntaje <= max);
    }

    if (sortField) {
      data.sort((a, b) => {
        let valA = a[sortField];
        let valB = b[sortField];
        if (valA === undefined || valA === null) return 1;
        if (valB === undefined || valB === null) return -1;
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
    filterPuntajeMin,
    filterPuntajeMax,
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
      Archivo: r.archivoUrl ? r.archivoUrl : "N/A",
    }));
    const ws = XLSX.utils.json_to_sheet(wsData);
    XLSX.utils.book_append_sheet(wb, ws, "Reportes");
    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const blob = new Blob([wbout], { type: "application/octet-stream" });
    saveAs(blob, "reportes_evaluaciones.xlsx");
  };

  return (
    <div
      style={{ backgroundColor: "#2c2f69", minHeight: "100vh", padding: 20 }}
    >
      <div style={containerStyle}>
        {/* Boton volver y logo */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 20,
          }}
        >
          <button
            onClick={() => navigate("/dashboard")}
            style={{
              background: "none",
              border: "none",
              color: "#2c2f69",
              fontWeight: "bold",
              cursor: "pointer",
              fontSize: 14,
              padding: 0,
              textDecoration: "underline",
            }}
          >
            ← Regresar a Dashboard
          </button>

          <img
            src={logoSpecialisterne}
            alt="Logo Specialisterne"
            style={{ height: 60, objectFit: "contain" }}
          />
        </div>

        <h2 style={{ color: "#2c2f69", textAlign: "center", marginBottom: 20 }}>
          Reporte General de Evaluaciones
        </h2>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 10,
            justifyContent: "center",
            marginBottom: 20,
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
            style={{ ...inputStyle, minWidth: 130 }}
            type="date"
            placeholder="Filtrar por fecha"
            value={filterFecha}
            onChange={(e) => setFilterFecha(e.target.value)}
          />
          <input
            style={{ ...inputStyle, maxWidth: 100 }}
            type="number"
            placeholder="Puntaje mínimo"
            min={0}
            max={100}
            value={filterPuntajeMin}
            onChange={(e) => setFilterPuntajeMin(e.target.value)}
          />
          <input
            style={{ ...inputStyle, maxWidth: 100 }}
            type="number"
            placeholder="Puntaje máximo"
            min={0}
            max={100}
            value={filterPuntajeMax}
            onChange={(e) => setFilterPuntajeMax(e.target.value)}
          />
          <button
            style={{ ...buttonPrimaryStyle, marginLeft: "auto" }}
            onClick={() => fetchReports()}
            title="Refrescar reportes"
          >
            Refrescar
          </button>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table
            style={{ width: "100%", borderCollapse: "collapse", minWidth: 700 }}
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
                      (e.currentTarget.style.backgroundColor = "#f1f3ff")
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
                          style={{ color: "#2c2f69", fontWeight: "bold" }}
                        >
                          Ver archivo
                        </a>
                      ) : (
                        "N/A"
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
            gap: 15,
          }}
        >
          <button
            style={{
              ...buttonPrimaryStyle,
              backgroundColor: page === 1 ? "#a3a5c3" : "#2c2f69",
              cursor: page === 1 ? "not-allowed" : "pointer",
            }}
            disabled={page === 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            Anterior
          </button>
          <span style={{ fontWeight: "bold" }}>
            Página {page} de {totalPages || 1}
          </span>
          <button
            style={{
              ...buttonPrimaryStyle,
              backgroundColor: page === totalPages ? "#a3a5c3" : "#2c2f69",
              cursor: page === totalPages ? "not-allowed" : "pointer",
            }}
            disabled={page === totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          >
            Siguiente
          </button>
        </div>

        {/* Botón exportar abajo */}
        <div
          style={{
            marginTop: 30,
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <button
            style={buttonPrimaryStyle}
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
