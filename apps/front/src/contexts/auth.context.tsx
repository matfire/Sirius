import React, { createContext, useEffect, useState } from "react";

interface AuthContext {
  token?: string;
  username?: string;
  email?: string;
  updateUser: () => void;
}

export const authContext = createContext<AuthContext>({
  email: "",
  token: "",
  username: "",
  updateUser: () => {},
});

export default function AuthProvider({
  children,
}: {
  children: React.ReactElement[] | React.ReactElement;
}) {
  const [token, setToken] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");

  useEffect(() => {
    updateUser();
  }, []);

  const updateUser = () => {
    const t = localStorage.getItem("sirius_token");
    if (t) {
      setToken(t);
    }
  };

  return (
    <authContext.Provider value={{ token, username, email, updateUser }}>
      {children}
    </authContext.Provider>
  );
}
