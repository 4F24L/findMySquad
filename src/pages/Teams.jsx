import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs, addDoc, serverTimestamp } from "firebase/firestore";
import TeamCard from "../components/TeamCard";
import { useAuth } from "../contexts/authContext";

export default function Teams() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const {currentUser} = useAuth();
  const [formData, setFormData] = useState({
    team_name: "",
    hackathon_name: "",
    hackathon_description: "",
    total_members: 0,
    members: [],
    skills: "",
    createdBy: currentUser?.uid,
  });


  useEffect(() => {
    async function fetchTeams() {
      try {
        const querySnapshot = await getDocs(collection(db, "teams"));
        const teamsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setTeams(teamsData);
      } catch (error) {
        console.error("Error fetching teams:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchTeams();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const formASquad = async (e) => {
    e.preventDefault();

    try {
      const newTeam = {
        ...formData,
        total_members: formData.total_members,
        members: [],
        skills: formData.skills.split(",").map(skill => skill.trim()),
        createdOn: new Date(),
      };

      const docRef = await addDoc(collection(db, "teams"), newTeam);
      setTeams([...teams, { id: docRef.id, ...newTeam }]);
      setFormData({
        team_name: "",
        hackathon_name: "",
        hackathon_description: "",
        total_members: 0,
        members: [],
        skills: "",
        createdBy: currentUser?.uid,
      });

      alert("Squad Formed Successfully!");
    } catch (error) {
      console.error("Error forming squad:", error);
    }
  };

  if (loading) return <p>Loading Squads...</p>;

  return (
    <>
      {currentUser && <form onSubmit={formASquad} className="flex flex-col gap-3 p-5 bg-gray-100 rounded-lg">
        <input type="text" name="team_name" placeholder="Team Name" value={formData.team_name} onChange={handleChange} required />
        <input type="text" name="hackathon_name" placeholder="Hackathon Name" value={formData.hackathon_name} onChange={handleChange} required />
        <input type="text" name="hackathon_description" placeholder="Hackathon Description" value={formData.hackathon_description} onChange={handleChange} required />
        <input type="number" name="total_members" placeholder="Total Soldiers Needed" value={formData.total_members} onChange={handleChange} required />
        <input type="text" name="skills" placeholder="Skills (comma separated)" value={formData.skills} onChange={handleChange} required />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md">Form a Squad</button>
      </form>}

      <div className="flex flex-wrap gap-5 mt-5 justify-between px-6">
        {teams.length > 0 ? (
          teams.map(team => (
            <TeamCard 
              key={team.id}
              team_name={team.team_name}
              hackathon_name={team.hackathon_name}
              hackathon_description={team.hackathon_description}
              total_members={team.total_members}
              members={team.members}
              skills={team.skills || []}
              createdBy={team.createdBy}
              createdOn={team.createdOn}
            />
          ))
        ) : (
          <p>No teams found.</p>
        )}
      </div>
    </>
  );
}
