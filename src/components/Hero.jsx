import React from "react";
import Button from "./Button";
import { Award, ChevronsRight, Rocket, UsersRound } from "lucide-react";

const Hero = () => {
  return (
    <div className="flex flex-col items-center justify-between h-[85vh] w-full">
      <div className="mt-20">
        <div className=" text-6xl font-bold text-center">
          Find Your Perfect
          <br />
          &lt;Hackathon/&gt; Team
        </div>

        <div className=" font-light text-center mt-5">
          Connect with talented developers, join exciting projects, and<br/>make
          your hackathon dreams come true.
        </div>
      </div>
      <Button label={"Browse Hackathons"} classes={"text-xl"} />
      <div className="flex justify-between px-10 gap-20 mb-10">
        <div className="flex flex-col items-center">
          <span className="bg-[#a78dfb] p-1 w-14 h-14 flex justify-center items-center rounded-md">
            <UsersRound color="white" size={30} />
          </span>
          <p className=" m-4">Find Squad Members</p>
        </div>

        <ChevronsRight size={50} color="#a78dfb" />

        <div className="flex flex-col items-center">
          <span className="bg-[#a78dfb] p-1 w-14 h-14 flex justify-center items-center rounded-md">
            <Award color="white" size={30} />
          </span>
          <p className=" m-4">Join Hackathons</p>
        </div>

        <ChevronsRight size={50} color="#a78dfb" />

        <div className="flex flex-col items-center">
          <span className="bg-[#a78dfb] p-1 w-14 h-14 flex justify-center items-center rounded-md">
            <Rocket color="white" size={30} />
          </span>
          <p className=" m-4">Build projects</p>
        </div>
      </div>
    </div>
  );
};

export default Hero;
