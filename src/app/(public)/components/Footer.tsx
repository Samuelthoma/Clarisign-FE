import { Lock, PenLine } from "lucide-react";

const columns = [
  {
    heading: "Product",
    links: [
      { label: "Home", href: "#home" },
      { label: "Features", href: "#features" },
      { label: "How it works", href: "#how-it-works" },
      { label: "Contact", href: "#contact" },
    ],
  },
  {
    heading: "Account",
    links: [
      { label: "Sign in", href: "/login" },
      { label: "Create account", href: "/register" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { label: "Privacy Policy", href: "#" },
      { label: "Terms of Service", href: "#" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-gradient-to-br from-[#4f3aa8] via-[var(--primary)] to-[#5a4fd6] text-white">
      <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-white/10 blur-3xl" aria-hidden />
      <div className="absolute -bottom-32 -left-20 w-96 h-96 rounded-full bg-indigo-300/20 blur-3xl" aria-hidden />

      <div className="relative max-w-6xl mx-auto px-6 pt-16 pb-8 md:pt-20">
        <div className="grid gap-12 md:grid-cols-[1.6fr_3fr] md:gap-8">
          <div className="max-w-xs">
            <div className="flex items-center gap-2.5 mb-4">
              <span className="w-9 h-9 rounded-xl bg-white flex items-center justify-center shadow-lg shadow-black/10">
                <PenLine className="w-5 h-5 text-[var(--primary)]" />
              </span>
              <span className="text-xl font-bold tracking-tight">Clarisign</span>
            </div>
            <p className="text-sm text-white/75 leading-relaxed">
              A smarter, safer, more elegant way to sign — with verified identities and
              end-to-end encryption.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-8 gap-y-10">
            {columns.map((column) => (
              <div key={column.heading}>
                <p className="text-xs font-semibold uppercase tracking-widest text-white/50 mb-4">
                  {column.heading}
                </p>
                <ul className="space-y-2.5">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        className="text-sm text-white/80 hover:text-white transition-colors"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-14 pt-6 border-t border-white/15 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-white/60">
          <p>© {new Date().getFullYear()} Clarisign. All rights reserved.</p>
          <p className="inline-flex items-center gap-1.5">
            <Lock className="w-3 h-3" />
            Secured with AES-256-GCM &amp; Ed25519
          </p>
        </div>
      </div>
    </footer>
  );
}
