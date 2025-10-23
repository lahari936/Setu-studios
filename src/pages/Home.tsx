"use client";
import { motion, Variants } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useInView } from "react-intersection-observer";

const floatingWords = [
  "Founder", "Build", "Vision", "Launch", "Idea", "Dream",
  "Startup", "Team", "Code", "Prototype", "Scale", "Mission",
  "Growth", "Product", "Brand", "User", "Impact", "Beta",
  "Passion", "Bridge", "Journey", "Goal", "Pitch", "Spark",
  "Create", "Strategy", "Investor", "Problem", "Solution", "Execute"
];

// Enhanced animation variants
const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.25, 0.46, 0.45, 0.94]
    }
  }
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94]
    }
  }
};

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
  const [heroRef, heroInView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  });
  const [featuresRef, featuresInView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  });
  const [aboutRef, aboutInView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

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
      <motion.div
        ref={heroRef}
        variants={fadeInUp}
        initial="hidden"
        animate={heroInView ? "visible" : "hidden"}
        className="text-center"
      >
        <motion.h1
          className="text-[6rem] md:text-[9rem] font-extrabold text-[#ff6600] text-center drop-shadow-[0_0_20px_#ff6600aa]"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            Setu
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            Studios
          </motion.div>
        </motion.h1>
      </motion.div>

      {/* Tagline */}
      <motion.p
        className="text-[#ff6600] text-xl md:text-3xl text-center mt-4 drop-shadow-[0_0_10px_#ff6600aa]"
        initial={{ opacity: 0, y: 30 }}
        animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ delay: 0.6, duration: 0.8 }}
      >
        Your Bridge from Idea to Launch
      </motion.p>

      {/* Buttons */}
      <motion.div
        className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6 mt-8"
        initial={{ opacity: 0, y: 30 }}
        animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ delay: 0.8, duration: 0.8 }}
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
          onClick={() => navigate('/idea-analyzer')}
        >
          Analyze Your Idea
        </motion.button>
      </motion.div>

      {/* New Features Section */}
      <motion.div
        ref={featuresRef}
        className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-12 w-full max-w-4xl"
        variants={staggerContainer}
        initial="hidden"
        animate={featuresInView ? "visible" : "hidden"}
      >
        <motion.button
          className="p-4 bg-[#10122b] border border-orange-500/30 rounded-xl hover:border-orange-500 transition-all duration-300 text-center group"
          variants={scaleIn}
          whileHover={{ scale: 1.05, y: -5 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/mentorship')}
        >
          <motion.div
            className="w-12 h-12 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-orange-500/30 transition-colors"
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.5 }}
          >
            <span className="text-orange-500 text-xl">👥</span>
          </motion.div>
          <h3 className="text-orange-500 font-bold text-lg mb-2">Find Mentors</h3>
          <p className="text-gray-400 text-sm">Connect with industry experts</p>
        </motion.button>
        <motion.button
          className="p-4 bg-[#10122b] border border-orange-500/30 rounded-xl hover:border-orange-500 transition-all duration-300 text-center group"
          variants={scaleIn}
          whileHover={{ scale: 1.05, y: -5 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/blog')}
        >
          <motion.div
            className="w-12 h-12 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-orange-500/30 transition-colors"
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.5 }}
          >
            <span className="text-orange-500 text-xl">📚</span>
          </motion.div>
          <h3 className="text-orange-500 font-bold text-lg mb-2">Read Stories</h3>
          <p className="text-gray-400 text-sm">Learn from real founders</p>
        </motion.button>
        <motion.div 
          className="p-4 bg-[#10122b] border border-orange-500/30 rounded-xl transition-all duration-300 text-center group"
          variants={scaleIn}
          whileHover={{ scale: 1.05, y: -5 }}
        >
          <motion.div
            className="w-12 h-12 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-orange-500/30 transition-colors"
            animate={{ 
              boxShadow: [
                "0 0 0 0 rgba(255, 102, 0, 0.4)",
                "0 0 0 10px rgba(255, 102, 0, 0)",
                "0 0 0 0 rgba(255, 102, 0, 0)"
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <span className="text-orange-500 text-xl">🤖</span>
          </motion.div>
          <h3 className="text-orange-500 font-bold text-lg mb-2">AI Assistant</h3>
          <p className="text-gray-400 text-sm">Chat with your co-founder AI</p>
          <motion.p 
            className="text-orange-500/60 text-xs mt-2"
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            👉 Check bottom-right corner
          </motion.p>
        </motion.div>
      </motion.div>

      {/* About Section */}
      <motion.section
        ref={aboutRef}
        id="about"
        className="w-full flex flex-col items-center justify-center bg-[#10122b] py-20 px-6 mt-20 rounded-2xl shadow-lg border border-orange-500/20"
        variants={fadeInUp}
        initial="hidden"
        animate={aboutInView ? "visible" : "hidden"}
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
      </motion.section>

      {/* Collaborations Section */}
      <section className="w-full max-w-6xl mt-12 px-6 py-12 rounded-2xl bg-gradient-to-r from-white/3 to-white/2 border border-white/5">
        <h3 className="text-2xl md:text-3xl font-bold text-orange-400 text-center mb-6">Collaborations</h3>
        <p className="text-center text-gray-300 max-w-2xl mx-auto mb-6">We partner with industry leaders and innovators. Here are some of our collaborators (logos are placeholders).</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-6 items-center">
          {Array.from({length:6}).map((_,i) => (
            <div key={i} className="flex items-center justify-center p-4 bg-white/5 rounded-lg h-20">
              <img src={`https://via.placeholder.com/120x40?text=Logo+${i+1}`} alt={`logo-${i}`} className="object-contain h-10" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

// Add smooth scrolling to the page
if (typeof window !== 'undefined') {
  document.documentElement.style.scrollBehavior = 'smooth';
}

