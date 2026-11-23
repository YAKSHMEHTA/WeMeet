import axios, { HttpStatusCode } from "axios";
import { createContext, useState } from "react";
import {url} from '../prod.js'
import { useNavigate } from "react-router-dom";
export const AuthContext = createContext({});

console.log('process.env.isProd:',import.meta.env.VITE_IS_PROD);
const client = axios.create({
  baseURL:  import.meta.env.VITE_IS_PROD == 'true' ? `${url}/api/v1` : "http://localhost:8000/api/v1",
});

export const AuthProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);

  const router = useNavigate();

  const handleRegister = async (name, username, password) => {
    console.log('name,username,password:', name,username,password);
    const request = await client.post("/register", {
      name,
      username,
      password,
    });
    console.log('request:', request);

    if (request.status === HttpStatusCode.Created) {
      return request.data.msg;
    }
  };


    const handleLogin = async(username, password) => {
      const request = await client.post("/login",{
        username: username,
        password: password,
      },{withCredentials:true});
      if (request.status === HttpStatusCode.Created) {
        return request.data.msg;
      }
    }


  const data = {
    userData,
    setUserData,
    handleLogin,
    handleRegister,
  };

  return <AuthContext.Provider value={data}>{children}</AuthContext.Provider>;
};
