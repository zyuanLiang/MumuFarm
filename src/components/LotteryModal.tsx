import React, {useMemo, useState} from 'react';
import {AnimatePresence, motion} from 'motion/react';
import {X} from 'lucide-react';
import {
  LOTTERY_COST,
  LOTTERY_TEN_COST,
  PRIZE_POOL,
  RARITY_CONFIG,
  SKINS,
  type SkinId,
  getPrizeFallbackIcon,
} from '../constants';
import type {LotterySessionResult, PrizePoolItem} from '../types';

interface LotteryModalProps {
  gold: number;
  activeSkin: SkinId;
  onDraw: (count?: number) => void;
  onClose: () => void;
  lastLotterySession: LotterySessionResult | null;
}

const FALLBACK_PRIZE_IMAGE = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
    <defs>
      <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#0f172a"/>
        <stop offset="100%" stop-color="#1e293b"/>
      </linearGradient>
    </defs>
    <rect width="512" height="512" rx="56" fill="url(#bg)"/>
    <circle cx="256" cy="190" r="96" fill="rgba(148,163,184,0.16)"/>
    <path d="M182 314c18-44 52-66 74-66s56 22 74 66" fill="none" stroke="#f8fafc" stroke-width="18" stroke-linecap="round"/>
    <circle cx="220" cy="198" r="10" fill="#f8fafc"/>
    <circle cx="292" cy="198" r="10" fill="#f8fafc"/>
    <text x="50%" y="430" text-anchor="middle" font-size="34" font-family="Arial, sans-serif" fill="#cbd5e1">Prize Preview</text>
  </svg>`,
)}`;

const handleImageError = (event: React.SyntheticEvent<HTMLImageElement>) => {
  if (event.currentTarget.src !== FALLBACK_PRIZE_IMAGE) {
    event.currentTarget.src = FALLBACK_PRIZE_IMAGE;
  }
};

const SACRED_SPRING_TITLE = String.fromCodePoint(0x795e, 0x6cc9, 0x5546, 0x5e97);
const SACRED_SPRING_DESCRIPTION = String.fromCodePoint(
  0x732e,
  0x796d,
  0x91d1,
  0x5e01,
  0xff0c,
  0x6362,
  0x53d6,
  0x795e,
  0x6cc9,
  0x8d50,
  0x798f,
);
const SINGLE_REWARD_STATUS = String.fromCodePoint(
  0x795e,
  0x6cc9,
  0x8d50,
  0x798f,
  0xff1a,
  0x5e7b,
  0x5883,
  0x7ed3,
  0x754c,
  0x5df2,
  0x5f00,
  0x542f,
);
const BATCH_REWARD_STATUS = String.fromCodePoint(
  0x795e,
  0x6cc9,
  0x56de,
  0x5e94,
  0x4e86,
  0x5341,
  0x91cd,
  0x7948,
  0x613f,
);
const LEGENDARY_LABEL = String.fromCodePoint(0x4f20, 0x8bf4);
const EPIC_LABEL = String.fromCodePoint(0x53f2, 0x8bd7);
const BATCH_SUMMARY_PREFIX = String.fromCodePoint(0x672c, 0x6b21, 0x5171, 0x83b7, 0x5f97);
const BATCH_SUMMARY_SUFFIX = String.fromCodePoint(0x4ef6, 0x5956, 0x52b1);
const DRAWING_TEXT = String.fromCodePoint(0x7948, 0x613f, 0x4e2d, 0x002e, 0x002e, 0x002e);
const BATCH_DRAWING_TEXT = String.fromCodePoint(
  0x5341,
  0x91cd,
  0x7948,
  0x613f,
  0x4e2d,
  0x002e,
  0x002e,
  0x002e,
);
const SINGLE_DRAWING_TEXT = String.fromCodePoint(
  0x795e,
  0x6cc9,
  0x611f,
  0x5e94,
  0x4e2d,
  0x002e,
  0x002e,
  0x002e,
);

const getThemeGlyph = (reward: PrizePoolItem, activeSkin: SkinId) => {
  if (reward.type === 'skin' && activeSkin === 'sacred_spring') {
    return String.fromCodePoint(0x2726);
  }

  return getPrizeFallbackIcon(reward);
};

