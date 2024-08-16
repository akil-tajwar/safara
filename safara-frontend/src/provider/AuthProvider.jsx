import { createContext, useState } from "react";

const AuthContext = createContext();
const AuthProvider = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const userInfo = {
    loading,
    user,
  };
  return <AuthContext.Provider value={userInfo}></AuthContext.Provider>;
};

export default AuthProvider;
