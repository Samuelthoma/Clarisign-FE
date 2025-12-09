"use client";

import { motion } from "framer-motion";

export default function HomeSection() {
    return (
        <section
            id="home"
            className="relative bg-gray-100 px-6 h-screen overflow-hidden flex items-center justify-center"
        >
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                transition={{ duration: 1.2 }}
                className="absolute inset-0"
            >
                <motion.div
                    animate={{ x: ["0%", "-6%"], y: ["0%", "-6%"] }}
                    transition={{
                        duration: 16,
                        repeat: Infinity,
                        repeatType: "mirror",
                        ease: "linear",
                    }}
                    className="w-[200%] h-[200%]"
                    style={{
                        backgroundImage:
                            "linear-gradient(to right, #00000022 1px, transparent 1px), linear-gradient(to bottom, #00000022 1px, transparent 1px)",
                        backgroundSize: "40px 40px",
                    }}
                />
            </motion.div>

            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 0.25, scale: 1 }}
                transition={{ duration: 1.2 }}
                className="absolute top-24 left-16 w-72 h-72 bg-blue-300 rounded-full blur-3xl"
            />

            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 0.25, scale: 1 }}
                transition={{ duration: 1.4 }}
                className="absolute bottom-20 right-10 w-96 h-96 bg-purple-300 rounded-full blur-3xl"
            />

            <div className="max-w-4xl mx-auto flex flex-col items-center text-center relative z-10">
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
