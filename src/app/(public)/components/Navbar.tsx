"use client";

import { useEffect } from "react";

export default function Navbar() {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const sections = ["home", "features", "how-it-works", "contact"];

  useEffect(() => {
    let index = 0;

    const interval = setInterval(() => {
      scrollTo(sections[index]);

      index = (index + 1) % sections.length;
    }, 7000);

    return () => clearInterval(interval);
  }, []);

  return (
    <nav className="fixed top-0 left-0 w-full bg-white/80 backdrop-blur-md shadow-sm z-50">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
        <div className="hidden md:flex gap-6 text-sm">
          <div className="font-bold text-xl">Clarisign</div>
          <button
            onClick={() => scrollTo("home")}
            className="hover:text-blue-600"
          >
            Home
          </button>
          <button
            onClick={() => scrollTo("features")}
            className="hover:text-blue-600"
          >
            Features
          </button>
          <button
            onClick={() => scrollTo("how-it-works")}
            className="hover:text-blue-600"
          >
            How It Works
          </button>
          <button
            onClick={() => scrollTo("contact")}
            className="hover:text-blue-600"
          >
            Contact Us
          </button>
        </div>

        <div className="flex gap-6">
          <button className="bg-gray-200 px-3 py-1 rounded-sm border border-gray-600 text-sm">
            <a href="/login">Sign-in</a>
          </button>
          <button className="bg-black px-3 py-1 rounded-sm border-white text-sm text-white">
            <a href="/register">Register</a>
          </button>
        </div>
      </div>
    </nav>
  );
}
