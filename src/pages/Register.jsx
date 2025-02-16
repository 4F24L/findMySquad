import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { useAuth } from "../contexts/AuthContext";
import { UsersRound } from "lucide-react";
import Input from "../components/Input";
import Button from "../components/Button";
import githubLogo from "../assets/github.svg";

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
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    // Fetch GitHub avatar
    let githubAvatarUrl = "";
    if (githubUsername) {
      try {
        const response = await fetch(`https://api.github.com/users/${githubUsername}`);
        if (response.ok) {
          const data = await response.json();
          githubAvatarUrl = data.avatar_url || "";
        }
      } catch (error) {
        console.error("Error fetching GitHub avatar:", error);
      }
    }

    // Update Firebase profile
    await updateProfile(user, {
      displayName: githubUsername,
      photoURL: githubAvatarUrl,
    });

    setIsLoading(false);
    navigate("/profile");
  } catch (err) {
    alert(err.message);
    setIsLoading(false);
  }
}


  return (
    <div className="flex justify-center items-center h-screen p-3">
      <div className="">
        <div className="flex flex-col items-center gap-2 mb-9">
          <UsersRound size={50} color="#a78dfb" className="mb-4" />
          <p className=" text-3xl font-bold">Sign up to findMySquad</p>
          <p className=" text-sm">
            Connect with fellow developers and join exciting hackathons
          </p>
        </div>

        <form className="flex flex-col mt-5 gap-3" onSubmit={handleReg}>
          <Input
            type={"text"}
            placeholder={"Github username"}
            value={githubUsername}
            onChange={(e) => setGithubUsername(e.target.value)}
            isRequired={true}
          />
          <Input
            type={"email"}
            placeholder={"Email"}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            isRequired={true}
          />
          <Input
            type={"password"}
            placeholder={"Password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            isRequired={true}
          />
          <Button
            type="submit"
            isDisabled={isLoading}
            label={isLoading ? "Registering..." : "Register"}
          />

          <p className=" text-center text-gray-600 text-sm">Or continue with</p>

          <Button
            onClick={signInWithGithub}
            bg="bg-gray"
            textClr={"text-zinc-900"}
            classes={"border-2 border-slate-500"}
          >
            <img
              src={githubLogo}
              alt="GitHub Logo"
              className="w-5 h-5 inline-block mr-2"
            />
            Sign up with GitHub
          </Button>      
        </form>

        <p className=" text-center text-gray-600 text-sm mt-5 cursor-pointer">Already have an account ? <span className="text-blue-500" onClick={()=>{
            navigate("/login");
          }}>Log in</span></p>
      </div>
    </div>
  );
}
