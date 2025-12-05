"use client";

import { motion } from "framer-motion";

export default function HomeSection() {
    return (
        <section
            id="home"
            className="relative bg-gray-100 px-6 h-screen overflow-hidden flex items-center justify-center"
        >
            <div className="max-w-4xl mx-auto flex flex-col items-center text-center">
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-4xl md:text-5xl font-extrabold leading-tight mb-4"
                >
                    The Future of Secure Digital Signatures <br />
                    <span className="text-blue-600"> to Empower Your Team</span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.15 }}
                    className="text-gray-700 text-lg md:text-xl leading-relaxed max-w-2xl mb-8"
                >
                    A smarter, safer, more elegant way to sign.
                </motion.p>
            </div>
        </section>
    );
}
