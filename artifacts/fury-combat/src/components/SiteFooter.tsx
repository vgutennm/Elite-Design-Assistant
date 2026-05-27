import { Link } from 'wouter';
import { ChevronRight, Instagram, Linkedin, Facebook, Youtube } from 'lucide-react';
import { categories, categoryOrder, getServicesByCategory } from '@/data/services';

const sectionLinks = [
  { name: 'Home', href: '/' },
  { name: 'The System', href: '/#system' },
  { name: 'The Legend', href: '/#legend' },
  { name: 'Gallery', href: '/#gallery' },
  { name: 'Contact', href: '/#contact' },
  { name: 'FAQ', href: '/#faq' },
];

export default function SiteFooter() {
  return (
    <footer className="bg-black py-20 border-t border-white/10">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-x-16 gap-y-12 lg:gap-x-20 mb-16">
          <div className="md:col-span-1">
            <Link href="/" className="inline-block font-serif text-2xl font-bold tracking-widest text-white mb-6">
              FURY<span className="text-primary">COMBAT</span>
            </Link>
            <p className="text-white/50 text-sm leading-relaxed mb-8">
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
              {sectionLinks.map(link => (
                <li key={link.name}>
                  {link.href.includes('#') ? (
                    <a href={link.href} className="text-white/50 hover:text-primary text-sm transition-colors">{link.name}</a>
                  ) : (
                    <Link href={link.href} className="text-white/50 hover:text-primary text-sm transition-colors">{link.name}</Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {categoryOrder.map(catId => {
            const cat = categories[catId];
            const items = getServicesByCategory(catId);
            return (
              <div key={catId}>
                <h4 className="text-white font-bold tracking-widest uppercase text-sm mb-6">{cat.label}</h4>
                <ul className="space-y-4">
                  {items.map(s => (
                    <li key={s.route}>
                      <Link href={s.route} className="text-white/50 hover:text-primary text-sm transition-colors">{s.title}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}

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
  );
}
