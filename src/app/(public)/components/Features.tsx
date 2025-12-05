"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function FeaturesSection() {
  return (
    <section id="features">
      <div className="px-6 md:px-20 py-20 space-y-32">

        <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-12">

          <motion.div
            className="max-w-xl text-center md:text-left"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl font-bold mb-4">
              Trust Starts With Strong Authentication
            </h2>

            <p className="text-gray-600 leading-relaxed text-md">
              Give your users secure and reliable access to your platform.
              Clarisign protects your data with industry-grade encryption
              and strict access control, ensuring every login, every
              document, and every action remains safe and compliant.
            </p>
          </motion.div>

          <motion.div
            className="flex justify-center md:justify-end w-full"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            viewport={{ once: true }}
          >
            <Image
              src="/landing/landing-1.svg"
              alt="Landing Image"
              width={600}
              height={600}
              unoptimized
              className="w-full max-w-[450px] h-auto"
            />
          </motion.div>

        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-12">

          <motion.div
            className="flex justify-center md:justify-start w-full"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            viewport={{ once: true }}
          >
            <Image
              src="/landing/landing-2.webp"
              alt="Landing Image"
              width={800}
              height={533}
              className="w-full max-w-[450px] h-auto"
            />
          </motion.div>

          <motion.div
            className="max-w-xl text-center md:text-left"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl font-bold mb-4">
              One Platform for Every Signing Workflow
            </h2>

            <p className="text-gray-600 leading-relaxed text-md">
              Clarisign lets you sign and manage documents in one seamless
              platform, making digital signing faster, more organized, and
              fully compliant wherever your team collaborates.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
