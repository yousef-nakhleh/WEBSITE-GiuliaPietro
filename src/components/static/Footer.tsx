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
        <meta itemProp="name" content="Epifanio Di Giovanni" />
        <meta itemProp="url" content="https://epifaniodigiovanni.it" />

        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
            {/* Logo + Slogan + Social */}
            <div className="flex flex-col items-center md:items-start">
              <picture>
                <source srcSet="/assets/logo.webp" type="image/webp" />
                <img
                  src="/assets/logo.png"
                  alt="Epifanio Di Giovanni logo"
                  width={160}
                  height={64}
                  loading="lazy"
                  decoding="async"
                  className="h-16 mb-4"
                  itemProp="logo"
                />
              </picture>

              <p className="text-center md:text-left mb-4 text-sm opacity-80">
                Stile senza confini. Per lui e per lei.
              </p>
              <div className="flex space-x-4 mt-2">
                <a
                  href="tel:3386699613"
                  className="hover:text-[#a18973] transition-colors"
                  aria-label="Telefono"
                  itemProp="telephone"
                >
                  <Phone size={20} />
                </a>
                <a
                  href="https://www.instagram.com/edg.hairstylist/"
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
                <a href="tel:3386699613" className="hover:text-[#a18973]" itemProp="telephone">
                  338 669 9613
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
                  <span itemProp="streetAddress">Via Giovanni Mulazzani, 11</span>
                  <br />
                  <span itemProp="postalCode">24047</span>{' '}
                  <span itemProp="addressLocality">Treviglio</span>{' '}
                  <span itemProp="addressRegion">BG</span>
                </span>
              </div>

              <div className="flex items-start justify-center md:justify-start">
                <Clock size={18} className="mr-2 mt-1" />
                <div>
                  <p>Lunedì: Chiuso</p>
                  <p>Martedì: 11–21</p>
                  <p>Mercoledì: 09–19</p>
                  <p>Giovedì: 09–19</p>
                  <p>Venerdì: 09–19</p>
                  <p>Sabato: 09–18</p>
                  <p>Domenica: Chiuso</p>
                </div>
              </div>
            </div>

            {/* Map */}
            <div className="text-center md:text-left">
              <h3 className="text-lg font-medium mb-4">Dove Trovarci</h3>
              <div className="h-52 rounded-lg overflow-hidden shadow-md border border-[#d4c9bc]/40">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d5590.9446494662125!2d9.588773076172492!3d45.52069997107483!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x478149c805c52e05%3A0xce3f8383e2b27143!2sEpifanio%20Di%20Giovanni%20parrucchiere!5e0!3m2!1sit!2sit!4v1760604675380!5m2!1sit!2sit"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Mappa Epifanio Di Giovanni"
                />
              </div>
            </div>
          </div>

          {/* Legal Row ABOVE the line */}
          <div className="flex flex-col md:flex-row items-center justify-between text-xs text-[#3C2A21]/70 mb-4">
            <p className="tracking-widest text-[#3C2A21]/70">© 2025 Epifanio Di Giovanni</p>
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