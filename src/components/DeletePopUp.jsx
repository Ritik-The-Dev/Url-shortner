import React from "react";
import "../styles/PopUp.css";
import { MdClose } from "react-icons/md";

function DeletePopUp({
  text = "Are you sure you want to perform this action ?",
  close = () => {},
  handleSubmit = () => {},
}) {
  return (
    <div className="remove-popup-container">
      <div className="remove-popup">
        <div className="remove-popup-header">
          <MdClose className="close-btn" onClick={close} />
        </div>
        <div className="remove-popup-body">
        <span className="remove-text">{text}</span>
        <div className="remove-btns">
          <button className="remove-no-btn" onClick={close}>No</button>
          <button onClick={handleSubmit} className="remove-yes-btn">Yes</button>
        </div>
        </div>
      </div>
    </div>
  );
}

export default DeletePopUp;
