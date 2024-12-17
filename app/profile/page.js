"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Input from "@/components/Input";
import Animation from "@/components/LoadingAnimation";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [message, setMessage] = useState("");
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      router.push("/login");
    }
  }, [router]);

  // Password validation function
  const validatePassword = (password) => {
    const errors = [];
    if (!/[A-Z]/.test(password)) errors.push("At least one uppercase letter");
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) errors.push("At least one special character");
    if (!/[0-9]/.test(password)) errors.push("At least one number");
    return errors;
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();

    const passwordErrors = validatePassword(newPassword);
    if (passwordErrors.length > 0) {
      setMessage("Password does not meet the requirements.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match!");
      return;
    }

    try {
      const response = await fetch("http://169.239.251.102:3341/~rachel.yeboah/otakuhub/update_password.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: user.username,
          password: newPassword,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setMessage("Password updated successfully!");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        setMessage(data.message || "Update failed!");
      }
    } catch (err) {
      setMessage("Server error. Please try again.");
    }
  };

  const handleUsernameUpdate = async () => {
    try {
      const response = await fetch("http://169.239.251.102:3341/~rachel.yeboah/otakuhub/update_username.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: newUsername.trim(),
          currentUsername: user.username,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setUser((prev) => ({ ...prev, username: newUsername }));
        localStorage.setItem("user", JSON.stringify({ username: newUsername }));
        setMessage("Username updated successfully!");
        setIsEditingUsername(false);
        setNewUsername("");
      } else {
        setMessage(data.message || "Username update failed!");
      }
    } catch (err) {
      setMessage("Server error. Please try again.");
    }
  };

  const logout = () => {
    localStorage.removeItem("user");
    router.push("/login");
  };

  const passwordErrors = validatePassword(newPassword);

  if (!user) return <div className="flex justify-center items-center m-auto w-full mt-10"><Animation /></div>;

  return (
    <div className="min-h-screen m-auto flex justify-center items-center">
      <div className="max-w-md p-4 w-full">
        <h1 className="text-3xl font-bold mb-4">User Profile</h1>

        <div className="mb-4">
          <strong className="text-lg">Username: </strong>
          {!isEditingUsername ? (
            <span
              className="cursor-pointer hover:text-[#595168] duration-700 ease-in-out"
              onClick={() => setIsEditingUsername(true)}
            >
              {user.username}
            </span>
          ) : (
            <div className="flex flex-col gap-2">
              <Input
                type="text"
                value={newUsername}
                placeholder={user.username}
                onChange={(e) => setNewUsername(e.target.value)}
                styles="w-full border-4 rounded-lg"
              />
              <div className="flex gap-2">
                <button
                  className="bg-green-500 text-white px-4 py-2 rounded-md"
                  onClick={handleUsernameUpdate}
                  disabled={!newUsername.trim()}
                >
                  Save Username
                </button>
                <button
                  className="custom-button text-white px-4 py-2 rounded-md"
                  onClick={() => setIsEditingUsername(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        <form onSubmit={handlePasswordUpdate} className="mb-4">
          <h2 className="text-xl font-semibold mb-2">Change Password</h2>

          <div className="relative mb-2">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              styles="w-full border-4 rounded-lg"
            />
          </div>

          <div className="relative mb-2">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              styles="w-full border-4 rounded-lg"
            />
          </div>

          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              id="showPassword"
              checked={showPassword}
              onChange={() => setShowPassword((prev) => !prev)}
              className="mr-2"
            />
            <label htmlFor="showPassword" className="text-sm">
              Show Password
            </label>
          </div>

          <span className="text-sm">Password should have:</span>
          <ul className="text-xs mb-4">
            <li className={/[A-Z]/.test(newPassword) ? "text-green-500" : "text-red-500"}>
              - At least one uppercase letter
            </li>
            <li className={/[!@#$%^&*(),.?":{}|<>]/.test(newPassword) ? "text-green-500" : "text-red-500"}>
              - At least one special character
            </li>
            <li className={/[0-9]/.test(newPassword) ? "text-green-500" : "text-red-500"}>
              - At least one number
            </li>
          </ul>

          {message && <p className="text-green-500 mt-4 mb-3">{message}</p>}

          <button
            type="submit"
            className="custom-button text-white px-4 py-2 rounded w-full"
            disabled={!newPassword}
          >
            Save Password
          </button>
        </form>

        <button onClick={logout} className="bg-red-500 text-white px-4 py-2 rounded w-full">
          Logout
        </button>
      </div>
    </div>
  );
}
