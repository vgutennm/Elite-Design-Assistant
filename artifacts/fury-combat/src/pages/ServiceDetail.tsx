import { useEffect } from 'react';
import { Link } from 'wouter';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, ChevronRight, ArrowLeft, Check, Shield, Target, Users, Sparkles, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { getServiceByRoute, getRelatedServices } from '@/data/services';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';

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

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

export default function ServiceDetail({ params }: { params: { slug: string } }) {
  const slug = params?.slug;
  const service = slug ? getServiceByRoute(`/${slug}`) : undefined;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  useEffect(() => {
    if (service) {
      document.title = service.metaTitle;
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) metaDesc.setAttribute('content', service.metaDescription);

      const existingSchema = document.getElementById('service-faq-schema');
      if (existingSchema) existingSchema.remove();

      const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": service.faqs.map(faq => ({
          "@type": "Question",
          "name": faq.q,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": faq.a
          }
        }))
      };
      const script = document.createElement('script');
      script.id = 'service-faq-schema';
      script.type = 'application/ld+json';
      script.textContent = JSON.stringify(faqSchema);
      document.head.appendChild(script);

      return () => {
        const el = document.getElementById('service-faq-schema');
        if (el) el.remove();
      };
    }
  }, [service]);

  if (!service) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-serif font-bold text-white mb-4">Service Not Found</h1>
          <p className="text-white/60 mb-8">The service page you are looking for does not exist.</p>
          <Button asChild className="bg-primary hover:bg-primary/90 text-white rounded-none tracking-widest uppercase">
            <Link href="/">Return Home</Link>
          </Button>
        </div>
      </div>
    );
  }

  const heroImg = service.heroImage ? asset(service.heroImage) : undefined;
  const related = getRelatedServices(service.relatedSlugs);

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30">
      <div className="fixed inset-0 z-[-1] bg-noise"></div>

      <SiteHeader />

      <section className="relative min-h-[70vh] flex items-end pt-20 pb-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          {heroImg ? (
            <img src={heroImg} alt={service.title} className="w-full h-full object-cover object-center opacity-30" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-zinc-900 via-zinc-800 to-black" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/30" />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/60 to-transparent" />
        </div>

        <div className="container relative z-10 px-6 mx-auto">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="max-w-3xl"
          >
            <motion.div variants={fadeInUp} className="mb-6">
              <Link href="/#instruction" className="inline-flex items-center gap-2 text-white/50 hover:text-primary text-sm transition-colors uppercase tracking-widest">
                <ArrowLeft size={14} />
                All Services
              </Link>
            </motion.div>

            <motion.div variants={fadeInUp} className="mb-4 inline-block px-3 py-1 border border-primary/30 bg-primary/10 text-primary text-xs font-semibold tracking-[0.2em] uppercase">
              {service.price}
            </motion.div>

            <motion.h1 variants={fadeInUp} className="text-4xl md:text-6xl lg:text-7xl font-black font-serif uppercase leading-[0.9] mb-6 tracking-tighter text-white">
              {service.title}
            </motion.h1>

            <motion.p variants={fadeInUp} className="text-lg md:text-xl text-white/80 leading-relaxed mb-10 max-w-2xl font-light">
              {service.subheadline}
            </motion.p>

            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-white rounded-none px-8 font-semibold tracking-widest uppercase">
                <a href="tel:9173402911"><Phone size={16} className="mr-2" />Inquire by Phone</a>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/5 rounded-none px-8 font-semibold tracking-widest uppercase">
                <a href="mailto:david.furie@gmail.com"><Mail size={16} className="mr-2" />Inquire by Email</a>
              </Button>
              <Button asChild size="lg" variant="ghost" className="text-white hover:text-primary hover:bg-transparent rounded-none px-8 font-semibold tracking-widest uppercase">
                <a href="https://www.google.com/maps/search/?api=1&query=Fury+Combat+Systems+24+Cobeck+Ct+Brooklyn+NY+11223" target="_blank" rel="noreferrer"><MapPin size={16} className="mr-2" />Get Directions</a>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-zinc-950 border-t border-white/5">
        <div className="container mx-auto px-6 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-serif font-bold uppercase mb-8 text-white">Overview</h2>
            <p className="text-lg text-white/70 leading-relaxed font-light">
              {service.overview}
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-background border-t border-white/5">
        <div className="container mx-auto px-6 max-w-4xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.div variants={fadeInUp} className="flex items-center gap-3 mb-8">
              <Users size={24} className="text-primary" />
              <h2 className="text-3xl md:text-4xl font-serif font-bold uppercase text-white">Who This Is For</h2>
            </motion.div>
            <div className="grid md:grid-cols-2 gap-4">
              {service.whoFor.map((item, i) => (
                <motion.div
                  key={i}
                  variants={fadeInUp}
                  className="flex items-start gap-3 p-4 bg-zinc-900/50 border border-white/5"
                >
                  <Check size={18} className="text-primary mt-0.5 shrink-0" />
                  <span className="text-white/70 text-sm">{item}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-zinc-950 border-t border-white/5">
        <div className="container mx-auto px-6 max-w-4xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.div variants={fadeInUp} className="flex items-center gap-3 mb-8">
              <Shield size={24} className="text-primary" />
              <h2 className="text-3xl md:text-4xl font-serif font-bold uppercase text-white">What You Get</h2>
            </motion.div>
            <div className="space-y-4">
              {service.whatYouGet.map((item, i) => (
                <motion.div
                  key={i}
                  variants={fadeInUp}
                  className="flex items-start gap-4 p-5 bg-black/30 border border-white/5"
                >
                  <div className="w-8 h-8 bg-primary/10 border border-primary/30 flex items-center justify-center shrink-0">
                    <span className="text-primary font-mono text-sm font-bold">{String(i + 1).padStart(2, '0')}</span>
                  </div>
                  <span className="text-white/70 text-base leading-relaxed">{item}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-background border-t border-white/5">
        <div className="container mx-auto px-6 max-w-4xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.div variants={fadeInUp} className="flex items-center gap-3 mb-8">
              <Target size={24} className="text-primary" />
              <h2 className="text-3xl md:text-4xl font-serif font-bold uppercase text-white">Training Focus</h2>
            </motion.div>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
              {service.trainingFocus.map((item, i) => (
                <motion.div
                  key={i}
                  variants={fadeInUp}
                  className="px-4 py-3 bg-zinc-900/50 border border-white/5 text-white/70 text-sm flex items-center gap-2"
                >
                  <ChevronRight size={14} className="text-primary shrink-0" />
                  {item}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-zinc-950 border-t border-white/5">
        <div className="container mx-auto px-6 max-w-4xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.div variants={fadeInUp} className="flex items-center gap-3 mb-8">
              <Sparkles size={24} className="text-primary" />
              <h2 className="text-3xl md:text-4xl font-serif font-bold uppercase text-white">Likely Outcomes</h2>
            </motion.div>
            <div className="space-y-3">
              {service.likelyOutcomes.map((item, i) => (
                <motion.div
                  key={i}
                  variants={fadeInUp}
                  className="flex items-start gap-3 p-4 border-l-2 border-primary/50 bg-primary/5"
                >
                  <span className="text-white/80 text-base">{item}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-background border-t border-white/5">
        <div className="container mx-auto px-6 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-serif font-bold uppercase mb-8 text-white">Why Choose This</h2>
            <div className="p-8 bg-zinc-900/50 border border-primary/20">
              <p className="text-lg text-white/80 leading-relaxed font-light italic">
                {service.whyChoose}
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-zinc-950 border-t border-white/5">
        <div className="container mx-auto px-6 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-3 mb-8">
              <HelpCircle size={24} className="text-primary" />
              <h2 className="text-3xl md:text-4xl font-serif font-bold uppercase text-white">FAQ</h2>
            </div>
            <Accordion type="single" collapsible className="w-full space-y-3">
              {service.faqs.map((faq, idx) => (
                <AccordionItem key={idx} value={`faq-${idx}`} className="border border-white/10 bg-black/30 px-6 data-[state=open]:border-primary/50 transition-colors">
                  <AccordionTrigger className="text-left font-serif text-base text-white hover:text-primary hover:no-underline py-5">
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-white/60 leading-relaxed pb-5">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="py-20 bg-background border-t border-white/5">
          <div className="container mx-auto px-6 max-w-4xl">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
            >
              <motion.h2 variants={fadeInUp} className="text-3xl md:text-4xl font-serif font-bold uppercase mb-8 text-white">Related Services</motion.h2>
              <div className="grid md:grid-cols-3 gap-4">
                {related.map((rel, i) => (
                  <motion.div key={i} variants={fadeInUp}>
                    <Link
                      href={rel.route}
                      className="block p-6 bg-zinc-900/50 border border-white/10 hover:border-primary/50 transition-colors group"
                    >
                      <h3 className="text-lg font-serif font-bold text-white group-hover:text-primary transition-colors mb-2">{rel.title}</h3>
                      <div className="text-primary font-mono text-sm font-bold mb-3">{rel.price}</div>
                      <p className="text-white/50 text-sm line-clamp-2 mb-4">{rel.subheadline}</p>
                      <span className="text-primary text-xs uppercase tracking-widest font-semibold flex items-center gap-1">
                        Learn More <ChevronRight size={12} />
                      </span>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      )}

      <section className="py-20 bg-zinc-950 border-t border-white/5">
        <div className="container mx-auto px-6 max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-serif font-bold uppercase mb-4 text-white">Ready to Begin?</h2>
            <p className="text-white/60 mb-8 text-lg font-light">
              Contact Grandmaster Dr. David Furie directly to inquire about {service.title}.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-white rounded-none px-8 font-semibold tracking-widest uppercase">
                <a href="tel:9173402911"><Phone size={16} className="mr-2" />Inquire by Phone</a>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/5 rounded-none px-8 font-semibold tracking-widest uppercase">
                <a href="mailto:david.furie@gmail.com"><Mail size={16} className="mr-2" />Inquire by Email</a>
              </Button>
            </div>

            <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-white/40">
              <a href="tel:9173402911" className="flex items-center gap-2 hover:text-primary transition-colors">
                <Phone size={14} /> (917) 340-2911
              </a>
              <a href="mailto:david.furie@gmail.com" className="flex items-center gap-2 hover:text-primary transition-colors">
                <Mail size={14} /> david.furie@gmail.com
              </a>
              <a href="https://www.google.com/maps/search/?api=1&query=Fury+Combat+Systems+24+Cobeck+Ct+Brooklyn+NY+11223" target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-primary transition-colors">
                <MapPin size={14} /> Brooklyn, NY
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
