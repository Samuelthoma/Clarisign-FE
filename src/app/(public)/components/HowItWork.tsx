"use client";

import { motion } from "framer-motion";

export default function HowItWorkSection() {
    const container = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                delayChildren: 0.2,
                staggerChildren: 0.2,
            },
        },
    };

    const item = {
        hidden: { opacity: 0, y: 25 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    };

    return (
        <section id="how-it-works">
            <div className="bg-gray-200 p-20">

                <motion.div
                    className="text-center mb-24"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                >
                    <h2 className="text-2xl font-bold">
                        With Clarisign, you can generate, share, and <br />
                        sign documents faster than ever
                    </h2>
                </motion.div>

                <div className="flex flex-col md:flex-row items-center gap-12">

                    <motion.div
                        className="w-full md:w-1/2 flex justify-center"
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                    >
                        <div className="w-full h-full min-h-[350px] bg-black rounded-xl"></div>
                    </motion.div>

                    <motion.div
                        className="w-full md:w-1/2"
                        variants={container}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                    >
                        <motion.div className="flex flex-row items-center mb-8" variants={item}>
                            <div className="w-14 h-14 flex items-center justify-center 
                  text-4xl mr-8 bg-orange-800 text-white rounded-xl">
                                1
                            </div>
                            <div>
                                <h2 className="text-lg font-bold">Upload a document</h2>
                                <p className="text-md text-gray-700 max-w-md">
                                    Upload a document or use a template. Add signature fields exactly where needed.
                                </p>
                            </div>
                        </motion.div>

                        <motion.div className="flex flex-row items-center mb-8" variants={item}>
                            <div className="w-14 h-14 flex items-center justify-center 
                  text-4xl mr-8 bg-orange-800 text-white rounded-xl">
                                2
                            </div>
                            <div>
                                <h2 className="text-lg font-bold">Share the link</h2>
                                <p className="text-md text-gray-700 max-w-md">
                                    Generate a secure signing link and send it instantly.
                                </p>
                            </div>
                        </motion.div>

                        <motion.div className="flex flex-row items-center mb-8" variants={item}>
                            <div className="w-14 h-14 flex items-center justify-center 
                  text-4xl mr-8 bg-orange-800 text-white rounded-xl">
                                3
                            </div>
                            <div>
                                <h2 className="text-lg font-bold">Track progress</h2>
                                <p className="text-md text-gray-700 max-w-md">
                                    Monitor document status in real-time and see when all signatures are complete.
                                </p>
                            </div>
                        </motion.div>
                    </motion.div>

                </div>
            </div>
        </section>
    );
}
