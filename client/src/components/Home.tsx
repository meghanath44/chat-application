import React, { useState } from "react";

const Home: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  const [displayText, setDisplayText] = useState("");
  const [state, setState] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (state) {
      if (password != rePassword) {
        setDisplayText("Password mismatch");
      }
    }
  };

  const setStateTo = (t: boolean) => {
    setUsername("");
    setPassword("");
    setRePassword("");
    setDisplayText("");
    setState(t);
  };

  return (
    <div className="auth-layout">
      <div className="auth-left">
        <h1>ChatSphere</h1>
        <p>
          A secure, real-time messaging app with video & audio calling built for
          modern communication.
        </p>
        <ul>
          <li>💬 Instant messaging</li>
          <li>📞 High-quality audio & video calls</li>
          <li>🔐 End-to-end encryption</li>
          <li>🌍 Lightweight and responsive</li>
        </ul>
      </div>
      <div className="auth-right">
        {state ? (
          <form className="auth-form" onSubmit={handleSubmit}>
            <h2>Signup</h2>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Re-enter password"
              value={rePassword}
              onChange={(e) => setRePassword(e.target.value)}
              required
            />
            <p>{displayText}</p>
            <button type="submit">Signup</button>
            <p>
              If you already have an account.{" "}
              <a onClick={() => setStateTo(false)}>Login</a>
            </p>
          </form>
        ) : (
          <form className="auth-form" onSubmit={handleSubmit}>
            <h2>Login</h2>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <p>{displayText}</p>
            <button type="submit">Login</button>
            <p>
              If you do not have an account.{" "}
              <a onClick={() => setStateTo(true)}>Signup</a>
            </p>
          </form>
        )}
      </div>
    </div>
  );
};

export default Home;
