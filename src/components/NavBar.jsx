import React from "react";
import Button from "./Button";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const NavBar = () => {
  const navigate = useNavigate();
  const { currentUser, signUserOut } = useAuth();
  return (
    <div className=" flex justify-between px-6 py-6 items-center">
      <div onClick={()=>{
        navigate("/")
      }} className=" font-bold text-2xl cursor-pointer">FindMySquad</div>

      <ul className=" flex justify-between gap-5">
        <li>
          <Link to="/teams">Squads</Link>
        </li>
        <li>
          <Link to="/hackathons">Upcoming Battles</Link>
        </li>
        <li>
          <Link to="/chats">Squad Chat</Link>
        </li>
        <li>
          <Link to="/profile">Profile</Link>
        </li>
      </ul>
      {currentUser ?  <Button onClick={() => {
          signUserOut()
        }} label={"Logout"} bg={"bg-[#D32F2F]"} textClr={"text-white"} /> : <div className="flex gap-5 justify-between">
        <Button onClick={() => {
          navigate("/register")
        }} label={"Sign Up"} bg={"bg-white"} textClr={"text-black"} classes={"border-2 border-[#a78dfb]"} />
        <Button onClick={() => {
          navigate("/login")
        }} label={"Login"} />
      </div>}
    </div>
  );
};

export default NavBar;
