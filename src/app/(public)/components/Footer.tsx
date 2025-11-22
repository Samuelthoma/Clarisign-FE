export default function Footer() {
  return (
    <footer className="border-t mt-24">
      <div className="max-w-6xl mx-auto px-6 py-12">
        
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-lg font-semibold">Clarisign</div>
        </div>

        <div className="mt-8 text-center text-gray-500 text-sm">
          © {new Date().getFullYear()} Clarisign. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
