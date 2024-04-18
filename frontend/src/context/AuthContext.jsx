import React, { useCallback, useEffect, useState } from "react";
import { createContext } from "react";
import { baseUrl, postRequest } from "../utils/services";
import axios from 'axios';

export const AuthContext = createContext();


export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [registerError, setRegisterError] = useState(null);
  const [isRegisterLoading, setIsRegisterLoading] = useState(false);
  const [registerInfo, setRegisterInfo] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loginInfo , setLoginInfo] = useState({
    email: "",
    password: "",
  });

  const [loginError, setLoginError] = useState(null);
  const [isLoginLoading, setIsLoginLoading] = useState(false);



  const [createdQuizId, setCreatedQuizId] = useState(null); // State to store the created quiz ID

  const removeCreatedQuizId = useCallback(() => {
    localStorage.removeItem('createdQuizId');
    setCreatedQuizId(null);
  }, []);


  console.log("register",registerInfo);
  console.log("Userr", user);
  console.log("loginInfo", loginInfo);

  useEffect(() => {
    const user = localStorage.getItem("User");
    setUser(JSON.parse(user));
  }, []);

  const updateRegisterInfo = useCallback((info) => {
    setRegisterInfo(info);
  }, []);

  const updateLoginInfo = useCallback((info) => {
    setLoginInfo((prevInfo) => ({
      ...prevInfo,
      ...info
    }));
  }, []);

  const registerUser = useCallback(
    async (e) => {
      e.preventDefault();
      setIsRegisterLoading(true);

      setRegisterError(null);
      const response = await postRequest(
        `${baseUrl}/users/register`,
        JSON.stringify(registerInfo)
      );

      setIsRegisterLoading(false);
      if (response.error) {
        return setRegisterError(response);
      }
      localStorage.setItem("User", JSON.stringify(response));
      setUser(response);
    },
    [registerInfo]
  );

  const loginUser = useCallback(
    async (e) => {
      e.preventDefault();

      setIsLoginLoading(true);
      setLoginError(null);
      const response = await postRequest(
        `${baseUrl}/users/login`,
        JSON.stringify(loginInfo)
      );
      setIsLoginLoading(false);
      if (response.error) {
        return setLoginError(response);
      }
      localStorage.setItem("User", JSON.stringify(response));
      setUser(response);
    },
    [loginInfo]
  );

  const logoutUser = useCallback(() => {
    localStorage.removeItem("User");
    setUser(null);
  }, []);

  
  useEffect(() => {
    // Example: Fetch user data from backend when component mounts
    const fetchUserData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/user'); // Adjust the endpoint URL accordingly
        setUser(response.data.user);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        registerInfo,
        updateRegisterInfo,
        registerUser,
        registerError,
        isRegisterLoading,
        logoutUser,
        loginUser,
        loginError,
        updateLoginInfo,
        isLoginLoading,
        createdQuizId,
        setCreatedQuizId,
        removeCreatedQuizId
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
