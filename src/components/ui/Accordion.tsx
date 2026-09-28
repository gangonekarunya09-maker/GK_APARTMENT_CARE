import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export interface AccordionItem {
  id: string;
  question: string;
  answer: string;
  tag?: string;
}

export interface AccordionProps {
  items: AccordionItem[];
  className?: string;
}

export const Accordion: React.FC<AccordionProps> = ({ items, className = '' }) => {
  const [openId, setOpenId] = useState<string | null>(items[0]?.id || null);

  const toggleItem = (id: string) => {
    setOpenId(prev => (prev === id ? null : id));
  };

  return (
    <div className={`divide-y divide-[#E4E0D8] border-y border-[#E4E0D8] ${className}`}>
      {items.map(item => {
        const isOpen = openId === item.id;
        return (
          <div key={item.id} className="py-5 sm:py-6 group transition-colors">
            <button
              onClick={() => toggleItem(item.id)}
              className="w-full flex items-center justify-between text-left gap-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#111111] rounded-lg p-1 -m-1 cursor-pointer"
              aria-expanded={isOpen}
            >
              <span className="text-lg sm:text-xl font-medium text-[#111111] group-hover:text-[#2596be] transition-colors">
                {item.question}
              </span>
              <div className="w-8 h-8 rounded-full bg-[#F0EDE7] border border-[#E4E0D8] group-hover:bg-[#111111] group-hover:text-white flex items-center justify-center shrink-0 transition-colors">
                {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              </div>
            </button>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: [0.2, 0.7, 0.2, 1] }}
                  className="overflow-hidden"
                >
                  <p className="pt-3 pb-2 text-sm sm:text-base text-[#5C5A56] leading-relaxed max-w-3xl">
                    {item.answer}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
};
