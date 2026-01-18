import axios from "axios";

export const loginUser = async (data) => {
  const res = await axios.post("http://127.0.0.1:8000/auth/login", data);
  return res.data;
};