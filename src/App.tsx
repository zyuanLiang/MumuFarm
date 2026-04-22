import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {AnimatePresence, motion} from 'motion/react';
import {Dices, Package, Sparkles, Sprout, Wheat} from 'lucide-react';
import {LotteryModal} from './components/LotteryModal';
import {HUD} from './components/HUD';
import {InventoryModal} from './components/InventoryModal';
import {Plot} from './components/Plot';
import {SeedSelector} from './components/SeedSelector';
import {CROPS, SKINS} from './constants';
import {
  commitHarvestAll,
  commitPlantAll,
  getEmptyPlotIds,
  planHarvestAll,
  planPlantAll,
  useGameActions,
} from './hooks/useGameActions';
import {useGameState} from './hooks/useGameState';
import type {CropType, LotteryEffect, LotterySessionResult} from './types';

type BulkActionType = 'plant' | 'harvest' | null;
type BulkPlotPhase = 'idle' | 'plant-target' | 'plant-impact' | 'harvest-lift' | 'harvest-cleared';

interface HarvestFlight {
  id: string;
  plotId: number;
  sequenceIndex: number;
  rewardGold: number;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
}

interface PlantFlight {
  id: string;
  plotId: number;
  sequenceIndex: number;
  seedId: CropType;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
}

const HARVEST_STAGGER_MS = 50;
const HARVEST_FLIGHT_MS = 550;
const HARVEST_COMMIT_OFFSET_MS = 450;
const PLANT_STAGGER_MS = 60;
const PLANT_FLIGHT_MS = 500;
const PLANT_IMPACT_MS = 180;

