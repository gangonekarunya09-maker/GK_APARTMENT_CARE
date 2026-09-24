import React from 'react';
import { ShieldCheck, Moon, UserCheck, KeySquare, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

export const TrustSection: React.FC = () => {
  return (
    <section className="py-12 bg-[#F8F9FA] border-y border-[#E5E7EB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#2596be] uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Association-First Protocols</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#142326]">
            Built for Gated Communities
          </h2>
          <p className="text-xs sm:text-sm text-[#667085] mt-1">
            Engineered around society security bylaws, tranquil quiet hours, and synchronized gate passes.
          </p>
        </div>

        {/* 3 Trust Cards - vertical stack on mobile, responsive grid, no horizontal row overflow */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.25 }}
            className="p-5 bg-white rounded-2xl border border-[#E5E7EB] shadow-xs space-y-2.5"
          >
            <div className="w-10 h-10 rounded-xl bg-[#2596be]/10 text-[#2596be] flex items-center justify-center">
              <KeySquare className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-[#142326]">
              Pre-Registered Gate Entry
            </h3>
            <p className="text-xs text-[#667085] leading-relaxed">
              Every technician passes through automated MyGate and NoBrokerHood digital gate approvals. Zero entry delays or guard calls at your intercom.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.25, delay: 0.05 }}
            className="p-5 bg-white rounded-2xl border border-[#E5E7EB] shadow-xs space-y-2.5"
          >
            <div className="w-10 h-10 rounded-xl bg-[#2596be]/10 text-[#2596be] flex items-center justify-center">
              <Moon className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-[#142326]">
              Quiet Hours Observed
            </h3>
            <p className="text-xs text-[#667085] leading-relaxed">
              Strict 1:00 PM – 2:30 PM afternoon siesta discipline. No drilling, rotary noise, or corridor disturbance is permitted during quiet hours.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.25, delay: 0.1 }}
            className="p-5 bg-white rounded-2xl border border-[#E5E7EB] shadow-xs space-y-2.5"
          >
            <div className="w-10 h-10 rounded-xl bg-[#2596be]/10 text-[#2596be] flex items-center justify-center">
              <UserCheck className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-[#142326]">
              Background Verified Staff
            </h3>
            <p className="text-xs text-[#667085] leading-relaxed">
              Aadhaar-verified, police-cleared personnel equipped with official GK Apartment Care badges, uniform aprons, and professional equipment.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
