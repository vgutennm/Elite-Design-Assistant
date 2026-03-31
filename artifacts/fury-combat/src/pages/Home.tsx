import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronRight, Phone, Mail, MapPin, ChevronLeft, Instagram, Linkedin, Facebook, Youtube, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const assetModules = import.meta.glob<string>('@assets/furycombat-website-photos-*', { eager: true, query: '?url', import: 'default' });

function asset(filename: string): string | undefined {
  const key = Object.keys(assetModules).find(k => k.endsWith(filename));
  return key ? assetModules[key] : undefined;
}

function Img({ src, alt, className }: { src: string | undefined; alt: string; className?: string }) {
  if (!src) return <div className={`bg-gradient-to-br from-zinc-800 via-zinc-900 to-black ${className || ''}`} />;
  return <img src={src} alt={alt} loading="lazy" className={className} />;
}

const imgHero = asset('furycombat-website-photos-005.jpg');
const imgSystem1 = asset('furycombat-website-photos-031.png');
const imgSystem2 = asset('furycombat-website-photos-021.jpg');
const imgSystem3 = asset('furycombat-website-photos-013.jpg');
const imgLegend1 = asset('furycombat-website-photos-001.jpg');
const imgLegend2 = asset('furycombat-website-photos-007.jpg');
const imgLegend3 = asset('furycombat-website-photos-010.jpg');
const imgLegend4 = asset('furycombat-website-photos-024.png');
const imgLegend5 = asset('furycombat-website-photos-034.png');
const imgPrivate1 = asset('furycombat-website-photos-017.jpg');
const imgPrivate2 = asset('furycombat-website-photos-019.jpg');
const imgPrivate3 = asset('furycombat-website-photos-040.png');

const galleryImageFiles = [
  'furycombat-website-photos-003.jpg',
  'furycombat-website-photos-008.jpg',
  'furycombat-website-photos-009.jpg',
  'furycombat-website-photos-011.jpg',
  'furycombat-website-photos-020.jpg',
  'furycombat-website-photos-023.png',
  'furycombat-website-photos-025.png',
  'furycombat-website-photos-026.png',
  'furycombat-website-photos-027.png',
  'furycombat-website-photos-028.png',
  'furycombat-website-photos-029.png',
  'furycombat-website-photos-030.png',
  'furycombat-website-photos-038.png',
  'furycombat-website-photos-039.png',
];
const galleryImages = galleryImageFiles.map(f => asset(f)).filter((v): v is string => !!v);
const imgDeco1 = asset('furycombat-website-photos-002.jpg');

const navLinks = [
  { name: 'Home', href: '#home' },
  { name: 'The System', href: '#system' },
  { name: 'The Legend', href: '#legend' },
  { name: 'Gallery', href: '#gallery' },
  { name: 'Private Instruction', href: '#instruction' },
  { name: 'FAQ', href: '#faq' },
  { name: 'Contact', href: '#contact' },
];

