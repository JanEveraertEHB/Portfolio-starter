import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import EHBLogo from "../assets/images/EHBLOGO.png";
import { loginUser } from "../services/api";

const LoginPage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const credentials = { username, password };
      console.log("Logging in with credentials:", credentials); // Debug log
      const result = await loginUser(credentials);
      console.log("Login result:", result); // Debug log
      if (result.user) {
        sessionStorage.setItem("user", JSON.stringify(result.user));
        setTimeout(() => {
          navigate("/home"); // Navigate to home page after successful login
        }, 1000); // 1 second delay
      }
    } catch (err) {
      console.error("Login error:", err); // Debug log
      setError(err.message); // Display error message if login fails
    }
  };

  return (
    <div className="flex items-center justify-center w-screen h-screen bg-primary font-jetbrains">
      <div className="p-10 w-full max-w-3xl bg-secondary">
        <div className="flex items-start justify-left mb-2">
          <h1 className="text-2xl font-bold flex items-center">
            Welcome to the
            <img src={EHBLogo} alt="EHB Logo" className="h-8 mx-3 mb-1" />
            Student Forum
          </h1>
        </div>
        <p className="mb-6">Login with your account to access the forum</p>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form>
          <div className="mb-4">
            <label
              className="block text-primary text-sm font-bold mb-2"
              htmlFor="username"
            >
              Username
            </label>
            <input
              className="shadow appearance-none border w-full py-2 px-3 text-primary leading-tight focus:outline-none focus:shadow-outline"
              id="username"
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="mb-6">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="password"
            >
              Password
            </label>
            <input
              className="shadow appearance-none border w-full py-2 px-3 text-primary mb-3 leading-tight focus:outline-none focus:shadow-outline"
              id="password"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              className="bg-primary hover:bg-blue-800 text-secondary font-bold py-2 px-4 focus:outline-none focus:shadow-outline mr-2"
              type="button"
              onClick={handleLogin}
            >
              Login
            </button>
            <button
              className="bg-primary hover:bg-blue-800 text-secondary font-bold py-2 px-4 ml-4 focus:outline-none focus:shadow-outline"
              type="button"
              onClick={() => navigate("/register")}
            >
              Register
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
