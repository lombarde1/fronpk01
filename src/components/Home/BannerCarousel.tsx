import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation, EffectFade } from 'swiper/modules';
import { motion } from 'framer-motion';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/effect-fade';

interface BannerCarouselProps {
  banners: string[];
}

const BannerCarousel: React.FC<BannerCarouselProps> = ({ banners }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <motion.section 
      className="relative w-full overflow-hidden rounded-b-3xl shadow-xl"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-amber-500/10 mix-blend-overlay z-10 pointer-events-none" />
      
      <Swiper
        modules={[Autoplay, Pagination, Navigation, EffectFade]}
        effect="fade"
        spaceBetween={0}
        slidesPerView={1}
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
          dynamicBullets: true,
          renderBullet: function (index, className) {
            return '<span class="' + className + ' custom-pagination bg-white/50 hover:bg-white/80 transition-colors duration-300" style="width: 10px; height: 10px;"></span>';
          },
        }}
        navigation={{
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        }}
        className="w-full group"
        onInit={() => setIsLoaded(true)}
      >
        {banners.map((banner, index) => (
          <SwiperSlide key={index}>
            <div className="relative w-full aspect-[16/9] sm:aspect-[16/7] md:aspect-[16/6] lg:aspect-[16/5] overflow-hidden">
              <img 
                src={banner} 
                alt={`Banner ${index + 1}`} 
                className="w-full h-full object-cover object-center transition-transform duration-7000 hover:scale-105"
                loading={index === 0 ? "eager" : "lazy"}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/40 to-transparent" />
            </div>
          </SwiperSlide>
        ))}
        
        {/* Custom navigation arrows */}
        <div className="swiper-button-prev !hidden md:!flex items-center justify-center w-12 h-12 rounded-full bg-white/10 backdrop-blur-md text-white opacity-0 group-hover:opacity-80 transition-opacity duration-300 -translate-x-4">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m15 18-6-6 6-6"/>
          </svg>
        </div>
        <div className="swiper-button-next !hidden md:!flex items-center justify-center w-12 h-12 rounded-full bg-white/10 backdrop-blur-md text-white opacity-0 group-hover:opacity-80 transition-opacity duration-300 translate-x-4">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m9 18 6-6-6-6"/>
          </svg>
        </div>
      </Swiper>
      
      {/* Custom styling for pagination */}
      <style jsx global>{`
        .swiper-pagination {
          bottom: 20px !important;
        }
        .swiper-pagination-bullet {
          width: 10px;
          height: 10px;
          margin: 0 6px;
          background: rgba(255, 255, 255, 0.4);
          opacity: 1;
          transition: all 0.3s ease;
        }
        .swiper-pagination-bullet-active {
          background: rgba(255, 255, 255, 0.95);
          width: 24px;
          border-radius: 5px;
        }
        
        .swiper-button-next, .swiper-button-prev {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 50%;
          width: 50px;
          height: 50px;
          backdrop-filter: blur(5px);
        }
        
        .swiper-button-next:after, .swiper-button-prev:after {
          display: none;
        }
      `}</style>
    </motion.section>
  );
};

export default BannerCarousel;