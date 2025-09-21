"use client";

import React from "react";
import Link from "next/link";

export const CtaSection = () => {
  return (
    <section className="py-24 bg-muted/50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Sell Your Vehicle?</h2>
        <p className="text-xl text-muted-foreground mb-8">
          Get started today and receive your quote in minutes. It&apos;s that simple!
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            href="/#valuation-form"
            className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-3 rounded-md text-lg font-medium transition-colors"
          >
            Get My Quote
          </Link>
          <Link 
            href="/contact"
            className="border border-border hover:bg-muted px-8 py-3 rounded-md text-lg font-medium transition-colors"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </section>
  );
};

