import CTAs from './CTAs';
import BorderTopRight from '../../../components/decorations/BorderTopRight';
import BorderBottomLeft from '../../../components/decorations/BorderBottomLeft';

const TreatmentsContainer = () => {
  return (
    <section id="trattamenti" className="pt-20 pb-8 bg-white">
      <div className="container mx-auto px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text Column */}
          <div className="space-y-6 order-1 lg:order-1">
            <h2
              className="text-4xl md:text-5xl font-bold text-[#3C2A21] uppercase tracking-tight"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              CAPELLI FORTI E LUMINOSI?
            </h2>

            <p className="text-lg text-gray-700 leading-relaxed">
              Trattamenti naturali che esaltano la bellezza naturale dei tuoi capelli, donando lucentezza e idratazione immediata.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              Ogni formula è studiata per nutrire in profondità senza appesantire, rispettando la struttura del capello e valorizzandone la morbidezza naturale.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              Un rituale di bellezza pensato per far risplendere i tuoi capelli, seduta dopo seduta.
            </p>
          </div>

          {/* Image with decorative borders */}
          <div className="relative flex justify-end order-2 lg:order-2">
            <div
              className="relative w-full max-w-sm"
              style={{ aspectRatio: '3 / 4' }}
            >
              {/* Decorative borders around the image */}
              <BorderTopRight className="absolute -top-6 -right-6 z-20 pointer-events-none" />
              <BorderBottomLeft className="absolute -bottom-6 -left-6 z-20 pointer-events-none" />

              <img
                src="/assets/model11.png"
                alt="Trattamenti per capelli luminosi e idratati"
                className="w-full h-full object-cover object-center rounded-none shadow-none"
              />
            </div>
          </div>

          {/* CTAs below the image */}
          <div className="order-3 lg:order-3 lg:col-span-2 flex justify-center mt-6">
            <CTAs />
          </div>
        </div>
      </div>
    </section>
  );
};

export default TreatmentsContainer;