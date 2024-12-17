"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Input from "@/components/Input";

export default function Login() {
  const [ username, setUsername ] = useState("");
  const [ password, setPassword ] = useState("");
  const [ showPassword, setShowPassword ] = useState(false);
  const [ error, setError ] = useState("");
  const [ success, setSuccess ] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const response = await fetch(
        "https://otakuhub-ray.vercel.app/login_proxy",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password }),
        }
      );

      const data = await response.json();

      if (data.success) {
        const user = { username: data.username };
        localStorage.setItem("user", JSON.stringify(user));

        window.dispatchEvent(new Event("user-login"));

        setSuccess("Login successful! Redirecting...");
        setTimeout(() => router.push("/home"), 2000);
      } else {
        setError(data.message || "Invalid username or password.");
      }
    } catch (err) {
      setError("Server error. Please try again.");
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto mt-20">
      <h1 className="text-3xl font-bold mb-4 text-center">Login</h1>

      {error && <p className="text-red-500 mb-4">{error}</p>}
      {success && <p className="text-green-500 mb-4">{success}</p>}

      <form onSubmit={handleSubmit}>
        {/* Username Input */}
        <Input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          styles="w-full border-4 rounded-lg mb-4"
        />

        {/* Password Input */}
        <div className="relative mb-4">
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

        {/* Submit Button */}
        <button
          type="submit"
          className="custom-button text-white px-4 py-2 rounded w-full"
        >
          Login
        </button>
      </form>

      {/* SignUp Redirect */}
      <p className="mt-4 text-center">
        Don't have an account?{" "}
        <a
          href="/signup"
          className="text-white underline hover:text-[#595168] ease-in-out duration-500 transition"
        >
          Sign-up here
        </a>
      </p>
    </div>
  );
};
