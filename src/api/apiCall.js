import axios from "axios";
import toast from "react-hot-toast";

export default async function apiCall(method, url, data = {},showToast=true){
  try {
    const token = localStorage.getItem("token")
    const response = await axios({
      method,
      url,
      data,
      headers:{
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });

    if (response.data?.success) {
      if(response.data?.token){
        localStorage.setItem("token", response.data.token);
      }
      showToast && response?.data?.message && toast.success(response?.data?.message)
      return response.data;
    } else {
      showToast && toast.error(response.data?.message || "Something went wrong");
      return { success: false, message: response.data?.message || "Unknown error" };
    }
  } catch (err) {
    const errorMessage = err?.response?.data?.message || "No Response From Server";
    toast.error(errorMessage);

    return {
      success: false,
      message: errorMessage,
    };
  }
};