const services = [
  {
    title: "Private Instruction",
    price: "$250/session",
    desc: "One-on-one training tailored to your goals, experience, and preferred areas of focus. Sessions may include movement, striking, grappling, defensive positioning, situational awareness, tactical response, pressure-point application, and controlled performance under stress.",
    isWorkshop: false
  },
  {
    title: "Advanced Tactical Instruction",
    price: "$500/session",
    desc: "A more elevated private offering for serious individuals seeking instruction in readiness, tactical thinking, awareness under pressure, protective movement, weapons familiarity, reconnaissance concepts, and strategic response.",
    isWorkshop: false
  },
  {
    title: "Women's Private Safety Training",
    price: "$300/session",
    desc: "Private instruction designed to help women strengthen awareness, confidence, prevention skills, de-escalation ability, escape options, and decisive real-world response.",
    isWorkshop: false
  },
  {
    title: "Tactical Conditioning",
    price: "$150/session",
    desc: "A private training experience that combines conditioning, coordination, movement, reaction, and practical defensive drills.",
    isWorkshop: false
  },
  {
    title: "Young Adult Readiness Training",
    price: "$225/session",
    desc: "Private instruction for young adults preparing for college, commuting, travel, city life, or greater independence.",
    isWorkshop: false
  },
  {
    title: "Executive Readiness",
    price: "$400/session",
    desc: "A premium private training offering for executives, entrepreneurs, professionals, and public-facing individuals who value preparedness, discretion, awareness, and self-command.",
    isWorkshop: false
  },
  {
    title: "Family Protection Session",
    price: "$350/session",
    desc: "A private session for individuals or families focused on practical awareness, protective habits, emergency thinking, and everyday readiness.",
    isWorkshop: false
  },
  {
    title: "Private Workshops",
    price: "Starting at $1,500",
    desc: "Private workshops for companies, organizations, leadership teams, women's groups, and select audiences seeking a refined, practical training experience in awareness, de-escalation, readiness, and personal protection principles.",
    isWorkshop: true
  }
];

const faqs = [
  {
    q: "What is Fury Combat Systems?",
    a: "Fury Combat Systems is a Brooklyn-based private martial arts and tactical training brand built around the Fury System developed by Grandmaster Dr. David Furie."
  },
  {
    q: "Who is David Furie?",
    a: "David Furie is a 10th degree black belt / dan, retired Secret Service Operative, former Special Forces member, world champion fighter, and International Combat Martial Arts Master."
  },
  {
    q: "What kind of training does Fury Combat offer?",
    a: "Fury Combat focuses on private instruction in practical self-protection, hand-to-hand skill, tactical awareness, conditioning, and readiness for real-world situations."
  },
  {
    q: "Are classes group classes or private lessons?",
    a: "At this time, Fury Combat offers private lessons and private workshops only."
  },
  {
    q: "Where is Fury Combat Systems located?",
    a: "Fury Combat Systems is based in Brooklyn, New York, at 24 Cobek Ct, Brooklyn, NY 11223."
  },
  {
    q: "How do I contact David Furie?",
    a: "You can contact David directly by phone at (917) 340-2911 or by email at david.furie@gmail.com."
  },
  {
    q: "Who is private instruction for?",
    a: "Private instruction is for serious clients seeking personalized, founder-led training in awareness, readiness, protective skill, and real-world application."
  },
  {
    q: "Is the Fury System only for sport fighting?",
    a: "No. The Fury System is positioned around practical self-protection and readiness for real-life situations, with self-protection first and combat second."
  }
];

