import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import NavBar from "../components/NavBar";
import Button from "../components/Button";
import githubLogo from "../assets/github.svg";
import { AtSign, Calendar, CalendarCheck, Code, Link, Rocket, Send, Star, Trophy, User } from "lucide-react";
import UserRating from "../components/UserRating"

export default function Profile() {
  const { currentUser } = useAuth();
  const [githubData, setGithubData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [totalRepos, setTotalRepos] = useState(0);

  useEffect(() => {
    if (!currentUser) return;

    const githubUsername =
      currentUser?.reloadUserInfo?.screenName || currentUser?.displayName;

    if (!githubUsername) {
      setError("GitHub username not found. Please log in with GitHub.");
      setLoading(false);
      return;
    }

    async function fetchGitHubData() {
      try {
        const res = await fetch(
          `https://api.github.com/users/${githubUsername}/repos`
        );
        if (!res.ok) {
          if (res.status === 403)
            throw new Error("GitHub API rate limit exceeded. Try again later.");
          throw new Error("Failed to fetch GitHub data");
        }

        const repos = await res.json();
        setTotalRepos(repos.length);
        const languageCount = {};
        repos.forEach((repo) => {
          if (repo.language) {
            languageCount[repo.language] =
              (languageCount[repo.language] || 0) + 1;
          }
        });

        const avatar_url =
          repos.length > 0 ? repos[0].owner.avatar_url : currentUser.photoURL;
        setGithubData({ repos, languageCount, avatar_url });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchGitHubData();
  }, [currentUser]);


  if (!currentUser) {
    return <h1 className="flex h-screen justify-center items-center text-xl">Please log in to view your profile. </h1>;
  }

  if (loading) return <h1 className="flex h-screen justify-center items-center text-xl">Loading GitHub data...</h1>;
  if (error) return <h1>Error: {error}</h1>;

  return (
    <>
      <NavBar />

      <div className="bg-white mx-6 px-7 flex justify-between items-center py-4 pb-10 rounded-t-lg ">
        <div className=" flex gap-4">
          <div className=" rounded-full">
            {githubData?.avatar_url ? (
              <img
                className="object-cover rounded-full w-32 h-32 "
                src={githubData.avatar_url}
                alt="Profile"
                width="100"
              />
            ) : (
              <p>N/A</p>
            )}
          </div>
          <div className="flex flex-col justify-center">
            <p className=" font-bold text-xl">
              {currentUser.displayName || "Not provided"}
            </p>
            <p className="flex items-center">
              <AtSign size={15} className="mr-1" />
              {currentUser.displayName || "Not provided"}
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            onClick={() => {
              // Navigate to GitHub profile
              window.open(
                `https://github.com/${
                  currentUser?.reloadUserInfo?.screenName ||
                  currentUser.displayName
                }`,
                "_blank"
              );
            }}
            bg="bg-gray"
            textClr={"text-zinc-900"}
            classes={"border-2 border-slate-500"}
          >
            <img
              src={githubLogo}
              alt="GitHub Logo"
              className="w-5 h-5 inline-block mr-2"
            />
            GitHub Profile
          </Button>
          <Button classes={"border-2 border-slate-500 flex items-center"}>
            <Send size={20} className="mr-2" />
            Message
          </Button>
        </div>
      </div>

      <div className="flex gap-2 bg-white mx-6 px-6 justify-between  items-center p-4 rounded-b-lg">
        <div className="flex">
          <span className=" font-medium">Skills</span>
          {
            <ul className=" flex flex-wrap">
              {Object.entries(githubData.languageCount).map(
                ([language, count]) => (
                  <li
                    className="flex text-base font-medium px-3 py-1 text-[#9b7cff] bg-[#eef2ff] mx-1 rounded-full"
                    key={language}
                  >
                    {language}
                  </li>
                )
              )}
            </ul>
          }
        </div>

        <div><UserRating user={currentUser?.reloadUserInfo?.screenName ||
                  currentUser.displayName}/></div>
      </div>
      <div className="flex justify-between">
        <div className="flex flex-col gap-2 flex-1 bg-white w-[45%] ml-6  justify-center p-4 rounded-lg mt-2">
          <span className="text-normal font-medium">About :</span>
          <p>No bio provided</p>

          <p
            className="flex text-normal text-gray-700 font-medium mt-3"
            onClick={() => {
              // Navigate to GitHub profile
              window.open(
                `https://github.com/${
                  currentUser?.reloadUserInfo?.screenName ||
                  currentUser.displayName
                }`,
                "_blank"
              );
            }}
          >
            <Link size={20} className="mr-2" />
            github.com/
            {currentUser?.reloadUserInfo?.screenName || currentUser.displayName}
          </p>

          <p className="flex text-gray-700 text-normal font-medium mt-3">
            <CalendarCheck size={20} className="mr-2" />
            Joined : 2022
          </p>
        </div>

        <div className="flex flex-col gap-2 bg-white mx-6 p-4 rounded-lg mt-2">
          <span className=" font-medium text-lg text-start mb-3">
            Repositories count <span className="text-blue-400">({totalRepos+1})</span>
          </span>
          <ul className="flex flex-wrap gap-2">
            {Object.entries(githubData.languageCount).map(
              ([language, count]) => (
                <li
                  className="flex text-base font-medium px-5 py-2 text-gray-700 bg-[#ede7ff] mx-1 rounded-full"
                  key={language}
                >
                  {language} : {count}
                </li>
              )
            )}
          </ul>
        </div>
      </div>

      <div className="flex justify-between">
        <div className="flex flex-col gap-2 flex-1 bg-white w-[45%] ml-6  justify-center p-4 rounded-lg mt-2">
          <span className="text-normal font-medium">Recent Activity</span>
          <div className="flex gap-2 items-center "><User className="bg-blue-200 text-blue-500 rounded-full w-8 h-8 p-2"/><span className="text-gray-700 text-sm">Joined</span><span className="font-medium">AI innovation Squad</span></div>
          <div className="flex gap-2 items-center "><Rocket className="bg-green-200 text-green-500 rounded-full w-8 h-8 p-2"/><span className="text-gray-700 text-sm">Created</span><span className="font-medium">TechCrunch Disrupt 2025</span></div>
          <div className="flex gap-2 items-center "><Calendar className="w-8 h-8 p-2"/><span className="text-gray-700 text-sm">12 Jan 2025</span></div>
          <div className="flex gap-2 items-center "><Star className="w-8 h-8 p-2"/><span className="text-gray-700 text-sm">Feedback by the Lead - </span>Did an amazing jod in the hackathon ! great team work and effort</div>
          <br />
          <div className="flex gap-2 items-center "><User className="bg-blue-200 text-blue-500 rounded-full w-8 h-8 p-2"/><span className="text-gray-700 text-sm">Joined</span><span className="font-medium">AI Trailblazers Squad</span></div>
          <div className="flex gap-2 items-center "><Rocket className="bg-green-200 text-green-500 rounded-full w-8 h-8 p-2"/><span className="text-gray-700 text-sm">Created</span><span className="font-medium">NextGen AI Summit 2025</span></div>
          <div className="flex gap-2 items-center "><Calendar className="w-8 h-8 p-2"/><span className="text-gray-700 text-sm">15 Feb 2025</span></div>
          <div className="flex gap-2 items-center "><Star className="w-8 h-8 p-2"/><span className="text-gray-700 text-sm">Feedback by the Lead - </span>Outstanding performance in the hackathon! Exceptional collaboration and innovation. 🚀</div>
        </div>

        <div className="flex flex-col gap-2 bg-white mx-6 p-4 rounded-lg mt-2">
          <span className="text-normal font-medium">Achievements</span>
          <div className=" flex items-center gap-2">
            <div>
            <Trophy className="bg-green-200 text-green-500 rounded-full w-8 h-8 p-2"/>
            </div>

            <div className="flex flex-col ">
              <p className="font-medium text-gray-900">Hackathon Champion</p>
              <p className="text-gray-700 text-sm">First place in 3 hackathons</p>
            </div>
          </div>
          <div className=" flex items-center gap-2">
            <div>
            <User className="bg-orange-200 text-orange-500 rounded-full w-8 h-8 p-2"/>
            </div>

            <div className="flex flex-col ">
              <p className="font-medium text-gray-900">Team Player</p>
              <p className="text-gray-700 text-sm">Led 5+ successful projects</p>
            </div>
          </div>
          <div className=" flex items-center gap-2">
            <div>
            <Code className="bg-violet-200 text-violet-500 rounded-full w-8 h-8 p-2"/>
            </div>

            <div className="flex flex-col ">
              <p className="font-medium text-gray-900">Code Master</p>
              <p className="text-gray-700 text-sm">1000+ contributions</p>
            </div>
          </div>
         
        </div>
      </div>

       
    </>
  );
}
