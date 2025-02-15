import React, { useContext, createContext, useEffect, useState } from "react";
import { auth } from "../firebase";
import { onAuthStateChanged, signOut, signInWithPopup, GithubAuthProvider } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const authContext = createContext();

export function useAuth() {
  return useContext(authContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const githubProvider = new GithubAuthProvider();

  const signInWithGithub = async () => {
    try {
      const result = await signInWithPopup(auth, githubProvider);
      setCurrentUser(result.user);
      navigate("/profile");
    } catch (err) {
      setError(err.message);
    }
  };

  const signUserOut = async () => {
    try {
      await signOut(auth);
      setCurrentUser(null);
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return unsubscribe;
  }, []);

  return (
    <authContext.Provider value={{ currentUser, error, signInWithGithub, signUserOut }}>
      {children}
    </authContext.Provider>
  );
}
