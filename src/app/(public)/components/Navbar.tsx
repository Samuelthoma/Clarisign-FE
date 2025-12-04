"use client";

export default function Navbar() {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

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
            onClick={() => scrollTo("about")}
            className="hover:text-blue-600"
          >
            About Us
          </button>
          <button
            onClick={() => scrollTo("contact")}
            className="hover:text-blue-600"
          >
            Contact
          </button>
        </div>

        <div className="flex gap-6">
          <button className="bg-gray-200 px-3 py-1 rounded-sm border border-gray-600 text-sm">
            Sign-in
          </button>
          <button className="bg-black px-3 py-1 rounded-sm border-white text-sm text-white">
            Register
          </button>
        </div>
      </div>
    </nav>
  );
}
