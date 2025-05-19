import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";

interface LoginProps {
  onLogin: (email: string) => void;
}

export default function Login({ onLogin }: LoginProps) {
  return (
    <GoogleOAuthProvider clientId="1013911387108-amu2fquaigpabk0cesu6j0f4v4ejsqqp.apps.googleusercontent.com">
      <div
        style={{
          minHeight: "100vh",
          backgroundColor: "#262d7d",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              backgroundColor: "#ffffff",
              padding: "40px",
              borderRadius: "16px",
              maxWidth: "400px",
              width: "100%",
              textAlign: "center",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
              margin: "20px",
            }}
          >
            <img
              src="/logo.png"
              alt="Logo Specialisterne"
              style={{
                width: "200px",
                height: "auto",
                margin: "0 auto 10px auto",
                display: "block",
              }}
            />

            <h2
              style={{
                color: "#262d7d",
                marginBottom: "8px",
                marginTop: "5px",
              }}
            >
              NeuroTalent - Iniciar sesión
            </h2>

            <p
              style={{
                fontSize: "14px",
                color: "#444",
                marginBottom: "20px",
              }}
            >
              Por favor, inicia sesión con tu correo institucional.
            </p>

            <GoogleLogin
              onSuccess={(credentialResponse) => {
                const token = credentialResponse.credential;
                if (!token) return;

                const payload = JSON.parse(atob(token.split(".")[1]));
                const email = payload.email;

                if (email.endsWith("@specialisterneneurotalentgt.com")) {
                  onLogin(email);
                } else {
                  alert("Solo se permiten correos institucionales.");
                }
              }}
              onError={() => {
                alert("Error al iniciar sesión con Google");
              }}
              ux_mode="popup"
            />
          </div>
        </div>

        <footer
          style={{
            textAlign: "center",
            padding: "20px",
            fontSize: "14px",
            color: "#ccc",
          }}
        >
          © 2025 Specialisterne NeuroTalent Guatemala UMG. Todos los derechos
          reservados.
          <br />
          Grupo 6 – Curso: Análisis de Sistemas I
        </footer>
      </div>
    </GoogleOAuthProvider>
  );
}
