import React from 'react';
import Head from 'next/head';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Services from '../components/Services';
import Portfolio from '../components/Portfolio';
import About from '../components/About';
import Contact from '../components/Contact';
import Footer from '../components/Footer';
import LiveChat from '../components/LiveChat';

export default function Home() {
  return (
    <>
      <Head>
        <title>ProgrammedStyle - Professional Web Development Services</title>
        <meta
          name="description"
          content="Professional web development services. We build modern, responsive websites using React, Next.js, Node.js, and MongoDB. Transform your business with our expert solutions."
        />
        <meta
          name="keywords"
          content="web development, website design, react development, nextjs, nodejs, mongodb, custom websites, professional web design"
        />
        <meta name="author" content="ProgrammedStyle" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href="https://www.programmedstyle.com" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.programmedstyle.com/" />
        <meta property="og:title" content="ProgrammedStyle - Professional Web Development" />
        <meta
          property="og:description"
          content="We build modern, responsive websites that help businesses grow online. Expert web development services."
        />
        
        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://www.programmedstyle.com/" />
        <meta property="twitter:title" content="ProgrammedStyle - Professional Web Development" />
        <meta
          property="twitter:description"
          content="We build modern, responsive websites that help businesses grow online."
        />
      </Head>

      <Navbar />
      <main>
        <Hero />
        <Services />
        <Portfolio />
        <About />
        <Contact />
      </main>
      <Footer />
      <LiveChat />
    </>
  );
}

