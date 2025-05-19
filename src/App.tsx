import { useState } from "react";
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./Components/Login";
import LoginGoogle from "./Components/LoginGoogle";
import Dashboard from "./Components/Dashboard";
import UserPanel from "./Components/UserPanel";
import Candidates from "./Components/Candidates";
import Evaluations from "./Components/Evaluations";
import Reports from "./Components/Reports";
import Results from "./Components/Results";
import ExportData from "./Components/ExportData";
import Statistics from "./Components/Statistics";
import Config from "./Components/Config";
import Users from "./Components/Users";
import "./App.css";

function App() {
  const [userEmail, setUserEmail] = useState("");

  const getUserRole = (email: string): string => {
    const lower = email.toLowerCase();
    if (lower === "admin@specialisterneneurotalentgt.com") return "admin";
    if (lower === "tester@specialisterneneurotalentgt.com") return "tester";
    if (lower === "supervisor@specialisterneneurotalentgt.com")
      return "supervisor";
    if (lower === "candidato@specialisterneneurotalentgt.com")
      return "candidate";
    return "usuario";
  };

  return (
    <HashRouter>
      {!userEmail ? (
        <Routes>
          <Route path="/login" element={<Login onLogin={setUserEmail} />} />
          <Route
            path="/login-google"
            element={<LoginGoogle onLogin={setUserEmail} />}
          />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      ) : (
        <Routes>
          <Route
            path="/dashboard"
            element={
              <Dashboard
                role={getUserRole(userEmail)}
                onLogout={() => setUserEmail("")}
                userEmail={userEmail} // Aquí agregamos la prop requerida
                // userPhotoUrl="url_de_foto_opcional" // Puedes agregar si tienes la URL
              />
            }
          />
          <Route path="/usuarios" element={<Users />} />
          <Route
            path="/panel"
            element={
              <UserPanel email={userEmail} role={getUserRole(userEmail)} />
            }
          />
          <Route path="/candidatos" element={<Candidates />} />
          <Route path="/evaluaciones" element={<Evaluations />} />
          <Route path="/reportes" element={<Reports />} />
          <Route path="/resultados" element={<Results />} />
          <Route path="/exportar" element={<ExportData />} />
          <Route path="/estadisticas" element={<Statistics />} />
          <Route path="/configuracion" element={<Config />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      )}
    </HashRouter>
  );
}

export default App;
