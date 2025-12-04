import Image from "next/image";

export default function AboutSection() {
  return (
    <>
      <div className="py-24 px-6 bg-gray-200 flex flex-col items-center text-center">
        <h2 className="text-2xl md:text-2xl font-bold mb-4 leading-snug">
          The Future of Secure Digital Signatures
          <br /> to Empower Your Team
        </h2>

        <p className="text-gray-600 leading-relaxed text-lg max-w-xl">
          A smarter, safer, more elegant way to sign
        </p>
      </div>

      <div className="px-6 md:px-20 py-20 space-y-32">

        <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-12">

          <div className="max-w-xl text-center md:text-left">
            <h2 className="text-2xl font-bold mb-4">
              Trust Starts With Strong Authentication
            </h2>

            <p className="text-gray-600 leading-relaxed text-md">
              Give your users secure and reliable access to your platform.
              Clarisign protects your data with industry-grade encryption
              and strict access control, ensuring every login, every
              document, and every action remains safe and compliant.
            </p>
          </div>

          <div className="flex justify-center md:justify-end w-full">
            <Image
              src="/landing/landing-1.svg"
              alt="Landing Image"
              width={600}
              height={600}
              unoptimized
              className="w-full max-w-[450px] h-auto"
            />
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-12">

          <div className="flex justify-center md:justify-start w-full">
            <Image
              src="/landing/landing-2.webp"
              alt="Landing Image"
              width={800}
              height={533}
              className="w-full max-w-[450px] h-auto"
            />
          </div>

          <div className="max-w-xl text-center md:text-left">
            <h2 className="text-2xl font-bold mb-4">
              One Platform for Every Signing Workflow
            </h2>

            <p className="text-gray-600 leading-relaxed text-md">
              Clarisign lets you sign and manage documents in one seamless
              platform, making digital signing faster, more organized, and
              fully compliant wherever your team collaborates.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-gray-200 p-20">
        <div className="text-center mb-24">
          <h2 className="text-2xl font-bold">
            With Clarisign, you can generate, share, and <br /> sign documents faster than ever
          </h2>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-12">

          <div className="w-full md:w-1/2 flex justify-center">
            <div className="w-full h-full min-h-[350px] bg-black rounded-xl"></div>
          </div>

          <div className="w-full md:w-1/2">
            <div className="flex flex-row items-center mb-8">
              <h1 className="w-14 h-14 flex items-center justify-center text-4xl mr-8 bg-orange-800 text-white rounded-xl">
                1
              </h1>
              <div>
                <h2 className="text-lg font-bold">Upload a document</h2>
                <p className="text-md text-gray-700">
                  Save time by uploading a document or a reusable template.
                  <br />
                  Add fields and position them where signatures are required.
                </p>
              </div>
            </div>

            <div className="flex flex-row items-center mb-8">
              <h1 className="w-14 h-14 flex items-center justify-center text-4xl mr-8 bg-orange-800 text-white rounded-xl">
                2
              </h1>
              <div>
                <h2 className="text-lg font-bold">Share the link</h2>
                <p className="text-md text-gray-700">
                  Generate a signing link and send it to your signer.
                  <br />
                  Fast, simple, and frictionless.
                </p>
              </div>
            </div>

            <div className="flex flex-row items-center">
              <h1 className="w-14 h-14 flex items-center justify-center text-4xl mr-8 bg-orange-800 text-white rounded-xl">
                3
              </h1>
              <div>
                <h2 className="text-lg font-bold">Track progress and collect signatures</h2>
                <p className="text-md text-gray-700">
                  Follow the document’s progress and check when signatures are completed.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
