import React from 'react';
import { motion } from 'framer-motion';
import { ParallaxHero } from "../components/parallax-hero";
import { MainContent } from "../components/main-content";
import { BookCarousel } from "../components/book-carousel";
import { Footer } from "../components/footer";
import ProfileLayoutV2 from "../components/important-peps";
import { EventBento } from "../components/event-bento";
import { Header } from '../components/header';

const animationVariants = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" }
  }
};

const LandingPage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow justify-center flex flex-col items-center">
        <motion.div
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-100px" }}
          variants={animationVariants}
          className="w-full"
        >
          <ParallaxHero />
        </motion.div>

        <motion.div
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-50px" }}
          variants={animationVariants}
          className="w-full"
        >
          <MainContent />
        </motion.div>

        <motion.div
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={animationVariants}
          className="w-full overflow-hidden relative shadow-[inset_0_2px_4px_0_rgb(0,0,0,0.05)]"
          style={{
            backgroundImage: "url('/shelf.jpg')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/30" />
          <BookCarousel />
        </motion.div>

        <motion.div
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={animationVariants}
          className="w-full"
        >
          <EventBento />
        </motion.div>

        <motion.div
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={animationVariants}
          className="w-full"
        >
          <ProfileLayoutV2 />
        </motion.div>
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;
