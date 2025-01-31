import { useState } from "react";
import apiCall from "./apiCall";

// const API_URL = "http://localhost:999/api/v1";  //For Local
const API_URL = "https://url-shorteners.vercel.app/api/v1"; //For Deployment

export const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);

  const login = async (payload) => {
    setLoading(true);
    const res = await apiCall("POST", `${API_URL}/login`, payload);
    setResponse(res);
    setLoading(false);
    return res;
  };

  return { login, loading, response };
};

export const useRegister = () => {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);

  const register = async (payload) => {
    setLoading(true);
    const res = await apiCall("POST", `${API_URL}/register`, payload);
    setResponse(res);
    setLoading(false);
    return res;
  };

  return { register, loading, response };
};

export const useGetUserData = () => {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);

  const getUserData = async () => {
    setLoading(true);
    const res = await apiCall("GET", `${API_URL}/user`, {}, {}, false);
    setResponse(res);
    setLoading(false);
    return res;
  };

  return { getUserData, loading, response };
};

export const useGetDashboardData = () => {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);

  const getDashboardData = async () => {
    setLoading(true);
    const res = await apiCall("GET", `${API_URL}/dashboard`);
    setResponse(res);
    setLoading(false);
    return res;
  };

  return { getDashboardData, loading, response };
};

export const useCreateLink = () => {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);

  const createLink = async (payload) => {
    setLoading(true);
    const res = await apiCall("POST", `${API_URL}/create-link`, payload);
    setResponse(res);
    setLoading(false);
    return res;
  };

  return { createLink, loading, response };
};

export const useEditLink = () => {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);

  const editLink = async (payload) => {
    setLoading(true);
    const res = await apiCall("PUT", `${API_URL}/edit-link`, payload);
    setResponse(res);
    setLoading(false);
    return res;
  };

  return { editLink, loading, response };
};

export const useDeleteLink = () => {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);

  const deleteLink = async (payload) => {
    setLoading(true);
    const res = await apiCall(
      "DELETE",
      `${API_URL}/delete-link/${payload}`
    );
    setResponse(res);
    setLoading(false);
    return res;
  };

  return { deleteLink, loading, response };
};

export const useGetLinks = () => {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);

  const getLinks = async (payload) => {
    setLoading(true);
    const res = await apiCall(
      "GET",
      `${API_URL}/links?page=${payload?.page}&limit=${payload?.limit}&remarks=${payload.remarks}`
    );
    setResponse(res);
    setLoading(false);
    return res;
  };

  return { getLinks, loading, response };
};

export const useGetAnalytics = () => {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);

  const getAnalytics = async (payload) => {
    setLoading(true);
    const res = await apiCall(
      "GET",
      `${API_URL}/analytics?page=${payload?.page}&limit=${payload?.limit}&remarks=${payload.remarks}`
    );
    setResponse(res);
    setLoading(false);
    return res;
  };

  return { getAnalytics, loading, response };
};

export const useUpdateUser = () => {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);

  const updateUser = async (payload) => {
    setLoading(true);
    const res = await apiCall("PUT", `${API_URL}/updateUser`, payload);
    setResponse(res);
    setLoading(false);
    return res;
  };

  return { updateUser, loading, response };
};

export const useDeleteUser = () => {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);

  const deleteUser = async () => {
    setLoading(true);
    const res = await apiCall("DELETE", `${API_URL}/delete-user`);
    setResponse(res);
    setLoading(false);
    return res;
  };

  return { deleteUser, loading, response };
};
