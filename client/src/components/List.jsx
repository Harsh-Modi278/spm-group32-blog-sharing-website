import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../UserContext.js";

const List = (props) => {
  // console.log(props);
  const { dataList, blogId } = props;
  const { user } = useContext(UserContext);

  return (
    <div className="blog-list">
      {dataList &&
        Array.from(dataList).map((data, indx) => {
          return (
            <div className={data.commentsArray && "blog-preview"} key={indx}>
              {/* If it has commentsArray then it is a blogpost */}
              {data.commentsArray && (
                <Link to={`/blogs/${data._id}`}>
                  <h2>{data?.title}</h2>
                  <em>Author: {data.authorId}</em>
                  {data.commentsArray ? null : <p>{data.text}</p>}
                </Link>
              )}
              {/* Else it is a commentsArray */}
              {!data.commentsArray && (
                <React.Fragment>
                  <h2>{data?.title}</h2>
                  <em>Author: {data.authorId}</em>
                  {data.commentsArray ? null : <p>{data.text}</p>}
                  {user && user.isAdmin && (
                    <button
                      onClick={(e) => {
                        return props.handleCommentDelete(data._id);
                      }}
                    >
                      Delete
                    </button>
                  )}
                </React.Fragment>
              )}
            </div>
          );
        })}
    </div>
  );
};

export default List;
