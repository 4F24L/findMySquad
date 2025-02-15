import { Target, UsersRound } from "lucide-react";
import Button from "./Button";

const TeamCard = ({team_name, hackathon_name, hackathon_description, total_members, members, skills, createdBy, createdOn}) => {
  const formatDate = (date) => {
    if (!date) return "Unknown Date"; // Handle undefined/null case
  
    // If it's a Firestore timestamp, convert it
    if (date.seconds) {
      return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }).format(new Date(date.seconds * 1000));
    }
  
    // If it's already a Date object or a string date
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(new Date(date));
  };
  
  return (
    <div className="flex flex-col w-10/21 shad bg-white p-5 rounded-2xl">
      <div className="flex justify-between w-[100%]">
        <p className=" font-medium text-2xl">{team_name}</p>
        <p className="bg-[#a78dfb] text-white font-medium px-4 py-1 rounded-full">
          {hackathon_name}
        </p>
      </div>
      <p className="w-[60%] mt-2">
        {hackathon_description}
      </p>

      <div className="flex justify-between text-sm mt-4 text-gray-600">
        <p className="flex">
          <UsersRound size={20} color="gray" className=" mr-2" /> {total_members} soliders
        </p>
        <p className="flex"> {total_members - (members?.length || 0)} soldier needed</p>
      </div>
      <div className="my-4">
        <p className="flex font-medium mb-3">
          <Target size={25} color="gray" className=" mr-2" /> Required Superpowers
        </p>
        <div className="flex">
          {skills.map((skill, index) => (
            <p
              key={index}
              className="flex text-base px-3 text-[#9b7cff] bg-[#eef2ff] mx-1 rounded-full"
            >
              {skill}
            </p>
          ))}
        </div>
      </div>

      <div className="flex gap-5 border-t-1 border-t-gray-500 mt-2 pt-3">
        <img className=" rounded-full h-13" src={`https://randomuser.me/api/portraits/men/58.jpg`} alt="user" />
        <div className="">
            <p>{createdBy}</p>
            <p>{formatDate(createdOn)}</p>
        </div>
          
      </div>
      <div className=" flex justify-end">
        <button className="cursor-pointer font-medium rounded-lg h-10 py-1 px-4 bg-[#f5f5f5] text-zinc-600 ">View Details</button>

          </div>
    </div>

  );
};

export default TeamCard;
