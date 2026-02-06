interface ServiceCardProps {
  title: string;
  image: string;
}

const ServiceCard = ({ title, image }: ServiceCardProps) => {
  return (
    <div className="flex flex-col items-center">
      <div className="w-full aspect-square bg-white shadow-lg overflow-hidden mb-4">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover"
        />
      </div>
      <h3 className="text-2xl font-semibold text-[#3C2A21]" style={{ fontFamily: 'Montserrat, sans-serif' }}>
        {title}
      </h3>
    </div>
  );
};

export default ServiceCard;
