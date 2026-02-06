// src/components/static/Footer.tsx
import { useState } from 'react';
import { Phone, Instagram, MapPin, Clock } from 'lucide-react';
import CookiePreferenceModal from '../../cookies/CookiePreferenceModal';
import PoweredBySef from '../../sef/PoweredBySef';

const Footer = () => {
  const [openPrefs, setOpenPrefs] = useState(false);

  return (
    <footer
        id="contatti"
        className="bg-[#e8dfd5] text-[#3C2A21] pt-16 pb-8"
        itemScope
        itemType="https://schema.org/LocalBusiness"
      >
        <meta itemProp="name" content="Giulia & Pietro Acconciature Unisex" />
        <meta itemProp="url" content="https://epifaniodigiovanni.it" />

        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
            {/* Logo + Slogan + Social */}
            <div className="flex flex-col items-center md:items-start">
              <picture>
                <source srcSet="/assets/logo.webp" type="image/webp" />
                <img
                  src="/assets/logo.png"
                  alt="Giulia & Pietro Acconciature Unisex logo"
                  width={160}
                  height={64}
                  loading="lazy"
                  decoding="async"
                  className="h-16 mb-4"
                  itemProp="logo"
                />
              </picture>

              <p className="text-center md:text-left mb-4 text-sm opacity-80">
                Acconciature unisex per ogni stile.
              </p>
              <div className="flex space-x-4 mt-2">
                <a
                  href="tel:3339347932"
                  className="hover:text-[#a18973] transition-colors"
                  aria-label="Telefono"
                  itemProp="telephone"
                >
                  <Phone size={20} />
                </a>
                <a
                  href="https://www.instagram.com/giuliaepietroacconciature/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#a18973] transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram size={20} />
                </a>
              </div>
            </div>

            {/* Contact Info */}
            <div className="text-sm text-center md:text-left space-y-4">
              <div className="flex items-center justify-center md:justify-start">
                <Phone size={18} className="mr-2" />
                <a href="tel:3339347932" className="hover:text-[#a18973]" itemProp="telephone">
                  333 934 7932
                </a>
              </div>

              <div
                className="flex items-start justify-center md:justify-start"
                itemProp="address"
                itemScope
                itemType="https://schema.org/PostalAddress"
              >
                <MapPin size={18} className="mr-2 mt-1" />
                <span>
                  <span itemProp="streetAddress">Piazza Dottor Emilio Gallavresi, 6</span>
                  <br />
                  <span itemProp="postalCode">24043</span>{' '}
                  <span itemProp="addressLocality">Caravaggio</span>{' '}
                  <span itemProp="addressRegion">BG</span>
                </span>
              </div>

              <div className="flex items-start justify-center md:justify-start">
                <Clock size={18} className="mr-2 mt-1" />
                <div>
                  <p>Lunedì: Chiuso</p>
                  <p>Martedì: 09–16</p>
                  <p>Mercoledì: 09–12, 15–19</p>
                  <p>Giovedì: 09–17</p>
                  <p>Venerdì: 09–19</p>
                  <p>Sabato: 08:30–18</p>
                  <p>Domenica: Chiuso</p>
                </div>
              </div>
            </div>

            {/* Map */}
            <div className="text-center md:text-left">
              <h3 className="text-lg font-medium mb-4">Dove Trovarci</h3>
              <div className="h-52 rounded-lg overflow-hidden shadow-md border border-[#d4c9bc]/40">
                <iframe
                  src="https://www.google.com/maps?q=Piazza%20Dottor%20Emilio%20Gallavresi%2C%206%2C%2024043%20Caravaggio%20BG&output=embed"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Mappa Giulia & Pietro Acconciature Unisex"
                />
              </div>
            </div>
          </div>

          {/* Legal Row ABOVE the line */}
          <div className="flex flex-col md:flex-row items-center justify-between text-xs text-[#3C2A21]/70 mb-4">
            <p className="tracking-widest text-[#3C2A21]/70">© 2025 Giulia &amp; Pietro Acconciature Unisex</p>
            <div className="flex space-x-6 mt-2 md:mt-0">
              <button
                type="button"
                onClick={() => setOpenPrefs(true)}
                className="hover:text-[#a18973] transition-colors underline-offset-2 hover:underline"
              >
                Impostazioni Cookie
              </button>
              <a
                href="/privacy"
                className="hover:text-[#a18973] transition-colors underline-offset-2 hover:underline"
              >
                Privacy Policy
              </a>
            </div>
          </div>

          {/* Divider line BELOW */}
          <div className="border-t border-[#3C2A21]/20 mb-2" />

          {/* ✅ Powered by SEF-AI below the line */}
          <PoweredBySef className="mt-4" muted />
        </div>

        {/* Cookie Preferences Modal */}
        <CookiePreferenceModal open={openPrefs} onClose={() => setOpenPrefs(false)} />
      </footer>
  );
};

export default Footer;
