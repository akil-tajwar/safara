import { createContext, useEffect, useState } from "react";

import {
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
} from "firebase/auth";
import app from "../firebase/firebase.config";
import useAxiosPublic from "../hooks/useAxiosPublic";

const AuthContext = createContext(null);

const AuthProvider = ({children}) => {
  const provider = new GoogleAuthProvider();
  const auth = getAuth(app);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const axiosPublic = useAxiosPublic();

  // google login
  const googleLogin = () => {
    return signInWithPopup(auth, provider);
  };

  //   track user is exist

  useEffect(() => {
    const unSubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const userEmail = currentUser?.email;

        axiosPublic.post("/jwt", userEmail).then((res) => {
          localStorage.setItem("access-token", res.data.token);
          setLoading(false);
        });
      } else {
        localStorage.removeItem("access-token");
        setLoading(false);
      }
    });

    return () => {
      unSubscribe();
    };
  }, []);

  const userInfo = {
    loading,
    user,
    googleLogin,
  };
  return <AuthContext.Provider value={userInfo}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