export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);
  
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (lightboxIndex === null) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') setLightboxIndex((prev) => (prev !== null && prev < galleryImages.length - 1 ? prev + 1 : prev));
    if (e.key === 'ArrowLeft') setLightboxIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : prev));
  }, [lightboxIndex]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30">
      <div className="fixed inset-0 z-[-1] bg-noise"></div>

      {/* Navigation */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-background/90 backdrop-blur-md border-b border-white/5 py-4' : 'bg-transparent py-6'}`}>
        <div className="container mx-auto px-6 flex items-center justify-between">
          <a href="#home" className="flex items-center gap-2 group">
            <span className="font-serif text-2xl font-bold tracking-widest text-white group-hover:text-primary transition-colors">FURY<span className="text-primary group-hover:text-white transition-colors">COMBAT</span></span>
          </a>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <a key={link.name} href={link.href} className="text-sm font-medium text-white/70 hover:text-white transition-colors uppercase tracking-widest">
                {link.name}
              </a>
            ))}
            <Button asChild variant="outline" className="border-primary/50 text-white hover:bg-primary hover:text-white rounded-none tracking-widest uppercase text-xs">
              <a href="#contact">Inquire Now</a>
            </Button>
          </nav>

          {/* Mobile Toggle */}
          <button className="lg:hidden text-white p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-background/95 backdrop-blur-xl pt-24 pb-8 px-6 flex flex-col"
          >
            <nav className="flex flex-col gap-6 text-center mt-12">
              {navLinks.map((link) => (
                <a 
                  key={link.name} 
                  href={link.href} 
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-xl font-serif text-white/80 hover:text-primary transition-colors uppercase tracking-widest"
                >
                  {link.name}
                </a>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HERO SECTION */}
      <section id="home" className="relative min-h-[100dvh] flex items-center pt-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          {imgHero ? (
            <img src={imgHero} alt="Grandmaster Dr. David Furie" className="w-full h-full object-cover object-center opacity-40" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-zinc-900 via-zinc-800 to-black" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-background/20" />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/50 to-transparent" />
        </div>

        <div className="container relative z-10 px-6 mx-auto">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="max-w-3xl"
          >
            <motion.div variants={fadeInUp} className="mb-4 inline-block px-3 py-1 border border-primary/30 bg-primary/10 text-primary text-xs font-semibold tracking-[0.2em] uppercase">
              Elite Private Training in Brooklyn
            </motion.div>
            <motion.h1 variants={fadeInUp} className="text-5xl md:text-7xl lg:text-8xl font-black font-serif uppercase leading-[0.9] mb-6 tracking-tighter">
              Fury Combat <br/><span className="text-transparent border-text" style={{ WebkitTextStroke: '2px hsl(var(--primary))'}}>Systems</span>
            </motion.h1>
            <motion.p variants={fadeInUp} className="text-lg md:text-xl text-white/80 leading-relaxed mb-8 max-w-2xl font-light">
              Train privately with Grandmaster Dr. David Furie in personal readiness, tactical awareness, practical self-protection, and high-level instruction designed for real-world application.
            </motion.p>
            <motion.p variants={fadeInUp} className="text-base text-white/60 mb-10 max-w-2xl">
              Fury Combat offers private instruction for individuals seeking more than a standard martial arts class. Each session is designed around the client's goals, lifestyle, and level of experience, with a focus on practical skill, confidence, awareness, conditioning, and readiness under pressure.
            </motion.p>
            
            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-white rounded-none px-8 font-semibold tracking-widest uppercase">
                <a href="tel:9173402911">Inquire by Phone</a>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/5 rounded-none px-8 font-semibold tracking-widest uppercase">
                <a href="mailto:david.furie@gmail.com">Inquire by Email</a>
              </Button>
              <Button asChild size="lg" variant="ghost" className="text-white hover:text-primary hover:bg-transparent rounded-none px-8 font-semibold tracking-widest uppercase">
                <a href="https://www.google.com/maps/search/?api=1&query=Fury+Combat+Systems+24+Cobeck+Ct+Brooklyn+NY+11223" target="_blank" rel="noreferrer">Get Directions</a>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* AUTHORITY STRIP */}
      <div className="border-y border-white/5 bg-black/50 py-8 relative z-20">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-x divide-white/5">
            <div className="px-4">
              <div className="text-primary font-serif font-bold text-xl md:text-2xl mb-1">10th Dan</div>
              <div className="text-xs text-white/50 uppercase tracking-widest">Grandmaster</div>
            </div>
            <div className="px-4">
              <div className="text-primary font-serif font-bold text-xl md:text-2xl mb-1">Operative</div>
              <div className="text-xs text-white/50 uppercase tracking-widest">Former Special Forces</div>
            </div>
            <div className="px-4">
              <div className="text-primary font-serif font-bold text-xl md:text-2xl mb-1">Champion</div>
              <div className="text-xs text-white/50 uppercase tracking-widest">World Fighter</div>
            </div>
            <div className="px-4">
              <div className="text-primary font-serif font-bold text-xl md:text-2xl mb-1">Brooklyn</div>
              <div className="text-xs text-white/50 uppercase tracking-widest">Private Instruction</div>
            </div>
          </div>
        </div>
      </div>

      {/* INTRO */}
      <section className="py-24 bg-background relative overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto text-center"
          >
            <p className="text-xl md:text-3xl font-serif leading-tight text-white/90">
              Fury Combat Systems is a Brooklyn-based private training brand led by Grandmaster Dr. David Furie. The Fury System blends practical hand-to-hand instruction, tactical awareness, strategic thinking, and personal readiness for clients who want real-world capability—not generic training.
            </p>
          </motion.div>
        </div>
      </section>

      {/* THE SYSTEM */}
      <section id="system" className="py-24 bg-zinc-950 relative border-t border-white/5">
        <div className="absolute right-0 top-0 w-1/3 h-full opacity-10 pointer-events-none">
          <Img src={imgDeco1} alt="Texture" className="w-full h-full object-cover mix-blend-overlay" />
        </div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
            >
              <motion.h2 variants={fadeInUp} className="text-4xl md:text-6xl font-serif font-bold uppercase mb-8 text-white">The System</motion.h2>
              <motion.p variants={fadeInUp} className="text-lg text-white/70 mb-6 font-light leading-relaxed">
                The Fury System is an innovative combat martial arts system that blends techniques, tactics, and strategic thinking from multiple disciplines into one practical method. It is built for modern self-protection, close-quarter readiness, tactical awareness, and real-world application.
              </motion.p>
              <motion.p variants={fadeInUp} className="text-lg text-white/70 mb-10 font-light leading-relaxed">
                In the original system language, FURY breaks into two symbolic elements: Wind and Spirit. Wind represents motivation, hard work, and discipline. Spirit represents heart, ambition, and devotion to the path. Together, they define the physical and mental foundation of the system.
              </motion.p>
              
              <motion.div variants={fadeInUp} className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8">
                {[
                  "Self-protection first. Combat second.",
                  "Real-world readiness",
                  "Hand-to-hand skill",
                  "Tactical awareness",
                  "Mental discipline",
                  "Emotional control under pressure",
                  "Improvised environmental awareness"
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <ChevronRight className="text-primary mt-1 flex-shrink-0" size={16} />
                    <span className="text-white/80 text-sm font-medium tracking-wide">{item}</span>
                  </div>
                ))}
              </motion.div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative grid grid-cols-2 gap-4"
            >
              <div className="col-span-2 relative aspect-video overflow-hidden">
                <Img src={imgSystem1} alt="The Fury System" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" />
                <div className="absolute inset-0 border border-white/10" />
              </div>
              <div className="relative aspect-square overflow-hidden mt-4">
                <Img src={imgSystem2} alt="Training Detail" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" />
                <div className="absolute inset-0 border border-white/10" />
              </div>
              <div className="relative aspect-square overflow-hidden mt-4">
                <Img src={imgSystem3} alt="System Detail" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" />
                <div className="absolute inset-0 border border-white/10" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* THE LEGEND: DAVID FURIE */}
      <section id="legend" className="py-32 relative bg-background">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-24">
            <motion.div 
              className="lg:col-span-5 relative"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="sticky top-32">
                <div className="relative overflow-hidden mb-6 aspect-[3/4]">
                  <Img src={imgLegend1} alt="Grandmaster Dr. David Furie" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 shadow-[inset_0_0_100px_rgba(0,0,0,0.8)] pointer-events-none" />
                </div>
                <div className="flex gap-4">
                  <Img src={imgLegend2} alt="David Furie Action" className="w-1/2 aspect-square object-cover grayscale opacity-70 hover:opacity-100 transition-opacity" />
                  <Img src={imgLegend4} alt="David Furie Seminar" className="w-1/2 aspect-square object-cover grayscale opacity-70 hover:opacity-100 transition-opacity" />
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              className="lg:col-span-7 flex flex-col justify-center"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
            >
              <motion.div variants={fadeInUp} className="mb-4 inline-block text-primary text-sm font-bold tracking-[0.3em] uppercase">
                The Legend
              </motion.div>
              <motion.h2 variants={fadeInUp} className="text-5xl md:text-7xl font-serif font-black uppercase mb-10 text-white leading-none">
                David Furie
              </motion.h2>
              
              <div className="space-y-8 text-lg md:text-xl text-white/70 font-light leading-relaxed">
                <motion.p variants={fadeInUp} className="text-white/90 font-medium">
                  Grandmaster Dr. David Furie is a 10th degree black belt / dan, a retired Secret Service Operative, a former member of the military's elite Special Forces unit, a world champion fighter, and an International Combat Martial Arts Master.
                </motion.p>
                <motion.p variants={fadeInUp}>
                  He developed the Fury System to reflect the evolution of combat for the modern world—training that sharpens not only physical capability, but also mental toughness, emotional control, and readiness under pressure.
                </motion.p>
                <motion.p variants={fadeInUp}>
                  For those seeking direct access to high-level instruction shaped by decades of experience, Fury Combat offers a rare private training environment grounded in real-world application.
                </motion.p>
                <motion.p variants={fadeInUp}>
                  Across seminars, public appearances, martial arts events, and private instruction, David has built a presence that reflects discipline, recognition, and lifelong commitment to the path of combat arts and personal readiness.
                </motion.p>
              </div>

              <motion.div variants={fadeInUp} className="mt-12 pt-12 border-t border-white/10 flex items-center gap-6">
                 {imgLegend5 && <img src={imgLegend5} alt="Certificate/Award" className="h-24 w-auto object-contain opacity-50 grayscale" />}
                 {imgLegend3 && <img src={imgLegend3} alt="Action Shot" className="h-24 w-auto object-contain opacity-50 grayscale" />}
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* GALLERY */}
      <section id="gallery" className="py-24 bg-zinc-950 border-y border-white/5">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mb-16">
            <h2 className="text-4xl md:text-5xl font-serif font-bold uppercase mb-6 text-white">Gallery</h2>
            <p className="text-xl text-white/60 font-light">
              A closer look at Fury Combat Systems, Grandmaster David Furie, public appearances, training moments, events, and the visual identity behind the Fury System.
            </p>
          </div>

          {galleryImages.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {galleryImages.map((src, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.05 }}
                  className={`relative overflow-hidden cursor-pointer group ${idx === 0 || idx === 7 ? 'md:col-span-2 md:row-span-2' : 'aspect-square'}`}
                  onClick={() => openLightbox(idx)}
                >
                  <img 
                    src={src} 
                    alt={`Fury Combat Gallery ${idx + 1}`} 
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 group-hover:opacity-80" 
                  />
                  <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/20 transition-colors duration-300" />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, idx) => (
                <div key={idx} className={`relative overflow-hidden ${idx === 0 || idx === 7 ? 'md:col-span-2 md:row-span-2' : 'aspect-square'}`}>
                  <div className="w-full h-full bg-gradient-to-br from-zinc-800 via-zinc-900 to-black border border-white/5 flex items-center justify-center">
                    <span className="text-white/20 text-xs uppercase tracking-widest">Photo</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* LIGHTBOX */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 backdrop-blur-sm"
            onClick={closeLightbox}
          >
            <button className="absolute top-6 right-6 text-white/50 hover:text-white p-2" onClick={closeLightbox}>
              <X size={32} />
            </button>
            
            <button 
              className="absolute left-6 top-1/2 -translate-y-1/2 text-white/50 hover:text-white p-4 hidden md:block" 
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIndex(prev => prev !== null && prev > 0 ? prev - 1 : prev);
              }}
            >
              <ChevronLeft size={48} />
            </button>

            <motion.img 
              key={lightboxIndex}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              src={galleryImages[lightboxIndex]} 
              alt="Gallery Enlarged" 
              className="max-h-[90vh] max-w-[90vw] object-contain shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />

            <button 
              className="absolute right-6 top-1/2 -translate-y-1/2 text-white/50 hover:text-white p-4 hidden md:block" 
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIndex(prev => prev !== null && prev < galleryImages.length - 1 ? prev + 1 : prev);
              }}
            >
              <ChevronRight size={48} />
            </button>
            
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/50 tracking-widest text-sm font-mono">
              {lightboxIndex + 1} / {galleryImages.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* PRIVATE INSTRUCTION */}
      <section id="instruction" className="py-32 bg-background relative">
        <div className="absolute left-0 top-1/4 w-64 h-64 bg-primary/5 blur-[150px] pointer-events-none rounded-full"></div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center max-w-4xl mx-auto mb-20">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-6xl font-serif font-bold uppercase mb-4 text-white">Private Instruction</h2>
              <div className="text-primary font-bold tracking-widest uppercase text-sm mb-8">Elite Private Training with Grandmaster Dr. David Furie</div>
              <p className="text-lg text-white/70 font-light leading-relaxed">
                Fury Combat offers a private training experience for individuals seeking a higher standard of instruction in personal readiness, protective skill, physical conditioning, and situational control. Each session is tailored to the individual and designed around specific goals, background, lifestyle, and level of experience. Training is discreet, personalized, and grounded in real-world application. Training is currently available by private lesson and private workshop only.
              </p>
            </motion.div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="group relative bg-zinc-900/50 border border-white/10 p-8 hover:border-primary/50 transition-colors flex flex-col h-full"
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <h3 className="text-xl font-serif font-bold text-white mb-2 pr-12">{service.title}</h3>
                <div className="text-primary font-mono text-sm font-bold mb-6">{service.price}</div>
                <p className="text-white/60 text-sm leading-relaxed mb-8 flex-grow">
                  {service.desc}
                </p>
                
                <div className="flex flex-col gap-3 mt-auto">
                  <Button asChild variant="outline" className="w-full justify-center border-white/20 hover:border-primary hover:bg-primary/10 rounded-none tracking-widest text-xs uppercase">
                    <a href="tel:9173402911">{service.isWorkshop ? 'Request a Private Workshop' : 'Inquire by Phone'}</a>
                  </Button>
                  <Button asChild variant="ghost" className="w-full justify-center text-white/50 hover:text-white rounded-none tracking-widest text-xs uppercase">
                    <a href="mailto:david.furie@gmail.com">{service.isWorkshop ? 'Contact David' : 'Inquire by Email'}</a>
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
          
          <div className="mt-16 grid md:grid-cols-3 gap-4">
            <Img src={imgPrivate1} alt="Training" className="w-full h-64 object-cover grayscale opacity-50 border border-white/10" />
            <Img src={imgPrivate2} alt="Training" className="w-full h-64 object-cover grayscale opacity-50 border border-white/10" />
            <Img src={imgPrivate3} alt="Training" className="w-full h-64 object-cover grayscale opacity-50 border border-white/10" />
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="py-32 bg-zinc-950 border-t border-white/5 relative">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-6xl font-serif font-bold uppercase mb-4 text-white">Contact</h2>
              <div className="text-primary font-bold tracking-widest uppercase text-sm mb-8">Inquire About Private Training</div>
              <p className="text-lg text-white/70 font-light mb-12">
                All Fury Combat instruction is currently offered by private lesson or private workshop only.
              </p>

              <div className="space-y-8 mb-12">
                <a href="tel:9173402911" className="flex items-center gap-6 group">
                  <div className="w-14 h-14 rounded-full border border-white/10 flex items-center justify-center group-hover:border-primary group-hover:bg-primary/10 transition-colors">
                    <Phone className="text-white group-hover:text-primary transition-colors" />
                  </div>
                  <div>
                    <div className="text-sm text-white/50 uppercase tracking-widest mb-1">Call Directly</div>
                    <div className="text-xl font-serif text-white">(917) 340-2911</div>
                  </div>
                </a>
                <a href="mailto:david.furie@gmail.com" className="flex items-center gap-6 group">
                  <div className="w-14 h-14 rounded-full border border-white/10 flex items-center justify-center group-hover:border-primary group-hover:bg-primary/10 transition-colors">
                    <Mail className="text-white group-hover:text-primary transition-colors" />
                  </div>
                  <div>
                    <div className="text-sm text-white/50 uppercase tracking-widest mb-1">Email David</div>
                    <div className="text-xl font-serif text-white">david.furie@gmail.com</div>
                  </div>
                </a>
                <a href="https://www.google.com/maps/search/?api=1&query=Fury+Combat+Systems+24+Cobeck+Ct+Brooklyn+NY+11223" target="_blank" rel="noreferrer" className="flex items-center gap-6 group">
                  <div className="w-14 h-14 rounded-full border border-white/10 flex items-center justify-center group-hover:border-primary group-hover:bg-primary/10 transition-colors">
                    <MapPin className="text-white group-hover:text-primary transition-colors" />
                  </div>
                  <div>
                    <div className="text-sm text-white/50 uppercase tracking-widest mb-1">Location</div>
                    <div className="text-xl font-serif text-white">24 Cobek Ct<br/>Brooklyn, NY 11223</div>
                  </div>
                </a>
              </div>

              <div className="flex gap-4">
                <Button asChild variant="outline" className="border-white/20 hover:border-primary rounded-none tracking-widest text-xs uppercase h-12 px-6">
                  <a href="https://www.google.com/maps/search/?api=1&query=Fury+Combat+Systems+24+Cobeck+Ct+Brooklyn+NY+11223" target="_blank" rel="noreferrer">Get Directions</a>
                </Button>
                <Button asChild className="bg-primary hover:bg-primary/90 text-white rounded-none tracking-widest text-xs uppercase h-12 px-6">
                  <a href="https://search.google.com/local/writereview?placeid=ChIJK3bJOxJGwokRWkZSVj7DV5s" target="_blank" rel="noreferrer">Leave a Google Review</a>
                </Button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-black border border-white/10 p-8 md:p-10"
            >
              <h3 className="text-2xl font-serif font-bold text-white mb-8">Send an Inquiry</h3>
              <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest text-white/50">Name</label>
                    <Input className="bg-zinc-900 border-white/10 rounded-none focus-visible:ring-primary h-12" placeholder="Your Name" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest text-white/50">Phone</label>
                    <Input type="tel" className="bg-zinc-900 border-white/10 rounded-none focus-visible:ring-primary h-12" placeholder="Your Phone Number" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-white/50">Email</label>
                  <Input type="email" className="bg-zinc-900 border-white/10 rounded-none focus-visible:ring-primary h-12" placeholder="Your Email Address" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-white/50">Interested In</label>
                  <Select>
                    <SelectTrigger className="bg-zinc-900 border-white/10 rounded-none focus-visible:ring-primary h-12">
                      <SelectValue placeholder="Select a program" />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-900 border-white/10 rounded-none text-white">
                      {services.map((s, i) => (
                        <SelectItem key={i} value={s.title} className="hover:bg-primary/20 cursor-pointer">{s.title}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-white/50">Message</label>
                  <Textarea className="bg-zinc-900 border-white/10 rounded-none focus-visible:ring-primary min-h-[120px] resize-none" placeholder="Tell us about your background and goals..." />
                </div>
                <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white rounded-none h-14 tracking-widest font-bold uppercase mt-4">
                  Submit Inquiry
                </Button>
              </form>
              
              <div className="mt-8 pt-8 border-t border-white/10 text-center flex flex-col items-center gap-3">
                <div className="flex gap-1 text-yellow-500">
                  <Star size={16} fill="currentColor" />
                  <Star size={16} fill="currentColor" />
                  <Star size={16} fill="currentColor" />
                  <Star size={16} fill="currentColor" />
                  <Star size={16} fill="currentColor" />
                </div>
                <p className="text-sm text-white/50 italic">
                  Trained with David? Please leave Fury Combat Systems a Google review.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-32 bg-background border-t border-white/5">
        <div className="container mx-auto px-6 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-serif font-bold uppercase text-white mb-4">FAQ</h2>
            <div className="text-primary font-bold tracking-widest uppercase text-sm">Frequently Asked Questions</div>
          </motion.div>

          <Accordion type="single" collapsible className="w-full space-y-4">
            {faqs.map((faq, idx) => (
              <AccordionItem key={idx} value={`item-${idx}`} className="border border-white/10 bg-zinc-900/30 px-6 data-[state=open]:border-primary/50 transition-colors">
                <AccordionTrigger className="text-left font-serif text-lg text-white hover:text-primary hover:no-underline py-6">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-white/60 leading-relaxed pb-6">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-black py-20 border-t border-white/10">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-12 lg:gap-8 mb-16">
            <div className="md:col-span-2">
              <a href="#home" className="inline-block font-serif text-2xl font-bold tracking-widest text-white mb-6">
                FURY<span className="text-primary">COMBAT</span>
              </a>
              <p className="text-white/50 text-sm max-w-sm leading-relaxed mb-8">
                Private lessons and private workshops by inquiry only. Elite private martial arts and tactical training based in Brooklyn, NY.
              </p>
              <div className="flex gap-4">
                <a href="https://www.facebook.com/furycombatbrooklyn/" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white hover:bg-primary hover:border-primary transition-colors">
                  <Facebook size={18} />
                </a>
                <a href="https://www.instagram.com/david.furie/" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white hover:bg-primary hover:border-primary transition-colors">
                  <Instagram size={18} />
                </a>
                <a href="https://www.linkedin.com/in/david-furie-17091548/" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white hover:bg-primary hover:border-primary transition-colors">
                  <Linkedin size={18} />
                </a>
                <a href="https://www.youtube.com/channel/UC1bJFJVjk-0AqvfVAj18IOg" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white hover:bg-primary hover:border-primary transition-colors">
                  <Youtube size={18} />
                </a>
              </div>
            </div>

            <div>
              <h4 className="text-white font-bold tracking-widest uppercase text-sm mb-6">Navigation</h4>
              <ul className="space-y-4">
                {navLinks.map(link => (
                  <li key={link.name}>
                    <a href={link.href} className="text-white/50 hover:text-primary text-sm transition-colors">{link.name}</a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold tracking-widest uppercase text-sm mb-6">Contact Info</h4>
              <ul className="space-y-4">
                <li>
                  <a href="tel:9173402911" className="text-white/50 hover:text-primary text-sm transition-colors block">(917) 340-2911</a>
                </li>
                <li>
                  <a href="mailto:david.furie@gmail.com" className="text-white/50 hover:text-primary text-sm transition-colors block break-words">david.furie@gmail.com</a>
                </li>
                <li className="text-white/50 text-sm">
                  24 Cobek Ct<br/>Brooklyn, NY 11223
                </li>
                <li className="pt-2">
                  <a href="https://www.google.com/maps/search/?api=1&query=Fury+Combat+Systems+24+Cobeck+Ct+Brooklyn+NY+11223" target="_blank" rel="noreferrer" className="text-primary hover:text-white text-sm font-semibold transition-colors flex items-center gap-1">
                    Get Directions <ChevronRight size={14} />
                  </a>
                </li>
                <li className="pt-2">
                  <a href="https://search.google.com/local/writereview?placeid=ChIJK3bJOxJGwokRWkZSVj7DV5s" target="_blank" rel="noreferrer" className="text-primary hover:text-white text-sm font-semibold transition-colors flex items-center gap-1">
                    Leave a Google Review <ChevronRight size={14} />
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-white/30 text-xs">
              &copy; {new Date().getFullYear()} Fury Combat Systems. All rights reserved.
            </p>
            <p className="text-white/30 text-xs">
              <a href="https://furycombat.com" className="hover:text-white transition-colors">furycombat.com</a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}