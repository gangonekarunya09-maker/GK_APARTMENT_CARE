import React from 'react';
import { Section } from '../ui/Section';
import { Accordion, AccordionItem } from '../ui/Accordion';

export const FAQSection: React.FC = () => {
  const faqs: AccordionItem[] = [
    {
      id: 'faq-1',
      question: 'How does the Sunday Community Bulk pooling work?',
      answer:
        'When multiple flats in your tower or gated society book home care or car cleaning for the same weekend, our operations team batches technician visits. This lowers logistics overhead and unlocks 20% to 35% bulk discounts for every participating flat.',
    },
    {
      id: 'faq-2',
      question: 'How do you observe society quiet hours?',
      answer:
        'We enforce a strict 1:00 PM to 2:30 PM quiet hour break. During this period, all noisy equipment (such as deep scrubbers, drillers, pressure washers, and carpet extractors) is strictly suspended to respect resident afternoon rest.',
    },
    {
      id: 'faq-3',
      question: 'Are all technicians police verified and insured?',
      answer:
        'Yes. 100% of our service personnel undergo mandatory Aadhaar verification and police background clearance. They arrive wearing official GK Apartment Care badges and uniforms, with digital gate passes sent directly to your society security booth.',
    },
    {
      id: 'faq-4',
      question: 'Do I need to pay in advance when booking?',
      answer:
        'No advance payment is required for regular doorstep bookings. You only pay after the service is fully completed to your complete satisfaction via UPI, cards, or net banking.',
    },
    {
      id: 'faq-5',
      question: 'How can our Apartment Association (RWA) partner with GK Apartment Care?',
      answer:
        'RWA committees can submit an application via our RWA Partnerships page. We will set up a dedicated digital community portal for your society, configure custom bulk slabs, and assign a dedicated relationship manager within 24 hours.',
    },
  ];

  return (
    <Section bg="bg" className="border-b border-[#E4E0D8]">
      <div className="max-w-3xl mx-auto space-y-10 sm:space-y-12">
        {/* Header */}
        <div className="text-center space-y-3">
          <span className="text-xs uppercase font-semibold tracking-wider text-[#2596be]">
            Frequently Asked Questions
          </span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-medium text-[#111111] leading-[1.08] tracking-tight">
            Clear answers.
          </h2>
          <p className="text-sm sm:text-base text-[#5C5A56]">
            Everything you need to know about our doorstep services, security protocols, and bulk rates.
          </p>
        </div>

        {/* Accordion Component */}
        <Accordion items={faqs} />
      </div>
    </Section>
  );
};
