// components/Login.js
import { useState } from 'react';
import { useRouter } from 'next/router';

export default function Login() {
  const [username, setUsername] = useState('');
  const router = useRouter();

  const handleLogin = (e) => {
    e.preventDefault();
    localStorage.setItem('username', username);
    router.push('/chat');
  };

  return (
    <div>
      <h1>Enter your username</h1>
      <form onSubmit={handleLogin}>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          required
        />
        <button type="submit">Enter Chat</button>
      </form>
    </div>
  );
}
