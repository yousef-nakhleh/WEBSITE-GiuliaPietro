const Salon = () => {
  return (
    <section id="salone" className="min-h-screen bg-[#F5F0E6] flex items-center py-20">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-bold text-[#3C2A21] mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Il Nostro Salone
          </h2>
          <div className="flex justify-center">
            <div className="h-px w-48 bg-[#3C2A21] opacity-50" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-stretch max-w-6xl mx-auto">
          <div className="md:col-span-2 overflow-hidden rounded-xl shadow-lg">
            <img
              src="src/assets/saloon1.png"
              alt="Interno Salone"
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              style={{ maxHeight: '360px' }}
            />
          </div>

          <div className="flex flex-col gap-4">
            <div className="overflow-hidden rounded-xl flex-1 shadow-lg">
              <img
                src="src/assets/saloon3.png"
                alt="Postazione"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                style={{ maxHeight: '175px' }}
              />
            </div>
            <div className="overflow-hidden rounded-xl flex-1 shadow-lg">
              <img
                src="src/assets/saloon2.png"
                alt="Strumenti"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                style={{ maxHeight: '175px' }}
              />
            </div>
          </div>
        </div>

        <div className="mt-12 text-center max-w-2xl mx-auto">
          <p className="text-lg text-gray-700 mb-6 leading-relaxed">
            Il nostro salone unisce eleganza e comfort, creando un ambiente dove ogni cliente può sentirsi completamente a proprio agio.
          </p>
          <a
            href="#shop"
            className="border-2 border-[#6e5a49] text-[#6e5a49] px-8 py-3 rounded-full font-semibold text-sm tracking-wider inline-flex items-center justify-center min-w-[180px] hover:bg-[#6e5a49] hover:text-white transition-all duration-300"
          >
            Shop
          </a>
        </div>
      </div>
    </section>
  );
};

export default Salon;