import React from 'react';
import {motion} from 'motion/react';
import {Lock, ChevronUp} from 'lucide-react';
import {CROPS} from '../constants';
import type {CropType, SkinId} from '../types';

interface SeedSelectorProps {
  currentLevel: number;
  selectedSeed: CropType;
  onSelect: (type: CropType) => void;
  gold: number;
  activeSkin: SkinId;
  bulkControls?: {left?: React.ReactNode; right?: React.ReactNode};
}

export const SeedSelector: React.FC<SeedSelectorProps> = ({
  currentLevel,
  selectedSeed,
  onSelect,
  gold,
  activeSkin,
  bulkControls,
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [showTooltip, setShowTooltip] = React.useState<string | null>(null);

  const availableCrops = Object.values(CROPS).filter(
    (crop) => crop.id !== 'koi_grass' || activeSkin === 'sacred_spring',
  );

  return (
    <div className="pointer-events-none fixed bottom-6 left-1/2 z-50 flex w-[95vw] max-w-xl -translate-x-1/2 flex-col items-center justify-end gap-3">
      <div className="pointer-events-auto relative flex w-full items-end justify-center gap-3">
        {bulkControls?.left ? <div className="mb-1 flex shrink-0">{bulkControls.left}</div> : null}

        <div className="relative flex min-w-0 flex-1 flex-col items-center">
          <div
            id="bulk-seed-launch-anchor"
            className="pointer-events-none absolute bottom-2 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full opacity-0"
          />

          <motion.div
            animate={{
              height: isOpen ? 'auto' : 0,
              opacity: isOpen ? 1 : 0,
              scale: isOpen ? 1 : 0.9,
              y: isOpen ? 0 : 20,
            }}
            className="pointer-events-auto w-full overflow-hidden rounded-[32px] border-[3px] border-[#10B981] bg-white/95 shadow-[0_20px_50px_rgba(0,0,0,0.2)] backdrop-blur-xl"
          >
            <div
              className="no-scrollbar flex w-full gap-3 overflow-x-auto px-4 py-3 scroll-smooth"
              style={{scrollbarWidth: 'none', msOverflowStyle: 'none'}}
            >
              {availableCrops.map((crop) => {
                const isLocked = currentLevel < crop.unlockLevel;
                const canAfford = gold >= crop.seedCost;
                const isSelected = selectedSeed === crop.id;

                return (
                  <div
                    key={crop.id}
                    className="relative flex-shrink-0"
                    onMouseLeave={() => setShowTooltip(null)}
                  >
                    <motion.button
                      whileHover={!isLocked ? {scale: 1.05, y: -4} : {}}
                      whileTap={!isLocked ? {scale: 0.95} : {}}
                      onClick={() => {
                        if (!isLocked) {
                          onSelect(crop.id);
                          setIsOpen(false);
                        } else {
                          setShowTooltip((prev) => (prev === crop.id ? null : crop.id));
                        }
                      }}
                      className={`group relative flex min-w-[70px] flex-col items-center justify-center overflow-hidden rounded-2xl border-[3px] p-3 transition-all duration-300 ${
                        isLocked
                          ? 'border-slate-200 bg-slate-50'
                          : isSelected
                            ? 'transform border-amber-500 -translate-y-2 shadow-md'
                            : 'border-transparent shadow-sm hover:border-emerald-400'
                      }`}
                    >
                      <div
                        className={`absolute inset-0 opacity-10 transition-opacity ${isLocked ? 'hidden' : 'group-hover:opacity-20'} ${crop.color}`}
                      />

                      <div
                        className={`mb-1 text-3xl drop-shadow-md transition-all ${isLocked ? 'scale-90 grayscale opacity-50' : 'scale-100'}`}
                      >
                        {crop.icon}
                      </div>
                      <div
                        className={`z-10 mb-1 text-[9px] font-black uppercase leading-none tracking-tighter ${isLocked ? 'text-slate-400' : 'text-slate-700'}`}
                      >
                        {crop.name}
                      </div>
                      <div
                        className={`z-10 text-[10px] font-black ${isLocked ? 'text-slate-300' : canAfford ? 'text-amber-600' : 'text-red-500'}`}
                      >
                        ${crop.seedCost}
                      </div>

                      {isLocked && (
                        <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-black/5">
                          <div className="scale-50 rounded-full bg-slate-800 p-1 text-white">
                            <Lock size={12} />
                          </div>
                        </div>
                      )}
                    </motion.button>

                    {showTooltip === crop.id && isLocked && (
                      <motion.div
                        initial={{opacity: 0, y: 10, scale: 0.8}}
                        animate={{opacity: 1, y: 0, scale: 1}}
                        exit={{opacity: 0, y: 5, scale: 0.8}}
                        className="absolute -top-10 left-1/2 z-[100] -translate-x-1/2 whitespace-nowrap rounded-lg bg-slate-800 px-3 py-1.5 text-[10px] font-black text-white shadow-xl"
                      >
                        LV.{crop.unlockLevel} 解锁
                        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-slate-800" />
                      </motion.div>
                    )}
                  </div>
                );
              })}
            </div>
          </motion.div>

          <div className="pointer-events-auto">
            {!isOpen ? (
              <motion.div
                initial={{opacity: 0, y: 20}}
                animate={{opacity: 1, y: 0}}
                onClick={() => setIsOpen(true)}
                className="flex cursor-pointer items-center gap-3 rounded-full border-[3px] border-[#10B981] bg-white/95 py-1.5 pl-4 pr-2 shadow-[0_10px_30px_rgba(0,0,0,0.15)] backdrop-blur-md transition-all hover:-translate-y-1 hover:scale-105"
              >
                <div className="flex items-center gap-2">
                  <motion.span
                    key={selectedSeed}
                    initial={{scale: 0, rotate: -45}}
                    animate={{scale: 1, rotate: 0}}
                    transition={{type: 'spring', stiffness: 500, damping: 12}}
                    className="inline-block origin-center text-[22px] drop-shadow-sm"
                  >
                    {CROPS[selectedSeed].icon}
                  </motion.span>
                  <div className="flex flex-col items-start leading-tight">
                    <span className="text-left text-[8px] font-black uppercase tracking-widest text-slate-400">
                      种子收纳
                    </span>
                    <span className="text-xs font-black text-slate-700">{CROPS[selectedSeed].name}</span>
                  </div>
                </div>
                <div className="rounded-full border border-emerald-200 bg-emerald-100 p-1 text-emerald-600">
                  <ChevronUp size={14} strokeWidth={4} />
                </div>
              </motion.div>
            ) : (
              <motion.button
                animate={{rotate: 180}}
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center rounded-full border-[3px] border-[#10B981] bg-white/95 p-2 text-[#10B981] shadow-lg backdrop-blur-md transition-all hover:scale-110 active:scale-95"
              >
                <ChevronUp size={20} strokeWidth={4} />
              </motion.button>
            )}
          </div>
        </div>

        {bulkControls?.right ? <div className="mb-1 flex shrink-0">{bulkControls.right}</div> : null}
      </div>
    </div>
  );
};
