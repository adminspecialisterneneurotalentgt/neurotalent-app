import { useState } from "react";

export default function Config() {
  const [themeColor, setThemeColor] = useState("#262d7d");
  const [password, setPassword] = useState("");
  const [mensaje, setMensaje] = useState("");

  const handleResetData = () => {
    if (confirm("¿Seguro que deseas restablecer los datos del sistema?")) {
      setMensaje("🧹 Base de datos simulada restablecida correctamente.");
    }
  };

  const handleChangePassword = () => {
    if (password.length < 6) {
      setMensaje("⚠️ La nueva contraseña debe tener al menos 6 caracteres.");
    } else {
      setMensaje("🔐 Contraseña del sistema actualizada (simulado).");
      setPassword("");
    }
  };

  const handleThemeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setThemeColor(e.target.value);
    setMensaje(
      `🎨 Color del sistema actualizado a ${e.target.value} (simulado).`
    );
  };

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
          maxWidth: "700px",
          margin: "auto",
          boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
          Configuración del Sistema
        </h2>

        {mensaje && (
          <div
            style={{
              backgroundColor: "#f0f0f0",
              padding: "10px",
              marginBottom: "20px",
              borderRadius: "8px",
              color: "#444",
            }}
          >
            {mensaje}
          </div>
        )}

        <div style={{ marginBottom: "20px" }}>
          <label style={{ fontWeight: "bold" }}>
            Cambiar color institucional:
          </label>
          <br />
          <input
            type="color"
            value={themeColor}
            onChange={handleThemeChange}
            style={{ width: "100%", height: "40px", marginTop: "10px" }}
          />
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label style={{ fontWeight: "bold" }}>
            Cambiar contraseña del sistema:
          </label>
          <br />
          <input
            type="password"
            placeholder="Nueva contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              padding: "10px",
              width: "100%",
              borderRadius: "6px",
              border: "1px solid #ccc",
              marginTop: "10px",
            }}
          />
          <button
            onClick={handleChangePassword}
            style={{
              marginTop: "10px",
              backgroundColor: "#262d7d",
              color: "white",
              border: "none",
              borderRadius: "6px",
              padding: "10px 20px",
              cursor: "pointer",
            }}
          >
            Cambiar contraseña
          </button>
        </div>

        <div style={{ textAlign: "center", marginTop: "40px" }}>
          <button
            onClick={handleResetData}
            style={{
              backgroundColor: "#e74c3c",
              color: "white",
              border: "none",
              borderRadius: "6px",
              padding: "10px 20px",
              cursor: "pointer",
            }}
          >
            🧹 Restablecer base de datos (simulado)
          </button>
        </div>
      </div>
    </div>
  );
}
