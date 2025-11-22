"use client";

export default function Navbar() {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-white/80 backdrop-blur-md shadow-sm z-50">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
        <div className="font-bold text-xl">Clarisign</div>

        <div className="hidden md:flex gap-6 text-sm">
          <button
            onClick={() => scrollTo("about")}
            className="hover:text-blue-600"
          >
            About
          </button>
          <button
            onClick={() => scrollTo("features")}
            className="hover:text-blue-600"
          >
            Features
          </button>
          <button
            onClick={() => scrollTo("pricing")}
            className="hover:text-blue-600"
          >
            Pricing
          </button>
          <button
            onClick={() => scrollTo("contact")}
            className="hover:text-blue-600"
          >
            Contact
          </button>
        </div>
      </div>
    </nav>
  );
}
