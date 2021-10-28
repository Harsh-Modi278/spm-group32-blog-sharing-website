import React, { useState, useContext } from "react";
import FlashMessages from "./FlashMessages.jsx";
import { Redirect, useHistory } from "react-router-dom";
import { UserContext } from "../UserContext.js";

const Login = () => {
  // const [email, setEmail] = useState("");
  // const [password, setPassword] = useState("");
  const [formBody, setFormBody] = useState({ email: "", password: "" });
  const [errorMessage, setErrorMessage] = useState("");
  const history = useHistory();
  const { user, setUser } = useContext(UserContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const myInit = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      mode: "cors",
      cache: "default",
      body: JSON.stringify(formBody),
    };

    let res, jsonRes;
    try {
      res = await fetch("/api/login", myInit);
      if (res.ok) {
        // console.log("res1:", res);
        jsonRes = await res.json();
      } else {
        setErrorMessage("Either email or password is invalid");
        throw Error("Either email or password is invalid");
      }
      const { accessToken: token, isAdmin } = jsonRes;
      // console.log("before:", user);
      setUser({ ...user, email: formBody["email"], isAdmin: isAdmin });
      // console.log({ user });
      localStorage.setItem(
        "token",
        JSON.stringify({ email: formBody["email"], token })
      );
      history.push("/");
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (e) => {
    setFormBody({ ...formBody, [e.target.name]: e.target.value });
  };

  return (
    <div className="login-form">
      {user && user.email ? (
        <Redirect to="/" />
      ) : (
        <React.Fragment>
          <h2>Login</h2>
          <br />
          {errorMessage && <FlashMessages failureMessages={[errorMessage]} />}
          <br />
          <form onSubmit={handleSubmit}>
            <label>Email:</label>
            <input
              name="email"
              type="email"
              required
              value={formBody["email"]}
              onChange={(e) => handleChange(e)}
            />
            <label>password:</label>
            <input
              type="password"
              name="password"
              required
              value={formBody["password"]}
              onChange={(e) => handleChange(e)}
            />
            <button>Login</button>
          </form>
        </React.Fragment>
      )}
    </div>
  );
};

export default Login;
