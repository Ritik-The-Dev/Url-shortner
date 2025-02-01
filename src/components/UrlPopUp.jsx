import React from "react";
import { MdClose } from "react-icons/md";
import "../styles/PopUp.css";

function UrlPopUp({
  name = "New Link",
  value = {
    destinationUrl: "",
    remarks: "",
    expirationEnabled: false,
    expirationDate: "",
  },
  setValue = () => {},
  close = () => {},
  handleSubmit = () => {},
  Urlerror = false,
  buttonName = "Create new"
}) {
  return (
    <div className="url-popup-container">
      <div className="url-popup">
        <div className="popup-header">
          <h3>{name}</h3>
          <MdClose className="close-btn" onClick={close} />
        </div>

        <div className="popup-body">
          <label>
            Destination Url <span className="required">*</span>
          </label>
          <input
            type="text"
            placeholder="https://web.whatsapp.com/"
            className={`${ Urlerror ? 'error-outline' : ''}`}
            value={value.destinationUrl}
            onChange={(e) =>
              setValue((prev) => ({ ...prev, destinationUrl: e.target.value }))
            }
          />
          {Urlerror && <span className="error-label">This field is mandatory</span>}

          <label>
            Remarks <span className="required">*</span>
          </label>
          <textarea
            placeholder="Add remarks"
            value={value.remarks}
            onChange={(e) =>
              setValue((prev) => ({ ...prev, remarks: e.target.value }))
            }
          ></textarea>

          <div className="toggle-containers">
            <label>Link Expiration</label>
            <div
              className={`toggle-container ${
                value.expirationEnabled ? "enabled" : "disabled"
              }`}
              onClick={() =>
                setValue((prev) => ({
                  ...prev,
                  expirationEnabled: !prev.expirationEnabled,
                }))
              }
            >
              <div className="toggle-circle"></div>
            </div>
          </div>

          {value.expirationEnabled && (
            <input
              type="datetime-local"
              value={value.expirationDate ? value.expirationDate.slice(0, 16) : ''}
              onChange={(e) =>
                setValue((prev) => ({
                  ...prev,
                  expirationDate: e.target.value,
                }))
              }
            />
          )}
        </div>

        <div className="popup-footer">
          <button
            className="clear-btn"
            onClick={() =>
              setValue({
                destinationUrl: "",
                remarks: "",
                expirationEnabled: false,
                expirationDate: "",
              })
            }
          >
            Clear
          </button>
          <button onClick={handleSubmit} className="create-btn">{buttonName}</button>
        </div>
      </div>
    </div>
  );
}

export default UrlPopUp;
