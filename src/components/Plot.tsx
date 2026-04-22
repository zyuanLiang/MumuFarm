import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PlotState, SkinId } from '../types';
import { CROPS } from '../constants';
import { Timer } from 'lucide-react';

interface PlotProps {
  plot: PlotState;
  onPlant: (plotId: number) => void;
  onHarvest: (plotId: number) => void;
  isDragging?: boolean;
  activeSkin: SkinId;
  isBulkLocked?: boolean;
  bulkPhase?: 'idle' | 'plant-target' | 'plant-impact' | 'harvest-lift' | 'harvest-cleared';
  sequenceIndex?: number;
  isBulkHighlighted?: boolean;
}

export const Plot: React.FC<PlotProps> = ({
  plot,
  onPlant,
  onHarvest,
  isDragging,
  activeSkin,
  isBulkLocked = false,
  bulkPhase = 'idle',
  sequenceIndex = -1,
  isBulkHighlighted = false,
}) => {
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isSquishing, setIsSquishing] = useState(false);
  const prevCropId = useRef(plot.cropId);
  const prevIsGrown = useRef(false);
  const squishTimeoutRef = useRef<number | null>(null);
  const crop = plot.cropId ? CROPS[plot.cropId] : null;

  const isGrown = plot.cropId ? timeLeft === 0 : false;
  const growthProgress = crop ? Math.min(1, (crop.growthTime - timeLeft) / crop.growthTime) : 0;

  const slotStyle = `
    relative w-full h-full aspect-square cursor-pointer touch-none
    rounded-2xl border border-white/8
    bg-black/20 backdrop-blur-sm
    transition-all duration-300
    flex items-center justify-center
    shadow-[inset_0_2px_10px_rgba(0,0,0,0.28)]
  `;

  const slotToneClass = !plot.cropId
    ? 'opacity-95 hover:opacity-100'
    : plot.isWatered
      ? 'bg-cyan-950/25 border-cyan-200/15'
      : isGrown
        ? 'bg-amber-950/20 border-amber-200/20'
        : 'bg-emerald-950/20 border-white/10';

  const slotInnerClass = !plot.cropId
    ? 'bg-white/[0.015]'
    : plot.isWatered
      ? 'bg-cyan-200/[0.06]'
      : isGrown
        ? 'bg-amber-200/[0.07]'
        : 'bg-emerald-200/[0.04]';

  const emptyPitClass = 'h-2 w-2 rounded-full bg-black/35 shadow-[0_1px_2px_rgba(255,255,255,0.05)]';
  const hasBulkSequence = sequenceIndex >= 0;

  const bulkAnimate =
    bulkPhase === 'harvest-lift'
      ? { scale: [1, 0.94, 1.03, 1], y: [0, -8, 0] }
      : bulkPhase === 'plant-impact'
        ? { scale: [1, 0.96, 1.02, 1], y: [0, 2, 0] }
        : bulkPhase === 'plant-target'
          ? { scale: [1, 1.02, 1], y: [0, -2, 0] }
          : bulkPhase === 'harvest-cleared'
            ? { scale: [1, 0.98, 1], y: [0, 1, 0] }
            : null;

  useEffect(() => {
    if (prevCropId.current !== null && plot.cropId === null && prevIsGrown.current) {
      setIsSquishing(true);

      if (squishTimeoutRef.current !== null) {
        window.clearTimeout(squishTimeoutRef.current);
      }

      squishTimeoutRef.current = window.setTimeout(() => setIsSquishing(false), 420);
    }

    prevCropId.current = plot.cropId;
    prevIsGrown.current = isGrown;
  }, [plot.cropId, isGrown]);

  useEffect(() => {
    return () => {
      if (squishTimeoutRef.current !== null) {
        window.clearTimeout(squishTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (plot.cropId && plot.plantedAt) {
      const interval = setInterval(() => {
        const elapsed = (Date.now() - plot.plantedAt!) / 1000;
        const remaining = Math.max(0, CROPS[plot.cropId!].growthTime - elapsed);
        setTimeLeft(Math.ceil(remaining));

        if (remaining <= 0) {
          clearInterval(interval);
        }
      }, 1000);

      return () => clearInterval(interval);
    }

    setTimeLeft(0);
  }, [plot.cropId, plot.plantedAt]);

  const handleInteract = () => {
    if (isBulkLocked) {
      return;
    }

    if (isGrown) {
      onHarvest(plot.id);
    } else if (!plot.cropId) {
      onPlant(plot.id);
    }
  };

  const handlePointerEnter = () => {
    if (!isBulkLocked && isDragging && isGrown) {
      onHarvest(plot.id);
    }
  };

  return (
    <motion.div
      data-plot-id={plot.id}
      data-bulk-phase={bulkPhase}
      whileHover={!isSquishing && !isBulkLocked ? { y: -4 } : {}}
      whileTap={!isSquishing && !isBulkLocked ? { scale: 0.98 } : {}}
      animate={bulkAnimate ?? (isSquishing ? { scale: [1, 0.96, 1.02, 1] } : { scale: 1, y: 0 })}
      transition={
        bulkAnimate
          ? { duration: bulkPhase === 'plant-target' ? 0.22 : 0.3, ease: [0.22, 1, 0.36, 1] }
          : isSquishing
            ? { duration: 0.42, ease: [0.22, 1, 0.36, 1] }
            : {}
      }
      onPointerDown={handleInteract}
      onPointerEnter={handlePointerEnter}
      className={`${slotStyle} ${slotToneClass} ${
        isBulkHighlighted || bulkPhase === 'plant-target'
          ? 'ring-2 ring-white/35 shadow-[0_0_0_1px_rgba(255,255,255,0.12),0_0_28px_rgba(255,255,255,0.18)]'
          : ''
      } ${hasBulkSequence ? 'will-change-transform' : ''}`}
    >
      <div className="pointer-events-none absolute inset-[6%] rounded-[1rem] border border-white/6 bg-white/[0.02]" />
      <div className={`pointer-events-none absolute inset-[10%] rounded-[0.95rem] ${slotInnerClass}`} />

      <AnimatePresence mode="wait">
        {!plot.cropId ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none"
          >
            <div className={emptyPitClass} />
          </motion.div>
        ) : (
          <motion.div
            key="growing"
            initial={{ scale: 0, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.5, opacity: 0, y: -40 }}
            transition={{ exit: { type: 'spring', stiffness: 300, damping: 20 } }}
            className="absolute inset-0 z-10 transform-gpu pointer-events-none"
          >
            {crop?.rarity === 'divine' && activeSkin === 'sacred_spring' && (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-x-0 bottom-[10%] z-10 flex aspect-square items-center justify-center rounded-full opacity-80"
              >
                <motion.div
                  className="absolute animate-pulse text-xl drop-shadow-[0_0_10px_#fff]"
                  style={{ top: '-10px' }}
                  animate={{ rotate: [0, -10, 10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  🪷
                </motion.div>
                <div className="absolute inset-2 animate-spin-slow rounded-full border-2 border-dashed border-teal-300 opacity-30" />
              </motion.div>
            )}

            <motion.div
              animate={{
                scale: isGrown ? 1.5 : 0.6 + growthProgress * 0.8,
                rotate: isGrown ? [0, -2, 2, 0] : [-3, 3, -3],
                filter: isGrown
                  ? 'grayscale(0%) brightness(110%)'
                  : `grayscale(${80 - growthProgress * 80}%) brightness(${90 + growthProgress * 15}%)`,
              }}
              transition={{
                rotate: { repeat: Infinity, duration: isGrown ? 3 : 2, ease: 'easeInOut' },
                scale: { type: 'spring', stiffness: 120, damping: 10 },
                filter: { duration: 0.5 },
              }}
              className="absolute bottom-[18%] left-1/2 z-20 -translate-x-1/2 origin-bottom text-7xl drop-shadow-[0_12px_12px_rgba(0,0,0,0.24)]"
            >
              {crop?.icon}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {plot.cropId && (
        <div className="pointer-events-none absolute bottom-[10%] left-1/2 z-10 h-1.5 w-[70%] -translate-x-1/2 overflow-hidden rounded-full border border-white/10 bg-black/30">
          <motion.div
            className={isGrown ? 'h-full bg-yellow-400 shadow-[0_0_8px_#fbbf24]' : 'h-full bg-emerald-400'}
            initial={{ width: '0%' }}
            animate={{ width: isGrown ? '100%' : `${((crop!.growthTime - timeLeft) / crop!.growthTime) * 100}%` }}
            transition={{ ease: 'linear', duration: 0.5 }}
          />
        </div>
      )}

      {isGrown ? (
        <motion.div
          animate={{ scale: [1, 1.2, 1], y: [0, -5, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="absolute -top-3 -right-3 rounded-full border border-emerald-300/70 bg-white/85 p-1 shadow-[0_8px_20px_rgba(16,185,129,0.24)] backdrop-blur-sm"
        >
          <div className="rounded-full bg-emerald-500 px-2 py-0.5 text-[8px] font-black whitespace-nowrap text-white">
            可收获
          </div>
        </motion.div>
      ) : plot.cropId && (
        <div className="pointer-events-none absolute top-2 left-1/2 flex -translate-x-1/2 items-center gap-1 rounded-full border border-white/10 bg-black/20 px-2 py-0.5 backdrop-blur-sm">
          <Timer size={8} className="text-white opacity-70" strokeWidth={3} />
          <span className="text-[8px] font-black text-white">{timeLeft}s</span>
        </div>
      )}
    </motion.div>
  );
};
