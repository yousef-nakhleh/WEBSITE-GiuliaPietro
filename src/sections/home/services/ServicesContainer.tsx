import CTAs from './CTAs';

const ServicesContainer = () => {
  return (
    <section
      id="servizi"
      className="relative h-[33vh] md:h-[50vh] flex items-center justify-center text-center text-white overflow-hidden"
    >
      {/* MOBILE background (no parallax): show only < md */}
      <picture className="md:hidden">
        <source srcSet="/assets/salon.webp" type="image/webp" />
        <img
          src="/assets/salon.png"               // fallback
          alt=""                                // decorative
          className="absolute inset-0 h-full w-full object-cover object-[center_30%] pointer-events-none"
        />
      </picture>

      {/* DESKTOP/TABLET background (parallax): show only >= md */}
      <div
        className="hidden md:block absolute inset-0 opacity-60 pointer-events-none"
        style={{
          backgroundImage: 'url(/assets/salon.webp)',
          backgroundAttachment: 'fixed',
          backgroundPosition: 'center',
          backgroundSize: 'cover',
        }}
      ></div>

      {/* overlay */}
      <div className="absolute inset-0 bg-black/50"></div>

      {/* CTA */}
      <div className="relative z-10">
        <CTAs />
      </div>
    </section>
  );
};

export default ServicesContainer;