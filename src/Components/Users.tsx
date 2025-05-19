import React, { useState } from "react";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
}

export default function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [form, setForm] = useState<Omit<User, "id">>({
    name: "",
    email: "",
    role: "admin",
    status: "Activo",
  });
  const [editId, setEditId] = useState<number | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const emailExists = users.some(
      (u) =>
        u.email.toLowerCase() === form.email.toLowerCase() && u.id !== editId
    );
    if (emailExists) {
      alert("Ya existe un usuario con ese correo.");
      return;
    }

    if (editId !== null) {
      setUsers((prev) =>
        prev.map((u) => (u.id === editId ? { ...u, ...form } : u))
      );
      setEditId(null);
    } else {
      const newUser: User = {
        id: Date.now(),
        ...form,
      };
      setUsers([...users, newUser]);
    }

    setForm({ name: "", email: "", role: "admin", status: "Activo" });
  };

  const handleEdit = (id: number) => {
    const user = users.find((u) => u.id === id);
    if (user) {
      setForm({
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
      });
      setEditId(id);
    }
  };

  const handleDelete = (id: number) => {
    if (confirm("¿Estás seguro de eliminar este usuario?")) {
      setUsers((prev) => prev.filter((u) => u.id !== id));
    }
  };

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
          maxWidth: "900px",
          margin: "auto",
          boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
        }}
      >
        <h2
          style={{
            color: "#262d7d",
            textAlign: "center",
            marginBottom: "20px",
          }}
        >
          Gestión de Usuarios
        </h2>

        <form onSubmit={handleSubmit} style={{ marginBottom: "30px" }}>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <input
              type="text"
              name="name"
              placeholder="Nombre completo"
              value={form.name}
              onChange={handleChange}
              required
              style={inputStyle}
            />
            <input
              type="email"
              name="email"
              placeholder="Correo electrónico"
              value={form.email}
              onChange={handleChange}
              required
              style={inputStyle}
            />
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              style={inputStyle}
            >
              <option value="admin">Administrador</option>
              <option value="tester">Tester</option>
              <option value="supervisor">Supervisor</option>
              <option value="candidato">Candidato</option>
            </select>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              style={inputStyle}
            >
              <option value="Activo">Activo</option>
              <option value="Inactivo">Inactivo</option>
            </select>
            <button type="submit" style={buttonStyle}>
              {editId !== null ? "Actualizar" : "Agregar"}
            </button>
          </div>
        </form>

        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={thStyle}>Nombre</th>
              <th style={thStyle}>Correo</th>
              <th style={thStyle}>Rol</th>
              <th style={thStyle}>Estado</th>
              <th style={thStyle}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td style={tdStyle}>{u.name}</td>
                <td style={tdStyle}>{u.email}</td>
                <td style={tdStyle}>{u.role}</td>
                <td style={tdStyle}>{u.status}</td>
                <td style={tdStyle}>
                  <button
                    onClick={() => handleEdit(u.id)}
                    style={{ marginRight: "10px" }}
                  >
                    Editar
                  </button>
                  <button onClick={() => handleDelete(u.id)}>Eliminar</button>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  style={{
                    textAlign: "center",
                    padding: "20px",
                    color: "#888",
                  }}
                >
                  No hay usuarios registrados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ✅ ESTILOS TIPADOS
const inputStyle: React.CSSProperties = {
  padding: "10px",
  borderRadius: "6px",
  border: "1px solid #ccc",
  flex: "1 1 200px",
};

const buttonStyle: React.CSSProperties = {
  padding: "10px 20px",
  backgroundColor: "#262d7d",
  color: "white",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  flex: "1 1 150px",
};

const thStyle: React.CSSProperties = {
  backgroundColor: "#f1f1f1",
  padding: "10px",
  textAlign: "left",
  borderBottom: "2px solid #ccc",
};

const tdStyle: React.CSSProperties = {
  padding: "10px",
  borderBottom: "1px solid #ddd",
};
