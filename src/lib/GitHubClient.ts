import { LocalStorageCache } from './LocalStorageCache'

export interface GithubUser {
  login: string
  id: number
  node_id: string
  avatar_url: string
  gravatar_id: string
  url: string
  html_url: string
  followers_url: string
  following_url: string
  gists_url: string
  starred_url: string
  subscriptions_url: string
  organizations_url: string
  repos_url: string
  events_url: string
  received_events_url: string
  type: string
  site_admin: boolean
  name: string
  company: string
  blog: string
  location: string
  email: string | null
  hireable: boolean | null
  bio: string
  twitter_username: string
  public_repos: number
  public_gists: number
  followers: number
  following: number
  created_at: string
  updated_at: string
}

class GitHubClient extends LocalStorageCache {
  private domain = 'https://api.github.com'

  public async listUsersByLogin(login: string): Promise<GithubUser[]> {
    const url = `${this.domain}/search/users?q=${login}+in:login`
    const cachedResponse = this.getFromCache<GithubUser[]>(url)

    if (cachedResponse) {
      return cachedResponse
    }

    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(
        `Failed to fetch GitHub users: ${response.status} ${response.statusText}`,
      )
    }

    const data = await response.json()
    this.setCache(url, data.items)

    return data.items
  }

  public async getUsersByLogin(login: string): Promise<GithubUser> {
    const url = `https://api.github.com/users/${login}`
    const cachedResponse = this.getFromCache<GithubUser>(url)

    if (cachedResponse) {
      return cachedResponse
    }

    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(
        `Failed to fetch GitHub user: ${response.status} ${response.statusText}`,
      )
    }

    const data = await response.json()
    this.setCache(url, data)

    return data
  }
}

export default new GitHubClient()
