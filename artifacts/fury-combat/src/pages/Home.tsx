import { useState, useEffect, useCallback } from 'react';
import { Link } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Phone, Mail, MapPin, ChevronLeft, Star, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { serviceRoutes, categories, categoryOrder, type ServiceCategory } from '@/data/services';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import ReviewsSection from '@/components/ReviewsSection';
import logoUfc from '@assets/trusted/ufc.png';
import logoMarines from '@assets/trusted/marines.jpg';
import logoArmy from '@assets/trusted/army.jpg';
import logoNavy from '@assets/trusted/navy.png';
import logoAirForce from '@assets/trusted/air_force.png';

const trustedLogos = [
  { src: logoUfc, alt: 'UFC', href: 'https://www.ufc.com' },
  { src: logoMarines, alt: 'United States Marine Corps', href: 'https://www.marines.com' },
  { src: logoArmy, alt: 'United States Army', href: 'https://www.army.mil' },
  { src: logoNavy, alt: 'United States Navy', href: 'https://www.navy.com' },
  { src: logoAirForce, alt: 'United States Air Force', href: 'https://www.airforce.com' },
];

const assetModules = import.meta.glob<string>('@assets/furycombat-website-photos-*', { eager: true, query: '?url', import: 'default' });

function asset(filename: string): string | undefined {
  const baseName = filename.replace(/\.[^.]+$/, '');
  const ext = filename.match(/\.[^.]+$/)?.[0] || '';
  const key = Object.keys(assetModules).find(k => {
    const kName = k.split('/').pop() || '';
    return kName.startsWith(baseName) && kName.endsWith(ext);
  });
  if (key) return assetModules[key];
  const keyAnyExt = Object.keys(assetModules).find(k => {
    const kName = k.split('/').pop() || '';
    return kName.startsWith(baseName);
  });
  return keyAnyExt ? assetModules[keyAnyExt] : undefined;
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
const imgPrivate3 = asset('furycombat-website-photos-036.png');

const galleryImageFiles = [
  'furycombat-website-photos-021.jpg',
  'furycombat-website-photos-016.jpg',
  'furycombat-website-photos-003.jpg',
  'furycombat-website-photos-008.jpg',
  'furycombat-website-photos-009.jpg',
  'furycombat-website-photos-011.jpg',
  'furycombat-website-photos-013.jpg',
  'furycombat-website-photos-020.jpg',
  'furycombat-website-photos-023.png',
  'furycombat-website-photos-025.png',
  'furycombat-website-photos-027.png',
  'furycombat-website-photos-028.png',
  'furycombat-website-photos-030.png',
  'furycombat-website-photos-031.png',
  'furycombat-website-photos-033.png',
  'furycombat-website-photos-035.png',
  'furycombat-website-photos-037.png',
  'furycombat-website-photos-038.png',
  'furycombat-website-photos-039.png',
];
const galleryImages = galleryImageFiles.map(f => asset(f)).filter((v): v is string => !!v);
const imgDeco1 = asset('furycombat-website-photos-002.jpg');


type HomeService = {
  title: string;
  price: string;
  desc: string;
  isWorkshop: boolean;
  category: ServiceCategory;
};

const services: HomeService[] = [
  {
    title: "Private Instruction",
    price: "$250/session",
    desc: "One-on-one training tailored to your goals, experience, and preferred areas of focus. Sessions may include movement, striking, grappling, defensive positioning, situational awareness, tactical response, pressure-point application, and controlled performance under stress.",
    isWorkshop: false,
    category: 'elite',
  },
  {
    title: "Advanced Tactical Instruction",
    price: "$500/session",
    desc: "A more elevated private offering for serious individuals seeking instruction in readiness, tactical thinking, awareness under pressure, protective movement, weapons familiarity, reconnaissance concepts, and strategic response.",
    isWorkshop: false,
    category: 'elite',
  },
  {
    title: "Women's Private Safety Training",
    price: "$300/session",
    desc: "Private instruction designed to help women strengthen awareness, confidence, prevention skills, de-escalation ability, escape options, and decisive real-world response.",
    isWorkshop: false,
    category: 'elite',
  },
  {
    title: "Tactical Conditioning",
    price: "$150/session",
    desc: "A private training experience that combines conditioning, coordination, movement, reaction, and practical defensive drills.",
    isWorkshop: false,
    category: 'elite',
  },
  {
    title: "Young Adult Readiness Training",
    price: "$225/session",
    desc: "Private instruction for young adults preparing for college, commuting, travel, city life, or greater independence.",
    isWorkshop: false,
    category: 'elite',
  },
  {
    title: "Executive Readiness",
    price: "$400/session",
    desc: "A premium private training offering for executives, entrepreneurs, professionals, and public-facing individuals who value preparedness, discretion, awareness, and self-command.",
    isWorkshop: false,
    category: 'elite',
  },
  {
    title: "Family Protection Session",
    price: "$350/session",
    desc: "A private session for individuals or families focused on practical awareness, protective habits, emergency thinking, and everyday readiness.",
    isWorkshop: false,
    category: 'elite',
  },
  {
    title: "Private Workshops",
    price: "Starting at $1,500",
    desc: "Private workshops for companies, organizations, leadership teams, women's groups, and select audiences seeking a refined, practical training experience in awareness, de-escalation, readiness, and personal protection principles.",
    isWorkshop: true,
    category: 'elite',
  },
  {
    title: "Self Defense",
    price: "",
    desc: "Private self defense training in Brooklyn built around awareness, prevention, hand-to-hand defense, confidence, and decisive real-world response.",
    isWorkshop: false,
    category: 'sport',
  },
  {
    title: "Jujitsu",
    price: "",
    desc: "Private Jujitsu training in Brooklyn focused on leverage, control, balance disruption, grappling concepts, and practical close-combat skill.",
    isWorkshop: false,
    category: 'sport',
  },
  {
    title: "Ninjutsu",
    price: "",
    desc: "Private Ninjutsu training in Brooklyn built around adaptability, awareness, movement, weapons concepts, and real-world combat strategy.",
    isWorkshop: false,
    category: 'sport',
  },
  {
    title: "Kickboxing",
    price: "",
    desc: "Private kickboxing training in Brooklyn for striking skill, footwork, conditioning, balance, reflexes, and self-defense readiness.",
    isWorkshop: false,
    category: 'sport',
  },
  {
    title: "Mixed Martial Arts",
    price: "",
    desc: "Private MMA training in Brooklyn combining striking, grappling, clinch fighting, ground awareness, and full-spectrum combat readiness.",
    isWorkshop: false,
    category: 'sport',
  },
  {
    title: "Weapons and Tactics",
    price: "",
    desc: "Private weapons and tactics training in Brooklyn focused on awareness, tactical movement, weapons familiarity, discipline, and practical readiness.",
    isWorkshop: false,
    category: 'sport',
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
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

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

      <SiteHeader />

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

      {/* TRUSTED BY */}
      <section className="py-20 bg-zinc-950 border-b border-white/5 relative">
        <div className="container mx-auto px-6">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center font-serif text-3xl md:text-4xl font-bold uppercase tracking-widest text-white mb-12"
          >
            Trusted By
          </motion.h2>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-nowrap items-stretch justify-center gap-2 sm:gap-4 md:gap-6 max-w-5xl mx-auto"
          >
            {trustedLogos.map((logo) => (
              <a
                key={logo.alt}
                href={logo.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Visit the official ${logo.alt} website`}
                className="flex flex-1 min-w-0 items-center justify-center bg-white border border-white/10 p-2 sm:p-4 md:p-6 aspect-[4/3] max-w-[200px] transition-transform duration-300 hover:scale-[1.03]"
              >
                <img
                  src={logo.src}
                  alt={logo.alt}
                  loading="lazy"
                  className="max-w-full max-h-full object-contain grayscale hover:grayscale-0 transition-all duration-300"
                />
              </a>
            ))}
          </motion.div>
        </div>
      </section>

      {/* REVIEWS */}
      <ReviewsSection />

      {/* VET US */}
      <section className="pt-28 pb-14 bg-zinc-950 border-t border-white/5">
        <div className="container mx-auto px-6 max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h2 className="text-3xl md:text-5xl font-serif font-bold uppercase tracking-wide text-white mb-5">
              Want to Vet Us Before You Reach Out?
            </h2>
            <p className="text-white/60 text-lg max-w-2xl mx-auto leading-relaxed">
              That makes sense. Review our Google business profile, see how we present
              ourselves publicly, and read what others have said before booking a session.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-12 border border-white/10 bg-white/[0.03] p-8 md:p-10 flex flex-col md:flex-row items-center gap-8"
          >
            <div className="shrink-0 w-16 h-16 rounded-full bg-white flex items-center justify-center">
              <svg viewBox="0 0 48 48" className="w-9 h-9" aria-hidden="true">
                <path fill="#4285F4" d="M45.12 24.5c0-1.56-.14-3.06-.4-4.5H24v8.51h11.84c-.51 2.75-2.06 5.08-4.39 6.64v5.52h7.11c4.16-3.83 6.56-9.47 6.56-16.17z"/>
                <path fill="#34A853" d="M24 46c5.94 0 10.92-1.97 14.56-5.33l-7.11-5.52c-1.97 1.32-4.49 2.1-7.45 2.1-5.73 0-10.58-3.87-12.31-9.07H4.34v5.7C7.96 41.07 15.4 46 24 46z"/>
                <path fill="#FBBC05" d="M11.69 28.18C11.25 26.86 11 25.45 11 24s.25-2.86.69-4.18v-5.7H4.34A21.99 21.99 0 0 0 2 24c0 3.55.85 6.91 2.34 9.88l7.35-5.7z"/>
                <path fill="#EA4335" d="M24 10.75c3.23 0 6.13 1.11 8.41 3.29l6.31-6.31C34.91 4.18 29.93 2 24 2 15.4 2 7.96 6.93 4.34 14.12l7.35 5.7c1.73-5.2 6.58-9.07 12.31-9.07z"/>
              </svg>
            </div>
            <p className="text-white/60 text-base md:text-lg leading-relaxed text-center md:text-left flex-1">
              Before booking a session, you are welcome to review our
              Google business profile, see how we present ourselves publicly, and read what
              others have said. We believe trust should come before pressure.
            </p>
            <a
              href="https://www.google.com/search?kgmid=/g/119w2108z&q=Fury+Combat+Systems"
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 inline-flex items-center gap-3 bg-red-600 hover:bg-red-700 text-white font-bold uppercase tracking-widest text-sm px-7 py-4 transition-colors"
            >
              <svg viewBox="0 0 48 48" className="w-5 h-5" aria-hidden="true">
                <path fill="#fff" d="M45.12 24.5c0-1.56-.14-3.06-.4-4.5H24v8.51h11.84c-.51 2.75-2.06 5.08-4.39 6.64v5.52h7.11c4.16-3.83 6.56-9.47 6.56-16.17z" opacity=".9"/>
                <path fill="#fff" d="M24 46c5.94 0 10.92-1.97 14.56-5.33l-7.11-5.52c-1.97 1.32-4.49 2.1-7.45 2.1-5.73 0-10.58-3.87-12.31-9.07H4.34v5.7C7.96 41.07 15.4 46 24 46z" opacity=".7"/>
                <path fill="#fff" d="M11.69 28.18C11.25 26.86 11 25.45 11 24s.25-2.86.69-4.18v-5.7H4.34A21.99 21.99 0 0 0 2 24c0 3.55.85 6.91 2.34 9.88l7.35-5.7z" opacity=".5"/>
                <path fill="#fff" d="M24 10.75c3.23 0 6.13 1.11 8.41 3.29l6.31-6.31C34.91 4.18 29.93 2 24 2 15.4 2 7.96 6.93 4.34 14.12l7.35 5.7c1.73-5.2 6.58-9.07 12.31-9.07z" opacity=".8"/>
              </svg>
              View Our Google Business Page
            </a>
          </motion.div>
        </div>
      </section>

      {/* INTRO */}
      <section className="pt-12 pb-24 bg-background relative overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto text-center"
          >
            <p className="text-xl md:text-3xl font-serif leading-tight text-white/90">
              Fury Combat Systems is a Brooklyn-based private training brand led by Grandmaster Dr. David Furie. The Fury System blends practical hand-to-hand instruction, tactical awareness, strategic thinking, and personal readiness for clients who want real-world capability, not generic training.
            </p>
          </motion.div>
        </div>
      </section>

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
              <h2 className="text-4xl md:text-6xl font-serif font-bold uppercase mb-4 text-white">Private Martial Arts, MMA, Self Defense &amp; Tactical Training in Brooklyn</h2>
              <div className="text-primary font-bold tracking-widest uppercase text-sm mb-8">Two Sides of the Fury System</div>
              <p className="text-lg text-white/70 font-light leading-relaxed">
                Fury Combat offers two distinct paths of private instruction. Elite Private Training is built for executives, professionals, families, and serious individuals who want discreet, high-level personal protection and tactical readiness. Martial Arts &amp; Combat Sports is built for adults and young athletes who want the competitive, sport side of the system. Every session is private, founder-led, and tailored to the individual.
              </p>
            </motion.div>
          </div>

          {categoryOrder.map((catId, catIdx) => {
            const cat = categories[catId];
            const items = services.filter(s => s.category === catId);
            return (
              <div key={catId} className={catIdx > 0 ? 'mt-24' : ''}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="max-w-3xl mb-12"
                >
                  <div className="text-primary font-bold tracking-widest uppercase text-xs mb-3">Category {String(catIdx + 1).padStart(2, '0')}</div>
                  <h3 className="text-3xl md:text-5xl font-serif font-bold uppercase mb-4 text-white">{cat.label}</h3>
                  <div className="text-white/50 font-medium tracking-wide uppercase text-sm mb-5">{cat.tagline}</div>
                  <p className="text-base text-white/60 font-light leading-relaxed">{cat.description}</p>
                  <div className="mt-6 h-px w-24 bg-primary" />
                </motion.div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {items.map((service, idx) => (
                    <motion.div
                      key={service.title}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: idx * 0.08 }}
                      className="group relative bg-zinc-900/50 border border-white/10 p-8 hover:border-primary/50 transition-colors flex flex-col h-full"
                    >
                      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                      <h4 className="text-xl font-serif font-bold text-white mb-6 pr-12">{service.title}</h4>
                      <p className="text-white/60 text-sm leading-relaxed mb-8 flex-grow">
                        {service.desc}
                      </p>

                      <div className="flex flex-col gap-3 mt-auto">
                        {serviceRoutes[service.title] && (
                          <Button asChild className="w-full justify-center bg-primary hover:bg-primary/90 text-white rounded-none tracking-widest text-xs uppercase">
                            <Link href={serviceRoutes[service.title]}>Learn More</Link>
                          </Button>
                        )}
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
              </div>
            );
          })}
          
          <div className="mt-16 grid md:grid-cols-3 gap-4">
            <Img src={imgPrivate1} alt="Training" className="w-full h-64 object-cover grayscale opacity-50 border border-white/10" />
            <Img src={imgPrivate2} alt="Training" className="w-full h-64 object-cover grayscale opacity-50 border border-white/10" />
            <Img src={imgPrivate3} alt="Training" className="w-full h-64 object-cover grayscale opacity-50 border border-white/10" />
          </div>
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

      {/* FEATURED VIDEO */}
      <section id="video" className="py-24 relative bg-background border-t border-white/5">
        <div className="absolute left-1/2 -translate-x-1/2 top-1/4 w-[60%] h-64 bg-primary/5 blur-[180px] pointer-events-none rounded-full" />
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-12"
          >
            <div className="text-primary font-bold tracking-widest uppercase text-xs mb-3">Watch</div>
            <h2 className="text-4xl md:text-5xl font-serif font-bold uppercase mb-4 text-white">Unleash Your Inner Warrior</h2>
            <p className="text-base text-white/60 font-light leading-relaxed">
              A glimpse inside the Fury Combat training environment with Grandmaster Dr. David Furie.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <div className="relative w-full overflow-hidden border border-white/10 bg-zinc-900" style={{ paddingTop: '56.25%' }}>
              <iframe
                src="https://www.youtube.com/embed/17TnRduoqLw"
                title="Unleash Your Inner Warrior at Fury Combat"
                loading="lazy"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="absolute inset-0 w-full h-full"
              />
            </div>
          </motion.div>
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
                  He developed the Fury System to reflect the evolution of combat for the modern world, training that sharpens not only physical capability, but also mental toughness, emotional control, and readiness under pressure.
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
                  <a href="https://www.google.com/search?kgmid=/g/119w2108z&q=Fury+Combat+Systems#lrd=0x89c24447140bc727:0x5cdccd1edaeaf78e,3,,,," target="_blank" rel="noreferrer">Leave a Google Review</a>
                </Button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-black border border-white/10 p-8 md:p-10"
            >
              <h3 className="text-2xl font-serif font-bold text-white mb-4">Inquire by Phone or Email</h3>
              <p className="text-white/60 font-light mb-8">
                Private instruction is arranged directly with David. Reach out by phone or email to discuss your goals and schedule a session.
              </p>
              <div className="space-y-4">
                <Button asChild className="w-full bg-primary hover:bg-primary/90 text-white rounded-none h-14 tracking-widest font-bold uppercase">
                  <a href="tel:9173402911"><Phone size={18} className="mr-2" />Call (917) 340-2911</a>
                </Button>
                <Button asChild variant="outline" className="w-full border-white/20 text-white hover:bg-white/5 rounded-none h-14 tracking-widest font-bold uppercase">
                  <a href="mailto:david.furie@gmail.com"><Mail size={18} className="mr-2" />Email David</a>
                </Button>
              </div>
              
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

      <SiteFooter />
    </div>
  );
}