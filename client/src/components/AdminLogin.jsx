import React, { useState, useContext } from "react";
import FlashMessages from "./FlashMessages.jsx";
import { Redirect, useHistory } from "react-router-dom";
import { UserContext } from "../UserContext.js";

const AdminLogin = () => {
  const [adminKey, setAdminKey] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const history = useHistory();
  const { user, setUser } = useContext(UserContext);

  const handleSubmit = (e) => {
    e.preventDefault();
    const myInit = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `BEARER ${
          JSON.parse(localStorage.getItem("token")).token
        }`,
      },
      mode: "cors",
      cache: "default",
      body: JSON.stringify({ password: adminKey }),
    };

    fetch("/api/admin/login", myInit)
      .then((res) => {
        if (res.ok) return res.json();
        else {
          setErrorMessage("Invalid admin key");
          throw Error("Invalid admin key");
        }
        // return res.json();
      })
      .then((jsonRes) => {
        if (jsonRes.msg === "You are already an admin") {
          setUser({ ...user, isAdmin: true });
          history.push("/admin/blogs");
        } else {
          setErrorMessage(jsonRes.msg);
        }
      })
      .catch((err) => console.log(err));
  };

  const handleChange = (e) => {
    setAdminKey(e.target.value);
  };

  return (
    <div className="login-form">
      {/* {JSON.stringify(user)} */}
      {user && user.isAdmin ? (
        <Redirect to="/" />
      ) : (
        <React.Fragment>
          <h2>Admin Login</h2>
          <br />
          {errorMessage && <FlashMessages failureMessages={[errorMessage]} />}
          <br />
          <form onSubmit={handleSubmit}>
            <label>Admin key:</label>
            <input
              type="password"
              name="adminKey"
              required
              value={adminKey}
              onChange={(e) => handleChange(e)}
            />
            <button>OK</button>
          </form>
        </React.Fragment>
      )}
    </div>
  );
};

export default AdminLogin;
