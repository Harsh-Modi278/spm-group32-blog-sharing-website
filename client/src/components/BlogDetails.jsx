import React, { useContext, useState, useEffect } from "react";
import { Redirect, useHistory, useParams } from "react-router-dom";
import useFetch from "../useFetch.js";
import List from "./List.jsx";
import { UserContext } from "../UserContext.js";
import FlashMessages from "../components/FlashMessages.jsx";

const BlogDetails = () => {
  const { id: blogId } = useParams();
  const { data: blog, isPending, error } = useFetch(`/api/posts/${blogId}`);

  const len = blog ? blog.commentsArray.length : 0;
  const pubFlag = blog?.isPublished;
  // console.log(blog && blog.commentsArray.map((c) => c.text));
  const [commentsArray, setCommentsArray] = useState(blog?.commentsArray);
  const [isPublished, setIsPublished] = useState(blog?.isPublished);
  const { user, setUser } = useContext(UserContext);
  const [comment, setComment] = useState(""); //controlled component's value
  const [successMessages, setSuccessMessages] = useState([]);
  const [failureMessages, setFailureMessages] = useState([]);
  const history = useHistory();

  // console.log(blog);
  // console.log({ pubFlag });
  // console.log({ isPublished });

  useEffect(() => {
    // console.log(blog ? blog.commentsArray.map((c) => c.text) : "empty");
    // console.log(blog);
    setCommentsArray(blog?.commentsArray);
    setIsPublished(blog?.isPublished);
    // console.log(commentsArray);
    // console.log("len:", len);
  }, [len, pubFlag]);

  // console.log(commentsArray);

  const handleCommentSubmit = (e) => {
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
      body: JSON.stringify({ text: comment }),
    };

    e.preventDefault();
    fetch(`/api/posts/${blogId}/comments`, myInit)
      .then((res) => {
        if (res.ok) return res.json();
        throw Error("Unable to post comment");
      })
      .then((jsonRes) => {
        // console.log(jsonRes);
        // console.log(Array.from(commentsArray));
        let updatedCommentsArray = Array.from(commentsArray);
        updatedCommentsArray.push(jsonRes);
        // console.log({updatedCommentsArray});
        setComment("");
        setCommentsArray(updatedCommentsArray);
        return;
      })
      .catch((err) => console.log(err));
  };

  const handleChange = (e) => {
    setComment(e.target.value);
  };

  const handlePublishChange = () => {
    // console.log(isPublished);
    const token = localStorage.getItem("token")
      ? JSON.parse(localStorage.getItem("token")).token
      : "";
    const bearer = "BEARER " + token;
    const reqOptions = {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: bearer },
      body: JSON.stringify({ isPublished: !isPublished }),
      mode: "cors",
    };

    fetch(`/api/admin/posts/${blogId}`, reqOptions)
      .then((res) => {
        if (res.ok) return res.json();
        setFailureMessages(["error in changing blog status"]);
        throw Error("error in changing blog status");
      })
      .then((jsonRes) => {
        // console.log(jsonRes);
        const oldFlag = isPublished;
        const newFlag = !oldFlag;
        setIsPublished(!isPublished);
        setSuccessMessages([
          `Blog status changed from ${
            oldFlag ? "published" : "unpublished"
          } to ${newFlag ? "published" : "unpublished"}`,
        ]);
      })
      .catch((err) => console.log(err));
  };

  const handleDelete = () => {
    const myInit = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `BEARER ${
          JSON.parse(localStorage.getItem("token")).token
        }`,
      },
      mode: "cors",
      cache: "default",
    };
    fetch(`/api/admin/posts/${blogId}`, myInit)
      .then((res) => {
        if (res.ok) {
          history.push("/");
        } else {
          setFailureMessages("Error in deleting blog");
          throw Error("Error in deleting blog");
        }
      })
      .then((jsonRes) => {
        return;
      })
      .catch((err) => console.log(err));
  };

  const handleCommentDelete = (commentId) => {
    console.log({ commentId });
    const myInit = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `BEARER ${
          JSON.parse(localStorage.getItem("token")).token
        }`,
      },
      mode: "cors",
      cache: "default",
    };
    fetch(`/api/admin/posts/${blogId}/${commentId}`, myInit)
      .then((res) => {
        if (res.ok) {
          setSuccessMessages([`Comment with id:${commentId} deleted`]);
          return res.json();
        } else {
          setFailureMessages(`Error in deleting comment with id:${commentId}`);
          throw Error("Error in deleting blog");
        }
      })
      .then((jsonRes) => {
        // console.log(jsonRes);
        const updatedCommentsArray = Array.from(jsonRes.commentsArray);
        setCommentsArray(updatedCommentsArray);
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="blog-details">
      {error && <div>{error}</div>}
      {isPending && <div>Loading...</div>}
      {blog && (isPublished || user.isAdmin) && (
        <React.Fragment>
          <FlashMessages
            successMessages={successMessages}
            failureMessages={failureMessages}
          />
          <article>
            <h2>{blog.title}</h2>
            <em>Author: {blog.authorId}</em>

            <div>{blog.text}</div>
          </article>
          {user && user.isAdmin && (
            <button onClick={handlePublishChange}>
              {isPublished ? "UnPublish" : "Publish"}
            </button>
          )}
          {user && user.isAdmin && (
            <button onClick={handleDelete}>Delete</button>
          )}

          <h4>Comments</h4>
          {user && user.email ? (
            <form onSubmit={handleCommentSubmit}>
              <label></label>
              <input
                type="textarea"
                value={comment}
                onChange={(e) => handleChange(e)}
              />
              <button>Post comment</button>
            </form>
          ) : null}
          <div className="comments">
            <List
              dataList={commentsArray}
              handleCommentDelete={handleCommentDelete}
            />
          </div>
        </React.Fragment>
      )}
    </div>
  );
};

export default BlogDetails;
