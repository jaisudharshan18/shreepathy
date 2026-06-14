import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, ShieldCheck } from 'lucide-react';
import { whatsappLink, assetUrl } from '@/lib/utils';

const HERO_WA_MESSAGE = "Hi Shreepathy & Co, I'd like to place a premium wholesale bakery order.";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-bakery-cream py-16 sm:py-24 px-4 sm:px-6 lg:px-8 border-b border-bakery-beige/50">
      {/* ── Background Layer Elements ────────────────────────────────────── */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Soft radial ambient gradient */}
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-radial from-bakery-beige/40 to-transparent blur-3xl" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-radial from-bakery-brown/10 to-transparent blur-3xl" />

        {/* Floating Organic SVG Blob 1 (Top Right) */}
        <svg
          className="absolute top-8 right-[-5%] w-[350px] h-[350px] text-bakery-beige/30 fill-current opacity-70 blur-xs"
          viewBox="0 0 200 200"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M41,-52.7C55.4,-45.5,70.9,-36.5,75.3,-23.7C79.8,-10.8,73.1,6,64.8,19.3C56.6,32.7,46.8,42.7,35,50.1C23.2,57.5,9.4,62.3,-5.7,60.2C-20.9,58,-37.4,49,-49.2,36.4C-61.1,23.7,-68.3,7.5,-67.2,-8C-66.2,-23.5,-56.9,-38.3,-44.3,-46C-31.6,-53.7,-15.8,-54.3,-0.6,-53.4C14.6,-52.6,26.6,-60,41,-52.7Z" transform="translate(100 100)" />
        </svg>

        {/* Floating Organic SVG Blob 2 (Left Middle) */}
        <svg
          className="absolute top-[40%] left-[-10%] w-[450px] h-[450px] text-bakery-brown/5 fill-current opacity-80"
          viewBox="0 0 200 200"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M42.2,-58.5C53.7,-50.2,61.4,-36.2,65.3,-21.2C69.3,-6.2,69.5,9.8,63.9,23.3C58.3,36.8,47,47.8,33.8,55.9C20.6,64.1,5.5,69.4,-9.7,67.9C-24.9,66.4,-40.1,58.2,-50.9,46.7C-61.8,35.2,-68.2,20.4,-69.6,4.9C-70.9,-10.6,-67.1,-26.8,-57.8,-39C-48.4,-51.2,-33.5,-59.4,-18.8,-63.3C-4.1,-67.2,10.4,-66.8,42.2,-58.5Z" transform="translate(100 100)" />
        </svg>

        {/* Floating Circular Decorations */}
        <div className="absolute top-[15%] left-[45%] w-8 h-8 rounded-full border-2 border-bakery-brown/20 opacity-60 animate-float-slow" />
        <div className="absolute bottom-[20%] left-[8%] w-12 h-12 rounded-full border-2 border-bakery-beige/60 opacity-50 animate-float-medium" />
        <div className="absolute top-[65%] right-[40%] w-6 h-6 rounded-full bg-bakery-brown/10 opacity-70 animate-float-fast" />
      </div>

      {/* ── Grid Content Layout ────────────────────────────────────────── */}
      <div className="relative max-w-7xl mx-auto z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Typography & CTAs */}
          <div className="lg:col-span-6 space-y-8 text-left max-w-xl mx-auto lg:mx-0">
            {/* Tagline */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/70 border border-bakery-beige shadow-xs">
              <Sparkles className="h-4.5 w-4.5 text-bakery-brown" />
              <span className="text-xs font-semibold uppercase tracking-wider text-bakery-chocolate/80">
                Wholesale Bakery Ingredients
              </span>
            </div>

            {/* Headline */}
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-extrabold text-bakery-chocolate leading-[1.15] tracking-tight">
                Trusted Bakery Ingredient <span className="text-bakery-brown italic">Distribution</span> Across Tamil Nadu
              </h1>
              <p className="text-base sm:text-lg text-bakery-chocolate/70 leading-relaxed font-sans font-medium">
                Authorized distributors of premium baking ingredients, premixes, chocolates, dairy products, and food solutions for bakeries, cafes, hotels, and manufacturers.
              </p>
            </div>

            {/* Trust Points */}
            <div className="grid grid-cols-2 gap-4 border-t border-bakery-beige/60 pt-6">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-full bg-bakery-beige text-bakery-chocolate/80">
                  <ShieldCheck className="h-4.5 w-4.5" />
                </div>
                <span className="text-xs font-bold text-bakery-chocolate/80">Authorized Brands Only</span>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-full bg-bakery-beige text-bakery-chocolate/80">
                  <ShieldCheck className="h-4.5 w-4.5" />
                </div>
                <span className="text-xs font-bold text-bakery-chocolate/80">Reliable Doorstep Delivery</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <Link
                to="/products"
                className="inline-flex items-center justify-center rounded-full bg-bakery-brown px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-bakery-brown/10 hover:bg-bakery-chocolate hover:shadow-bakery-chocolate/20 transition-all duration-300"
              >
                Browse Products
              </Link>
              <a
                href={whatsappLink(HERO_WA_MESSAGE)}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center justify-center rounded-full border-2 border-bakery-chocolate/20 bg-white/40 backdrop-blur-xs px-8 py-3.5 text-sm font-bold text-bakery-chocolate hover:bg-white hover:border-bakery-chocolate transition-all duration-300"
              >
                Order via WhatsApp
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </div>

          {/* Right Column: Featured Image & Floating Cards */}
          <div className="lg:col-span-6 relative flex justify-center items-center">
            {/* Curved, rounded main image container */}
            <div className="relative w-full max-w-[480px] aspect-[4/5] rounded-[50px] overflow-hidden shadow-2xl border-4 border-white bg-bakery-beige/20 transform hover:scale-[1.01] transition-transform duration-500">
              <img
                src={assetUrl("/images/artisan_bakery_hero.png")}
                alt="Premium Artisan Breads and Pastries"
                className="w-full h-full object-cover"
              />
              {/* Layered vignette gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-bakery-chocolate/30 via-transparent to-transparent" />
            </div>

            {/* Overlapping Curved Background Frame Effect */}
            <div className="absolute -inset-4 rounded-[60px] border-2 border-bakery-brown/15 -z-10 transform rotate-2 pointer-events-none" />
            
            {/* Floating Card 1: Trust Rating (Top Left) */}
            <div className="absolute top-[10%] left-[-8%] sm:left-[-12%] bg-white/90 backdrop-blur-md border border-bakery-beige rounded-2xl p-4 shadow-xl flex items-center gap-3 max-w-[210px] animate-float-slow hover:scale-105 transition-transform duration-300 pointer-events-auto">
              <div className="p-2.5 rounded-xl bg-bakery-cream flex items-center justify-center text-bakery-brown">
                <Sparkles className="h-6 w-6" />
              </div>
              <div className="text-left">
                <div className="flex items-center gap-0.5 text-amber-500 font-bold text-xs">
                  <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
                </div>
                <p className="text-xs font-extrabold text-bakery-chocolate mt-0.5">Trust Score 4.9</p>
                <p className="text-[10px] text-bakery-chocolate/60 font-semibold uppercase tracking-wider">Tamil Nadu Wide</p>
              </div>
            </div>

            {/* Floating Card 2: Features (Bottom Right) */}
            <div className="absolute bottom-[12%] right-[-8%] sm:right-[-10%] bg-white/90 backdrop-blur-md border border-bakery-beige rounded-2xl p-4 shadow-xl flex flex-col gap-1 max-w-[220px] animate-float-medium hover:scale-105 transition-transform duration-300 pointer-events-auto">
              <div className="flex items-center gap-2">
                <span className="text-lg">🥐</span>
                <span className="text-xs font-extrabold text-bakery-chocolate">Artisan Ingredients</span>
              </div>
              <p className="text-[11px] font-medium text-bakery-chocolate/70 leading-normal text-left">
                Pillsbury premixes, Morde chocolate, Monin syrups & crush.
              </p>
            </div>

            {/* Cute bottom dot decoration */}
            <div className="absolute bottom-[5%] left-[10%] bg-bakery-brown w-3 h-3 rounded-full animate-ping pointer-events-none" />
          </div>

        </div>
      </div>
    </section>
  );
}
