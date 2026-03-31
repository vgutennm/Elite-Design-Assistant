import { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronDown, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { allServices } from '@/data/services';

const mainNavLinks = [
  { name: 'Home', href: '/', isHash: false },
  { name: 'The System', href: '/#system', isHash: true },
  { name: 'The Legend', href: '/#legend', isHash: true },
  { name: 'Gallery', href: '/#gallery', isHash: true },
];

const bottomNavLinks = [
  { name: 'Contact', href: '/#contact', isHash: true },
  { name: 'FAQ', href: '/#faq', isHash: true },
];

export default function SiteHeader() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [location] = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setServicesOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNavClick = (href: string, isHash: boolean) => {
    setMobileMenuOpen(false);
    setMobileServicesOpen(false);
    if (isHash) {
      const hashPart = href.includes('#') ? href.split('#')[1] : '';
      if (location === '/') {
        const el = document.getElementById(hashPart);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      } else {
        const base = import.meta.env.BASE_URL || '/';
        window.location.href = `${base}#${hashPart}`;
      }
    }
  };

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-background/90 backdrop-blur-md border-b border-white/5 py-4' : 'bg-transparent py-6'}`}>
        <div className="container mx-auto px-6 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <span className="font-serif text-2xl font-bold tracking-widest text-white group-hover:text-primary transition-colors">FURY<span className="text-primary group-hover:text-white transition-colors">COMBAT</span></span>
          </Link>

          <nav className="hidden lg:flex items-center gap-8">
            {mainNavLinks.map((link) =>
              link.isHash ? (
                <a key={link.name} href={link.href} onClick={(e) => { e.preventDefault(); handleNavClick(link.href, true); }} className="text-sm font-medium text-white/70 hover:text-white transition-colors uppercase tracking-widest cursor-pointer">
                  {link.name}
                </a>
              ) : (
                <Link key={link.name} href={link.href} className="text-sm font-medium text-white/70 hover:text-white transition-colors uppercase tracking-widest">
                  {link.name}
                </Link>
              )
            )}

            <div ref={dropdownRef} className="relative">
              <button
                onClick={() => setServicesOpen(!servicesOpen)}
                className="text-sm font-medium text-white/70 hover:text-white transition-colors uppercase tracking-widest flex items-center gap-1"
              >
                Services <ChevronDown size={14} className={`transition-transform ${servicesOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {servicesOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full right-0 mt-4 w-72 bg-zinc-900/95 backdrop-blur-xl border border-white/10 shadow-2xl py-2"
                  >
                    {allServices.map((s) => (
                      <Link
                        key={s.route}
                        href={s.route}
                        onClick={() => setServicesOpen(false)}
                        className="flex items-center justify-between px-5 py-3 text-sm text-white/70 hover:text-white hover:bg-primary/10 transition-colors"
                      >
                        <span>{s.title}</span>
                        <span className="text-primary/60 font-mono text-xs">{s.price.split('/')[0].trim()}</span>
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {bottomNavLinks.map((link) => (
              <a key={link.name} href={link.href} onClick={(e) => { e.preventDefault(); handleNavClick(link.href, true); }} className="text-sm font-medium text-white/70 hover:text-white transition-colors uppercase tracking-widest cursor-pointer">
                {link.name}
              </a>
            ))}

            <Button asChild variant="outline" className="border-primary/50 text-white hover:bg-primary hover:text-white rounded-none tracking-widest uppercase text-xs">
              <a href="/#contact" onClick={(e) => { e.preventDefault(); handleNavClick('/#contact', true); }}>Inquire Now</a>
            </Button>
          </nav>

          <button className="lg:hidden text-white p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-background/95 backdrop-blur-xl pt-24 pb-8 px-6 flex flex-col overflow-y-auto"
          >
            <nav className="flex flex-col gap-5 text-center mt-12">
              {mainNavLinks.map((link) =>
                link.isHash ? (
                  <a
                    key={link.name}
                    href={link.href}
                    onClick={(e) => { e.preventDefault(); handleNavClick(link.href, true); }}
                    className="text-xl font-serif text-white/80 hover:text-primary transition-colors uppercase tracking-widest"
                  >
                    {link.name}
                  </a>
                ) : (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-xl font-serif text-white/80 hover:text-primary transition-colors uppercase tracking-widest"
                  >
                    {link.name}
                  </Link>
                )
              )}

              <div>
                <button
                  onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
                  className="text-xl font-serif text-white/80 hover:text-primary transition-colors uppercase tracking-widest flex items-center justify-center gap-2 mx-auto"
                >
                  Services <ChevronDown size={16} className={`transition-transform ${mobileServicesOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {mobileServicesOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden mt-3"
                    >
                      <div className="flex flex-col gap-3 py-3 border-t border-b border-white/10">
                        {allServices.map((s) => (
                          <Link
                            key={s.route}
                            href={s.route}
                            onClick={() => { setMobileMenuOpen(false); setMobileServicesOpen(false); }}
                            className="text-base text-white/60 hover:text-primary transition-colors flex items-center justify-center gap-2"
                          >
                            {s.title} <ChevronRight size={12} className="text-primary/40" />
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {bottomNavLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => { e.preventDefault(); handleNavClick(link.href, true); }}
                  className="text-xl font-serif text-white/80 hover:text-primary transition-colors uppercase tracking-widest"
                >
                  {link.name}
                </a>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
