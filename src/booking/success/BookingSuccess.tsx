// src/booking/success/BookingSuccess.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Calendar, Clock, User, Scissors } from 'lucide-react';
import { safeJSONParse } from '../slots/utils/safeJSON';
import { bookingStorage } from '../../utils/bookingStorage';

interface SEOProps {
  title: string;
  description: string;
  noindex?: boolean;
}

interface PageText {
  successHeading: string;
  thankYouMessage: string;
  detailsHeading: string;
  dateLabel: string;
  staffLabel: string;
  timeLabel: string;
  serviceLabel: string;
  anyStaffText: string;
  nextStepsHeading: string;
  nextStepsDescription: string;
  homeButtonText: string;
  callButtonText: string;
}

interface BookingSuccessProps {
  SEOComponent: React.ComponentType<SEOProps>;
  seoConfig: SEOProps;
  pageText: PageText;
  homeRoute: string;
  phoneNumber: string;
  dateLocale?: string;
}

const BookingSuccess = ({
  SEOComponent,
  seoConfig,
  pageText,
  homeRoute,
  phoneNumber,
  dateLocale = 'it-IT',
}: BookingSuccessProps) => {
  const navigate = useNavigate();
  const [customerName, setCustomerName] = useState('');
  const [appointmentInfo, setAppointmentInfo] = useState<any>(null);

  useEffect(() => {
    const name = bookingStorage.getItem('customerName');
    const services = safeJSONParse<Record<string, any>[] | null>(
      bookingStorage.getItem('selectedServices'),
      null
    );
    const barber = safeJSONParse<{ name?: string } | 'any' | null>(
      bookingStorage.getItem('selectedBarber'),
      'any'
    );
    const selectedTime = bookingStorage.getItem('selectedTime');
    const selectedDate = bookingStorage.getItem('selectedDate');

    setCustomerName(name || '');
    setAppointmentInfo({
      services,
      barber,
      selectedTime,
      selectedDate,
    });

    // Clean up sessionStorage after displaying
    setTimeout(() => {
      bookingStorage.removeItem('customerName');
      bookingStorage.removeItem('selectedServices');
      bookingStorage.removeItem('selectedServiceIds');
      bookingStorage.removeItem('selectedBarber');
      bookingStorage.removeItem('selectedTime');
      bookingStorage.removeItem('selectedDate');
    }, 5000);
  }, []);

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString(dateLocale, {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeStr: string) => {
    if (!timeStr) return '';
    return timeStr;
  };

  return (
    <main className="pt-24 bg-white min-h-screen">
      <SEOComponent {...seoConfig} />

      {/* Hero Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 md:px-8 text-center">
          <div className="max-w-4xl mx-auto">
            {/* Success Icon */}
            <div className="mb-8">
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-12 h-12 text-green-600" />
              </div>
            </div>

            {/* Success Message */}
            <div className="mb-12">
              <h1 className="text-4xl sm:text-5xl font-heading font-bold mb-6 text-black">
                {pageText.successHeading}
              </h1>
              <div className="w-20 h-[2px] bg-[#E8E0D5] mx-auto mb-6"></div>
              {customerName && (
                <p className="text-xl text-gray-600 font-primary">
                  {pageText.thankYouMessage.replace('{name}', customerName)}
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Appointment Details */}
      {appointmentInfo && (
        <section className="pb-16 bg-white">
          <div className="container mx-auto px-4 md:px-8 max-w-4xl">
            <div className="bg-gray-50 rounded-lg p-8 border-2 border-gray-200 shadow-lg">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-heading font-bold text-black mb-2">
                  {pageText.detailsHeading}
                </h2>
                <div className="w-16 h-[2px] bg-[#E8E0D5] mx-auto"></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Data */}
                <div className="flex items-start gap-4 p-4 bg-white rounded-lg border border-gray-200">
                  <Calendar className="text-[#E8E0D5] mt-1 flex-shrink-0" size={24} />
                  <div>
                    <h3 className="font-heading font-semibold text-black mb-1">
                      {pageText.dateLabel}
                    </h3>
                    <p className="text-gray-600 font-primary">
                      {formatDate(appointmentInfo.selectedDate)}
                    </p>
                  </div>
                </div>

                {/* Staff */}
                <div className="flex items-start gap-4 p-4 bg-white rounded-lg border border-gray-200">
                  <User className="text-[#E8E0D5] mt-1 flex-shrink-0" size={24} />
                  <div>
                    <h3 className="font-heading font-semibold text-black mb-1">
                      {pageText.staffLabel}
                    </h3>
                    <p className="text-gray-600 font-primary">
                      {appointmentInfo.barber === 'any' || !appointmentInfo.barber?.name
                        ? pageText.anyStaffText
                        : appointmentInfo.barber.name
                      }
                    </p>
                  </div>
                </div>

                {/* Time */}
                <div className="flex items-start gap-4 p-4 bg-white rounded-lg border border-gray-200">
                  <Clock className="text-[#E8E0D5] mt-1 flex-shrink-0" size={24} />
                  <div>
                    <h3 className="font-heading font-semibold text-black mb-1">
                      {pageText.timeLabel}
                    </h3>
                    <p className="text-gray-600 font-primary">
                      {formatTime(appointmentInfo.selectedTime)}
                    </p>
                  </div>
                </div>

                {/* Service */}
                <div className="flex items-start gap-4 p-4 bg-white rounded-lg border border-gray-200">
                  <Scissors className="text-[#E8E0D5] mt-1 flex-shrink-0" size={24} />
                  <div>
                    <h3 className="font-heading font-semibold text-black mb-1">
                      {pageText.serviceLabel}
                    </h3>
                    <p className="text-gray-600 font-primary">
                      {appointmentInfo.services?.length
                        ? appointmentInfo.services.map((service: any) => service.name).join(', ')
                        : ''}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Action Buttons */}
      <section className="pb-20 bg-white">
        <div className="container mx-auto px-4 md:px-8 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-heading font-bold mb-6 text-black">
              {pageText.nextStepsHeading}
            </h2>
            <p className="text-gray-600 font-primary mb-8">
              {pageText.nextStepsDescription}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate(homeRoute)}
                className="bg-[#E8E0D5] border border-black text-black px-8 py-3 rounded-lg font-heading font-bold text-lg transition-all duration-300 hover:brightness-95 shadow-lg hover:shadow-xl"
              >
                {pageText.homeButtonText}
              </button>

              <a
                href={`tel:${phoneNumber}`}
                className="bg-white text-black border border-black px-8 py-3 rounded-lg font-heading font-bold text-lg transition-all duration-300 hover:bg-gray-50 hover:border-[#E8E0D5]"
              >
                {pageText.callButtonText}
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default BookingSuccess; 
