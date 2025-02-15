import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs, addDoc } from "firebase/firestore";
import TeamCard from "../components/TeamCard";
import { useAuth } from "../contexts/AuthContext";
import NavBar from "../components/NavBar";
import { UserPlus, Search, Filter } from "lucide-react";

export default function Teams() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({});
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const [formData, setFormData] = useState({
    team_name: "",
    hackathon_name: "",
    hackathon_description: "",
    total_members: "",
    members: [],
    skills: "",
    createdBy: "",
    creatorId: "",
  });

  const fetchTeams = async () => {
    try {
      setLoading(true);
      const querySnapshot = await getDocs(collection(db, "teams"));
      const teamsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTeams(teamsData);
    } catch (error) {
      console.error("Error fetching teams:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const formASquad = async (e) => {
    e.preventDefault();

    if (!currentUser) {
      alert("You must be logged in to form a squad.");
      return;
    }

    try {
      const newTeam = {
        ...formData,
        createdBy: currentUser.displayName || "Anonymous",
        creatorId: currentUser.uid || "unknown",
        skills: formData.skills.split(",").map((skill) => skill.trim()),
        createdOn: new Date().toISOString(),
        total_members: Number(formData.total_members),
        members: [
          {
            uid: currentUser.uid,
            displayName: currentUser.displayName || "Anonymous",
          },
        ],
      };

      const docRef = await addDoc(collection(db, "teams"), newTeam);
      setTeams([...teams, { id: docRef.id, ...newTeam }]);

      setFormData({
        team_name: "",
        hackathon_name: "",
        hackathon_description: "",
        total_members: "",
        members: [
          {
            uid: currentUser.uid,
            displayName: currentUser.displayName || "Anonymous",
          },
        ],
        skills: "",
        createdBy: "",
        creatorId: "",
      });

      alert("Squad Formed Successfully!");
    } catch (error) {
      console.error("Error forming squad:", error);
    }
  };

  const filteredTeams = teams.filter(
    (team) =>
      team.team_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      team.hackathon_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      team.hackathon_description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return <p>Loading Squads...</p>;

  return (
    <>
      <NavBar />
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
          <form onSubmit={formASquad} className="flex flex-col gap-3 p-5 bg-gray-100 rounded-lg">
            <input type="text" name="team_name" placeholder="Team Name" value={formData.team_name} onChange={handleChange} required />
            <input type="text" name="hackathon_name" placeholder="Hackathon Name" value={formData.hackathon_name} onChange={handleChange} required />
            <input type="text" name="hackathon_description" placeholder="Hackathon Description" value={formData.hackathon_description} onChange={handleChange} required />
            <input type="number" name="total_members" placeholder="Total Soldiers Needed" value={formData.total_members} onChange={handleChange} required />
            <input type="text" name="skills" placeholder="Skills (comma separated)" value={formData.skills} onChange={handleChange} required />
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md">Form a Squad</button>
          </form>
        </div>
        </div>
      )}

      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Squads</h2>
            <p className="mt-1 text-sm text-gray-500">Find your perfect squad or create your own</p>
          </div>
          {currentUser &&
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Create a Squad
            </button>}
        </div>

        <div className="mb-6 flex items-center gap-4">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search teams by name, description, or hackathon..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <button
            onClick={() => setIsFilterOpen(true)}
            className={`inline-flex items-center px-4 py-2 border rounded-md text-sm font-medium ${Object.values(filters).some((f) => (Array.isArray(f) ? f.length > 0 : f))
                ? "border-indigo-600 text-indigo-600 bg-indigo-50 hover:bg-indigo-100"
                : "border-gray-300 text-gray-700 bg-white hover:bg-gray-50"
              }`}
          >
            <Filter className="h-4 w-4 mr-2" />
            Filter
            {Object.values(filters).some((f) => (Array.isArray(f) ? f.length > 0 : f)) && (
              <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                Active
              </span>
            )}
          </button>
        </div>

        <div className="flex flex-wrap gap-5 mt-5 justify-between px-6">
          {filteredTeams.length > 0 ? (
            filteredTeams.map((team) => (
              <TeamCard
                key={team.id}
                {...team}
                refreshTeams={fetchTeams}
              />
            ))
          ) : (
            <p>No teams found.</p>
          )}
        </div>
      </div>
    </>
  );
}
