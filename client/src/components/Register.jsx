import React, { useState } from "react";
import FlashMessages from "./FlashMessages.jsx";

const Register = () => {
  // const [email, setEmail] = useState("");
  // const [password, setPassword] = useState("");
  const [formBody, setFormBody] = useState({
    email: "",
    password: "",
    password2: "",
  });
  const [successMessages, setSuccessMessages] = useState([]);
  const [failureMessages, setFailureMessages] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const myInit = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      mode: "cors",
      cache: "default",
      body: JSON.stringify(formBody),
    };

    fetch("/api/register", myInit)
      .then((res) => {
        return res.json();
      })
      .then((jsonRes) => {
        if (jsonRes.msg) {
          setSuccessMessages([jsonRes.msg]);
          setFormBody({
            email: "",
            password: "",
            password2: "",
          });
        } else {
          setFailureMessages([
            ...Array.from(JSON.parse(jsonRes)).map((message) => message),
          ]);
        }
      })
      .catch((err) => console.log(err));
  };

  const handleChange = (e) => {
    setFormBody({ ...formBody, [e.target.name]: e.target.value });
  };

  return (
    <div className="register-form">
      <h2>Register</h2>
      <br />
      {successMessages.length > 0 && (
        <FlashMessages successMessages={successMessages} />
      )}
      <br />
      {failureMessages.length > 0 && (
        <FlashMessages failureMessages={failureMessages} />
      )}
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
        <label>confirm password:</label>
        <input
          type="password"
          name="password2"
          required
          value={formBody["password2"]}
          onChange={(e) => handleChange(e)}
        />
        <button>Register</button>
      </form>
    </div>
  );
};

export default Register;
