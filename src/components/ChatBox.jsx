// components/ChatBox.jsx
import React, { useEffect, useState, useRef } from 'react';
import { useChannel } from 'ably/react';
import { useRouter } from 'next/navigation';
import styles from '@/css/ChatBox.module.css';

// Function to generate a unique color based on a string (username)
const stringToColor = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  let color = '#';
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff;
    color += ('00' + value.toString(16)).substr(-2);
  }
  return color;
};

export default function ChatBox() {
  const inputBox = useRef(null);
  const messageEnd = useRef(null);

  const [messageText, setMessageText] = useState('');
  const [receivedMessages, setMessages] = useState([]);
  const [username, setUsername] = useState('');
  const messageTextIsEmpty = messageText.trim().length === 0;

  const router = useRouter();

  useEffect(() => {
    try {
      const storedUsername = localStorage.getItem('username');
      console.log('Fetched username from localStorage:', storedUsername); // Log fetched username
      if (storedUsername) {
        setUsername(storedUsername);
      } else {
        console.log('No username found, redirecting to login'); // Log redirection case
        router.push('/login');
      }

      const storedMessages = JSON.parse(localStorage.getItem('chatMessages') || '[]');
      setMessages(storedMessages);
    } catch (error) {
      console.error('Error accessing localStorage:', error); // Log any localStorage errors
    }
  }, [router]);

  const { channel, ably } = useChannel('chat-demo', (message) => {
    const history = receivedMessages.slice(-199);
    const updatedMessages = [...history, message];
    setMessages(updatedMessages);
    localStorage.setItem('chatMessages', JSON.stringify(updatedMessages));
  });

  const sendChatMessage = (messageText) => {
    const message = {
      text: messageText,
      username: username,
      connectionId: ably.connection.id,
      timestamp: new Date().toLocaleTimeString(),
    };
    channel.publish({ name: 'chat-message', data: message });
    setMessageText('');
    inputBox.current.focus();
  };

  const handleFormSubmission = (event) => {
    event.preventDefault();
    sendChatMessage(messageText);
  };

  const handleKeyPress = (event) => {
    if (event.charCode !== 13 || messageTextIsEmpty) {
      return;
    }
    sendChatMessage(messageText);
    event.preventDefault();
  };

  const handleLogout = () => {
    localStorage.removeItem('chatMessages');
    localStorage.removeItem('username');
    router.push('/login');
  };

  const messages = receivedMessages.map((message, index) => {
    const author = message.data.connectionId === ably.connection.id ? 'me' : 'other';
    const usernameColor = stringToColor(message.data.username);
    return (
      <div key={index} className={`${styles.message} ${styles[author]}`} data-author={author}>
        <strong className={styles.username} style={{ color: usernameColor }}>
          {message.data.username}
        </strong> [{message.data.timestamp}]: {message.data.text}
      </div>
    );
  });

  useEffect(() => {
    if (messageEnd.current) {
      messageEnd.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [receivedMessages]);

  return (
    <div className={styles.chatBoxRoot}>
      <div className={styles.chatHolder}>
        <div className={styles.sidebar}>
          <p className={styles.welcome}>Welcome to the TU Connect, <hr />{username}!</p>
          <button onClick={handleLogout} className={styles.logoutButton}>
            Logout
          </button>
        </div>
        <div className={styles.chatContent}>
          <div className={styles.chatText}>
            {messages}
            <div ref={messageEnd}></div>
          </div>
          <form onSubmit={handleFormSubmission} className={styles.form}>
            <textarea
              ref={inputBox}
              value={messageText}
              placeholder="Type a message..."
              onChange={(e) => setMessageText(e.target.value)}
              onKeyPress={handleKeyPress}
              className={styles.textarea}
            ></textarea>
            <button type="submit" className={styles.button} disabled={messageTextIsEmpty}>
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
