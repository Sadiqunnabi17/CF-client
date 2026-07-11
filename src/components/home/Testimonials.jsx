"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

const testimonials = [
  {
    name: "Amelia Chen",
    quote: "I raised funds for my community garden in under two weeks.",
    photo: "https://i.pravatar.cc/100?img=32",
  },
  {
    name: "Rafael Costa",
    quote: "The platform made it dead simple to track my contributions.",
    photo: "https://i.pravatar.cc/100?img=12",
  },
  {
    name: "Priya Nair",
    quote: "Transparent, fast payouts, and a genuinely supportive community.",
    photo: "https://i.pravatar.cc/100?img=47",
  },
];

export default function Testimonials() {
  return (
    <section className="bg-slate-50 py-16">
      <div className="max-w-3xl mx-auto px-4 text-center">
        <h2 className="text-2xl font-bold text-slate-800 mb-8">What Our Users Say</h2>
        <Swiper modules={[Autoplay]} autoplay={{ delay: 5000 }} loop>
          {testimonials.map((t, i) => (
            <SwiperSlide key={i}>
              <img
                src={t.photo}
                alt={t.name}
                className="w-16 h-16 rounded-full mx-auto mb-4"
              />
              <p className="text-slate-600 italic mb-2">"{t.quote}"</p>
              <p className="text-slate-800 font-semibold">{t.name}</p>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}