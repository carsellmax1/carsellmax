"use client";

import { PublicLayout } from "@/components/layouts/public-layout";
import { QuickValuationCTA } from "@/components/homepage/quick-valuation-cta";
import { useState } from "react";

export default function FAQ() {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set(['0-0'])); // First item expanded by default

  const toggleExpanded = (columnIndex: number, itemIndex: number) => {
    const key = `${columnIndex}-${itemIndex}`;
    const newExpanded = new Set(expandedItems);
    
    if (expandedItems.has(key)) {
      newExpanded.delete(key);
    } else {
      newExpanded.add(key);
    }
    
    setExpandedItems(newExpanded);
  };

  const leftColumnFaqs = [
    {
      question: "How does CarSellMax's car selling process work?",
      answer: "Selling your car with CarSellMax is straightforward and stress-free. Start by entering your car's VIN and mileage to get a free, instant valuation. If you're happy with the offer, we'll arrange a convenient pickup and handle all the paperwork. You'll get paid quickly—no fuss, no hidden fees."
    },
    {
      question: "How long does it take to sell my car?",
      answer: "The entire selling process typically takes 24-48 hours from initial valuation to final payment. Once you accept our offer, we'll schedule a convenient pickup time that works for your schedule. Our team handles all the paperwork, and you'll receive payment immediately upon vehicle collection."
    },
    {
      question: "Is the valuation free?",
      answer: "Yes, absolutely! Getting your car's valuation is completely free with no hidden fees, obligations, or commitments. Simply enter your VIN and mileage to receive an instant, accurate estimate of your vehicle's current market value."
    },
    {
      question: "What happens after I accept an offer?",
      answer: "Once you accept our offer, we'll schedule a convenient pickup time at your location. Our professional team will arrive with all necessary paperwork, conduct a final vehicle inspection, complete the transfer of ownership, and provide immediate payment. The entire process is designed to be hassle-free."
    },
    {
      question: "Do I have to pay for pickup?",
      answer: "No, pickup is completely free! We provide complimentary vehicle collection anywhere within our service area. There are no hidden towing fees, pickup charges, or transportation costs. What you see in your quote is exactly what you'll receive."
    },
    {
      question: "How is my car's value calculated?",
      answer: "Our valuations are based on comprehensive market analysis including real-time sales data, vehicle condition, mileage, location, demand trends, and multiple industry sources like KBB and Edmunds. Our advanced algorithms ensure you receive a fair, competitive, and accurate market price."
    }
  ];

  const rightColumnFaqs = [
    {
      question: "Are there any hidden fees?",
      answer: "No hidden fees whatsoever! We believe in complete transparency throughout the entire selling process. What you see in your quote is exactly what you'll receive. There are no processing fees, administrative charges, pickup fees, or any other hidden costs."
    },
    {
      question: "When do I get paid?",
      answer: "Payment is made immediately upon vehicle pickup and paperwork completion. You can choose to receive payment via instant bank transfer, certified check, or cash for smaller amounts. There are no waiting periods, processing delays, or payment holds."
    },
    {
      question: "What if I still owe money on my car?",
      answer: "No problem! We regularly handle vehicles with existing loans or financing. We'll work directly with your lender to pay off the remaining loan balance and handle all the paperwork. You'll receive any remaining equity after the loan payoff, making the process seamless and stress-free."
    },
    {
      question: "Can I get a valuation without registering?",
      answer: "Yes, you can get an instant, accurate valuation without creating an account or providing personal information upfront. Simply enter your vehicle's VIN and current mileage to see your car's estimated market value immediately. Registration is only required if you decide to proceed with selling."
    },
    {
      question: "Can I sell any type of vehicle?",
      answer: "We buy cars, trucks, SUVs, vans, and other passenger vehicles in all conditions. Whether your vehicle is running perfectly, has mechanical issues, accident damage, high mileage, or cosmetic problems, we'll provide a fair offer based on its current condition and market value."
    },
    {
      question: "What if my car is damaged?",
      answer: "We still buy damaged vehicles! Our valuation system takes into account any damage including mechanical issues, accident damage, cosmetic problems, or wear and tear. We provide fair offers based on your car's current condition. Honesty about damage ensures the most accurate pricing."
    },
    {
      question: "Does mileage affect my offer?",
      answer: "Yes, mileage is one of the key factors in determining your vehicle's value. Higher mileage typically results in a lower valuation as it indicates more wear and tear. However, we consider all factors including maintenance history, overall condition, and market demand to provide the best possible offer."
    },
    {
      question: "Can I change my mind after accepting an offer?",
      answer: "Yes, you can cancel your sale before the scheduled pickup appointment without any penalties or fees. However, once our team arrives, the vehicle is inspected, paperwork is signed, and payment is made, the sale becomes final. We encourage you to be certain before scheduling pickup."
    }
  ];

  return (
    <PublicLayout>
      {/* Hero Section */}
      <section className="bg-background py-12 sm:py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold mb-4 sm:mb-6 text-foreground">
            Frequently Asked Questions
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground/70 max-w-lg mx-auto">
            Got questions? We&apos;ve got answers to help you sell your car confidently.
          </p>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16">
            {/* Left Column */}
            <div className="space-y-6">
              {leftColumnFaqs.map((faq, index) => {
                const isExpanded = expandedItems.has(`0-${index}`);
                return (
                  <div
                    key={index}
                    className="border-b border-border pb-6"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="text-lg sm:text-xl lg:text-2xl font-bold mb-3 sm:mb-4 text-foreground leading-tight">
                          {faq.question}
                        </h3>
                        {isExpanded && (
                          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                            {faq.answer}
                          </p>
                        )}
                      </div>
                      <button 
                        className="flex-shrink-0 w-6 h-6 flex items-center justify-center"
                        onClick={() => toggleExpanded(0, index)}
                      >
                        {isExpanded ? (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                          </svg>
                        ) : (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {rightColumnFaqs.map((faq, index) => {
                const isExpanded = expandedItems.has(`1-${index}`);
                return (
                  <div
                    key={index}
                    className="border-b border-border pb-6"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="text-lg sm:text-xl lg:text-2xl font-bold mb-3 sm:mb-4 text-foreground leading-tight">
                          {faq.question}
                        </h3>
                        {isExpanded && (
                          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                            {faq.answer}
                          </p>
                        )}
                      </div>
                      <button 
                        className="flex-shrink-0 w-6 h-6 flex items-center justify-center"
                        onClick={() => toggleExpanded(1, index)}
                      >
                        {isExpanded ? (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                          </svg>
                        ) : (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Quick Valuation CTA */}
      <QuickValuationCTA
        title="Ready to Sell Your Car?"
        subtitle="Get your instant valuation now"
        description="Start the process today and see what your car is worth. Fast, free, and no obligations."
      />
    </PublicLayout>
  );
}



