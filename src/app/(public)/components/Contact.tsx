export default function ContactSection() {
  return (
    <div className="pt-24 px-6 max-w-5xl mx-auto">
      <h2 className="text-3xl font-bold mb-4">Contact Us</h2>

      <p className="text-gray-600 mb-6">
        Have a question? We're here to help.
      </p>

      <a
        href="mailto:hello@example.com"
        className="text-blue-600 font-semibold hover:underline"
      >
        hello@example.com
      </a>
    </div>
  );
}
