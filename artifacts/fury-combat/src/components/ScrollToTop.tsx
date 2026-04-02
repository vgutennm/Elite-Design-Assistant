import { useState, useEffect } from "react";
import { ChevronUp } from "lucide-react";

const images = import.meta.glob<{ default: string }>("@assets/furycombat-website-photos-*", { eager: true });

function asset(name: string) {
  const match = Object.entries(images).find(([k]) => k.includes(name));
  return match ? match[1].default : "";
}

const logo = asset("furycombat-website-photos-015");

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Scroll to top"
      className="fixed bottom-6 right-6 z-50 group cursor-pointer flex flex-col items-center gap-0.5 transition-opacity duration-300"
      style={{ opacity: visible ? 1 : 0 }}
    >
      <ChevronUp className="w-4 h-4 text-white/70 group-hover:text-white transition-colors -mb-1" strokeWidth={3} />
      <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-primary/60 group-hover:border-primary shadow-lg shadow-black/50 group-hover:shadow-primary/20 transition-all duration-300">
        <img
          src={logo}
          alt="Scroll to top"
          className="w-full h-full object-cover"
          draggable={false}
        />
      </div>
    </button>
  );
}
