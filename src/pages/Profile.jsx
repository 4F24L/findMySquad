import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";

export default function Profile() {
  const { currentUser } = useAuth();
  const [githubData, setGithubData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [totalRepos, setTotalRepos] = useState(0);

  useEffect(() => {
    if (!currentUser) return;

    const githubUsername = currentUser?.reloadUserInfo?.screenName || currentUser?.displayName;

    if (!githubUsername) {
      setError("GitHub username not found. Please log in with GitHub.");
      setLoading(false);
      return;
    }

    async function fetchGitHubData() {
      try {
        const res = await fetch(`https://api.github.com/users/${githubUsername}/repos`);
        if (!res.ok) {
          if (res.status === 403) throw new Error("GitHub API rate limit exceeded. Try again later.");
          throw new Error("Failed to fetch GitHub data");
        }

        const repos = await res.json();
        setTotalRepos(repos.length);
        const languageCount = {};
        repos.forEach(repo => {
          if (repo.language) {
            languageCount[repo.language] = (languageCount[repo.language] || 0) + 1;
          }
        });

        const avatar_url = repos.length > 0 ? repos[0].owner.avatar_url : currentUser.photoURL;
        setGithubData({ repos, languageCount, avatar_url });

    } catch (err) {
        setError(err.message);
        setLoading(false);
    }
}

    fetchGitHubData();
  }, [currentUser]);

  if (!currentUser) {
    return <h1>Please log in with GitHub to view your profile.</h1>;
  }

  if (loading) return <h1>Loading GitHub data...</h1>;
  if (error) return <h1>Error: {error}</h1>;

  return (
    <div>
      <h1>Profile</h1>
      <p><strong>Name:</strong> {currentUser.displayName || "Not provided"}</p>
      <p><strong>Email:</strong> {currentUser.email}</p>
      <p><strong>Photo:</strong></p>
      {githubData.avatar_url ? <img src={githubData.avatar_url} alt="Profile" width="100" /> : <p>No profile picture.</p>}
      <h2>GitHub Repositories</h2>
      <p>Total: {totalRepos}</p>

      <h2>Most Used Languages</h2>
      <ul>
        {Object.entries(githubData.languageCount).map(([language, count]) => (
          <li key={language}>{language}: {count} repos</li>
        ))}
      </ul>
    </div>
  );
}
