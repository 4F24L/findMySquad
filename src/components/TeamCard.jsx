import { Target, UsersRound } from "lucide-react";
import Button from "./Button";
import { useAuth } from "../contexts/AuthContext";
import { arrayUnion, arrayRemove, doc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useEffect, useState } from "react";

const TeamCard = ({ id, team_name, hackathon_name, hackathon_description, total_members, members, skills, createdBy, creatorId, createdOn }) => {
  const { currentUser } = useAuth();
  const [joinRequests, setJoinRequests] = useState([]);

  useEffect(() => {
    const fetchTeamData = async () => {
      const teamRef = doc(db, "teams", id);
      const teamSnap = await getDoc(teamRef);

      if (teamSnap.exists()) {
        setJoinRequests(teamSnap.data().joinRequests || []);
      }
    };

    fetchTeamData();
  }, [id]);

  const isJoined = members?.some(member => member.uid === currentUser?.uid);
  const hasRequested = joinRequests?.some(request => request.uid === currentUser?.uid);

  const formatDate = (date) => {
    if (!date) return "Unknown Date"; 

    if (date.seconds) {
      return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }).format(new Date(date.seconds * 1000));
    }

    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(new Date(date));
  };

  const handleJoinRequest = async () => {
    if (!currentUser) {
      alert("You must be logged in to request to join a squad.");
      return;
    }

    try {
      const teamRef = doc(db, "teams", id);
      await updateDoc(teamRef, {
        joinRequests: arrayUnion({
          uid: currentUser.uid,
          displayName: currentUser.displayName || "Anonymous",
        }),
      });

      alert("Join request sent to the squad creator!");
      setJoinRequests(prev => [...prev, { uid: currentUser.uid, displayName: currentUser.displayName || "Anonymous" }]);
    } catch (error) {
      console.error("Error requesting to join squad:", error);
    }
  };

  const handleApprove = async (uid, displayName) => {
    try {
      const teamRef = doc(db, "teams", id);
      await updateDoc(teamRef, {
        members: arrayUnion({ uid, displayName }),
        joinRequests: joinRequests.filter(request => request.uid !== uid),
      });

      setJoinRequests(prev => prev.filter(request => request.uid !== uid));
      alert("User added to the squad!");
    } catch (error) {
      console.error("Error approving request:", error);
    }
  };

  const handleReject = async (uid) => {
    try {
      const teamRef = doc(db, "teams", id);
      await updateDoc(teamRef, {
        joinRequests: joinRequests.filter(request => request.uid !== uid),
      });

      setJoinRequests(prev => prev.filter(request => request.uid !== uid));
      alert("Join request rejected.");
    } catch (error) {
      console.error("Error rejecting request:", error);
    }
  };

  return (
    <div className="flex flex-col w-10/21 shad bg-white p-5 rounded-2xl">
      <div className="flex justify-between w-[100%]">
        <p className="font-medium text-2xl">{team_name}</p>
        <p className="bg-[#a78dfb] text-white font-medium px-4 py-1 rounded-full">
          {hackathon_name}
        </p>
      </div>
      <p className="w-[60%] mt-2">{hackathon_description}</p>

      <div className="flex justify-between text-sm mt-4 text-gray-600">
        <p className="flex">
          <UsersRound size={20} color="gray" className="mr-2" /> {total_members} soldiers
        </p>
        <p className="flex">{total_members - (members?.length || 0)} soldiers needed</p>
      </div>
      <div className="my-4">
        <p className="flex font-medium mb-3">
          <Target size={25} color="gray" className="mr-2" /> Required Superpowers
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
        <img className="rounded-full h-13" src={`https://randomuser.me/api/portraits/men/58.jpg`} alt="user" />
        <div>
          <p>{createdBy}</p>
          <p>{formatDate(createdOn)}</p>
        </div>
      </div>

      <div className="flex justify-end gap-5">
        {currentUser && currentUser?.uid !== creatorId && (
          isJoined ? (
            <Button label={"Already in Squad"} isDisabled={true} />
          ) : hasRequested ? (
            <Button label={"Request Sent"} isDisabled={true} />
          ) : (
            <Button label={"Request to Join"} onClick={handleJoinRequest} />
          )
        )}
        <button className="cursor-pointer font-medium rounded-lg h-10 py-1 px-4 bg-[#f5f5f5] text-zinc-600">View Details</button>
      </div>

      {currentUser?.uid === creatorId && (
        <div className="mt-4 p-3 bg-gray-100 rounded-md">
          <h3 className="font-medium mb-2">Pending Join Requests</h3>
          {joinRequests?.length > 0 ? (
            joinRequests.map((request) => (
              <div key={request.uid} className="flex justify-between items-center p-2 bg-white shadow-sm rounded-md mb-2">
                <p>{request.displayName}</p>
                <div className="flex gap-2">
                  <Button onClick={() => handleApprove(request.uid, request.displayName)} bg={"bg-[#4be74b]"} label={"Approve"}/>
                  <Button onClick={() => handleReject(request.uid)} bg={"bg-[#e7724b]"} label={"Reject"}/>
                </div>
              </div>
            ))
          ) : (
            <p>No pending requests</p>
          )}
        </div>
      )}
    </div>
  );
};

export default TeamCard;
