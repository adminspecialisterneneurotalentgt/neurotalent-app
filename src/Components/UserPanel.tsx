import { useEffect, useState } from "react";

interface Props {
  email: string;
  role: string;
}

interface Evaluation {
  titulo: string;
  descripcion: string;
  fecha: string;
  tipo: string;
}

export default function UserPanel({ email, role }: Props) {
  const [evaluaciones, setEvaluaciones] = useState<Evaluation[]>([]);

  useEffect(() => {
    // Simular evaluaciones asignadas al candidato (esto se conectará a BD luego)
    if (role === "candidate") {
      setEvaluaciones([
        {
          titulo: "Evaluación Lógica",
          descripcion: "Prueba de razonamiento lógico",
          fecha: "2025-05-25",
          tipo: "Lógica",
        },
        {
          titulo: "Prueba de Atención",
          descripcion: "Ejercicios para medir atención sostenida",
          fecha: "2025-06-01",
          tipo: "Atención",
        },
      ]);
    }
  }, [role]);

  return (
    <div
      style={{
        backgroundColor: "#262d7d",
        minHeight: "100vh",
        padding: "40px",
        color: "white",
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          color: "#262d7d",
          borderRadius: "16px",
          padding: "30px",
          maxWidth: "800px",
          margin: "auto",
          boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
          Panel del Usuario
        </h2>

        <p>
          <strong>Correo:</strong> {email}
        </p>
        <p>
          <strong>Rol:</strong>{" "}
          {role === "admin"
            ? "Administrador"
            : role === "tester"
            ? "Tester"
            : role === "supervisor"
            ? "Supervisor"
            : "Candidato"}
        </p>

        {role === "candidate" && (
          <>
            <h3 style={{ marginTop: "30px" }}>Tus Evaluaciones Asignadas</h3>
            <ul>
              {evaluaciones.map((ev, index) => (
                <li key={index} style={{ marginBottom: "10px" }}>
                  <strong>{ev.titulo}</strong> - {ev.tipo} - {ev.fecha}
                  <br />
                  <span style={{ fontSize: "14px", color: "#555" }}>
                    {ev.descripcion}
                  </span>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
}