export default function App() {
  const {
    gameState,
    setGameState,
    xpToNextLevel,
    levelUpEvent,
    clearLevelUpEvent,
    isInventoryOpen,
    activeInventoryTab,
    openInventory,
    closeInventory,
    setActiveInventoryTab,
    setActiveSkin,
  } = useGameState();
  const [selectedSeed, setSelectedSeed] = useState<CropType>('wheat');
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [showLottery, setShowLottery] = useState(false);
  const [lastLotterySession, setLastLotterySession] = useState<LotterySessionResult | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showDivineFlare, setShowDivineFlare] = useState(false);
  const [showCyberAurora, setShowCyberAurora] = useState(false);
  const [showLotteryCoins, setShowLotteryCoins] = useState(false);
  const [showLotteryButterflies, setShowLotteryButterflies] = useState(false);
  const [showLotterySparkles, setShowLotterySparkles] = useState(false);
  const [lotteryCoinCount, setLotteryCoinCount] = useState(18);
  const [lotteryButterflyCount, setLotteryButterflyCount] = useState(14);
  const [lotterySparkleCount, setLotterySparkleCount] = useState(20);
  const [cyberAuroraIntensity, setCyberAuroraIntensity] = useState(1);
  const [activeBulkAction, setActiveBulkAction] = useState<BulkActionType>(null);
  const [isBulkBusy, setIsBulkBusy] = useState(false);
  const [bulkAnimatedPlotIds, setBulkAnimatedPlotIds] = useState<number[]>([]);
  const [bulkHarvestFlights, setBulkHarvestFlights] = useState<HarvestFlight[]>([]);
  const [bulkPlantFlights, setBulkPlantFlights] = useState<PlantFlight[]>([]);
  const [bulkActivePlotId, setBulkActivePlotId] = useState<number | null>(null);
  const [bulkPlotPhases, setBulkPlotPhases] = useState<Record<number, BulkPlotPhase>>({});
  const [nowTick, setNowTick] = useState(() => Date.now());
  const bulkTimeoutsRef = React.useRef<number[]>([]);

  useEffect(() => {
    const handlePointerUp = () => setIsDragging(false);
    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('touchend', handlePointerUp);
    window.addEventListener('touchcancel', handlePointerUp);

    return () => {
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('touchend', handlePointerUp);
      window.removeEventListener('touchcancel', handlePointerUp);
    };
  }, []);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setNowTick(Date.now());
    }, 1000);

    return () => window.clearInterval(interval);
  }, []);

  const clearBulkTimeouts = useCallback(() => {
    bulkTimeoutsRef.current.forEach((timeoutId) => window.clearTimeout(timeoutId));
    bulkTimeoutsRef.current = [];
  }, []);

  const registerBulkTimeout = useCallback((callback: () => void, delay: number) => {
    const timeoutId = window.setTimeout(callback, delay);
    bulkTimeoutsRef.current.push(timeoutId);
  }, []);

  const resetBulkVisuals = useCallback(() => {
    setBulkAnimatedPlotIds([]);
    setBulkHarvestFlights([]);
    setBulkPlantFlights([]);
    setBulkActivePlotId(null);
    setBulkPlotPhases({});
  }, []);

  useEffect(() => {
    return () => {
      clearBulkTimeouts();
    };
  }, [clearBulkTimeouts]);

  useEffect(() => {
    if (!levelUpEvent) {
      return;
    }

    setShowLevelUp(true);
    const timeout = window.setTimeout(() => {
      setShowLevelUp(false);
      clearLevelUpEvent();
    }, 3000);

    return () => window.clearTimeout(timeout);
  }, [clearLevelUpEvent, levelUpEvent]);

  const currentSkin = useMemo(
    () => SKINS[gameState.activeSkin] || SKINS.default,
    [gameState.activeSkin],
  );

  const harvestAllPlan = useMemo(() => planHarvestAll(gameState, nowTick), [gameState, nowTick]);
  const plantAllPlan = useMemo(() => planPlantAll(gameState, selectedSeed, nowTick), [gameState, nowTick, selectedSeed]);
  const emptyPlotIds = useMemo(() => getEmptyPlotIds(gameState), [gameState]);

  const harvestDisabled = isBulkBusy || harvestAllPlan.blockedReason !== 'none';
  const plantDisabled =
    isBulkBusy || emptyPlotIds.length === 0 || plantAllPlan.blockedReason !== 'none';

  const getElementCenter = useCallback((selector: string) => {
    const element = document.querySelector(selector);
    if (!element) {
      return null;
    }

    const rect = element.getBoundingClientRect();
    return {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    };
  }, []);

  const getPlotCenter = useCallback(
    (plotId: number) => getElementCenter(`[data-plot-id="${plotId}"]`),
    [getElementCenter],
  );

  const getSeedLaunchAnchor = useCallback(() => getElementCenter('#bulk-seed-launch-anchor'), [getElementCenter]);
  const getGoldBagAnchor = useCallback(() => getElementCenter('#gold-bag-ui'), [getElementCenter]);

  const triggerDivineFlare = useCallback(() => {
    setShowDivineFlare(true);
    window.setTimeout(() => setShowDivineFlare(false), 4000);
  }, []);

  const triggerCyberAurora = useCallback((intensity = 1) => {
    setCyberAuroraIntensity(intensity);
    setShowCyberAurora(true);
    window.setTimeout(() => setShowCyberAurora(false), 3000);
  }, []);

  const triggerLotteryCoins = useCallback((count = 18) => {
    setLotteryCoinCount(count);
    setShowLotteryCoins(true);
    window.setTimeout(() => setShowLotteryCoins(false), 1400);
  }, []);

  const triggerLotteryButterflies = useCallback((count = 14) => {
    setLotteryButterflyCount(count);
    setShowLotteryButterflies(true);
    window.setTimeout(() => setShowLotteryButterflies(false), 2000);
  }, []);

  const triggerLotterySparkles = useCallback((count = 20) => {
    setLotterySparkleCount(count);
    setShowLotterySparkles(true);
    window.setTimeout(() => setShowLotterySparkles(false), 1800);
  }, []);

  const applyLotteryEffect = useCallback(
    (effect: LotteryEffect, session: LotterySessionResult) => {
      const isTenDraw = session.drawCount === 10;
      const highRarityCount = session.highRarityCount;

      if (effect.triggerCoins) {
        triggerLotteryCoins(isTenDraw ? 24 + highRarityCount * 4 : 18);
      }

      if (effect.triggerButterflies) {
        triggerLotteryButterflies(isTenDraw ? 20 + highRarityCount * 8 : 14);
      }

      if (effect.triggerSparkles) {
        triggerLotterySparkles(isTenDraw ? 22 + highRarityCount * 6 : 20);
      }

      if (effect.triggerRainbow) {
        triggerCyberAurora(isTenDraw ? 1 + highRarityCount * 0.2 : 1);
      }
    },
    [triggerCyberAurora, triggerLotteryButterflies, triggerLotteryCoins, triggerLotterySparkles],
  );

  const showHarvestFeedback = useCallback((plotId: number, finalGold: number, goldMultiplier: number) => {
    const floatingText = document.createElement('div');
    floatingText.innerText = `+${finalGold} 🪙`;
    if (goldMultiplier > 1) {
      floatingText.innerText += ' (BOOST!)';
      floatingText.className =
        'fixed font-black text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.8)] pointer-events-none z-50 transition-all duration-700 ease-in text-2xl';
    } else {
      floatingText.className =
        'fixed font-black text-yellow-500 drop-shadow-md pointer-events-none z-50 transition-all duration-700 ease-in text-xl';
    }

    const plotElement = document.querySelector(`[data-plot-id="${plotId}"]`);
    const goldBagElement = document.getElementById('gold-bag-ui');

    if (!plotElement) {
      return;
    }

    const rect = plotElement.getBoundingClientRect();
    const startX = rect.left + rect.width / 2;
    const startY = rect.top + rect.height / 2;

    floatingText.style.left = `${startX}px`;
    floatingText.style.top = `${startY}px`;
    floatingText.style.transform = 'translate(-50%, -50%) scale(1.5)';
    document.body.appendChild(floatingText);

    requestAnimationFrame(() => {
      floatingText.style.transform = 'translate(-50%, calc(-50% - 40px)) scale(2)';

      window.setTimeout(() => {
        if (goldBagElement) {
          const destRect = goldBagElement.getBoundingClientRect();
          const destX = destRect.left + destRect.width / 2 - startX;
          const destY = destRect.top + destRect.height / 2 - startY;
          floatingText.style.transform = `translate(calc(-50% + ${destX}px), calc(-50% + ${destY}px)) scale(0.5)`;
          floatingText.style.opacity = '0.5';
        } else {
          floatingText.style.transform = 'translate(-50%, -150px) scale(0)';
          floatingText.style.opacity = '0';
        }
      }, 300);
    });

    window.setTimeout(() => floatingText.remove(), 1000);
  }, []);

  const {handlePlant, handleHarvest, handleDraw, handleUseProp, handleAddGold} = useGameActions({
    gameState,
    setGameState,
    selectedSeed,
    onHarvestFeedback: ({plotId, finalGold, goldMultiplier}) =>
      showHarvestFeedback(plotId, finalGold, goldMultiplier),
    onDivineFlare: triggerDivineFlare,
    onCyberAurora: triggerCyberAurora,
    onLotteryResolved: (result) => {
      setLastLotterySession(result);
      applyLotteryEffect(result.summaryEffect, result);
    },
    onNoGrowablePlots: () => {
      window.alert('当前没有正在生长的作物！');
    },
  });

  const handleTouchMove = useCallback(
    (event: React.TouchEvent | TouchEvent | React.PointerEvent) => {
      if (!isDragging || isBulkBusy) {
        return;
      }

      let clientX = 0;
      let clientY = 0;
      if ('touches' in event) {
        if (!event.touches || event.touches.length === 0) {
          return;
        }

        clientX = event.touches[0].clientX;
        clientY = event.touches[0].clientY;
      } else {
        clientX = event.clientX;
        clientY = event.clientY;
      }

      const target = document.elementFromPoint(clientX, clientY);
      const plotId = target?.closest('[data-plot-id]')?.getAttribute('data-plot-id');
      if (plotId) {
        handleHarvest(Number(plotId));
      }
    },
    [handleHarvest, isBulkBusy, isDragging],
  );

  const handleGoldDebugBoost = useCallback(() => {
    handleAddGold(10_000);
  }, [handleAddGold]);

  const handlePlantAllClick = useCallback(() => {
    if (isBulkBusy) {
      return;
    }

    const plan = planPlantAll(gameState, selectedSeed, Date.now());
    if (plan.blockedReason !== 'none') {
      return;
    }

    clearBulkTimeouts();
    resetBulkVisuals();

    const now = Date.now();
    const seedAnchor = getSeedLaunchAnchor();
    const commitResult = commitPlantAll(gameState, plan.plotIds, selectedSeed, now);
    const flights = commitResult.plotIds.flatMap((plotId, sequenceIndex) => {
      const target = getPlotCenter(plotId);
      if (!seedAnchor || !target) {
        return [];
      }

      return [
        {
          id: `plant_${plotId}_${now}_${sequenceIndex}`,
          plotId,
          sequenceIndex,
          seedId: selectedSeed,
          startX: seedAnchor.x,
          startY: seedAnchor.y,
          endX: target.x,
          endY: target.y,
        } satisfies PlantFlight,
      ];
    });

    setActiveBulkAction('plant');
    setIsBulkBusy(true);
    setBulkPlantFlights(flights);
    setBulkAnimatedPlotIds(commitResult.plotIds);
    setGameState(commitResult.nextState);

    commitResult.plotIds.forEach((plotId, sequenceIndex) => {
      const targetDelay = sequenceIndex * PLANT_STAGGER_MS;
      const impactDelay = targetDelay + Math.max(120, PLANT_FLIGHT_MS - 140);

      registerBulkTimeout(() => {
        setBulkActivePlotId(plotId);
        setBulkPlotPhases((previous) => ({...previous, [plotId]: 'plant-target'}));
      }, targetDelay);

      registerBulkTimeout(() => {
        setBulkActivePlotId(plotId);
        setBulkPlotPhases((previous) => ({...previous, [plotId]: 'plant-impact'}));
      }, impactDelay);

      registerBulkTimeout(() => {
        setBulkPlotPhases((previous) => ({...previous, [plotId]: 'idle'}));
        setBulkActivePlotId((previous) => (previous === plotId ? null : previous));
      }, impactDelay + PLANT_IMPACT_MS);
    });

    const totalDuration = flights.length > 0
      ? (Math.max(...flights.map((flight) => flight.sequenceIndex)) * PLANT_STAGGER_MS) + PLANT_FLIGHT_MS + PLANT_IMPACT_MS
      : PLANT_FLIGHT_MS;

    registerBulkTimeout(() => {
      resetBulkVisuals();
      setActiveBulkAction(null);
      setIsBulkBusy(false);
    }, totalDuration);
  }, [
    clearBulkTimeouts,
    gameState,
    getPlotCenter,
    getSeedLaunchAnchor,
    isBulkBusy,
    registerBulkTimeout,
    resetBulkVisuals,
    selectedSeed,
    setGameState,
  ]);

  const handleHarvestAllClick = useCallback(() => {
    if (isBulkBusy) {
      return;
    }

    const now = Date.now();
    const plan = planHarvestAll(gameState, now);
    if (plan.blockedReason !== 'none') {
      return;
    }

    clearBulkTimeouts();
    resetBulkVisuals();

    const goldAnchor = getGoldBagAnchor();
    const flights = plan.perPlot.flatMap((item, sequenceIndex) => {
      const start = getPlotCenter(item.plotId);
      if (!start || !goldAnchor) {
        return [];
      }

      return [
        {
          id: `harvest_${item.plotId}_${now}_${sequenceIndex}`,
          plotId: item.plotId,
          sequenceIndex,
          rewardGold: item.rewardGold,
          startX: start.x,
          startY: start.y,
          endX: goldAnchor.x,
          endY: goldAnchor.y,
        } satisfies HarvestFlight,
      ];
    });

    setActiveBulkAction('harvest');
    setIsBulkBusy(true);
    setBulkHarvestFlights(flights);
    setBulkAnimatedPlotIds(plan.plotIds);

    plan.plotIds.forEach((plotId, sequenceIndex) => {
      const launchDelay = sequenceIndex * HARVEST_STAGGER_MS;

      registerBulkTimeout(() => {
        setBulkActivePlotId(plotId);
        setBulkPlotPhases((previous) => ({...previous, [plotId]: 'harvest-lift'}));
      }, launchDelay);
    });

    const commitDelay =
      (Math.max(plan.plotIds.length - 1, 0) * HARVEST_STAGGER_MS) + HARVEST_COMMIT_OFFSET_MS;

    registerBulkTimeout(() => {
      const result = commitHarvestAll(gameState, plan.plotIds, now);
      setGameState(result.nextState);
      setBulkPlotPhases((previous) =>
        result.plotIds.reduce<Record<number, BulkPlotPhase>>(
          (next, plotId) => ({...next, [plotId]: 'harvest-cleared'}),
          {...previous},
        ),
      );
    }, commitDelay);

    const totalDuration =
      (Math.max(plan.plotIds.length - 1, 0) * HARVEST_STAGGER_MS) + HARVEST_FLIGHT_MS;

    registerBulkTimeout(() => {
      resetBulkVisuals();
      setActiveBulkAction(null);
      setIsBulkBusy(false);
    }, totalDuration + 120);
  }, [
    clearBulkTimeouts,
    gameState,
    getGoldBagAnchor,
    getPlotCenter,
    isBulkBusy,
    registerBulkTimeout,
    resetBulkVisuals,
    setGameState,
  ]);

  return (
    <div className={`game-world relative min-h-screen overflow-x-hidden px-4 pb-48 pt-20 transition-all duration-1000 ${currentSkin.bgClass}`}>
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSkin.id}
          initial={{opacity: 0}}
          animate={{opacity: 1}}
          exit={{opacity: 0}}
          transition={{duration: 0.45, ease: 'easeInOut'}}
          className="pointer-events-none absolute inset-0"
          style={
            currentSkin.bgImage
              ? {
                  backgroundImage: `url(${currentSkin.bgImage})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center 85%',
                  backgroundAttachment: 'fixed',
                }
              : {
                  background: `linear-gradient(to bottom, ${currentSkin.secondaryColor} 0%, ${currentSkin.secondaryColor} 30%, ${currentSkin.color} 30%, ${currentSkin.color} 100%)`,
                }
          }
        >
          {currentSkin.bgImage ? <div className="absolute inset-0 bg-black/10" /> : null}
        </motion.div>
      </AnimatePresence>

      <HUD
        gold={gameState.gold}
        level={gameState.level}
        xp={gameState.xp}
        xpToNextLevel={xpToNextLevel}
        onGoldDoubleClick={handleGoldDebugBoost}
      />

      <div className="max-w-6xl w-full flex flex-col items-center relative z-10 pt-16">
        <AnimatePresence>
          {showLotteryCoins && (
            <motion.div
              initial={{opacity: 0}}
              animate={{opacity: 1}}
              exit={{opacity: 0}}
              className="fixed inset-0 z-[99] pointer-events-none overflow-hidden"
            >
              {Array.from({length: lotteryCoinCount}).map((_, index) => (
                <motion.div
                  key={index}
                  initial={{x: 0, y: 0, scale: 0.5, opacity: 0}}
                  animate={{
                    x: (Math.random() - 0.5) * window.innerWidth * 0.8,
                    y: (Math.random() - 0.5) * window.innerHeight * 0.7,
                    scale: [0.6, 1.2, 0.3],
                    opacity: [0, 1, 0],
                    rotate: Math.random() * 240 - 120,
                  }}
                  transition={{duration: 1.1, ease: 'easeOut', delay: index * 0.02}}
                  className="absolute left-1/2 top-1/2 text-3xl sm:text-4xl drop-shadow-[0_0_12px_rgba(251,191,36,0.9)]"
                >
                  🪙
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showLotteryButterflies && (
            <motion.div
              initial={{opacity: 0}}
              animate={{opacity: 1}}
              exit={{opacity: 0}}
              className="fixed inset-0 z-[100] pointer-events-none overflow-hidden"
            >
              {Array.from({length: lotteryButterflyCount}).map((_, index) => (
                <motion.div
                  key={index}
                  initial={{x: 0, y: 0, scale: 0.3, opacity: 0}}
                  animate={{
                    x: (Math.random() - 0.5) * window.innerWidth,
                    y: (Math.random() - 0.5) * window.innerHeight,
                    scale: [0.4, 1.1, 0.2],
                    opacity: [0, 1, 0],
                    rotate: Math.random() * 360,
                  }}
                  transition={{duration: 1.6, ease: 'easeOut', delay: index * 0.03}}
                  className="absolute left-1/2 top-1/2 text-4xl"
                >
                  🦋
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showLotterySparkles && (
            <motion.div
              initial={{opacity: 0}}
              animate={{opacity: 1}}
              exit={{opacity: 0}}
              className="fixed inset-0 z-[100] pointer-events-none overflow-hidden"
            >
              {Array.from({length: lotterySparkleCount}).map((_, index) => (
                <motion.div
                  key={index}
                  initial={{x: 0, y: 0, scale: 0.3, opacity: 0}}
                  animate={{
                    x: (Math.random() - 0.5) * window.innerWidth * 0.9,
                    y: (Math.random() - 0.5) * window.innerHeight * 0.8,
                    scale: [0.2, 1.2, 0.4],
                    opacity: [0, 1, 0],
                    rotate: Math.random() * 360,
                  }}
                  transition={{duration: 1.4, ease: 'easeOut', delay: index * 0.02}}
                  className="absolute left-1/2 top-1/2 text-white"
                >
                  <Sparkles size={34} className="drop-shadow-[0_0_18px_rgba(255,255,255,0.9)]" />
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showDivineFlare && (
            <motion.div
              initial={{opacity: 0}}
              animate={{opacity: 1}}
              exit={{opacity: 0}}
              className="fixed inset-0 z-[101] pointer-events-none flex items-center justify-center overflow-hidden"
            >
              <motion.div
                initial={{scale: 0, opacity: 0}}
                animate={{scale: [1, 3], opacity: [0.8, 0]}}
                transition={{duration: 1.5, ease: 'easeOut'}}
                className="absolute inset-0 bg-teal-300 pointer-events-none"
                style={{mixBlendMode: 'screen', filter: 'brightness(2) saturate(1.5)'}}
              />

              <motion.div
                initial={{x: -100, y: 100, scale: 0, rotate: 45}}
                animate={{x: 100, y: -100, scale: 2, rotate: 135}}
                transition={{duration: 2, ease: 'easeOut'}}
                className="absolute text-8xl drop-shadow-[0_0_30px_#fff]"
              >
                💎
              </motion.div>

              <motion.div
                initial={{x: 100, y: 100, scale: 0, rotate: -45}}
                animate={{x: -100, y: -100, scale: 2, rotate: -135}}
                transition={{duration: 2, ease: 'easeOut'}}
                className="absolute text-8xl drop-shadow-[0_0_30px_#fff]"
              >
                💎
              </motion.div>

              {[...Array(24)].map((_, index) => (
                <motion.div
                  key={index}
                  initial={{x: 0, y: 0, scale: 0, opacity: 1}}
                  animate={{
                    x: (Math.random() - 0.5) * window.innerWidth * 1.5,
                    y: (Math.random() - 0.5) * window.innerHeight * 1.5,
                    scale: Math.random() * 1.5 + 0.5,
                    opacity: 0,
                    rotate: Math.random() * 360,
                  }}
                  transition={{duration: 2 + Math.random() * 2, ease: 'easeOut'}}
                  className="absolute text-teal-300"
                >
                  <Sparkles size={24} className="drop-shadow-[0_0_15px_rgba(45,212,191,0.8)]" />
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showCyberAurora && (
            <motion.div
              initial={{opacity: 0}}
              animate={{opacity: 1}}
              exit={{opacity: 0}}
              className="fixed inset-0 z-[102] pointer-events-none overflow-hidden"
            >
              <motion.div
                animate={{
                  backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'],
                }}
                transition={{duration: 10, repeat: Infinity, ease: 'linear'}}
                className="absolute top-0 left-0 w-full h-[40vh]"
                style={{
                  background: 'radial-gradient(ellipse at top, #d946ef 0%, #06b6d4 50%, transparent 100%)',
                  backgroundSize: '200% 200%',
                  mixBlendMode: 'screen',
                  opacity: Math.min(0.95, 0.6 * cyberAuroraIntensity),
                }}
              />

              <motion.div
                initial={{scaleX: 0, opacity: 0}}
                animate={{scaleX: 1, opacity: Math.min(1, 0.8 * cyberAuroraIntensity)}}
                exit={{opacity: 0}}
                transition={{duration: 0.8}}
                className="absolute top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[40vw] max-w-[800px] max-h-[400px] rounded-t-full border-t-[20px] border-l-[20px] border-r-[20px] border-transparent scale-y-50 origin-bottom"
                style={{
                  borderImage: 'linear-gradient(to right, #ec4899, #8b5cf6, #3b82f6) 1',
                  filter: 'drop-shadow(0 0 20px #d946ef)',
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {bulkHarvestFlights.map((flight) => {
            const xDistance = flight.endX - flight.startX;
            const yDistance = flight.endY - flight.startY;

            return (
              <motion.div
                key={flight.id}
                initial={{x: 0, y: 0, scale: 0.75, opacity: 0}}
                animate={{
                  x: [0, xDistance * 0.45, xDistance],
                  y: [0, yDistance - 48, yDistance],
                  scale: [0.8, 1.12, 0.5],
                  opacity: [0, 1, 0.85],
                }}
                exit={{opacity: 0, scale: 0.2}}
                transition={{
                  duration: HARVEST_FLIGHT_MS / 1000,
                  ease: 'easeOut',
                  delay: flight.sequenceIndex * (HARVEST_STAGGER_MS / 1000),
                }}
                onAnimationComplete={() => {
                  setBulkHarvestFlights((previous) => previous.filter((item) => item.id !== flight.id));
                }}
                className="fixed left-0 top-0 z-[88] pointer-events-none text-2xl sm:text-3xl drop-shadow-[0_0_12px_rgba(251,191,36,0.85)]"
                style={{left: flight.startX, top: flight.startY}}
              >
                🪙
              </motion.div>
            );
          })}
        </AnimatePresence>

        <AnimatePresence>
          {bulkPlantFlights.map((flight) => {
            const xDistance = flight.endX - flight.startX;
            const yDistance = flight.endY - flight.startY;

            return (
              <motion.div
                key={flight.id}
                initial={{x: 0, y: 0, scale: 0.6, opacity: 0}}
                animate={{
                  x: [0, xDistance * 0.42, xDistance],
                  y: [0, yDistance - 36, yDistance],
                  rotate: [0, 12, 0],
                  scale: [0.6, 0.95, 0.82],
                  opacity: [0, 1, 0.9],
                }}
                exit={{opacity: 0, scale: 0.2}}
                transition={{
                  duration: PLANT_FLIGHT_MS / 1000,
                  ease: 'easeOut',
                  delay: flight.sequenceIndex * (PLANT_STAGGER_MS / 1000),
                }}
                onAnimationComplete={() => {
                  setBulkPlantFlights((previous) => previous.filter((item) => item.id !== flight.id));
                }}
                className="fixed left-0 top-0 z-[87] pointer-events-none text-2xl sm:text-3xl drop-shadow-[0_0_10px_rgba(255,255,255,0.7)]"
                style={{left: flight.startX, top: flight.startY}}
              >
                {CROPS[flight.seedId].icon}
              </motion.div>
            );
          })}
        </AnimatePresence>

        <div className="fixed top-24 right-2 sm:right-8 flex flex-col gap-3 sm:gap-4 z-[40]">
          <button
            onClick={() => setShowLottery(true)}
            className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-amber-400 border-4 border-amber-600 flex items-center justify-center shadow-[0_4px_0_#b45309] sm:shadow-[0_6px_0_#b45309] hover:translate-y-[-2px] active:translate-y-[4px] active:shadow-none transition-all group relative"
          >
            <Dices className="w-6 h-6 sm:w-8 sm:h-8 text-amber-800" />
            <div className="absolute right-full mr-4 bg-slate-800 text-white text-[10px] font-black px-2 py-1 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap pointer-events-none transition-opacity hidden sm:block">
              幸运抽奖
            </div>
          </button>

          <button
            onClick={() => openInventory('items')}
            className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-blue-400 border-4 border-blue-600 flex items-center justify-center shadow-[0_4px_0_#2563eb] sm:shadow-[0_6px_0_#2563eb] hover:translate-y-[-2px] active:translate-y-[4px] active:shadow-none transition-all group relative"
          >
            <Package className="w-6 h-6 sm:w-8 sm:h-8 text-blue-900" />
            <div className="absolute right-full mr-4 bg-slate-800 text-white text-[10px] font-black px-2 py-1 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap pointer-events-none transition-opacity hidden sm:block">
              背包与衣橱
            </div>
          </button>
        </div>

        <div className="flex gap-12 items-start w-full justify-center relative pt-8 md:pt-16 sm:min-h-[500px] mb-[200px]">
          <div className="relative farm-field scale-[0.55] sm:scale-[0.6] lg:scale-[0.65] transform-gpu origin-center">
            <div
              className="planter-box p-6 w-[760px] aspect-[2/1] flex items-center justify-center relative z-20 touch-none"
              onPointerDown={() => setIsDragging(true)}
              onPointerMove={handleTouchMove}
              onTouchMove={handleTouchMove}
            >
              <motion.div
                layout
                className="grid grid-cols-4 gap-6 p-8 rounded-[36px] bg-emerald-950/20 w-full h-full"
              >
                {gameState.plots.map((plot) => (
                  <Plot
                    key={plot.id}
                    plot={plot}
                    onPlant={handlePlant}
                    onHarvest={handleHarvest}
                    isDragging={isDragging && !isBulkBusy}
                    activeSkin={gameState.activeSkin}
                    isBulkLocked={isBulkBusy}
                    bulkPhase={bulkPlotPhases[plot.id] ?? 'idle'}
                    sequenceIndex={bulkAnimatedPlotIds.indexOf(plot.id)}
                    isBulkHighlighted={bulkActivePlotId === plot.id}
                  />
                ))}
              </motion.div>
            </div>

            <div className="absolute -bottom-[60px] left-1/2 -translate-x-1/2 w-[85%] h-16 bg-black/15 blur-3xl rounded-full z-0 pointer-events-none" />
          </div>
        </div>
      </div>

      <SeedSelector
        currentLevel={gameState.level}
        selectedSeed={selectedSeed}
        onSelect={setSelectedSeed}
        gold={gameState.gold}
        activeSkin={gameState.activeSkin}
        bulkControls={{
          left: (
            <button
              type="button"
              aria-label="一键收取"
              title="一键收取"
              onClick={handleHarvestAllClick}
              disabled={harvestDisabled}
              className={`flex h-12 w-12 items-center justify-center rounded-full border transition-all ${
                harvestDisabled
                  ? 'cursor-not-allowed border-white/15 bg-slate-950/20 text-white/40'
                  : 'border-amber-100/70 bg-amber-200/95 text-amber-900 shadow-[0_14px_30px_rgba(251,191,36,0.32)] hover:-translate-y-1 hover:scale-105 active:scale-95'
              }`}
            >
              <Wheat size={22} strokeWidth={2.6} />
            </button>
          ),
          right: (
            <button
              type="button"
              aria-label="一键播种"
              title="一键播种"
              onClick={handlePlantAllClick}
              disabled={plantDisabled}
              className={`flex h-12 w-12 items-center justify-center rounded-full border transition-all ${
                plantDisabled
                  ? 'cursor-not-allowed border-white/15 bg-slate-950/20 text-white/40'
                  : 'border-emerald-100/70 bg-emerald-200/95 text-emerald-900 shadow-[0_14px_30px_rgba(16,185,129,0.28)] hover:-translate-y-1 hover:scale-105 active:scale-95'
              } ${!plantDisabled && emptyPlotIds.length > 0 ? 'animate-pulse' : ''}`}
            >
              <Sprout size={22} strokeWidth={2.6} />
            </button>
          ),
        }}
      />

      <AnimatePresence>
        {isInventoryOpen && (
          <InventoryModal
            activeTab={activeInventoryTab}
            activeSkin={gameState.activeSkin}
            activeBuffs={gameState.activeBuffs}
            currentLevel={gameState.level}
            gold={gameState.gold}
            inventory={gameState.inventory}
            onClose={closeInventory}
            onSelectSeed={setSelectedSeed}
            onTabChange={setActiveInventoryTab}
            onUseProp={handleUseProp}
            ownedSkinIds={gameState.ownedSkinIds}
            selectedSeed={selectedSeed}
            setSkin={setActiveSkin}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showLottery && (
          <LotteryModal
            gold={gameState.gold}
            activeSkin={gameState.activeSkin}
            onDraw={handleDraw}
            onClose={() => setShowLottery(false)}
            lastLotterySession={lastLotterySession}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showLevelUp && (
          <motion.div
            initial={{scale: 0.5, opacity: 0}}
            animate={{scale: 1, opacity: 1}}
            exit={{scale: 1.5, opacity: 0}}
            className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none"
          >
            <div className="bg-white/90 backdrop-blur-xl p-12 rounded-[50px] shadow-2xl border-8 border-yellow-400 text-center">
              <motion.div
                animate={{rotate: [0, 10, -10, 0]}}
                transition={{repeat: Infinity, duration: 1}}
                className="text-8xl mb-4"
              >
                🎉
              </motion.div>
              <h2 className="text-6xl font-black text-blue-600 mb-2">升级了！</h2>
              <p className="text-2xl font-bold text-blue-400 uppercase tracking-widest">
                当前等级: Lv.{levelUpEvent?.level ?? gameState.level}
              </p>
              {levelUpEvent?.unlockedPlot && (
                <p className="text-green-500 font-bold mt-4 animate-bounce">+1 块新土地！</p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

