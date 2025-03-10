// src/app/components/Header.js
"use client";
import React from "react";

export default function Header() {
  return (
    <header className="flex items-center justify-between px-6 py-4 bg-[#173628] shadow-md">
  <div className="text-2xl font-bold text-white">Mushi</div>
  <nav className="space-x-6 hidden md:block">
    <a href="#" className="text-gray-300 hover:text-white transition-colors duration-200">Templates</a>
    <a href="#" className="text-gray-300 hover:text-white transition-colors duration-200">Courses</a>
  </nav>
  <div className="flex items-center space-x-2">
    <img src="https://firebasestorage.googleapis.com/v0/b/mushi-a9949.firebasestorage.app/o/Screenshot%202025-03-09%20161043.png?alt=media&token=b4467fc5-1e2e-450e-9b1a-c4cc2f496a73" alt="Account Avatar" className="w-10 h-10 rounded-full border border-gray-500" />
    <span className="hidden sm:inline text-gray-300">Sonis Vaiciunas</span>
  </div>
</header>
  );
}
