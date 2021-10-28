import { useState } from "react";
import { useHistory } from "react-router-dom";

const Create = () => {
  const [formBody, setFormBody] = useState({ title: "", body: "" });
  const history = useHistory();

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch("/api/admin/posts/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `BEARER ${
          JSON.parse(localStorage.getItem("token")).token
        }`,
      },
      mode: "cors",
      cache: "default",
      body: JSON.stringify(formBody),
    })
      .then((res) => {
        if (res.ok) return res.json();
        throw Error("error in posting");
      })
      .then((jsonRes) => {
        // console.log(jsonRes);
        history.push("/admin/blogs");
      })
      .catch((err) => console.log(err));
  };

  const handleChange = (e) => {
    setFormBody({ ...formBody, [e.target.name]: e.target.value });
  };

  return (
    <div className="create">
      <h2>Add a New Blog</h2>
      <form onSubmit={handleSubmit}>
        <label>Blog title:</label>
        <input
          type="text"
          required
          name="title"
          value={formBody["title"]}
          onChange={(e) => handleChange(e)}
        />
        <label>Blog body:</label>
        <textarea
          required
          name="body"
          value={formBody["body"]}
          onChange={(e) => handleChange(e)}
        ></textarea>

        <button>Add Blog</button>
      </form>
    </div>
  );
};

export default Create;
