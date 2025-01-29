import React, { useEffect, useState } from "react";
import {useNavigate} from 'react-router-dom'
import "../styles/Settings.css";
import DeletePopUp from "../components/DeletePopUp";
import { useRecoilState } from "recoil";
import { USERDATA } from "../recoil/recoil";
import Loader from "../components/Loader";
import { useDeleteUser, useGetUserData, useUpdateUser } from "../api/hooks";
import toast from "react-hot-toast";

function Settings() {
  const navigate = useNavigate()
  const [isUpdated, setIsUpdated] = useState(false);
  const [deletePopUp, setDeletePopUp] = useState(false);
  const [userInfo, setUserInfo] = useRecoilState(USERDATA);
  const { getUserData, loading} = useGetUserData();
  const {
    updateUser,
    loading: UpdateLoading,
  } = useUpdateUser();
  const {
    deleteUser,
    loading: DeleteLoading,
  } = useDeleteUser();

  const [updateData, setUpdatedData] = useState({
    name: "",
    email: "",
    number: "",
  });

  const handleInputChange = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    if (name === "number") {
      if (!/^\d*$/.test(value)) {
        return;
      }
      if (value.length > 10) {
        return;
      }
    }
    setUpdatedData((prevData) => ({
      ...prevData,
      [name]: name === "name" ? value : value?.trim(),
    }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!updateData?.name?.trim()) return toast.error("Name is Required");
    if (!updateData?.email?.trim()) return toast.error("Email Id is Required");
    if (!updateData?.number) return toast.error("Mobile No. is Required");
    const UpdateResponse = await updateUser(updateData);
    if (UpdateResponse.success) {
      setUserInfo(UpdateResponse.data);
    }
  };

  const handleDeleteAccount = async () => {
    const DeleteResponse = await deleteUser();
    if (DeleteResponse.success) {
      localStorage.removeItem("token")
      navigate("/login");
    }
  };

  useEffect(() => {
    if (userInfo) {
      setUpdatedData({
        name: userInfo?.username,
        email: userInfo?.email,
        number: userInfo?.number,
      });
    }
  }, [userInfo]);

  useEffect(() => {
    if (
      updateData?.name?.trim() == userInfo?.name?.trim() &&
      updateData?.email?.trim() == userInfo?.email?.trim() &&
      updateData?.number == userInfo?.number
    ) {
      setIsUpdated(false);
    } else {
      setIsUpdated(true);
    }
  }, [updateData]);

  const CallSettings = async () => {
    const response = await getUserData();
    if (response?.success) {
      setUserInfo(response?.data);
    }
  };

  useEffect(() => {
    if (!userInfo) {
      CallSettings();
    }
  }, []);

  return (
    <div className="main-app">
      <div className="settings-main">
        <div className="settings-div">
          <form
            className="settings-form"
            onSubmit={isUpdated ? handleUpdate : (e) => e.preventDefault()}
          >
            <div className="update-div-form">
              <label className="update-title">Name</label>
              <input
                type="text"
                className="update-input"
                name="name"
                value={updateData?.name}
                onChange={handleInputChange}
                placeholder="UserName"
              />
            </div>
            <div className="update-div-form">
              <label className="update-title">Email Id</label>
              <input
                type="email"
                className="update-input"
                name="email"
                value={updateData?.email}
                onChange={handleInputChange}
                placeholder="Email"
              />
            </div>
            <div className="update-div-form">
              <label className="update-title">Mobile No.</label>
              <input
                type="number"
                minLength={1000000000}
                maxLength={9999999999}
                className="update-input"
                name="number"
                value={updateData?.number}
                onChange={handleInputChange}
                placeholder="Number"
              />
            </div>
            <button
              type="submit"
              disabled={!isUpdated}
              className={`save-changes-btn ${isUpdated ? "" : "inactive"}`}
            >
              Save Changes
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                setDeletePopUp(true);
              }}
              className="delete-account-btn"
            >
              Delete Account
            </button>
          </form>
        </div>
      </div>
      {deletePopUp && (
        <DeletePopUp
          text=" Are you sure, you want to delete the account ? "
          handleSubmit={handleDeleteAccount}
          close={() => setDeletePopUp(false)}
        />
      )}
      {loading && <Loader text="Setting is being loaded..." />}
      {UpdateLoading && <Loader text="User is being Updated..." />}
      {DeleteLoading && <Loader text="User is being Deleted..." />}
    </div>
  );
}

export default Settings;
