import React from "react";
import Button from "./Button";
import { Link } from "react-router-dom";

const NavBar = () => {
  return (
    <div className=" flex justify-between px-6 py-6">
      <div className=" font-bold text-2xl">FindMySquad</div>

      <ul className=" flex justify-between gap-5">
        <li>
          <Link to="/teams">Squads</Link>
        </li>
        <li>
          <Link to="hackathons">Upcoming Battles</Link>
        </li>
        <li>
          <Link to="/chats">Squad Chat</Link>
        </li>
        <li>
          <Link to="/profile">Profile</Link>
        </li>
      </ul>
      <div className="flex gap-5 justify-between">
        <Button label={"Sign Up"} bg={"bg-white"} textClr={"text-black"} />
        <Button label={"Login"} />
      </div>
    </div>
  );
};

export default NavBar;
