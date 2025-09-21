"use client";

import React from "react";
import Image from "next/image";

const benefits = [
  {
    step: 1,
    title: "Get a Free Valuation",
    desc: "See your car's value instantly. Use our app to profile your vehicle—quick, easy, and done in just a few taps.",
    image: "/benefits/benefit-1.jpg"
  },
  {
    step: 2,
    title: "Best Price",
    desc: "We do the leg work, then we send you the highest offer. No fees. No hassle.",
    image: "/benefits/benefit-2.jpg"
  },
  {
    step: 3,
    title: "They Pick Up. You Get Paid.",
    desc: "We come to you and pay you on the same day. If you've got an outstanding loan, we'll handle it for you.",
    image: "/benefits/benefit-3.jpg"
  }
];

export const BenefitsSection = () => (
  <section className="w-full flex flex-col items-center bg-background px-4 py-12 sm:py-14 md:py-16">
    <div className="w-full max-w-[1400px] flex flex-col items-center gap-12 sm:gap-16 md:gap-[63px]">
      {/* Header */}
      <div className="flex flex-col items-center gap-3 sm:gap-4">
        <h2 className="text-3xl sm:text-4xl md:text-[40px] font-bold text-foreground text-center leading-[1.4] tracking-[-0.01em] max-w-[544px]">
          Ready. Set. Sold.
        </h2>
        <p className="text-lg sm:text-xl md:text-2xl font-medium text-muted-foreground text-center leading-[1.5] tracking-[-0.01em] max-w-2xl">
          We make selling your car simple. Here&apos;s how it works.
        </p>
      </div>

      {/* Benefits Grid */}
      <div className="flex flex-col lg:flex-row justify-center items-stretch gap-6 sm:gap-8 lg:gap-[77px] w-full">
        {benefits.map((benefit, i) => (
          <div key={i} className="flex flex-col items-center gap-5 sm:gap-7 w-full max-w-[420px] mx-auto">
            <div className="relative w-full aspect-square rounded-xl overflow-hidden border border-border">
              <Image
                src={benefit.image}
                alt={benefit.title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover"
                priority={i === 0}
              />
            </div>
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3 sm:gap-4 md:gap-6 w-full">
              <div className="flex flex-col items-center sm:items-start">
                <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-[62px] md:h-[62px] flex items-center justify-center rounded-full bg-primary text-primary-foreground text-lg sm:text-xl md:text-2xl font-bold shadow-lg">
                  {benefit.step}
                </div>
              </div>
              <div className="flex-1 flex flex-col items-center sm:items-start text-center sm:text-left">
                <h3 className="text-lg sm:text-xl md:text-[21px] font-bold text-foreground mb-2 leading-[1.5] tracking-[-0.01em]">
                  {benefit.title}
                </h3>
                <p className="text-sm sm:text-base text-muted-foreground leading-[1.6]">
                  {benefit.desc}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

