import { CheckCircle, Clock, Shield, Target, UsersRound } from "lucide-react";
import Button from "./Button";
import { useAuth } from "../contexts/AuthContext";
import { arrayUnion, arrayRemove, doc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useEffect, useState } from "react";

const TeamCard = ({ id, team_name, hackathon_name, hackathon_description, total_members, members, skills, createdBy, creatorId, createdOn, photoURL}) => {
  const { currentUser } = useAuth();
  const [joinRequests, setJoinRequests] = useState([]);
  const [showSquadDetails, setShowSquadDetails] = useState(false);
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
          photoURL: currentUser.photoURL || "Anonymous",
        }),
      });

      alert("Join request sent to the squad creator!");
      setJoinRequests(prev => [...prev, { uid: currentUser.uid, displayName: currentUser.displayName, photoURL: currentUser.photoURL || "Anonymous" }]);
    } catch (error) {
      console.error("Error requesting to join squad:", error);
    }
  };

  const handleApprove = async (uid, displayName,photoURL) => {
    try {
      const teamRef = doc(db, "teams", id);
      await updateDoc(teamRef, {
        members: arrayUnion({ uid, displayName, photoURL }),
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
    <div className="flex flex-col w-full md:w-10/21 shad bg-white p-5 rounded-2xl">
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
        <img className="rounded-full h-13" src={photoURL} alt="user" />
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
          ) : members?.length >= total_members ? ( 
            <Button label={"Squad Full"} isDisabled={true} />
          ) : (
            <Button label={"Request to Join"} onClick={handleJoinRequest} />
          )
        )}
        <button onClick={() => setShowSquadDetails(!showSquadDetails)} className="cursor-pointer">
          {!showSquadDetails ? "View" : "Hide"} All Squads
        </button>
      </div>

      {showSquadDetails && (
      <div className="mt-4 p-3 bg-gray-100 rounded-md">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-gray-700 flex items-center">
              <Shield className="h-4 w-4 text-gray-400 mr-2" />
              Squad Details
            </h3>
          </div>

          <div className="space-y-3">
            {/* Active Members */}
            <div className="space-y-2">
              {members?.map((member) => (
                <div key={member.uid} className="flex items-center justify-between p-2 rounded-lg bg-gray-50">
                  <div className="flex items-center space-x-3">
                    <img
                      src={member?.photoURL}
                      alt={member?.displayName}
                      className="h-8 w-8 rounded-full ring-2 ring-white"
                    />
                    <p className="text-sm font-medium text-gray-900">{member?.displayName}</p>
                  </div>
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Active
                  </span>
                </div>
              ))}

            </div>

            {/* Pending Members */}
            {Array.isArray(joinRequests) && currentUser?.uid === creatorId && joinRequests.length > 0 && (
              <div className="space-y-2">
                <h5 className="text-xs font-medium text-gray-500 mt-3 mb-2">Pending Requests</h5>
                {joinRequests.map((request) => (
                  <div key={request.uid} className="flex items-center justify-between p-2 rounded-lg bg-gray-50 border border-gray-100">
                    <div className="flex items-center space-x-3">
                      <img
                        src={request?.photoURL}
                        alt={request?.displayName}
                        className="h-8 w-8 rounded-full ring-2 ring-white"
                      />
                      <div>
                        <p className="text-sm font-medium text-gray-900 mb-2 cursor-pointer">{request?.displayName}</p>
                        <span onClick={() => handleApprove(request?.uid, request?.displayName, request?.photoURL)} className="bg-green-100 text-green-800 cursor-pointer px-2 py-1 rounded-full text-xs font-medium mr-2">Approve</span>
                        <span onClick={() => handleReject(request?.uid, request?.displayName)} className="bg-red-100 text-red-800 cursor-pointer px-2 py-1 rounded-full text-xs font-medium">Reject</span>
                      </div>
                    </div>

                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      <Clock className="w-3 h-3 mr-1" />
                      Pending
                    </span>
                  </div>
                ))}
              </div>
            )}

          </div>
        </div>
      )}
      </div>
  );
};

export default TeamCard;
