import React from 'react';

export const ValuePropsBar: React.FC = () => {
  const perks = [
    'DELIVERY IN MOROCCO (2–5 DAYS)',
    'CASH ON DELIVERY AVAILABLE',
    'FREE EXCHANGES & RETURNS',
  ];

  return (
    <section className="w-full px-3 sm:px-5 lg:px-6 py-4 sm:py-6 max-w-[1878px] mx-auto">
      {/* 3 adjacent boxes */}
      <div className="w-full grid grid-cols-1 md:grid-cols-3 border border-black divide-y md:divide-y-0 md:divide-x divide-black bg-white">
        {perks.map((perk, index) => (
          <div
            key={index}
            className="h-[76px] sm:h-[90px] lg:h-[104px] px-4 sm:px-6 flex items-center justify-center text-center group hover:bg-neutral-50 transition-colors"
          >
            <h3 className="font-inter-tight font-normal text-xs sm:text-[13px] lg:text-[14px] leading-snug text-black tracking-wider uppercase select-none">
              {perk}
            </h3>
          </div>
        ))}
      </div>
    </section>
  );
};

