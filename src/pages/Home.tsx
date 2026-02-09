import SEO from '../seo/SEO';
import HeroContainer from '../sections/home/hero/HeroContainer';
import ServicesContainer from '../sections/home/services/ServicesContainer';
import GalleryContainer from '../sections/home/gallery/GalleryContainer';

const Home = () => {
  return (
    <>
      <SEO
        title="Giulia & Pietro Acconciature Unisex a Caravaggio"
        description="Giulia & Pietro Acconciature Unisex a Caravaggio (BG): tagli, colore e styling per lui e per lei."
        canonicalUrl="https://www.giuliaepietroacconciature.it"
        ogImage="/assets/model.webp"
        ogImageAlt="Giulia & Pietro Acconciature Unisex a Caravaggio"
        preloadImageHref="/assets/model.webp"
      />

      <HeroContainer />
      <ServicesContainer />
      <GalleryContainer />
    </>
  );
};

export default Home;
