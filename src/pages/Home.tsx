"use client";
import React from "react";
import { motion, Variants } from "framer-motion";
import { useNavigate } from "react-router-dom";

const floatingWords = [
  "Founder", "Build", "Vision", "Launch", "Idea", "Dream",
  "Startup", "Team", "Code", "Prototype", "Scale", "Mission",
  "Growth", "Product", "Brand", "User", "Impact", "Beta",
  "Passion", "Bridge", "Journey", "Goal", "Pitch", "Spark",
  "Create", "Strategy", "Investor", "Problem", "Solution", "Execute"
];

// Animation Variant: fade in and stay
const fadeInAndStay: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 1,
      ease: [0.25, 0.46, 0.45, 0.94] // easeOutQuart
    }
  }
};

export default function Home() {
  const navigate = useNavigate();
  return (
    <div className="relative w-full min-h-screen bg-[#0b0d24] overflow-hidden flex flex-col items-center justify-center px-6">

      {/* Floating Words in Background */}
      {floatingWords.slice(0, 20).map((word, i) => (
        <span
          key={i}
          className="absolute text-white font-bold select-none pointer-events-none"
          style={{
            top: `${(i * 17) % 100}%`,  // distribute vertically
            left: `${(i * 37) % 100}%`, // distribute horizontally
            fontSize: `${Math.random() * 3 + 2}rem`, // size between 2rem and 5rem
            opacity: 0.25,
            animation: `fadeInOut ${Math.random() * 8 + 5}s ease-in-out infinite`,
            zIndex: 0,
          }}
        >
          {word}
        </span>
      ))}

      {/* Glowing Title */}
      <motion.h1
        className="text-[6rem] md:text-[9rem] font-extrabold text-[#ff6600] text-center drop-shadow-[0_0_20px_#ff6600aa]"
        variants={fadeInAndStay}
        initial="hidden"
        animate="visible"
      >
        <div>Setu</div>
        <div>Studios</div>
      </motion.h1>

      {/* Tagline */}
      <motion.p
        className="text-[#ff6600] text-xl md:text-3xl text-center mt-4 drop-shadow-[0_0_10px_#ff6600aa]"
        variants={fadeInAndStay}
        initial="hidden"
        animate="visible"
      >
        Your Bridge from Idea to Launch
      </motion.p>

      {/* Buttons */}
      <motion.div
        className="flex justify-center gap-6 mt-8"
        variants={fadeInAndStay}
        initial="hidden"
        animate="visible"
      >
        <motion.button
          className="px-6 py-3 bg-[#ff6600] hover:bg-[#e65c00] text-white rounded-full font-semibold transition-all duration-300"
          whileHover={{
            scale: 1.05,
            boxShadow: "0 0 12px #ff6600, 0 0 24px #ff6600",
          }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/services')}
        >
          Get Started
        </motion.button>
        <motion.button
          className="px-6 py-3 border border-[#ff6600] text-[#ff6600] hover:bg-[#ff6600] hover:text-white rounded-full font-semibold transition-all duration-300"
          whileHover={{
            scale: 1.05,
            backgroundColor: "#ff6600",
            color: "#fff",
            boxShadow: "0 0 12px #ff6600, 0 0 24px #ff6600",
          }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            const aboutSection = document.getElementById('about');
            if (aboutSection) {
              aboutSection.scrollIntoView({ behavior: 'smooth' });
            }
          }}
        >
          Learn More
        </motion.button>
      </motion.div>

      {/* About Section */}
      <section
        id="about"
        className="w-full flex flex-col items-center justify-center bg-[#10122b] py-20 px-6 mt-20 rounded-2xl shadow-lg border border-orange-500/20"
      >
        <h2 className="text-4xl md:text-5xl font-bold text-orange-500 mb-6 text-center drop-shadow-[0_0_10px_#ff6600aa]">
          About Setu Studios
        </h2>
        <p className="max-w-2xl text-center text-lg md:text-xl text-gray-300 mb-4">
          Setu Studios is your bridge from idea to launch. We empower founders and startups with AI-driven insights, hands-on execution, and a passion for turning dreams into reality. Our team combines strategy, design, development, and mentorship to help you build, validate, and scale your vision in today's fast-paced world.
        </p>
        <p className="max-w-xl text-center text-md md:text-lg text-orange-400">
          From concept to MVP and beyond, we are your partners in innovation. Let's build the future together.
        </p>
        {/* Founder Subsection */}
        <section
          id="founder"
          className="w-full flex flex-col items-center justify-center mt-16"
        >
          <h3 className="text-3xl md:text-4xl font-bold text-orange-500 mb-8 text-center drop-shadow-[0_0_8px_#ff6600aa]">
            Meet the Founder
          </h3>
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16 w-full max-w-3xl">
          <img
  src="/images/founder-setu.JPG"
  alt="E Sai Eshwar"
  className="w-48 h-48 rounded-full object-cover shadow-lg border-4 border-orange-500 z-10 bg-[#10122b]"
/>

            <div className="text-center md:text-left">
              <h4 className="text-2xl font-semibold text-white mb-2">E Sai Eshwar</h4>
              <p className="text-lg text-gray-300 max-w-md">
                E Sai Eshwar is the visionary behind Setu Studios. With a passion for empowering founders and a background in technology and entrepreneurship, he leads the team with creativity, empathy, and a relentless drive to help others turn their ideas into impactful startups.
              </p>
            </div>
          </div>
        </section>
      </section>
    </div>
  );
}

// Add smooth scrolling to the page
if (typeof window !== 'undefined') {
  document.documentElement.style.scrollBehavior = 'smooth';
}

