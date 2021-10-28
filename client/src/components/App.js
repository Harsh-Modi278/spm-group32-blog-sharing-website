import { useEffect, useState } from "react";
import "./App.css";
import NavBar from "./components/NavBar.jsx";
import Home from "./components/Home.jsx";
import BlogDetails from "./components/BlogDetails.jsx";
import Login from "./components/Login.jsx";
import Register from "./components/Register.jsx";
import AdminLogin from "./components/AdminLogin.jsx";
import Create from "./components/Create.jsx";
import { UserContext } from "./UserContext.js";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

function App() {
  const email = JSON.parse(localStorage.getItem("token"))
    ? JSON.parse(localStorage.getItem("token")).email
    : null;

  const [user, setUser] = useState({ email: email || "", isAdmin: false });

  // equivalent to componentDidMount
  useEffect(() => {
    if (user.email) {
      // if token is available in localStorage, try to check if admin access is available for this user

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
      };

      fetch("/api/admin/login", myInit)
        .then((res) => {
          if (res.ok) return res.json();
          else {
            throw Error("Invalid admin key");
          }
          // return res.json();
        })
        .then((jsonRes) => {
          if (jsonRes.msg === "You are already an admin") {
            setUser({ ...user, isAdmin: true });
          }
        })
        .catch((err) => console.log(err));
    }
  }, []);

  return (
    <Router>
      <div className="App">
        <UserContext.Provider value={{ user, setUser }}>
          <NavBar />
          <div className="content">
            {/* {JSON.stringify(user)} */}
            <Switch>
              <Route exact path="/" component={Home} />
              <Route exact path="/blogs" component={Home} />
              <Route exact path="/admin/blogs" component={Home} />
              <Route exact path="/admin/login" component={AdminLogin} />
              <Route path="/create">
                <Create />
              </Route>
              <Route path="/blogs/:id" component={BlogDetails}></Route>
              <Route path="/login" component={Login} />
              <Route path="/register" component={Register} />
              <Route path="/admin/login" component={AdminLogin} />
            </Switch>
          </div>
        </UserContext.Provider>
      </div>
    </Router>
  );
}

export default App;
