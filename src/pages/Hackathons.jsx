import { useState } from "react";
import NavBar from "../components/NavBar";
import Input from "../components/Input";
import {
  UsersRound,
  Trophy,
  Users,
  CalendarClock,
  CodeXml,
} from "lucide-react";
import Button from "../components/Button";
import hackathonsData from "../../public/HackathonsData.json";

export default function HackathonList() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMode, setSelectedMode] = useState("All");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const modes = ["All", ...["Hybrid", "Offline", "Online"].sort()];
  const categories = [
    "All",
    ...[...new Set(hackathonsData.flatMap((h) => h.categories))].sort()
  ];

  const filteredHackathons = hackathonsData.filter(
    (h) =>
      (["title", "theme", "mode"].some((key) =>
        h[key].toLowerCase().includes(searchQuery.toLowerCase())
      ) ||
        h.categories.some((category) =>
          category.toLowerCase().includes(searchQuery.toLowerCase())
        )) &&
      (selectedMode === "All" || h.mode === selectedMode) &&
      (selectedCategory === "All" || h.categories.includes(selectedCategory))
  );

  return (
    <>
      <NavBar />
      <div className="p-6 flex flex-col items-start bg-[#F3F4F6] rounded-lg">
        <div className="mb-4 w-full">
          <h2 className="text-2xl font-bold text-gray-900">Upcoming Battles</h2>
          <p className="mt-1 text-sm text-gray-500">
            Find your next battle, assemble your squad, and compete to win!
          </p>
        </div>

        {/* Filter Section */}
        <div className="w-full flex flex-col md:flex-row gap-4 mb-5">
          <Input
            type="text"
            placeholder="Search hackathons by title, theme, or mode"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            classes="w-full md:w-4/6"
          />
          <select
            value={selectedMode}
            onChange={(e) => setSelectedMode(e.target.value)}
            className="w-full md:w-1/6 p-2 border rounded-lg text-gray-600"
          >
            {modes.map((mode) => (
              <option key={mode} value={mode}>
                {mode}
              </option>
            ))}
          </select>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full md:w-1/6 p-2 border rounded-lg text-gray-600 scrollbar-hide no-scrollbar"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {/* Hackathon Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6 w-full">
          {filteredHackathons.length > 0 ? (
            filteredHackathons.map((hackathon, index) => (
              <div
                key={index}
                className="bg-white flex flex-col p-5 rounded-2xl shadow-lg w-full"
              >
                <div className="flex flex-wrap justify-between">
                  <p className="font-bold text-2xl text-gray-700">
                    {hackathon.title}
                  </p>
                  <p
                    className={`px-4 py-1 rounded-full text-white font-medium ${
                      hackathon.mode === "Online"
                        ? "bg-[#41a261]"
                        : "bg-[#a78dfb]"
                    }`}
                  >
                    {hackathon.mode}
                  </p>
                </div>
                <p className="text-emerald-600 w-max px-2 rounded-lg border">
                  {hackathon.theme}
                </p>

                <div className="mt-4 space-y-2 text-gray-700 w-[100%]">
                  <p className="flex items-center">
                    <UsersRound size={20} className="mr-2 text-gray-500" />
                    {hackathon.participants} participants
                  </p>
                  <p className="flex items-center">
                    <Trophy size={20} className="mr-2 text-yellow-500" />
                    {hackathon.prize_pool}
                  </p>
                  <p className="flex items-center">
                    <Users size={20} className="mr-2 text-blue-500" />
                    {hackathon.team_size}
                  </p>
                  <p className="flex items-center">
                    <CodeXml size={20} className="mr-2 text-gray-500" />
                    {hackathon.categories.map((language, index) => (
                      <li
                        className="flex text-base font-medium px-3 py-1 text-slate-700 bg-[#eef2ff] mx-1 rounded-full"
                        key={index}
                      >
                        {language}
                      </li>
                    ))}
                  </p>
                </div>

                <div className="flex justify-between items-center mt-4">
                  <p className="flex items-center text-gray-600">
                    <CalendarClock size={20} className="mr-1" /> Starts on :{" "}
                    {hackathon?.date?.start}
                  </p>
                  <Button
                    textClr="text-[#2368FB]"
                    bg="bg-white"
                    classes="border"
                  >
                    Join The Battle
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No hackathons found.</p>
          )}
        </div>
      </div>
    </>
  );
}
