import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";

interface Props {
  onLogin: (email: string) => void;
}

export default function LoginGoogle({ onLogin }: Props) {
  return (
    <GoogleOAuthProvider clientId="TU_CLIENT_ID_AQUI">
      <div style={{ marginTop: "20px" }}>
        <GoogleLogin
          onSuccess={(credentialResponse) => {
            const token = credentialResponse.credential;
            if (!token) return;

            const payload = JSON.parse(atob(token.split(".")[1]));
            const email = payload.email;

            if (email.endsWith("@specialisterneneurotalentgt.com")) {
              onLogin(email); // Actualiza estado en App.tsx
              // Aquí NO usamos navigate, la redirección la hace App.tsx con <Navigate>
            } else {
              alert("Solo se permiten correos institucionales.");
            }
          }}
          onError={() => {
            alert("Error al iniciar sesión con Google");
          }}
          ux_mode="popup"
          useOneTap={false}
        />
      </div>
    </GoogleOAuthProvider>
  );
}