const RewardDisplay: React.FC<{reward: PrizePoolItem; activeSkin: SkinId}> = ({
  reward,
  activeSkin,
}) => {
  const rarityStyle = RARITY_CONFIG[reward.rarity];
  const highlightedReward = reward.rarity === 'epic' || reward.rarity === 'legendary';

  return (
    <motion.div
      className="relative flex flex-col items-center transform-gpu"
      initial={{scale: 0.8, opacity: 0}}
      animate={{scale: 1, opacity: 1}}
    >
      {highlightedReward && (
        <div className="pointer-events-none absolute -inset-12 z-0 flex items-center justify-center transform-gpu">
          <motion.div
            className="absolute inset-0 rounded-full blur-2xl mix-blend-screen"
            animate={{opacity: [0.5, 1, 0.5], scale: [0.9, 1.1, 0.9]}}
            transition={{duration: reward.rarity === 'legendary' ? 1.5 : 2.5, repeat: Infinity}}
            style={{
              background: `radial-gradient(circle at center, ${rarityStyle.color} 0%, transparent 60%)`,
            }}
          />
          {reward.rarity === 'legendary' && (
            <motion.div
              className="absolute inset-0"
              animate={{rotate: 360}}
              transition={{duration: 8, repeat: Infinity, ease: 'linear'}}
            >
              <span className="absolute -top-2 left-1/2 h-3 w-3 rounded-full bg-yellow-300 shadow-[0_0_15px_#fde047]" />
              <span className="absolute -bottom-2 left-1/2 h-2 w-2 rounded-full bg-yellow-200 shadow-[0_0_15px_#fde047]" />
              <span className="absolute left-0 top-1/2 h-3 w-3 rounded-full bg-yellow-400 shadow-[0_0_15px_#fde047]" />
              <span className="absolute right-0 top-1/2 h-2 w-2 rounded-full bg-yellow-300 shadow-[0_0_15px_#fde047]" />
            </motion.div>
          )}
        </div>
      )}

      <div
        className="relative z-10 flex flex-col items-center justify-center overflow-hidden rounded-[28px] border-2 bg-slate-900/95 p-4 shadow-2xl"
        style={{
          borderColor: `${rarityStyle.color}90`,
          boxShadow: highlightedReward
            ? `inset 0 1px 0 rgba(255,255,255,0.2), 0 0 30px ${rarityStyle.color}40`
            : 'inset 0 1px 0 rgba(255,255,255,0.18), 0 20px 40px rgba(0,0,0,0.5)',
        }}
      >
        <motion.div
          className="relative z-10 mb-4 flex h-40 w-40 items-center justify-center overflow-hidden rounded-2xl border bg-slate-950"
          style={{borderColor: `${rarityStyle.color}40`}}
        >
          <img
            src={reward.image}
            className="h-full w-full object-cover"
            alt={reward.name}
            onError={handleImageError}
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent" />
          <div className="absolute right-2 top-2 text-xl drop-shadow-md">
            {getThemeGlyph(reward, activeSkin)}
          </div>
        </motion.div>

        <div className="relative z-10 text-center">
          <h2 className="mb-1 text-xl font-black uppercase italic tracking-tighter text-white">
            {reward.name}
          </h2>
          <div
            className="inline-flex items-center rounded-full border px-3 py-1 text-[9px] font-black uppercase tracking-[0.2em]"
            style={{
              borderColor: `${rarityStyle.color}66`,
              color: rarityStyle.color,
              background: `${rarityStyle.color}15`,
            }}
          >
            {reward.rarity} REWARD
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const RewardGridDisplay: React.FC<{
  rewards: PrizePoolItem[];
  activeSkin: SkinId;
}> = ({rewards, activeSkin}) => {
  return (
    <motion.div
      className="flex w-full max-w-3xl flex-wrap justify-center gap-x-[1.875%] gap-y-3 px-1"
      variants={{
        hidden: {},
        show: {
          transition: {
            staggerChildren: 0.08,
          },
        },
      }}
      initial="hidden"
      animate="show"
    >
      {rewards.map((reward, index) => {
        const rarityStyle = RARITY_CONFIG[reward.rarity];
        const highlightedReward = reward.rarity === 'epic' || reward.rarity === 'legendary';

        return (
          <motion.div
            key={`${reward.id}-${index}`}
            variants={{
              hidden: {opacity: 0, scale: 0.7, y: 24},
              show: {opacity: 1, scale: 1, y: 0},
            }}
            transition={{type: 'spring', stiffness: 200, damping: 20}}
            className="relative flex w-[18.5%] min-w-[60px] flex-col transform-gpu will-change-transform"
          >
            {highlightedReward && (
              <div className="pointer-events-none absolute -inset-6 z-0 flex items-center justify-center transform-gpu">
                <motion.div
                  className="absolute inset-0 rounded-2xl blur-xl mix-blend-screen"
                  animate={{opacity: [0.4, 1, 0.4], scale: [0.9, 1.15, 0.9]}}
                  transition={{duration: reward.rarity === 'legendary' ? 1.4 : 2.1, repeat: Infinity}}
                  style={{
                    background: `radial-gradient(circle at center, ${rarityStyle.color} 0%, transparent 70%)`,
                  }}
                />
                {reward.rarity === 'legendary' && (
                  <motion.div
                    className="absolute inset-0"
                    animate={{rotate: 360}}
                    transition={{duration: 6, repeat: Infinity, ease: 'linear'}}
                  >
                    <span className="absolute -top-1 left-1/2 h-2 w-2 rounded-full bg-yellow-300 shadow-[0_0_10px_#fde047]" />
                    <span className="absolute -bottom-1 left-1/2 h-1.5 w-1.5 rounded-full bg-yellow-200 shadow-[0_0_10px_#fde047]" />
                  </motion.div>
                )}
              </div>
            )}

            <div
              className="relative z-10 flex h-full flex-col items-center gap-1.5 overflow-hidden rounded-[20px] border bg-slate-900/95 p-1.5 shadow-xl"
              style={{
                borderColor: `${rarityStyle.color}80`,
                boxShadow: highlightedReward
                  ? `inset 0 1px 0 rgba(255,255,255,0.2), 0 0 15px ${rarityStyle.color}40`
                  : 'inset 0 1px 0 rgba(255,255,255,0.1), 0 8px 16px rgba(0,0,0,0.5)',
              }}
            >
              <div
                className="relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-[16px] border bg-slate-900"
                style={{borderColor: `${rarityStyle.color}50`}}
              >
                <img
                  src={reward.image}
                  alt={reward.name}
                  className="h-full w-full object-cover"
                  onError={handleImageError}
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/70 to-transparent" />
                <span className="absolute right-1.5 top-1.5 text-sm drop-shadow-md">
                  {getThemeGlyph(reward, activeSkin)}
                </span>
              </div>

              <div className="w-full pb-0.5 text-center">
                <div className="line-clamp-2 text-[10px] font-black text-white">{reward.name}</div>
                <div
                  className="mt-1 text-[9px] font-black uppercase tracking-[0.18em]"
                  style={{color: rarityStyle.color}}
                >
                  {reward.rarity}
                </div>
              </div>
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
};

export const LotteryModal: React.FC<LotteryModalProps> = ({
  gold,
  activeSkin,
  onDraw,
  onClose,
  lastLotterySession,
}) => {
  const [isDrawing, setIsDrawing] = useState(false);
  const [showReward, setShowReward] = useState(false);
  const [pendingDrawCount, setPendingDrawCount] = useState<1 | 10>(1);

  const handleDraw = async (count: 1 | 10) => {
    const cost = count === 10 ? LOTTERY_TEN_COST : LOTTERY_COST;
    if (gold < cost || isDrawing) {
      return;
    }

    setPendingDrawCount(count);
    setIsDrawing(true);
    setShowReward(false);

    await new Promise((resolve) => setTimeout(resolve, 2000));

    onDraw(count);
    setIsDrawing(false);
    setShowReward(true);
  };

  const activeTheme = SKINS[activeSkin] || SKINS.default;
  const backgroundTheme = activeTheme.bgImage ? activeTheme : SKINS.sacred_spring;
  const accentColor = activeTheme.accentColor || backgroundTheme.color;
  const modalOverlay = activeTheme.modalOverlay || 'bg-black/80';
  const featuredSession = showReward ? lastLotterySession : null;
  const featuredReward = featuredSession?.primaryReward ?? null;
  const isBatchReveal = featuredSession?.drawCount === 10;
  const isLegendaryReward = featuredReward?.rarity === 'legendary';
  const highlightedReward =
    featuredReward?.rarity === 'epic' || featuredReward?.rarity === 'legendary';
  const canSingleDraw = gold >= LOTTERY_COST && !isDrawing;
  const canTenDraw = gold >= LOTTERY_TEN_COST && !isDrawing;
  const backdropGlow = featuredReward
    ? RARITY_CONFIG[featuredReward.rarity].color
    : accentColor;
  const batchBrightnessBoost = Math.max(0, (featuredSession?.highRarityCount ?? 0) - 1) * 0.12;
  const brightnessSpike = isLegendaryReward
    ? [
        'brightness(0.4) saturate(1)',
        `brightness(${1.2 + batchBrightnessBoost}) saturate(${1.45 + batchBrightnessBoost})`,
        `brightness(${0.45 + batchBrightnessBoost * 0.3}) saturate(${1.08 + batchBrightnessBoost * 0.2})`,
      ]
    : [
        'brightness(0.4) saturate(1)',
        'brightness(0.4) saturate(1)',
        'brightness(0.4) saturate(1)',
      ];
  const legendaryFlash = isLegendaryReward ? [0.06, 0.36, 0.1] : [0.08, 0.12, 0.08];

  const rewardSummaryText = useMemo(() => {
    if (!featuredSession) {
      return '';
    }

    const legendaryCount = featuredSession.displayRewards.filter(
      (reward) => reward.rarity === 'legendary',
    ).length;
    const epicCount = featuredSession.displayRewards.filter(
      (reward) => reward.rarity === 'epic',
    ).length;

    if (legendaryCount > 0 || epicCount > 0) {
      return `${LEGENDARY_LABEL} x${legendaryCount} · ${EPIC_LABEL} x${epicCount}`;
    }

    return `${BATCH_SUMMARY_PREFIX} ${featuredSession.drawCount} ${BATCH_SUMMARY_SUFFIX}`;
  }, [featuredSession]);

  return (
    <div
      className={`fixed inset-0 z-[200] flex items-center justify-center overflow-hidden p-2 backdrop-blur-lg sm:p-4 ${modalOverlay}`}
      onClick={onClose}
    >
      <div className="absolute inset-0 z-0 overflow-hidden">
        {backgroundTheme.bgImage ? (
          <motion.div
            aria-hidden="true"
            className="absolute inset-0 scale-110 brightness-[0.4] blur-[2px]"
            style={{
              backgroundImage: `url(${backgroundTheme.bgImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center center',
            }}
            animate={{
              x: [-6, 6, -6],
              y: [-4, 4, -4],
              scale: isLegendaryReward ? [1.1, 1.16, 1.12] : [1.1, 1.12, 1.1],
              filter: brightnessSpike,
            }}
            transition={{
              x: {duration: 18, repeat: Infinity, ease: 'easeInOut'},
              y: {duration: 22, repeat: Infinity, ease: 'easeInOut'},
              scale: isLegendaryReward
                ? {duration: 0.5, times: [0, 0.45, 1], ease: 'easeOut'}
                : {duration: 12, repeat: Infinity, ease: 'easeInOut'},
              filter: isLegendaryReward
                ? {duration: 0.5, times: [0, 0.45, 1], ease: 'easeOut'}
                : {duration: 12, repeat: Infinity, ease: 'linear'},
            }}
          />
        ) : (
          <motion.div
            className="absolute inset-0 scale-110"
            style={{
              background: `linear-gradient(180deg, ${backgroundTheme.secondaryColor} 0%, ${backgroundTheme.color} 100%)`,
              filter: 'brightness(0.4)',
            }}
            animate={{x: [-4, 4, -4], y: [-3, 3, -3]}}
            transition={{duration: 18, repeat: Infinity, ease: 'easeInOut'}}
          />
        )}

        <motion.div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(circle, transparent 0%, ${backgroundTheme.color}40 55%, rgba(0,0,0,0.92) 100%)`,
          }}
          animate={{opacity: legendaryFlash}}
          transition={
            isLegendaryReward
              ? {duration: 0.5, times: [0, 0.45, 1], ease: 'easeOut'}
              : {duration: 10, repeat: Infinity, ease: 'easeInOut'}
          }
        />
      </div>

      <motion.div
        initial={{scale: 0.9, opacity: 0}}
        animate={{scale: 1, opacity: 1}}
        exit={{scale: 1.1, opacity: 0}}
        onClick={(event) => event.stopPropagation()}
        className="relative flex h-[85vh] w-[95vw] max-w-4xl flex-col overflow-hidden rounded-[40px] border border-white/10 shadow-[0_0_20px_rgba(100,200,255,0.1)] backdrop-blur-lg md:h-[80vh] md:w-[90vw]"
        style={{
          background:
            'linear-gradient(180deg, rgba(7,12,24,0.4) 0%, rgba(10,18,34,0.3) 34%, rgba(6,11,23,0.4) 100%)',
          boxShadow:
            '0 0 20px rgba(100,200,255,0.1), 0 30px 100px rgba(0,0,0,0.9), inset 0 1px 0 rgba(255,255,255,0.08)',
        }}
      >
        <div className="absolute inset-0 z-0 overflow-hidden">
          <div
            className={`absolute inset-0 pointer-events-none ${highlightedReward ? 'animate-pulse' : ''}`}
            style={{
              background: `radial-gradient(circle at center, ${backdropGlow}33 0%, transparent 60%)`,
            }}
          />
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-b via-transparent to-slate-950"
            style={{
              backgroundImage: `linear-gradient(180deg, ${accentColor}1a 0%, transparent 38%, rgba(2,6,23,0.88) 100%)`,
            }}
          />
          <div className="pointer-events-none absolute left-0 top-0 h-1/2 w-full -translate-y-1/2 rounded-full bg-cyan-500/5 blur-[120px]" />
        </div>

        <button
          onClick={onClose}
          className="absolute right-6 top-6 z-50 flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/5 text-gray-400 shadow-2xl transition-all hover:border-white/20 hover:bg-white/10 hover:text-[#2DD4BF] backdrop-blur-xl"
        >
          <X size={24} strokeWidth={3} />
        </button>

        <div className="relative z-10 flex flex-1 flex-col px-4 pb-2 pt-10">
          {!featuredReward && (
            <div className="mx-auto mb-4 flex w-full max-w-3xl flex-col items-start pr-16">
              <span
                className="mb-2 text-[10px] font-black uppercase tracking-[0.36em]"
                style={{color: `${accentColor}cc`}}
              >
                Sacred Spring
              </span>
              <h2 className="text-2xl font-black tracking-tight text-white sm:text-3xl">
                {SACRED_SPRING_TITLE}
              </h2>
              <p className="mt-1 text-xs text-white/68">{SACRED_SPRING_DESCRIPTION}</p>
            </div>
          )}

          <div className="flex flex-1 flex-col items-center justify-center">
            {featuredSession && (
              <motion.div
                initial={{opacity: 0, y: 6}}
                animate={{opacity: 1, y: 0}}
                className="mb-3 flex flex-col items-center text-center"
              >
                <div className="text-sm font-black tracking-[0.12em] text-white">
                  {isBatchReveal ? BATCH_REWARD_STATUS : SINGLE_REWARD_STATUS}
                </div>
                <div className="mt-1 text-[10px] font-bold tracking-[0.2em] text-white/70">
                  {rewardSummaryText}
                </div>
              </motion.div>
            )}

            <AnimatePresence mode="wait">
              {isDrawing ? (
                <motion.div key="drawing" className="flex flex-col items-center">
                  <div className="mb-6 flex gap-4">
                    {[1, 2, 3].map((value) => (
                      <motion.span
                        key={value}
                        animate={{y: [0, -40, 0], rotate: [0, 20, -20, 0], scale: [1, 1.2, 1]}}
                        transition={{repeat: Infinity, duration: 0.7, delay: value * 0.1}}
                        className="text-5xl drop-shadow-[0_0_30px_rgba(255,255,255,0.7)]"
                      >
                        {String.fromCodePoint(0x2726)}
                      </motion.span>
                    ))}
                  </div>
                  <div className="animate-pulse rounded-full border border-teal-400/40 bg-teal-500/20 px-8 py-2 font-bold tracking-[0.4em] text-teal-100 shadow-[0_0_20px_rgba(45,212,191,0.3)] backdrop-blur-md">
                    {pendingDrawCount === 10 ? BATCH_DRAWING_TEXT : SINGLE_DRAWING_TEXT}
                  </div>
                  <div className="mt-3 text-xs font-bold tracking-[0.4em] text-teal-100/90">
                    {DRAWING_TEXT}
                  </div>
                </motion.div>
              ) : isBatchReveal && featuredSession ? (
                <RewardGridDisplay
                  key={`batch-${featuredSession.displayRewards.map((reward) => reward.id).join('-')}`}
                  rewards={featuredSession.displayRewards}
                  activeSkin={activeSkin}
                />
              ) : featuredReward ? (
                <RewardDisplay key={featuredReward.id} reward={featuredReward} activeSkin={activeSkin} />
              ) : null}
            </AnimatePresence>
          </div>
        </div>

        <div
          className="relative z-20 flex h-[35%] min-h-[220px] w-full flex-none flex-col items-center justify-between border-t border-white/10 bg-slate-900/60 p-4 backdrop-blur-lg sm:p-6 md:p-8"
          style={{
            background:
              'linear-gradient(180deg, rgba(15,23,42,0.82) 0%, rgba(8,15,28,0.72) 100%)',
            boxShadow:
              '0 -18px 80px rgba(2,6,23,0.72), inset 0 1px 0 rgba(255,255,255,0.05)',
          }}
        >
          {/* sacred shrine base */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/55 to-transparent" />
          <div
            className="pointer-events-none absolute inset-x-[12%] top-2 h-12 rounded-full blur-3xl"
            style={{backgroundColor: `${accentColor}20`}}
          />

          <div className="mb-4 flex w-full max-w-2xl items-stretch gap-3">
            {/* single-draw button - clean */}
            <button
              onClick={() => handleDraw(1)}
              disabled={!canSingleDraw}
              className={`group relative flex-1 overflow-hidden rounded-full py-3 transition-all duration-300 sm:py-5 ${
                canSingleDraw
                  ? 'hover:brightness-110 active:scale-95'
                  : 'cursor-not-allowed opacity-50 grayscale-[0.4]'
              }`}
              style={{
                background: `linear-gradient(180deg, ${accentColor} 0%, #047857 100%)`,
                boxShadow: canSingleDraw
                  ? '0 18px 32px rgba(13,148,136,0.34), inset 0 1px 0 rgba(255,255,255,0.36), inset 0 -6px 18px rgba(4,120,87,0.55)'
                  : 'inset 0 1px 0 rgba(255,255,255,0.1)',
              }}
            >
              {canSingleDraw && (
                <div className="pointer-events-none absolute inset-x-8 top-1 h-7 rounded-full bg-white/18 blur-md" />
              )}
              <div className="relative z-10 flex flex-col items-center">
                <span className="whitespace-nowrap text-lg font-black tracking-widest text-white drop-shadow-md sm:tracking-[0.2em] md:text-2xl">
                  {String.fromCodePoint(0x89e6, 0x78b0, 0x795e, 0x5723, 0x4e4b, 0x6e90)}
                </span>
                <span className="mt-1 whitespace-nowrap text-[10px] font-bold uppercase tracking-widest text-white/90 md:text-xs">
                  {String.fromCodePoint(0x732e, 0x796d, 0x20, 0x35, 0x30, 0x20, 0x91d1, 0x5e01)}
                </span>
              </div>
            </button>

            {/* ten-draw button - clean */}
            <button
              onClick={() => handleDraw(10)}
              disabled={!canTenDraw}
              className={`group relative flex-1 overflow-hidden rounded-full py-3 transition-all duration-300 sm:py-5 ${
                canTenDraw
                  ? 'hover:brightness-110 active:scale-95'
                  : 'cursor-not-allowed opacity-50 grayscale-[0.4]'
              }`}
              style={{
                background: `linear-gradient(180deg, #f59e0b 0%, ${accentColor} 100%)`,
                boxShadow: canTenDraw
                  ? '0 18px 32px rgba(217,119,6,0.28), inset 0 1px 0 rgba(255,255,255,0.36), inset 0 -6px 18px rgba(4,120,87,0.42)'
                  : 'inset 0 1px 0 rgba(255,255,255,0.1)',
              }}
            >
              {canTenDraw && (
                <div className="pointer-events-none absolute inset-x-8 top-1 h-7 rounded-full bg-white/18 blur-md" />
              )}
              {canTenDraw && (
                <div className="pointer-events-none absolute right-3 top-2 rounded-full border border-white/15 bg-white/10 px-2 py-0.5 text-[10px] font-black tracking-[0.22em] text-white backdrop-blur-md">
                  {String.fromCodePoint(0x7acb, 0x7701, 0x20, 0x35, 0x30)}
                </div>
              )}
              <div className="relative z-10 flex flex-col items-center">
                <span className="whitespace-nowrap text-lg font-black tracking-widest text-white drop-shadow-md sm:tracking-[0.2em] md:text-2xl">
                  {'10 ' + String.fromCodePoint(0x91cd, 0x7948, 0x613f)}
                </span>
                <span className="mt-1 whitespace-nowrap text-[10px] font-bold uppercase tracking-widest text-white/90 md:text-xs">
                  {String.fromCodePoint(0x732e, 0x796d, 0x20, 0x34, 0x35, 0x30, 0x20, 0x91d1, 0x5e01)}
                </span>
              </div>
            </button>
          </div>

          <div
            className="no-scrollbar flex w-full items-center justify-start gap-3 overflow-x-auto overflow-y-hidden px-4 pb-2 sm:justify-center sm:gap-4"
            style={{
              maskImage: 'linear-gradient(to right, transparent, black 5%, black 95%, transparent)',
              WebkitMaskImage:
                'linear-gradient(to right, transparent, black 5%, black 95%, transparent)',
            }}
          >
            {PRIZE_POOL.map((item) => {
              const rarityStyle = RARITY_CONFIG[item.rarity];

              return (
                <div
                  key={item.id}
                  className="group flex w-16 flex-shrink-0 flex-col items-center rounded-[22px] border border-white/8 bg-slate-950/40 p-2 backdrop-blur-lg sm:w-20"
                  style={{
                    boxShadow:
                      'inset 0 1px 0 rgba(255,255,255,0.06), 0 10px 24px rgba(2,6,23,0.28)',
                  }}
                >
                  <div
                    className="relative h-12 w-12 overflow-hidden rounded-[18px] border bg-white/8 backdrop-blur-xl transition-all group-hover:-translate-y-1 group-hover:scale-105 sm:h-16 sm:w-16"
                    style={{
                      borderColor: `${rarityStyle.color}66`,
                      boxShadow: `${rarityStyle.shadow}, inset 0 1px 0 rgba(255,255,255,0.18)`,
                    }}
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-full w-full object-cover"
                      onError={handleImageError}
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/70 to-transparent" />
                    <span className="absolute right-1 top-1 text-sm">{getThemeGlyph(item, activeSkin)}</span>
                  </div>
                  <span
                    className="mt-2 text-center text-[9px] font-black leading-tight text-white/80 sm:text-[10px]"
                    style={{textShadow: '0 1px 6px rgba(2, 6, 23, 0.9)'}}
                  >
                    {item.name}
                  </span>
                  <span
                    className="mt-1 text-[9px] font-black sm:text-[10px]"
                    style={{color: rarityStyle.color}}
                  >
                    {item.weight}%
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </motion.div>
    </div>
  );
};
