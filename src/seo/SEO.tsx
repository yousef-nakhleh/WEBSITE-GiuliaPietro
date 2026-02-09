// src/seo/SEO.tsx
import React from 'react';
import { Helmet } from 'react-helmet-async';

/**
 * Reusable SEO component.
 *
 * Wrap your app once with <HelmetProvider> in src/main.tsx (or App) and
 * render <SEO /> per page/section as needed.
 */

type SEOProps = {
  /** Per-page <title>. Defaults to site name. */
  title?: string;
  /** Per-page meta description. */
  description?: string;
  /** If provided, used as full canonical; else auto (baseUrl + pathname). */
  canonicalUrl?: string;
  /** Override OG image absolute or root-relative path. Defaults to logo. */
  ogImage?: string;
  /** Alt text for OG image. */
  ogImageAlt?: string;
  /** Robots directives. */
  robots?: string;
  /** Preload a hero image (root-relative). */
  preloadImageHref?: string;
  /** Optionally inject JSON-LD (will merge with defaults below). */
  extraJsonLd?: Record<string, any> | Record<string, any>[];
};

const SITE_NAME = 'Giulia & Pietro Acconciature Unisex';
const BASE_URL = 'https://www.giuliaepietroacconciature.it';
const DEFAULT_LOCALE = 'it_IT';
const THEME_COLOR = '#DED4CA';
const COLOR_SCHEME = 'light';

// Default, refined SEO description (local + services + brand)
const DEFAULT_DESCRIPTION =
  'A Caravaggio (BG), Giulia & Pietro Acconciature Unisex offre tagli, colore e styling per lui e per lei. Un salone accogliente per ogni esigenza.';

// Default OG image (logo) and alt text
const DEFAULT_OG_IMAGE = '/assets/logo.png';
const DEFAULT_OG_IMAGE_ALT =
  'Giulia & Pietro Acconciature Unisex a Caravaggio (BG)';

// Social / profiles (for JSON-LD sameAs)
const INSTAGRAM_URL = 'https://www.instagram.com/giuliaepietroacconciature/';
const GOOGLE_MAPS_URL =
  'https://www.google.com/maps?q=Via%20al%20Teatro%2C%206%2C%2024043%20Caravaggio%20BG';

// Business details for JSON-LD
const BUSINESS = {
  name: 'Giulia & Pietro Acconciature Unisex',
  url: BASE_URL,
  telephone: '+39 333 934 7932',
  logo: `${BASE_URL}/assets/logo.png`,
  address: {
    streetAddress: 'Via al Teatro, 6',
    addressLocality: 'Caravaggio',
    postalCode: '24043',
    addressRegion: 'BG',
    addressCountry: 'IT',
  },
  openingHours: [
    // Mon closed
    // Tue 09–16
    { day: 'Tuesday', opens: '09:00', closes: '16:00' },
    // Wed 09–12, 15–19
    { day: 'Wednesday', opens: '09:00', closes: '12:00' },
    { day: 'Wednesday', opens: '15:00', closes: '19:00' },
    // Thu 09–17
    { day: 'Thursday', opens: '09:00', closes: '17:00' },
    // Fri 09–19
    { day: 'Friday', opens: '09:00', closes: '19:00' },
    // Sat 08:30–18
    { day: 'Saturday', opens: '08:30', closes: '18:00' },
    // Sun closed
  ],
  sameAs: [INSTAGRAM_URL, GOOGLE_MAPS_URL],
};

function absUrl(possiblyRootRelative: string): string {
  if (!possiblyRootRelative) return BASE_URL;
  if (possiblyRootRelative.startsWith('http')) return possiblyRootRelative;
  return `${BASE_URL}${possiblyRootRelative.startsWith('/') ? '' : '/'}${possiblyRootRelative}`;
}

export default function SEO({
  title = SITE_NAME,
  description = DEFAULT_DESCRIPTION,
  canonicalUrl,
  ogImage = DEFAULT_OG_IMAGE,
  ogImageAlt = DEFAULT_OG_IMAGE_ALT,
  robots = 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1',
  preloadImageHref = '/assets/model.webp',
  extraJsonLd,
}: SEOProps) {
  // Compute canonical if not provided (SSR-safe)
  const pathname =
    typeof window !== 'undefined' ? window.location.pathname : '/';
  const finalCanonical = canonicalUrl || `${BASE_URL}${pathname}`;

  const finalOgImage = absUrl(ogImage);

  // JSON-LD: HairSalon with opening hours
  const hairSalonJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'HairSalon',
    name: BUSINESS.name,
    url: BUSINESS.url,
    telephone: BUSINESS.telephone,
    image: finalOgImage,
    logo: BUSINESS.logo,
    address: {
      '@type': 'PostalAddress',
      streetAddress: BUSINESS.address.streetAddress,
      addressLocality: BUSINESS.address.addressLocality,
      postalCode: BUSINESS.address.postalCode,
      addressRegion: BUSINESS.address.addressRegion,
      addressCountry: BUSINESS.address.addressCountry,
    },
    sameAs: BUSINESS.sameAs,
    openingHoursSpecification: [
      // Tuesday
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: 'Tuesday',
        opens: '09:00',
        closes: '16:00',
      },
      // Wednesday (split)
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: 'Wednesday',
        opens: '09:00',
        closes: '12:00',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: 'Thursday',
        opens: '09:00',
        closes: '17:00',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: 'Friday',
        opens: '09:00',
        closes: '19:00',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: 'Wednesday',
        opens: '15:00',
        closes: '19:00',
      },
      // Saturday
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: 'Saturday',
        opens: '08:30',
        closes: '18:00',
      },
    ],
  };

  // Also include a minimal WebSite JSON-LD (no SearchAction since we have no site search)
  const websiteJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: BASE_URL,
    inLanguage: 'it',
  };

  const jsonLdToInject = Array.isArray(extraJsonLd)
    ? [hairSalonJsonLd, websiteJsonLd, ...extraJsonLd]
    : extraJsonLd
    ? [hairSalonJsonLd, websiteJsonLd, extraJsonLd]
    : [hairSalonJsonLd, websiteJsonLd];

  return (
    <Helmet>
      {/* Base Title & Description */}
      <title>{title}</title>
      <meta name="description" content={description} />

      {/* Robots */}
      <meta name="robots" content={robots} />
      <meta name="googlebot" content={robots} />

      {/* Canonical */}
      <link rel="canonical" href={finalCanonical} />

      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content={DEFAULT_LOCALE} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={finalCanonical} />
      <meta property="og:image" content={finalOgImage} />
      <meta property="og:image:alt" content={ogImageAlt} />

      {/* Theme / Color Scheme */}
      <meta name="theme-color" content={THEME_COLOR} />
      <meta name="color-scheme" content={COLOR_SCHEME} />

      {/* Preload hero image (WebP). Fallback PNG is served by <img> tags at runtime. */}
      {preloadImageHref && (
        <link rel="preload" as="image" href={preloadImageHref} />
      )}

      {/* JSON-LD */}
      {jsonLdToInject.map((obj, i) => (
        <script
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(obj) }}
          type="application/ld+json"
          key={`jsonld-${i}`}
        />
      ))}
    </Helmet>
  );
}
