"use client";
import React, { useState } from "react";
import Link from "next/link";

export default function AuthForm({ isSignup }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(isSignup ? "Signing up..." : "Logging in...");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full">
        
        {/* Logo */}
        <h2 className="text-center text-2xl font-semibold text-red-500">Kandy</h2>

        {/* Title */}
        <h3 className="text-center text-xl font-bold mt-2">
          {isSignup ? "Create your account" : "Sign in"}
        </h3>
        <p className="text-center text-gray-500 text-sm">
          {isSignup ? "Welcome! Fill in the details to get started." : "Welcome back! Log in to continue."}
        </p>

        {/* Social Login Buttons */}
        <div className="mt-4 flex space-x-2">
          <button className="flex-1 bg-blue-600 text-white py-2 rounded-md flex items-center justify-center">
            <span className="mr-2">🔵</span> Facebook
          </button>
          <button className="flex-1 bg-white border py-2 rounded-md flex items-center justify-center">
            <span className="mr-2">🌍</span> Google
          </button>
        </div>

        <div className="flex items-center my-4">
          <div className="border-t flex-1"></div>
          <p className="text-sm text-gray-400 mx-2">or</p>
          <div className="border-t flex-1"></div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm text-gray-700">Email address</label>
            <input
              type="email"
              className="w-full border rounded-md px-4 py-2 focus:ring-2 focus:ring-green-700"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="text-sm text-gray-700">Password</label>
            <div className="relative">
              <input
                type="password"
                className="w-full border rounded-md px-4 py-2 focus:ring-2 focus:ring-green-700"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <span className="absolute right-3 top-2 cursor-pointer">👁️</span>
            </div>
          </div>

          {/* Submit Button */}
          <button className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800 transition">
            {isSignup ? "Continue" : "Sign In"}
          </button>
        </form>

        {/* Switch Between Signup & Login */}
        <p className="text-center text-sm text-gray-500 mt-4">
          {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
          <Link href={isSignup ? "/auth/login" : "/auth/signup"} className="text-blue-500">
            {isSignup ? "Sign in" : "Sign up"}
          </Link>
        </p>
      </div>
    </div>
  );
}
