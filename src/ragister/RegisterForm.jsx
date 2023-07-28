import { useState, useEffect, useRef } from "react";
import { FaInfoCircle, FaTimes, FaCheck } from "react-icons/fa";
import axios from "../api/axios";

const USER_REGEX = /^[a-zA-Z][a-zA-Z0-9-_]{3,23}$/;
const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
const REGISTER_URL = "/users";

const RegisterForm = () => {
  const userRef = useRef();
  const errRef = useRef();

  const [userName, setUserName] = useState("");
  const [validUserName, setValidUserName] = useState(false);
  const [userNameFocus, setUserNameFocus] = useState(false);

  const [password, setPassword] = useState("");
  const [validPassword, setValidPassword] = useState(false);
  const [passwordFocus, setPasswordFocus] = useState(false);

  const [matchPassword, setMatchPassword] = useState("");
  const [validMatchPassword, setValidMatchPassword] = useState(false);
  const [matchPasswordFocus, setMatchPasswordFocus] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    userRef.current.focus();
  }, []);

  useEffect(() => {
    setValidUserName(USER_REGEX.test(userName));
  }, [userName]);

  useEffect(() => {
    setValidPassword(PASSWORD_REGEX.test(password));
    setValidMatchPassword(password === matchPassword);
  }, [password, matchPassword]);

  useEffect(() => {
    setErrorMessage("");
  }, [userName, password, matchPassword]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const v1 = USER_REGEX.test(userName);
    const v2 = PASSWORD_REGEX.test(password);

    if (!v1 || !v2) {
      setErrorMessage("Invalid Entry");
      return;
    }

    try {
      const response = await axios.post(
        REGISTER_URL,
        JSON.stringify({ userName, password }),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      console.log(response?.data);
      console.log(response?.accessToken);
      console.log(JSON.stringify(response));
      setSuccess(true);

      setUserName("");
      setPassword("");
      setMatchPassword("");
    } catch (err) {
      if (!err?.response) {
        setErrorMessage("No Server Response");
      } else if (err.response?.status === 409) {
        setErrorMessage("Username Taken");
      } else {
        setErrorMessage("Registration Failed");
      }
      errRef.current.focus();
    }
  };

  return (
    <div className="container">
      {success ? (
        <h3 className="success">Ragistration Successful</h3>
      ) : (
        <section className="content">
          <p
            ref={errRef}
            className={errorMessage ? "showError" : "hide"}
            aria-live="assertive"
            id="error"
          >
            {errorMessage}
          </p>
          <h2>Ragistration</h2>

          <form className="form" onSubmit={handleSubmit}>
            <label htmlFor="username">
              Username:
              <span className={validUserName ? "showCheck" : "hide"}>
                <FaCheck />
              </span>
              <span
                className={
                  validUserName || !userName ? "hideRedCross" : "showRedCross"
                }
              >
                <FaTimes />
              </span>
            </label>
            <input
              type="text"
              id="username"
              value={userName}
              required
              onChange={(e) => setUserName(e.target.value)}
              autoComplete="off"
              ref={userRef}
              aria-invalid={validUserName ? false : true}
              aria-describedby="uidnote"
              onFocus={() => setUserNameFocus(true)}
              onBlur={() => setUserNameFocus(false)}
            />
            <p
              id="uidnote"
              className={
                userNameFocus && userName && !validUserName
                  ? "instruction"
                  : "offscreen"
              }
            >
              <FaInfoCircle /> 4 to 24 characters. <br />
              Must begin with a letter. <br />
              Letters, numbers, underscorces, hypens allowed.
            </p>

            <label htmlFor="password">
              Passowrd:
              <span className={validPassword ? "showCheck" : "hide"}>
                <FaCheck />
              </span>
              <span
                className={
                  validPassword || !password ? "hideRedCross" : "showRedCross"
                }
              >
                <FaTimes />
              </span>
            </label>
            <input
              type="password"
              id="password"
              value={password}
              required
              onChange={(e) => setPassword(e.target.value)}
              aria-invalid={validPassword ? false : true}
              aria-describedby="passwordnote"
              onFocus={() => setPasswordFocus(true)}
              onBlur={() => setPasswordFocus(false)}
            />
            <p
              id="passwordnote"
              className={
                passwordFocus && !validPassword ? "instruction" : "hide"
              }
            >
              <FaInfoCircle /> 8 to 24 characters. <br />
              Must include uppercase and lowercase letters, number and a special
              character. <br />
              Allowed special characters:
              <span aria-label="exclamation mark">!</span>
              <span aria-label="at symbol">@</span>
              <span aria-label="hashtag">#</span>
              <span aria-label="dollar sign">$</span>
              <span aria-label="percent">%</span>
            </p>

            <label htmlFor="matchpassword">
              Confirm Password:
              <span
                className={
                  validMatchPassword && matchPassword ? "showCheck" : "hide"
                }
              >
                <FaCheck />
              </span>
              <span
                className={
                  validMatchPassword || !matchPassword
                    ? "hideRedCross"
                    : "showRedCross"
                }
              >
                <FaTimes />
              </span>
            </label>

            <input
              type="password"
              id="matchpassword"
              value={matchPassword}
              required
              onChange={(e) => setMatchPassword(e.target.value)}
              aria-invalid={validMatchPassword ? false : true}
              aria-describedby="matchpasswordnote"
              onFocus={() => setMatchPasswordFocus(true)}
              onBlur={() => setMatchPasswordFocus(false)}
            />
            <p
              id="matchpasswordnote"
              className={
                matchPasswordFocus && !validMatchPassword
                  ? "instruction"
                  : "offscreen"
              }
            >
              <FaInfoCircle /> Must match the first password input field.
            </p>

            <button
              disabled={
                !validUserName || !validPassword || !validMatchPassword
                  ? true
                  : false
              }
            >
              Sign Up
            </button>
          </form>

          <p>
            Already registered? <br />
            <span className="line">
              <a href="#"> Sign In</a>
            </span>
          </p>
        </section>
      )}
    </div>
  );
};

export default RegisterForm;
