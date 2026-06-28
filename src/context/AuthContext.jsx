import { createContext, useState } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = async (email, password) => {
    const res = await axios.post("http://localhost:5000/api/auth/admin/login", { email, password });
    localStorage.setItem("token", res.data.token);
    setUser({ email: res.data.email, role: res.data.role });
  };

  const checkProtected = async () => {
    const token = localStorage.getItem("token");
    const res = await axios.get("http://localhost:5000/api/auth/protected", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setUser(res.data.user);
  };

  return (
    <AuthContext.Provider value={{ user, login, checkProtected }}>
      {children}
    </AuthContext.Provider>
  );
};
