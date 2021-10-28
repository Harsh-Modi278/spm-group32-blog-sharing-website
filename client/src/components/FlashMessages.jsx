import React from "react";

const FlashMessages = (props) => {
  const { failureMessages, successMessages } = props;
  return (
    <div className="flash-messages">
      {successMessages &&
        successMessages.map((message) => <p key={message}>{message}</p>)}
      {failureMessages &&
        failureMessages.map((message) => <p key={message}>{message}</p>)}
    </div>
  );
};
export default FlashMessages;
