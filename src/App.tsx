import { useEffect, useRef, useState } from 'react'
import { ComboBox, ComboBoxItem } from './components/ComboBox'
import { useDebounce } from './hooks/useDebounce'
import GitHubClient, { GithubUser } from './lib/GitHubClient'
import { ComboBoxItemHighlight } from './components/ComboBox/ComboBoxItemHighlight'

function App() {
  const inputRef = useRef<HTMLInputElement>(null)
  const [value, setValue] = useState('')
  const debouncedValue = useDebounce<string>(value, 500)
  const [users, setUsers] = useState<GithubUser[]>([])
  const [selectedUser, setSelectedUser] = useState<GithubUser | null>(null)

  async function listUsersByLogin(login: string) {
    const data = await GitHubClient.listUsersByLogin(login)
    setUsers(data)
  }

  async function getUsersByLogin(login: string) {
    const data = await GitHubClient.getUsersByLogin(login)
    setSelectedUser(data)
  }

  useEffect(() => {
    if (debouncedValue.trim()) {
      listUsersByLogin(debouncedValue)
    } else {
      setUsers([])
    }
  }, [debouncedValue])

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  return (
    <div className="App">
      <div className="search-container">
        <ComboBox
          ref={inputRef}
          label="Search for github usernames..."
          value={value}
          onChange={(value) => setValue(value)}
          onSelect={getUsersByLogin}
        >
          {users.map((user) => (
            <ComboBoxItem key={user.login}>
              <div className="github-card-avatar">
                <img src={user.avatar_url} alt="Avatar" />
              </div>

              <div className="github-card-login">
                @<ComboBoxItemHighlight text={user.login} />
              </div>
            </ComboBoxItem>
          ))}
        </ComboBox>
      </div>

      {selectedUser && <pre>{JSON.stringify(selectedUser, null, 4)}</pre>}
    </div>
  )
}

export default App
