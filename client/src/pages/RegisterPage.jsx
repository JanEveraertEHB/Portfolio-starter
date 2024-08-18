import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import EHBLogo from "../assets/images/EHBLOGO.png";
import { createUser } from "../services/api";

const RegisterPage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("member");
  const [error, setError] = useState("");

  useEffect(() => {
    sessionStorage.clear();
  }, []);

  const handleRegister = async () => {
    try {
      const userData = { username, password, role };

      // Simulate a small delay before creating the user
      await new Promise((resolve) => setTimeout(resolve, 500));

      const createdUser = await createUser(userData);

      // Simulate a small delay before storing user data in sessionStorage
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Store the registered user data in sessionStorage
      sessionStorage.setItem("user", JSON.stringify(createdUser));

      // Simulate a small delay before navigating to the home page
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Navigate to the home page
      navigate("/home", { replace: true }); // Ensure navigation is replacing current history entry
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex items-center justify-center w-screen h-screen bg-primary font-jetbrains">
      <div className="p-10 w-full max-w-3xl bg-secondary">
        <h1 className="text-2xl font-bold mb-2 flex items-center">
          Welcome to the
          <img src={EHBLogo} alt="EHB Logo" className="h-8 mx-3 mb-1" />
          Student Forum
        </h1>
        <p className="mb-6">Create an account to access the forum</p>
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
          <div className="mb-4">
            <label
              className="block text-primary text-sm font-bold mb-2"
              htmlFor="role"
            >
              Role
            </label>
            <select
              className="shadow appearance-none border w-full py-2 px-3 text-primary leading-tight focus:outline-none focus:shadow-outline"
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="member">Member</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div className="mb-4">
            <label
              className="block text-primary text-sm font-bold mb-2"
              htmlFor="password"
            >
              Password
            </label>
            <input
              className="shadow appearance-none border w-full py-2 px-3 text-primary leading-tight focus:outline-none focus:shadow-outline"
              id="password"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              type="button"
              className="bg-primary hover:bg-blue-800 text-secondary font-bold py-2 px-4 focus:outline-none focus:shadow-outline"
              onClick={handleRegister}
            >
              Register
            </button>
            <button
              type="button"
              className="bg-primary hover:bg-blue-800 text-secondary font-bold py-2 px-4 focus:outline-none focus:shadow-outline"
              onClick={() => navigate("/login")}
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
