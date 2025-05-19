import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function Statistics() {
  const resultadosPorEvaluacion: { nombre: string; promedio: number }[] = [];
  // Datos vacíos para que luego se llenen desde base de datos

  return (
    <div
      style={{
        backgroundColor: "#262d7d",
        minHeight: "100vh",
        padding: "40px",
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "16px",
          padding: "30px",
          maxWidth: "1000px",
          margin: "auto",
          boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
        }}
      >
        <h2
          style={{
            color: "#262d7d",
            textAlign: "center",
            marginBottom: "30px",
          }}
        >
          Estadísticas Generales de Candidatos
        </h2>

        <div style={{ marginBottom: "40px" }}>
          <h3 style={{ color: "#262d7d", marginBottom: "10px" }}>
            Promedio de Puntajes por Evaluación
          </h3>
          {resultadosPorEvaluacion.length === 0 ? (
            <p style={{ textAlign: "center", color: "#888" }}>
              No hay datos para mostrar.
            </p>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={resultadosPorEvaluacion}>
                <XAxis dataKey="nombre" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="promedio" fill="#262d7d" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}
