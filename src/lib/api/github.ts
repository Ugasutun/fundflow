const GH_API = 'https://api.github.com';

export interface GithubUser {
  login: string;
  name: string | null;
  avatar_url: string;
  bio: string | null;
  public_repos: number;
  followers: number;
  html_url: string;
}

export interface GithubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  language: string | null;
  topics: string[];
}

export async function fetchGithubUser(username: string): Promise<GithubUser | null> {
  try {
    const res = await fetch(`${GH_API}/users/${username}`);
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function fetchGithubRepos(username: string): Promise<GithubRepo[]> {
  try {
    const res = await fetch(`${GH_API}/users/${username}/repos?sort=updated&per_page=6&type=owner`);
    if (!res.ok) return [];
    const repos: GithubRepo[] = await res.json();
    return repos.filter((r) => !r.name.startsWith(username));
  } catch {
    return [];
  }
}
