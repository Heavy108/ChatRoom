// components/Login.jsx
"use client"
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from '@/css/ChatBox.module.css';

export default function Login() {
  const [username, setUsername] = useState('');
  const router = useRouter();

  const handleLogin = () => {
    if (username.trim()) {
      localStorage.setItem('username', username);
      console.log('Username stored:', username); // Verify this log
      router.push('/chat');
    } else {
      console.log('Username is empty'); // Check for empty username
    }
  };

  return (
    <div className={styles.loginContainer}>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Enter your username"
        className={styles.usernameInput}
      />
      <button onClick={handleLogin} className={styles.loginButton}>
        Login
      </button>
    </div>
  );
}
