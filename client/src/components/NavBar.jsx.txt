import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../UserContext.js";

const NavBar = () => {
  const { user, setUser } = useContext(UserContext);

  return (
    <nav className="navbar">
      <h1>MyBlog</h1>

      <div className="links">
        <Link to="/">Home</Link>
        {user && user.isAdmin && (
          <Link
            to="/create"
            style={{
              color: "white",
              backgroundColor: "#f1356d",
              borderRadius: "8px",
            }}
          >
            New Blog
          </Link>
        )}

        {user && user.email ? (
          <React.Fragment>
            <button
              onClick={() => {
                setUser(null);
                localStorage.removeItem("token");
              }}
            >
              Logout
            </button>
            {!user.isAdmin && <Link to="/admin/login">Admin login</Link>} |
            <span> {user["email"]}</span>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </React.Fragment>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
