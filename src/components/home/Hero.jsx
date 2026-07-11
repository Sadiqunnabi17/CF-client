"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import Link from "next/link";
import "swiper/css";
import "swiper/css/pagination";

const slides = [
  {
    title: "Fund Ideas That Matter",
    subtitle: "Back creators and causes with as little as a few credits.",
    bg: "from-slate-900 to-slate-700",
  },
  {
    title: "Launch Your Own Campaign",
    subtitle: "Turn your project into reality with community support.",
    bg: "from-slate-800 to-slate-600",
  },
  {
    title: "Transparent. Trusted. Simple.",
    subtitle: "Every campaign is reviewed before it goes live.",
    bg: "from-slate-900 to-slate-800",
  },
];

export default function Hero() {
  return (
    <Swiper
      modules={[Autoplay, Pagination]}
      autoplay={{ delay: 4000 }}
      pagination={{ clickable: true }}
      loop
      className="h-[420px]"
    >
      {slides.map((slide, i) => (
        <SwiperSlide key={i}>
          <div
            className={`h-full flex flex-col items-center justify-center text-center px-4 bg-gradient-to-br ${slide.bg} text-white`}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{slide.title}</h1>
            <p className="text-lg text-slate-200 mb-6 max-w-xl">{slide.subtitle}</p>
            <Link
              href="/explore"
              className="bg-white text-slate-900 px-6 py-3 rounded-md font-semibold hover:bg-slate-100"
            >
              Explore Campaigns
            </Link>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}