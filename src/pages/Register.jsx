import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { useAuth } from "../contexts/authContext";

export default function Register() {
  const [githubUsername, setGithubUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const { signInWithGithub } = useAuth();

  async function handleReg(e) {
    e.preventDefault();
    setIsLoading(true);

    try {
      const userCrediential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCrediential.user;
      setIsLoading(false);
      await updateProfile(user, {
        displayName: githubUsername,
      })
      navigate("/profile");
    } catch (err) {
      alert(err.message);
      setIsLoading(false);
    }
  }

  return (
    <>
      <h1>Register</h1>
      <form onSubmit={handleReg}>
        <input
          type="text"
          placeholder="Github username"
          value={githubUsername}
          onChange={(e) => setGithubUsername(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Registering..." : "Register"}
        </button>
      </form>

      <hr />

      <h3>Or sign in with</h3>
      <button onClick={signInWithGithub}>GitHub</button>
    </>
  );
}
