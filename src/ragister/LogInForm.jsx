import { useRef, useState, useContext, useEffect } from "react";
import axios from "../api/axios";
import AuthContext from "../context/AuthProvider";

const LOGIN_URL = "/users";

const LogInForm = () => {
  const { setAuth } = useContext(AuthContext);
  const userRef = useRef();
  const errRef = useRef();

  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [userNameFocus, setUserNameFocus] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    userRef.current.focus();
  }, []);

  useEffect(() => {
    setError("");
  }, [userName, password]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        LOGIN_URL,
        JSON.stringify({ userName, password }),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      console.log(JSON.stringify(response?.data));
      console.log(JSON.stringify(response));
      const accessToken = response?.data.accessToken;
      const roles = response?.data.roles;
      setAuth({ userName, password, roles, accessToken });
      setSuccess(true);
      setUserName("");
      setPassword("");
    } catch (err) {
      if (!err?.response) {
        setError("No Server Response");
      } else if (err.response?.status === 400) {
        setError("Missing Username or Password");
      } else if (err.response?.status === 401) {
        setError("Unauthorized");
      } else {
        setError("Login Failed");
      }
      errRef.current.focus();
    }
  };

  useEffect(() => {});

  return (
    <div className="container">
      {success ? (
        <h2>Logged In</h2>
      ) : (
        <section className="content">
          <p
            ref={errRef}
            className={error ? "showError" : "hide"}
            aria-live="assertive"
            id="error"
          >
            {error}
          </p>
          <h1>Login Form</h1>
          <form className="form" onSubmit={handleSubmit}>
            <label htmlFor="username">Username</label>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              required
              id="username"
              ref={userRef}
              onFocus={() => setUserNameFocus(true)}
              onBlur={() => setUserNameFocus(false)}
              autoComplete="off"
            />
            <label htmlFor="password">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              id="password"
              required
            />
            <button disabled={!userName || !password ? true : false}>
              Sign In
            </button>
          </form>
        </section>
      )}
    </div>
  );
};

export default LogInForm;
