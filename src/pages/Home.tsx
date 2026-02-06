import SEO from '../seo/SEO';
import HeroContainer from '../sections/home/hero/HeroContainer';
import ServicesContainer from '../sections/home/services/ServicesContainer';
import TreatmentsContainer from '../sections/home/treatments/TreatmentsContainer';
import GalleryContainer from '../sections/home/gallery/GalleryContainer';

const Home = () => {
  return (
    <>
      <SEO
        title="Epifanio di Giovanni | Parrucchiere e Hairstylist a Treviglio"
        description="A Treviglio, Epifanio di Giovanni è il tuo parrucchiere e hairstylist di fiducia: specializzato in colorazioni L’Oréal, tagli personalizzati e trattamenti naturali per capelli luminosi e sani."
        canonicalUrl="https://epifaniodigiovanni.it"
        ogImage="/assets/model.webp"
        ogImageAlt="Epifanio di Giovanni hairstylist – salone di parrucchiere a Treviglio"
        preloadImageHref="/assets/model.webp"
      />

      <HeroContainer />
      <ServicesContainer />
      <GalleryContainer />
      <TreatmentsContainer />
    </>
  );
};

export default Home;