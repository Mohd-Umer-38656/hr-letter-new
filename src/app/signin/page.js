"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignIn() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
      credentials: "include", // Allows cookies to be saved
    });

    if (res.ok) {
      router.push("/admin"); // Redirect to admin if login is successful
    } else {
      const data = await res.json();
      setError(data.error);
    }
  };

  return (
    <div className="flex h-screen justify-center items-center">
      <form onSubmit={handleLogin} className="p-6 bg-white shadow-md rounded w-96">
        <h2 className="text-xl font-bold mb-4">Admin Login</h2>
        {error && <p className="text-red-500">{error}</p>}
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="border p-2 w-full mb-2" required />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="border p-2 w-full mb-2" required />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded w-full">Login</button>
      </form>
    </div>
  );
}
