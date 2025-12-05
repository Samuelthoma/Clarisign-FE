export default function Footer() {
  return (
    <footer className="border-t bg-gray-50 mt-24">
      <div className="max-w-6xl mx-auto px-6 py-12">

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

          <div>
            <h3 className="text-xl font-bold">Clarisign</h3>
            <p className="text-gray-600 mt-3 text-sm">
              A smarter, safer, more elegant way to sign.
            </p>
          </div>

          <div className="flex justify-start md:justify-center">
            <ul className="space-y-3">
              <li>
                <a href="#home" className="text-gray-600 hover:text-gray-900 text-sm">
                  Home
                </a>
              </li>
              <li>
                <a href="#features" className="text-gray-600 hover:text-gray-900 text-sm">
                  Features
                </a>
              </li>
              <li>
                <a href="#pricing" className="text-gray-600 hover:text-gray-900 text-sm">
                  Pricing
                </a>
              </li>
              <li>
                <a href="#contact" className="text-gray-600 hover:text-gray-900 text-sm">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          <div className="flex md:justify-end">
            <ul className="space-y-3 text-sm">
              <li>
                <a href="#" className="text-gray-600 hover:text-gray-900">Privacy Policy</a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-gray-900">Terms of Service</a>
              </li>
            </ul>
          </div>

        </div>

        <div className="border-t mt-10 pt-6 text-center text-gray-500 text-sm">
          © {new Date().getFullYear()} Clarisign. All rights reserved.
        </div>

      </div>
    </footer>
  );
}
