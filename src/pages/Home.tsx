"use client";
import { motion, Variants } from "framer-motion";
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useInView } from "react-intersection-observer";

const floatingWords = [
  "Founder", "Build", "Vision", "Launch", "Idea", "Dream",
  "Startup", "Team", "Code", "Scale", "Growth", "Impact"
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
  const cursorRef = useRef<HTMLDivElement | null>(null);
  const shape1Ref = useRef<HTMLDivElement | null>(null);
  const shape2Ref = useRef<HTMLDivElement | null>(null);
  const shape3Ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let rafId = 0;
    const lerp = (a: number, b: number, n: number) => a + (b - a) * n;

    const state = {
      cursor: { x: 0, y: 0 },
      s1: { x: 0, y: 0 },
      s2: { x: 0, y: 0 },
      s3: { x: 0, y: 0 },
      target: { x: window.innerWidth / 2, y: window.innerHeight / 2 }
    } as const;

    const onMove = (e: MouseEvent) => {
      // update target to follow mouse
      // @ts-expect-error - readonly narrowed above for safety, we mutate here intentionally
      state.target.x = e.clientX;
      // @ts-expect-error
      state.target.y = e.clientY;
    };

    const tick = () => {
      // smooth follow with different easing factors
      // @ts-expect-error
      state.cursor.x = lerp(state.cursor.x, state.target.x, 0.35);
      // @ts-expect-error
      state.cursor.y = lerp(state.cursor.y, state.target.y, 0.35);
      // @ts-expect-error
      state.s1.x = lerp(state.s1.x, state.target.x, 0.18);
      // @ts-expect-error
      state.s1.y = lerp(state.s1.y, state.target.y, 0.18);
      // @ts-expect-error
      state.s2.x = lerp(state.s2.x, state.target.x, 0.12);
      // @ts-expect-error
      state.s2.y = lerp(state.s2.y, state.target.y, 0.12);
      // @ts-expect-error
      state.s3.x = lerp(state.s3.x, state.target.x, 0.08);
      // @ts-expect-error
      state.s3.y = lerp(state.s3.y, state.target.y, 0.08);

      if (cursorRef.current) {
        // @ts-expect-error
        cursorRef.current.style.transform = `translate3d(${state.cursor.x}px, ${state.cursor.y}px, 0)`;
      }
      if (shape1Ref.current) {
        // @ts-expect-error
        shape1Ref.current.style.transform = `translate3d(${state.s1.x}px, ${state.s1.y}px, 0)`;
      }
      if (shape2Ref.current) {
        // @ts-expect-error
        shape2Ref.current.style.transform = `translate3d(${state.s2.x}px, ${state.s2.y}px, 0)`;
      }
      if (shape3Ref.current) {
        // @ts-expect-error
        shape3Ref.current.style.transform = `translate3d(${state.s3.x}px, ${state.s3.y}px, 0)`;
      }

      rafId = requestAnimationFrame(tick);
    };

    window.addEventListener('mousemove', onMove);
    rafId = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(rafId);
    };
  }, []);
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
    <div className="relative w-full min-h-screen bg-gradient-to-br from-orange-900 via-orange-800 to-stone-900 overflow-hidden flex flex-col items-center justify-center px-6 cursor-none">

      {/* Parallax Orange Shapes Background */}
      <div className="pointer-events-none absolute inset-0">
        <div
          ref={shape1Ref}
          className="absolute rounded-full mix-blend-screen"
          style={{
            width: 650,
            height: 650,
            marginLeft: -325,
            marginTop: -325,
            background: '#ff7a18',
            filter: 'blur(10px)',
            left: 0,
            top: 0,
            willChange: 'transform',
          }}
        />
        <div
          ref={shape2Ref}
          className="absolute rounded-full mix-blend-screen"
          style={{
            width: 440,
            height: 440,
            marginLeft: -220,
            marginTop: -220,
            background: '#ffd5bf',
            filter: 'blur(16px)',
            left: 0,
            top: 0,
            willChange: 'transform',
          }}
        />
        <div
          ref={shape3Ref}
          className="absolute rounded-full mix-blend-screen"
          style={{
            width: 270,
            height: 270,
            marginLeft: -135,
            marginTop: -135,
            background: '#ffb347',
            filter: 'blur(20px)',
            left: 0,
            top: 0,
            willChange: 'transform',
          }}
        />
        <div className="absolute inset-0 bg-white mix-blend-screen" />
      </div>

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
          className="text-[6rem] md:text-[9rem] font-extrabold gradient-text-entrepreneur text-center text-shadow-glow animate-innovation-pulse"
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
        className="gradient-text-orange text-xl md:text-3xl text-center mt-4 text-shadow-glow"
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
          className="px-8 py-4 bg-white text-orange-500 rounded-full font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
          whileHover={{
            scale: 1.05,
            boxShadow: "0 0 20px rgba(255, 255, 255, 0.6), 0 0 40px rgba(255, 255, 255, 0.4)",
          }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/services')}
        >
          Get Started
        </motion.button>
        <motion.button
          className="px-8 py-4 bg-orange-500 text-white rounded-full font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
          whileHover={{
            scale: 1.05,
            boxShadow: "0 0 20px rgba(249, 115, 22, 0.6), 0 0 40px rgba(249, 115, 22, 0.4)",
          }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/idea-analyzer')}
        >
          Analyze Your Idea
        </motion.button>
      </motion.div>

      {/* Enhanced Features Section */}
      <motion.div
        ref={featuresRef}
        className="modern-grid-3 mt-16 w-full max-w-6xl"
        variants={staggerContainer}
        initial="hidden"
        animate={featuresInView ? "visible" : "hidden"}
      >
        <motion.button
          className="modern-card p-8 text-center group"
          variants={scaleIn}
          whileHover={{ scale: 1.05, y: -8 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/mentorship')}
        >
          <motion.div
            className="w-16 h-16 bg-gradient-to-r from-orange-primary to-orange-secondary rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:from-orange-secondary group-hover:to-orange-primary transition-all duration-300 shadow-lg"
            whileHover={{ rotate: 360, scale: 1.1 }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-white text-2xl">👥</span>
          </motion.div>
          <h3 className="gradient-text font-bold text-xl mb-3">Find Mentors</h3>
          <p className="text-gray-400 text-sm leading-relaxed">Connect with industry experts and get personalized guidance for your startup journey</p>
        </motion.button>
        
        <motion.button
          className="modern-card p-8 text-center group"
          variants={scaleIn}
          whileHover={{ scale: 1.05, y: -8 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/blog')}
        >
          <motion.div
            className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:from-pink-500 group-hover:to-purple-500 transition-all duration-300 shadow-lg"
            whileHover={{ rotate: 360, scale: 1.1 }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-white text-2xl">📚</span>
          </motion.div>
          <h3 className="gradient-text-purple font-bold text-xl mb-3">Read Stories</h3>
          <p className="text-gray-400 text-sm leading-relaxed">Learn from real founders and discover insights that can accelerate your success</p>
        </motion.button>
        
        <motion.div 
          className="modern-card p-8 text-center group"
          variants={scaleIn}
          whileHover={{ scale: 1.05, y: -8 }}
        >
          <motion.div
            className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-neon-glow shadow-lg"
            animate={{ 
              boxShadow: [
                "0 0 0 0 rgba(59, 130, 246, 0.4)",
                "0 0 0 15px rgba(59, 130, 246, 0)",
                "0 0 0 0 rgba(59, 130, 246, 0)"
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <span className="text-white text-2xl">🤖</span>
          </motion.div>
          <h3 className="gradient-text-blue font-bold text-xl mb-3">AI Assistant</h3>
          <p className="text-gray-400 text-sm leading-relaxed mb-3">Chat with your co-founder AI for instant insights and guidance</p>
          <motion.p 
            className="gradient-text-blue text-xs font-medium"
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            👉 Check bottom-right corner
          </motion.p>
        </motion.div>
      </motion.div>

      {/* Enhanced About Section */}
      <motion.section
        ref={aboutRef}
        id="about"
        className="w-full max-w-6xl modern-card py-16 px-8 mt-20"
        variants={fadeInUp}
        initial="hidden"
        animate={aboutInView ? "visible" : "hidden"}
      >
        <div className="text-center">
          <h2 className="text-4xl md:text-5xl font-bold gradient-text mb-8 text-shadow-glow">
            About Setu Studios
          </h2>
          <div className="max-w-4xl mx-auto space-y-6">
            <p className="text-lg md:text-xl text-gray-300 leading-relaxed">
              Setu Studios is your bridge from idea to launch. We empower founders and startups with AI-driven insights, hands-on execution, and a passion for turning dreams into reality. Our team combines strategy, design, development, and mentorship to help you build, validate, and scale your vision in today's fast-paced world.
            </p>
            <p className="text-md md:text-lg gradient-text-orange font-semibold">
              From concept to MVP and beyond, we are your partners in innovation. Let's build the future together.
            </p>
          </div>
        </div>
      </motion.section>

      {/* Enhanced Collaborations Section */}
      <section className="w-full max-w-6xl mt-16 modern-card py-12 px-8">
        <div className="text-center mb-12">
          <h3 className="text-3xl md:text-4xl font-bold gradient-text mb-4">Our Partners</h3>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto">We partner with industry leaders and innovators to bring you the best resources and opportunities.</p>
        </div>
        <div className="modern-grid-4">
          {Array.from({length:6}).map((_,i) => (
            <motion.div 
              key={i} 
              className="flex items-center justify-center p-6 modern-card h-24 hover-lift"
              whileHover={{ scale: 1.05, y: -5 }}
              transition={{ duration: 0.3 }}
            >
              <div className="w-32 h-12 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg flex items-center justify-center">
                <span className="text-gray-600 font-semibold text-sm">Partner {i+1}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
      {/* Custom Cursor */}
      <div
        ref={cursorRef}
        className="fixed rounded-full pointer-events-none z-[10000]"
        style={{
          width: 20,
          height: 20,
          marginLeft: -10,
          marginTop: -10,
          background: '#ff7a18',
          willChange: 'transform',
        }}
      />
    </div>
  );
}

// Add smooth scrolling to the page
if (typeof window !== 'undefined') {
  document.documentElement.style.scrollBehavior = 'smooth';
}

