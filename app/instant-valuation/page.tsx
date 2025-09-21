"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCarStore } from "@/lib/car-store";
import { PublicLayout } from "@/components/layouts/public-layout";
import ComprehensiveSubmissionForm from "@/components/forms/comprehensive-submission-form";

export default function InstantValuationPage() {
  const router = useRouter();
  const { foundCar: car } = useCarStore();

  useEffect(() => {
    // Redirect to home if no car data
    if (!car) {
      router.push('/');
      return;
    }
  }, [car, router]);

  if (!car) {
    return null; // Will redirect
  }

  return (
    <PublicLayout>
      <ComprehensiveSubmissionForm />
    </PublicLayout>
  );
}