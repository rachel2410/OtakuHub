"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Input from "@/components/Input";

export default function SignUpPage() {
  const [ username, setUsername ] = useState("");
  const [ password, setPassword ] = useState("");
  const [ confirmPassword, setConfirmPassword ] = useState("");
  const [ showPassword, setShowPassword ] = useState(false);
  const [ error, setError ] = useState(null);
  const [ success, setSuccess ] = useState(null);
  const router = useRouter();

  // Password validation function
  const validatePassword = (password) => {
    const errors = [];
    if (!/[A-Z]/.test(password)) errors.push("At least one uppercase letter");
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) errors.push("At least one special character");
    if (!/[0-9]/.test(password)) errors.push("At least one number");
    return errors;
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const passwordErrors = validatePassword(password);
    if (passwordErrors.length > 0) {
      setError("Password does not meet the requirements.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const response = await fetch("http://169.239.251.102:3341/~rachel.yeboah/otakuhub/register.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess("Registration successful! Redirecting to login...");
        setTimeout(() => router.push("/login"), 2000);
      } else {
        setError(data.message || "Registration failed.");
      }
    } catch (err) {
      setError("Server error. Please try again.");
    }
  };

  const passwordErrors = validatePassword(password);

  return (
    <div className="p-4 max-w-md mx-auto mt-20">
      <h1 className="text-3xl font-bold mb-4 text-center">Sign Up</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {success && <p className="text-green-500 mb-4">{success}</p>}

      <form onSubmit={handleSignUp}>
        <Input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          styles="w-full border-4 rounded-lg"
        />

        <div className="relative mb-2">
          <Input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            styles="w-full border-4 rounded-lg"
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute inset-y-0 right-0 pr-3 pb-2 flex items-center text-sm leading-5"
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>

        <div className="relative mb-4">
          <Input
            type={showPassword ? "text" : "password"}
            placeholder="Confirm Password"
            value={confirmPassword}
            styles="w-full border-4 rounded-lg"
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>

        <span className="text-sm">Password should have:</span>
        <ul className="text-xs mb-4">
          <li className={/[A-Z]/.test(password) ? "text-green-500" : "text-red-500"}>
            - At least one uppercase letter
          </li>
          <li className={/[!@#$%^&*(),.?":{}|<>]/.test(password) ? "text-green-500" : "text-red-500"}>
            - At least one special character
          </li>
          <li className={/[0-9]/.test(password) ? "text-green-500" : "text-red-500"}>
            - At least one number
          </li>
        </ul>

        <button type="submit" className="custom-button text-white px-4 py-2 rounded w-full">
          Sign Up
        </button>
      </form>

      <p className="mt-4 text-center">
        Already have an account?{" "}
        <a href="/login" className="text-white underline hover:text-[#595168] ease-in-out duration-500 transition">
          Login here
        </a>
      </p>
    </div>
  );
}
