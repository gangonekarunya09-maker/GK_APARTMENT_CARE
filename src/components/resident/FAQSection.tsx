import React from 'react';
import { Section } from '../ui/Section';
import { Accordion, AccordionItem } from '../ui/Accordion';

export const FAQSection: React.FC = () => {
  const faqs: AccordionItem[] = [
    {
      id: 'faq-1',
      question: 'What is GK Apartment Care?',
      answer:
        'GK Apartment Care is a community-first service platform that organizes trusted doorstep home and automobile services for gated apartment complexes in Hyderabad through scheduled campaigns, pooled resident demand, and coordinated gate passes.',
    },
    {
      id: 'faq-2',
      question: 'How does a community service campaign work?',
      answer:
        'A service campaign is created for your specific apartment complex with transparent community rates and batch dates. Residents express interest by clicking "I\'m Interested". When enough neighbors join, GK coordinates the assigned provider crew and scheduled time slots.',
    },
    {
      id: 'faq-3',
      question: 'Do I book directly with an arbitrary provider?',
      answer:
        'No. Instead of dealing with unvetted independent contractors, you register through your society\'s campaign. GK manages provider selection, background checks, equipment standards, and gate pass coordination.',
    },
    {
      id: 'faq-4',
      question: 'What happens when enough residents are interested?',
      answer:
        'Once the minimum demand target for the campaign is reached, the batch is confirmed. Registered residents receive WhatsApp notifications with their allocated time slot and gate pass confirmation.',
    },
    {
      id: 'faq-5',
      question: 'How do I access my community portal?',
      answer:
        'Every partner apartment community has a private URL format (/c/:slug/:token) distributed through your resident WhatsApp groups, apartment app notices, or RWA management desk.',
    },
    {
      id: 'faq-6',
      question: 'What happens if the demand target is not reached?',
      answer:
        'If the minimum threshold is not met before the campaign deadline, our operations desk will notify you to reschedule for the next batch or offer an individual service visit with zero cancellation penalties.',
    },
    {
      id: 'faq-7',
      question: 'How are society quiet hours observed?',
      answer:
        'All noisy machinery and high-decibel operations are strictly suspended from 1:00 PM to 2:30 PM to respect resident afternoon rest hours across all towers.',
    },
    {
      id: 'faq-8',
      question: 'How can our Apartment Association (RWA) partner with GK?',
      answer:
        'RWA committees can submit an onboarding request through our RWA Partnerships page. We will set up a dedicated portal for your society and coordinate with your facility management board.',
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
            Everything you need to know about our community campaigns, scheduling, and gate coordination.
          </p>
        </div>

        {/* Accordion Component */}
        <Accordion items={faqs} />
      </div>
    </Section>
  );
};
