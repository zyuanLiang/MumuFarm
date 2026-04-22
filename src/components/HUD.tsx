import React, { useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Coins, Trophy, Sprout } from 'lucide-react';
import { resolveGoldDebugClick } from './hudGoldDebug';

interface HUDProps {
  gold: number;
  level: number;
  xp: number;
  xpToNextLevel: number;
  onGoldDoubleClick?: () => void;
}

export const HUD: React.FC<HUDProps> = ({ gold, level, xp, xpToNextLevel, onGoldDoubleClick }) => {
  const xpPercentage = Math.min((xp / xpToNextLevel) * 100, 100);
  const lastGoldClickAtRef = useRef<number | null>(null);

  const handleGoldClick = () => {
    const nextState = resolveGoldDebugClick(lastGoldClickAtRef.current, Date.now());
    lastGoldClickAtRef.current = nextState.lastClickAt;

    if (nextState.shouldTrigger) {
      onGoldDoubleClick?.();
    }
  };

  return (
    <div className="fixed top-0 left-0 w-full p-4 md:p-6 z-50 flex items-start justify-between pointer-events-none gap-4">
      {/* Left Area */}
      <div className="flex flex-col gap-2 md:gap-3 pointer-events-auto items-start">
        {/* Small Delicate Logo */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex items-center gap-2 px-2"
        >
          <span className="text-xl drop-shadow-sm"><Sprout size={20} className="text-emerald-500 fill-emerald-100" /></span>
          <h1 className="text-sm font-black text-emerald-800 tracking-widest uppercase drop-shadow-[0_2px_0_rgba(255,255,255,0.5)]">
            mumu农场
          </h1>
        </motion.div>

        <div className="flex gap-4">
          {/* Gold Display */}
          <motion.div 
            id="gold-bag-ui"
            className="vibrant-card px-4 md:px-5 py-1.5 md:py-2 flex items-center gap-2 md:gap-3 shadow-lg cursor-pointer"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            onClick={handleGoldClick}
            title="连续点击两次可增加 10000 金币"
          >
            <span className="text-xl md:text-2xl drop-shadow-sm">💰</span>
            <span className="font-bold text-amber-900 text-lg md:text-xl tracking-tight">{gold.toLocaleString()}</span>
          </motion.div>

          {/* Energy/XP Display */}
          <motion.div 
            className="vibrant-card px-4 py-1.5 items-center gap-3 shadow-lg hidden sm:flex"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <span className="text-xl drop-shadow-sm">⚡</span>
            <div className="w-32 sm:w-40 h-3 bg-gray-200 rounded-full border border-slate-700 overflow-hidden shadow-inner hidden md:block">
              <motion.div 
                className="h-full bg-gradient-to-r from-red-400 to-red-600"
                animate={{ width: `${xpPercentage}%` }}
                transition={{ type: "spring", stiffness: 50 }}
              />
            </div>
            <span className="text-[10px] font-black text-amber-900 leading-none">
              {xp}/{xpToNextLevel}
            </span>
            <span className="text-slate-800 font-black text-sm text-shadow-sm ml-1">Lv.{level}</span>
          </motion.div>
        </div>
      </div>

      {/* Right Area */}
      <div className="flex flex-row gap-2 md:gap-4 pointer-events-auto items-center">
        <motion.div 
          className="vibrant-card bg-amber-400 border-amber-600 px-3 md:px-5 py-1.5 md:py-2 flex flex-col items-center justify-center min-w-[60px] md:min-w-[100px] shadow-lg text-amber-900"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="text-[8px] md:text-[10px] font-black tracking-widest uppercase opacity-70">春季</div>
          <div className="text-lg md:text-3xl font-black leading-none mt-0.5 md:mt-1">12</div>
        </motion.div>

        <motion.div 
          className="vibrant-card px-3 md:px-5 py-1 md:py-2 flex items-center gap-1.5 md:gap-3 shadow-lg"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <span className="text-base md:text-2xl drop-shadow-sm">🏆</span>
          <span className="font-bold text-amber-900 text-sm md:text-xl tracking-tight leading-none pt-0.5">LV. {level}</span>
        </motion.div>
      </div>
    </div>
  );
};
