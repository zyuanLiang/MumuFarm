import {useCallback, useEffect, useMemo, useRef, useState, type PointerEvent as ReactPointerEvent} from 'react';
import {CottageView} from './CottageView';
import {CROPS, SEED_ORDER, type PrimaryKind} from './crops';
import {SeedIcon} from './SeedIcon';
import {summarizeYard} from './yardSummary';
import {
  ATMOSPHERES,
  pickAtmosphere,
  pickBubble,
  rollVisitor,
  type AccessoryId,
  type AtmosphereId,
  type VisitorKind,
} from './dayFeel';
import {BlackCat, GirlFigure} from './GirlFigure';
import {OUTFITS, outfitsUnlockedBy, type OutfitId} from './outfits';
import {
  BOOTS,
  DRESSES,
  HATS,
  bootsUnlockedBy,
  closestOutfit,
  dressesUnlockedBy,
  hatsUnlockedBy,
  lookFromOutfit,
  lookLabel,
  looksEqual,
  normalizeLook,
  type BootsId,
  type DressId,
  type HatId,
  type Look,
} from './pieces';
import {
  makeHarvestNote,
  shouldPinHarvestNote,
  suggestTodayLook,
  type DailyTip,
} from './dailyTips';
import {PlotTile, type PlotFxKind} from './PlotTile';
import {loadSave, writeSave} from './save';
import {playSfx, resumeAudio} from './sfx';
import {useFarmPrototype} from './useFarmPrototype';
import {VISTA_ORDER, VISTAS, vistasUnlockedBy, type VistaId} from './vistas';
import {JournalView} from './JournalView';
import {createJournalEntry, prependJournalEntry, type JournalEntry} from './journal';
import {WardrobeView} from './WardrobeView';
import {CozyIcon} from './cozy/CozyIcon';
import {primaryActionIconId} from './cozy/mappings';
import {
  DEFAULT_CROP_SKIN_ID,
  DEFAULT_THEME_ID,
  farmBgArtUrl,
  getSkin,
  getTheme,
  houseArtUrl,
  skinsUnlockedBy,
  themesUnlockedBy,
  vistaArtUrl,
  wardrobeBgArtUrl,
  type ThemeId,
  type SkinId,
} from './themes';
import {themeStyle} from './themes/useThemeStyle';
import {ThemeRuntimeContext} from './themes/ThemeRuntimeContext';

type Scene = 'farm' | 'cottage' | 'wardrobe' | 'journal';

const SHOWOFF_MS = 1600;
const PHOTO_MS = 1400;
const CELEBRATE_MS = 2200;
const TOAST_MS = 2400;

function readMeta() {
  const saved = loadSave();
  const harvestCount = saved?.harvestCount ?? 0;
  const unlockedHats = saved?.unlockedHats?.length
    ? saved.unlockedHats
    : hatsUnlockedBy(harvestCount);
  const unlockedDresses = saved?.unlockedDresses?.length
    ? saved.unlockedDresses
    : dressesUnlockedBy(harvestCount);
  const unlockedBoots = saved?.unlockedBoots?.length
    ? saved.unlockedBoots
    : bootsUnlockedBy(harvestCount);
  const outfit = (saved?.outfit ?? 'raincoat') as OutfitId;
  const look = normalizeLook(saved?.look ?? lookFromOutfit(outfit), {
    hats: unlockedHats,
    dresses: unlockedDresses,
    boots: unlockedBoots,
  }, outfit);
  return {
    outfit,
    look,
    accessory: (saved?.accessory ?? 'none') as AccessoryId,
    unlockedAccessories: (saved?.unlockedAccessories?.length
      ? saved.unlockedAccessories
      : (['none'] as AccessoryId[])),
    unlockedOutfits: saved?.unlockedOutfits?.length
      ? saved.unlockedOutfits
      : outfitsUnlockedBy(harvestCount),
    unlockedHats,
    unlockedDresses,
    unlockedBoots,
    unlockedVistas: saved?.unlockedVistas?.length
      ? saved.unlockedVistas
      : vistasUnlockedBy(harvestCount),
    activeVista: (saved?.activeVista ?? 'westlake') as VistaId,
    catGiftClaimed: Boolean(saved?.catGiftClaimed),
    birdGiftClaimed: Boolean(saved?.birdGiftClaimed),
    sunflowerCelebrated: Boolean(saved?.sunflowerCelebrated),
    starPumpkinGifted: Boolean(saved?.starPumpkinGifted),
    mushroomPinGifted: Boolean(saved?.mushroomPinGifted),
    journalEntries: saved?.journalEntries ?? [],
    lastBubble: saved?.lastBubble ?? pickBubble(),
    activeTheme: (saved?.activeTheme as ThemeId) ?? DEFAULT_THEME_ID,
    unlockedThemes: Array.from(
      new Set([...(saved?.unlockedThemes ?? []), ...themesUnlockedBy(harvestCount)]),
    ),
    activeCropSkin: (saved?.activeCropSkin as SkinId) ?? DEFAULT_CROP_SKIN_ID,
  };
}

export function FarmPrototype() {
  const farm = useFarmPrototype();
  const meta = useMemo(() => readMeta(), []);
  const [scene, setScene] = useState<Scene>('farm');
  const [look, setLook] = useState<Look>(meta.look);
  const [accessory, setAccessory] = useState<AccessoryId>(meta.accessory);
  const [preview, setPreview] = useState<Look>(meta.look);
  const [previewAccessory, setPreviewAccessory] = useState<AccessoryId>(meta.accessory);
  const [unlockedAccessories, setUnlockedAccessories] = useState<AccessoryId[]>(
    meta.unlockedAccessories.includes('none')
      ? meta.unlockedAccessories
      : ['none', ...meta.unlockedAccessories],
  );
  const [unlockedOutfits, setUnlockedOutfits] = useState<OutfitId[]>(meta.unlockedOutfits);
  const [unlockedHats, setUnlockedHats] = useState<HatId[]>(meta.unlockedHats);
  const [unlockedDresses, setUnlockedDresses] = useState<DressId[]>(meta.unlockedDresses);
  const [unlockedBoots, setUnlockedBoots] = useState<BootsId[]>(meta.unlockedBoots);
  const prevHarvestRef = useRef(farm.harvestCount);
  const [unlockedVistas, setUnlockedVistas] = useState<VistaId[]>(meta.unlockedVistas);
  const [activeVista, setActiveVista] = useState<VistaId>(
    meta.unlockedVistas.includes(meta.activeVista) ? meta.activeVista : 'westlake',
  );
  const [showoff, setShowoff] = useState(false);
  const [photoFlash, setPhotoFlash] = useState(false);
  const [celebrate, setCelebrate] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [atmosphere, setAtmosphere] = useState<AtmosphereId>(() => pickAtmosphere());
  const [bubble, setBubble] = useState(meta.lastBubble);
  const [catGiftClaimed, setCatGiftClaimed] = useState(meta.catGiftClaimed);
  const [birdGiftClaimed, setBirdGiftClaimed] = useState(meta.birdGiftClaimed);
  const [sunflowerCelebrated, setSunflowerCelebrated] = useState(meta.sunflowerCelebrated);
  const [starPumpkinGifted, setStarPumpkinGifted] = useState(meta.starPumpkinGifted);
  const [mushroomPinGifted, setMushroomPinGifted] = useState(Boolean(meta.mushroomPinGifted));
  const [visitor, setVisitor] = useState<VisitorKind>(null);
  const [cottageEntering, setCottageEntering] = useState(false);
  const [catPose, setCatPose] = useState<'idle' | 'look-up'>('idle');
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>(meta.journalEntries ?? []);
  const [tipDismissed, setTipDismissed] = useState(false);
  const [dailyTip, setDailyTip] = useState<DailyTip | null>(null);
  const sessionHarvestsRef = useRef(0);
  const [plotFx, setPlotFx] = useState<{id: number; kind: PlotFxKind; key: number} | null>(
    null,
  );
  const [yardTipDismissed, setYardTipDismissed] = useState(false);
  const yardBootstrapped = useRef(false);
  const [activeTheme, setActiveTheme] = useState<ThemeId>(
    meta.unlockedThemes.includes(meta.activeTheme) ? meta.activeTheme : DEFAULT_THEME_ID,
  );
  const [unlockedThemes, setUnlockedThemes] = useState<ThemeId[]>(meta.unlockedThemes);
  const [activeCropSkin, setActiveCropSkin] = useState<SkinId>(meta.activeCropSkin);

  const brushModeRef = useRef<Exclude<PrimaryKind, 'noop'> | null>(null);
  const brushedRef = useRef<Set<number>>(new Set());
  const rainHelpAtRef = useRef(0);

  const catAssist = useCallback(() => {
    resumeAudio();
    farm.onHelpWater('黑猫踮脚浇了一格～', 1);
    playSfx('water');
  }, [farm]);

  // Soft rain gently waters one dry plot every ~12s while raining.
  useEffect(() => {
    if (atmosphere !== 'soft_rain') return;
    const id = window.setInterval(() => {
      const now = Date.now();
      if (now - rainHelpAtRef.current < 12_000) return;
      const needs = farm.rawPlots.some((p) => !p.watered && p.cropId && p.progress < 1);
      if (!needs) return;
      rainHelpAtRef.current = now;
      farm.onHelpWater('软雨替你润了一块地', 1);
      playSfx('water');
    }, 4000);
    return () => window.clearInterval(id);
  }, [atmosphere, farm]);

  const plotIdFromEvent = (event: ReactPointerEvent | PointerEvent) => {
    const el = document.elementFromPoint(event.clientX, event.clientY);
    const host = el?.closest?.('[data-plot-id]') as HTMLElement | null;
    if (!host) return null;
    const id = Number(host.dataset.plotId);
    return Number.isFinite(id) ? id : null;
  };

  const flashPlot = useCallback((plotId: number, kind: PlotFxKind) => {
    setPlotFx({id: plotId, kind, key: Date.now()});
  }, []);

  useEffect(() => {
    if (!plotFx) return;
    const id = window.setTimeout(() => setPlotFx(null), 620);
    return () => window.clearTimeout(id);
  }, [plotFx]);

  const brushPlot = useCallback(
    (plotId: number, isStart: boolean) => {
      if (brushedRef.current.has(plotId)) return;
      const plot = farm.plots.find((p) => p.id === plotId);
      if (!plot) return;
      const kind = plot.stage === 'empty'
        ? 'plant'
        : plot.stage === 'mature'
          ? 'harvest'
          : plot.watered
            ? 'noop'
            : 'water';
      if (isStart) {
        if (kind === 'noop') {
          farm.onSelectPlot(plotId);
          brushModeRef.current = null;
          return;
        }
        brushModeRef.current = kind;
        brushedRef.current = new Set([plotId]);
        farm.onApplyPlot(plotId, kind);
        flashPlot(plotId, kind);
        if (kind === 'plant') playSfx('plant');
        if (kind === 'water') playSfx('water');
        if (kind === 'harvest') playSfx('harvest');
        return;
      }
      const mode = brushModeRef.current;
      if (!mode) return;
      brushedRef.current.add(plotId);
      farm.onApplyPlot(plotId, mode);
      flashPlot(plotId, mode);
      if (mode === 'plant') playSfx('plant');
      if (mode === 'water') playSfx('water');
      if (mode === 'harvest') playSfx('harvest');
    },
    [farm, flashPlot],
  );

  const onPlotsPointerDown = useCallback(
    (event: ReactPointerEvent<HTMLElement>) => {
      resumeAudio();
      (event.currentTarget as HTMLElement).setPointerCapture?.(event.pointerId);
      brushedRef.current = new Set();
      brushModeRef.current = null;
      const plotId = plotIdFromEvent(event);
      if (plotId == null) return;
      event.preventDefault();
      brushPlot(plotId, true);
    },
    [brushPlot],
  );

  const onPlotsPointerMove = useCallback(
    (event: ReactPointerEvent<HTMLElement>) => {
      if (event.buttons === 0 && event.pointerType === 'mouse') return;
      const plotId = plotIdFromEvent(event);
      if (plotId == null) return;
      brushPlot(plotId, false);
    },
    [brushPlot],
  );

  const onPlotsPointerUp = useCallback(() => {
    brushModeRef.current = null;
    brushedRef.current = new Set();
  }, []);

  useEffect(() => {
    const unlockAudio = () => resumeAudio();
    window.addEventListener('pointerdown', unlockAudio, {once: true});
    return () => window.removeEventListener('pointerdown', unlockAudio);
  }, []);

  useEffect(() => {
    setVisitor(rollVisitor(atmosphere, {cat: catGiftClaimed, bird: birdGiftClaimed}));
  }, [atmosphere, catGiftClaimed, birdGiftClaimed]);

  const yardSummary = useMemo(() => summarizeYard(farm.rawPlots), [farm.rawPlots]);

  useEffect(() => {
    if (yardBootstrapped.current) return;
    yardBootstrapped.current = true;
    if (yardSummary.message) {
      farm.setFeedback(yardSummary.message);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- once on mount
  }, []);

  useEffect(() => {
    const tip = suggestTodayLook({
      atmosphere,
      unlocked: {
        hats: unlockedHats,
        dresses: unlockedDresses,
        boots: unlockedBoots,
      },
      current: look,
      seed: Date.now() + unlockedDresses.length * 17,
    });
    setDailyTip(tip);
    setTipDismissed(false);
  }, [atmosphere, unlockedHats, unlockedDresses, unlockedBoots]);

  useEffect(() => {
    if (!showoff) return;
    const id = window.setTimeout(() => setShowoff(false), SHOWOFF_MS);
    return () => window.clearTimeout(id);
  }, [showoff]);

  useEffect(() => {
    if (!photoFlash) return;
    const id = window.setTimeout(() => setPhotoFlash(false), PHOTO_MS);
    return () => window.clearTimeout(id);
  }, [photoFlash]);

  useEffect(() => {
    if (!celebrate) return;
    const id = window.setTimeout(() => setCelebrate(false), CELEBRATE_MS);
    return () => window.clearTimeout(id);
  }, [celebrate]);

  useEffect(() => {
    if (!toast) return;
    const id = window.setTimeout(() => setToast(null), TOAST_MS);
    return () => window.clearTimeout(id);
  }, [toast]);

  // Unlock content from harvest progress (monotonic: never shrink)
  useEffect(() => {
    const hc = farm.harvestCount;
    const fromHarvestOutfits = outfitsUnlockedBy(hc);
    const fromHarvestVistas = vistasUnlockedBy(hc);
    const fromHats = hatsUnlockedBy(hc);
    const fromDresses = dressesUnlockedBy(hc);
    const fromBoots = bootsUnlockedBy(hc);
    const newOutfit = fromHarvestOutfits.find((id) => !unlockedOutfits.includes(id));
    const newHat = fromHats.find((id) => id !== 'bare' && !unlockedHats.includes(id));
    const newDress = fromDresses.find((id) => !unlockedDresses.includes(id));
    const newBoots = fromBoots.find((id) => !unlockedBoots.includes(id));
    const newVista = fromHarvestVistas.find((id) => !unlockedVistas.includes(id));

    if (newOutfit || newHat || newDress || newBoots) {
      setUnlockedOutfits((p) => Array.from(new Set([...p, ...fromHarvestOutfits])));
      setUnlockedHats((p) => Array.from(new Set([...p, ...fromHats])));
      setUnlockedDresses((p) => Array.from(new Set([...p, ...fromDresses])));
      setUnlockedBoots((p) => Array.from(new Set([...p, ...fromBoots])));
    }

    if (newOutfit) {
      setToast(`解锁套装：${OUTFITS[newOutfit].name}`);
      setBubble(`${OUTFITS[newOutfit].name}可以去换上试试～`);
      playSfx('unlock');
    } else if (newDress) {
      setToast(`解锁衣服：${DRESSES[newDress].name}`);
      setBubble(`${DRESSES[newDress].name}可以去试衣间混搭～`);
      playSfx('unlock');
    } else if (newHat) {
      setToast(`解锁帽子：${HATS[newHat].name}`);
      setBubble(`${HATS[newHat].name}戴上会更有季节感。`);
      playSfx('unlock');
    } else if (newBoots) {
      setToast(`解锁鞋子：${BOOTS[newBoots].name}`);
      setBubble(`${BOOTS[newBoots].name}踩在菜地里刚刚好。`);
      playSfx('unlock');
    }

    if (newVista) {
      setUnlockedVistas((p) => Array.from(new Set([...p, ...fromHarvestVistas])));
      setToast(`收到风景明信片：${VISTAS[newVista].name}`);
      playSfx('unlock');
    }

    const fromThemes = themesUnlockedBy(hc);
    const newTheme = fromThemes.find((id) => !unlockedThemes.includes(id));
    if (newTheme) {
      setUnlockedThemes((p) => Array.from(new Set([...p, ...fromThemes])));
      setToast(`解锁主题：${getTheme(newTheme).name}`);
      playSfx('unlock');
    }

    const prevSkins = skinsUnlockedBy(prevHarvestRef.current, 'crops');
    const nextSkins = skinsUnlockedBy(hc, 'crops');
    const newSkin = nextSkins.find((id) => !prevSkins.includes(id));
    if (newSkin) {
      setToast(`解锁作物皮：${getSkin(newSkin).name}`);
      setBubble(`${getSkin(newSkin).name}可以在收获提示旁切换看看。`);
      playSfx('unlock');
    }

    prevHarvestRef.current = hc;
  }, [
    farm.harvestCount,
    unlockedOutfits,
    unlockedHats,
    unlockedDresses,
    unlockedBoots,
    unlockedVistas,
    unlockedThemes,
  ]);

  // Special crop celebrations / gifts + 丰收小记
  useEffect(() => {
    if (!farm.lastHarvestCrop) return;
    const crop = farm.lastHarvestCrop;
    sessionHarvestsRef.current += 1;
    const note = makeHarvestNote(crop, farm.harvestCount, activeVista);
    if (crop === 'sunflower' && !sunflowerCelebrated) {
      setSunflowerCelebrated(true);
      setCelebrate(true);
      setBubble('向日葵一开，院子就亮了。');
      farm.setFeedback('向日葵开花啦！');
      playSfx('unlock');
    } else if (crop === 'star_pumpkin' && !starPumpkinGifted) {
      setStarPumpkinGifted(true);
      setUnlockedAccessories((prev) =>
        prev.includes('flower_crown') ? prev : [...prev, 'flower_crown'],
      );
      setAccessory('flower_crown');
      setToast('星星南瓜结出了花冠');
      setBubble('小小魔法，戴在头发上。');
      setShowoff(true);
      playSfx('unlock');
    } else {
      setBubble(note);
    }

    if (shouldPinHarvestNote(crop, sessionHarvestsRef.current)) {
      const entry = createJournalEntry({
        vista: activeVista,
        look,
        accessory,
        atmosphere,
        themeId: activeTheme,
        caption: `丰收小记 · ${note}`,
      });
      setJournalEntries((prev) => prependJournalEntry(prev, entry));
      setToast('丰收小记写进手帐了');
    }

    playSfx('harvest');
    setCatPose('look-up');
    window.setTimeout(() => setCatPose('idle'), 900);
    farm.clearLastHarvest();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- harvest burst only
  }, [farm.lastHarvestCrop, sunflowerCelebrated, starPumpkinGifted]);

  useEffect(() => {
    writeSave({
      version: 2,
      gold: farm.gold,
      outfit: closestOutfit(look),
      look,
      accessory,
      unlockedAccessories,
      unlockedOutfits,
      unlockedHats,
      unlockedDresses,
      unlockedBoots,
      unlockedVistas,
      activeVista,
      selectedSeed: farm.selectedSeed,
      plots: farm.rawPlots,
      harvestCount: farm.harvestCount,
      catGiftClaimed,
      birdGiftClaimed,
      sunflowerCelebrated,
      starPumpkinGifted,
      mushroomPinGifted,
      journalEntries,
      lastBubble: bubble,
      activeTheme,
      unlockedThemes,
      activeCropSkin,
    });
  }, [
    farm.gold,
    farm.selectedSeed,
    farm.rawPlots,
    farm.harvestCount,
    look,
    accessory,
    unlockedAccessories,
    unlockedOutfits,
    unlockedHats,
    unlockedDresses,
    unlockedBoots,
    unlockedVistas,
    activeVista,
    catGiftClaimed,
    birdGiftClaimed,
    sunflowerCelebrated,
    starPumpkinGifted,
    mushroomPinGifted,
    journalEntries,
    bubble,
    activeTheme,
    unlockedThemes,
    activeCropSkin,
  ]);

  const openCottage = useCallback(() => {
    setShowoff(false);
    setCottageEntering(true);
    setScene('cottage');
    farm.setFeedback('黑猫踮脚跟进来了');
    playSfx('tap');
    window.setTimeout(() => setCottageEntering(false), 900);
    if (!mushroomPinGifted) {
      setMushroomPinGifted(true);
      setUnlockedAccessories((prev) =>
        prev.includes('mushroom_pin') ? prev : [...prev, 'mushroom_pin'],
      );
      setAccessory('mushroom_pin');
      setToast('蘑菇屋里找到一枚蘑菇胸针');
      setBubble('这是蘑菇屋留给你的小记号。');
      playSfx('unlock');
    }
  }, [farm, mushroomPinGifted]);

  const openWardrobe = useCallback(() => {
    setPreview(look);
    setPreviewAccessory(accessory);
    setScene('wardrobe');
  }, [look, accessory]);

  const openJournal = useCallback(() => {
    setScene('journal');
    playSfx('tap');
  }, []);

  const actOnYardFocus = useCallback(() => {
    const id = yardSummary.focusPlotId;
    if (id == null) return;
    resumeAudio();
    if (yardSummary.readyIds.includes(id)) {
      flashPlot(id, 'harvest');
      farm.onApplyPlot(id, 'harvest');
      playSfx('harvest');
    } else if (yardSummary.thirstyIds.includes(id)) {
      flashPlot(id, 'water');
      farm.onApplyPlot(id, 'water');
      playSfx('water');
    } else {
      farm.onSelectPlot(id);
      playSfx('tap');
    }
    setYardTipDismissed(true);
  }, [yardSummary, farm, flashPlot]);

  const applyDailyTip = useCallback(() => {
    if (!dailyTip) return;
    setLook(dailyTip.look);
    setTipDismissed(true);
    setShowoff(true);
    playSfx('equip');
    setBubble(dailyTip.reason);
    farm.setFeedback(`今天试试：${dailyTip.label}`);
  }, [dailyTip, farm]);

  const equipAndShowOff = useCallback(() => {
    setLook(preview);
    setAccessory(previewAccessory);
    setScene('farm');
    setShowoff(true);
    playSfx('equip');
    const dress = preview.dress;
    setBubble(
      dress === 'witch'
        ? '魔女裙在菜地里也很好看。'
        : dress === 'denim'
          ? '牛仔日常，适合晒太阳。'
          : dress === 'garden'
            ? '背带裙沾上一点泥土刚刚好。'
            : dress === 'spore'
              ? '蘑菇裙晃一晃，黑猫也跟过来了。'
              : dress === 'sweater'
                ? '奶油毛衣软软的，适合慢慢浇水。'
                : '今天的搭配回菜地炫耀一下。',
    );
  }, [preview, previewAccessory]);

  const claimVisitorGift = useCallback(() => {
    if (visitor === 'cat' && !catGiftClaimed) {
      setCatGiftClaimed(true);
      setVisitor(null);
      setUnlockedAccessories((prev) =>
        prev.includes('cat_ears') ? prev : [...prev, 'cat_ears'],
      );
      farm.addGold(6, '野猫留下猫耳发夹，还有一点金币');
      setBubble('软雨里的访客，不是来踩菜的。');
      setAccessory('cat_ears');
      setShowoff(true);
      playSfx('unlock');
      return;
    }
    if (visitor === 'bird' && !birdGiftClaimed) {
      setBirdGiftClaimed(true);
      setVisitor(null);
      setUnlockedAccessories((prev) => (prev.includes('scarf') ? prev : [...prev, 'scarf']));
      farm.addGold(4, '小鸟衔来一条小围巾');
      setBubble('晴天的礼物，轻轻的。');
      setAccessory('scarf');
      setShowoff(true);
      playSfx('unlock');
    }
  }, [visitor, catGiftClaimed, birdGiftClaimed, farm]);

  const takePhoto = useCallback(() => {
    const entry = createJournalEntry({
      vista: activeVista,
      look,
      accessory,
      atmosphere,
      themeId: activeTheme,
    });
    setJournalEntries((prev) => prependJournalEntry(prev, entry));
    setPhotoFlash(true);
    playSfx('photo');
    farm.setFeedback(`咔嚓，${VISTAS[activeVista].name}风景收进手帐了`);
    setToast('手帐又多了一页');
  }, [farm, activeVista, look, accessory, atmosphere, activeTheme]);

  const onPrimaryWithSfx = useCallback(() => {
    const kind = farm.primaryKind;
    if (kind === 'plant' || kind === 'water' || kind === 'harvest') {
      flashPlot(farm.selectedPlotId, kind);
    }
    farm.onPrimary();
    if (kind === 'plant') playSfx('plant');
    if (kind === 'water') playSfx('water');
    // harvest SFX played when lastHarvestCrop effect runs
  }, [farm, flashPlot]);

  const cycleAtmosphere = useCallback(() => {
    const order: AtmosphereId[] = ['clear', 'soft_rain', 'dusk'];
    const next = order[(order.indexOf(atmosphere) + 1) % order.length];
    setAtmosphere(next);
    if (next === 'soft_rain') {
      farm.setFeedback('细雨来了，黑猫躲到蘑菇檐下～');
    }
  }, [atmosphere, farm]);

  const cycleVista = useCallback(() => {
    if (unlockedVistas.length <= 1) {
      farm.setFeedback('多种一点菜，会收到新风景明信片');
      return;
    }
    const idx = unlockedVistas.indexOf(activeVista);
    const next = unlockedVistas[(idx + 1) % unlockedVistas.length];
    setActiveVista(next);
    farm.setFeedback(`远景切换：${VISTAS[next].name}`);
  }, [unlockedVistas, activeVista, farm]);

  const cycleTheme = useCallback(() => {
    if (unlockedThemes.length <= 1) {
      farm.setFeedback('再收获几次，会解锁新主题皮肤');
      return;
    }
    const idx = unlockedThemes.indexOf(activeTheme);
    const next = unlockedThemes[(idx + 1) % unlockedThemes.length];
    setActiveTheme(next);
    if (next === 'rainy_lilac') {
      farm.setFeedback('雨紫庭院：衣柜贴也换上了～');
    } else if (next === 'png_portrait') {
      farm.setFeedback('水彩立绘包穿上了：女孩头像也换真了～');
    } else {
      farm.setFeedback(`主题切换：${getTheme(next).name}`);
    }
    playSfx('tap');
  }, [unlockedThemes, activeTheme, farm]);

  const atm = ATMOSPHERES[atmosphere];
  const outfitLabel = lookLabel(look);
  const theme = getTheme(activeTheme);
  const cropSkin = getSkin(activeCropSkin);
  const vistaBg = vistaArtUrl(theme, activeVista);
  const farmBg = farmBgArtUrl(theme);
  const houseArt = houseArtUrl(theme);
  const shellStyle = {
    ...themeStyle(theme),
    ...(vistaBg ? {['--vista-bg-image' as string]: `url("${vistaBg}")`} : {}),
    ...(farmBg ? {['--farm-bg-image' as string]: `url("${farmBg}")`} : {}),
  };
  const shellClass = [
    'p1-shell', 'cozy-kit',
    'has-paper',
    atm.skyClass,
    `vista-${activeVista}`,
    vistaBg ? 'has-vista-art' : '',
    farmBg ? 'has-farm-bg' : '',
    theme.id === 'v1_complete' ? 'skin-v1-complete' : '',
  ]
    .filter(Boolean)
    .join(' ');
  const shellProps = {
    className: shellClass,
    style: shellStyle,
    'data-theme': theme.id,
    'data-crop-skin': activeCropSkin,
    'data-vista-bg': vistaBg ? '1' : undefined,
  };
  const runtimeValue = {theme, cropSkin};

  const cycleCropSkin = useCallback(() => {
    const unlocked = skinsUnlockedBy(farm.harvestCount, 'crops');
    if (unlocked.length <= 1) {
      farm.setFeedback('作物皮肤包以后可以整套替换');
      return;
    }
    const idx = unlocked.indexOf(activeCropSkin);
    const next = unlocked[(idx + 1) % unlocked.length];
    setActiveCropSkin(next);
    farm.setFeedback(`作物皮：${getSkin(next).name}`);
    playSfx('tap');
  }, [farm, activeCropSkin]);

  if (scene === 'cottage') {
    return (
      <ThemeRuntimeContext.Provider value={runtimeValue}>
      <div {...shellProps}>
        <CottageView
          entering={cottageEntering}
          look={look}
          accessory={accessory}
          onBack={() => setScene('farm')}
          onOpenWardrobe={openWardrobe}
        />
      </div>
      </ThemeRuntimeContext.Provider>
    );
  }

  if (scene === 'wardrobe') {
    return (
      <ThemeRuntimeContext.Provider value={runtimeValue}>
      <div
        {...shellProps}
        className={`${shellProps.className}${wardrobeBgArtUrl(theme) ? ' has-wardrobe-bg' : ''}`}
        style={{
          ...shellProps.style,
          ...(wardrobeBgArtUrl(theme)
            ? {['--wardrobe-bg-image' as string]: `url("${wardrobeBgArtUrl(theme)}")`}
            : {}),
        }}
      >
        {wardrobeBgArtUrl(theme) ? (
          <div
            className="wardrobe-bg-layer"
            aria-hidden
            style={{backgroundImage: `url("${wardrobeBgArtUrl(theme)}")`}}
          />
        ) : null}
        <WardrobeView
          equipped={look}
          preview={preview}
          accessory={accessory}
          previewAccessory={previewAccessory}
          unlockedPresets={unlockedOutfits}
          unlockedHats={unlockedHats}
          unlockedDresses={unlockedDresses}
          unlockedBoots={unlockedBoots}
          unlockedAccessories={unlockedAccessories}
          onApplyPreset={(id) => setPreview(lookFromOutfit(id))}
          onPreviewHat={(id) => setPreview((p) => ({...p, hat: id}))}
          onPreviewDress={(id) => setPreview((p) => ({...p, dress: id}))}
          onPreviewBoots={(id) => setPreview((p) => ({...p, boots: id}))}
          onPreviewAccessory={setPreviewAccessory}
          onEquip={equipAndShowOff}
          onBack={() => setScene('farm')}
        />
      </div>
      </ThemeRuntimeContext.Provider>
    );
  }

  if (scene === 'journal') {
    return (
      <ThemeRuntimeContext.Provider value={runtimeValue}>
      <div {...shellProps}>
        <JournalView
          entries={journalEntries}
          onBack={() => setScene('farm')}
          onTakePhoto={() => {
            setScene('farm');
            window.setTimeout(() => takePhoto(), 80);
          }}
        />
      </div>
      </ThemeRuntimeContext.Provider>
    );
  }

  return (
    <ThemeRuntimeContext.Provider value={runtimeValue}>
    <div {...shellProps}>
      {farmBg ? (
        <div
          className="farm-bg-layer"
          aria-hidden
          style={{backgroundImage: `url("${farmBg}")`}}
        />
      ) : null}
      <div className="p1-sky is-breathing" aria-hidden>
        <div className="p1-westlake">
          <div className="wl-pagoda" />
          <div className="wl-bridge" />
          <div className="wl-willow wl-left" />
          <div className="wl-willow wl-right" />
          <div className="wl-mist" />
          <div className="vista-guilin" />
          <div className="vista-castle" />
          <div className="vista-huangshan" />
        </div>
        {atmosphere === 'soft_rain' && <div className="rain-layer" />}
      </div>

      {photoFlash && (
        <div className="photo-flash" aria-hidden>
          <div
            className={`photo-frame vista-${activeVista}${vistaBg ? ' has-vista-art' : ''}`}
            style={vistaBg ? {['--photo-vista' as string]: `url("${vistaBg}")`} : undefined}
          >
            <div className="photo-frame-sky" />
            <div className="photo-frame-stage">
              <GirlFigure look={look} accessory={accessory} size="room" pose="showoff" />
              <BlackCat size="room" />
            </div>
            <span className="photo-caption">
              {VISTAS[activeVista].name} · {outfitLabel} · 手帐
            </span>
          </div>
        </div>
      )}
      {celebrate && (
        <div className="bloom-celebrate" role="status">
          <span>向日葵开花啦</span>
        </div>
      )}
      {toast && (
        <div className="unlock-toast" role="status">
          {toast}
        </div>
      )}

      <header className="p1-topbar cozy-topbar">
        <div className="p1-chip p1-profile" aria-label="晴暖">
          晴暖
        </div>
        <div className="p1-chip p1-gold" aria-label={`金币 ${farm.gold}`}>
          <CozyIcon id="coin" className="cozy-hud-icon" alt="" />
          <span>{farm.gold}</span>
        </div>
        <button type="button" className="p1-chip" onClick={cycleAtmosphere} aria-label="切换氛围天气">
          {atm.name}
        </button>
      </header>

      <nav className="cozy-side-rail cozy-side-left" aria-label="功能">
        <button type="button" className="cozy-rail-btn" onClick={openWardrobe} aria-label="换装">
          <CozyIcon id="wardrobe" alt="" />
          <span>换装</span>
        </button>
        <button type="button" className="cozy-rail-btn" onClick={openWardrobe} aria-label="小屋">
          <CozyIcon id="home_mushroom" alt="" />
          <span>小屋</span>
        </button>
        <button type="button" className="cozy-rail-btn" onClick={openJournal} aria-label="图鉴">
          <CozyIcon id="codex" alt="" />
          <span>图鉴</span>
        </button>
        <button type="button" className="cozy-rail-btn" aria-label="订单">
          <CozyIcon id="quest" alt="" />
          <span>订单</span>
        </button>
      </nav>
      <nav className="cozy-side-rail cozy-side-right" aria-label="探索">
        <button type="button" className="cozy-rail-btn" aria-label="地图">
          <CozyIcon id="map" alt="" />
          <span>地图</span>
        </button>
        <button type="button" className="cozy-rail-btn" aria-label="任务">
          <CozyIcon id="task_notify" alt="" />
          <span>任务</span>
        </button>
      </nav>

      <main className="p1-stage">
        <section className="p1-homestead" aria-label="蘑菇屋小院">
          {/* farm-bg paints house/meadow only — girl+cat must still overlay as real PNGs */}
          <button
            type="button"
            className={`mushroom-house is-button${farmBg ? ' is-hit-only' : houseArt ? ' has-art' : ''}`}
            onClick={openWardrobe}
            aria-label="去换装"
          >
            {farmBg ? null : houseArt ? (
              <img className="mh-art" src={houseArt} alt="" draggable={false} />
            ) : (
              <>
                <div className="mh-cap" />
                <div className="mh-stem" />
                <div className="mh-door" />
                <div className="mh-window" />
                <div className="mh-glow" />
              </>
            )}
          </button>
          <div className="p1-actors">
            <GirlFigure
              look={look}
              accessory={accessory}
              size="farm"
              pose={showoff ? 'showoff' : 'idle'}
            />
            <BlackCat
              size="farm"
              onAssist={catAssist}
              pose={showoff ? 'cheer' : catPose}
            />
          </div>
        </section>

        <section
          className="p1-plots"
          aria-label="六块菜地，点选或滑动浇收"
          onPointerDown={onPlotsPointerDown}
          onPointerMove={onPlotsPointerMove}
          onPointerUp={onPlotsPointerUp}
          onPointerCancel={onPlotsPointerUp}
        >
          {farm.plots.map((plot) => (
            <PlotTile
              key={plot.id}
              id={plot.id}
              selected={plot.id === farm.selectedPlotId}
              watered={plot.watered}
              cropId={plot.cropId}
              stage={plot.stage}
              progress={plot.progress}
              fx={plotFx?.id === plot.id ? plotFx.kind : null}
              fxKey={plotFx?.id === plot.id ? plotFx.key : 0}
              onSelect={farm.onSelectPlot}
            />
          ))}
        </section>

        <div className="p1-seeds" role="listbox" aria-label="选择种子">
          {SEED_ORDER.map((seed) => (
            <button
              key={seed}
              type="button"
              role="option"
              aria-selected={farm.selectedSeed === seed}
              className={`seed-chip seed-${seed} ${farm.selectedSeed === seed ? 'is-on' : ''}`}
              onClick={() => farm.onSelectSeed(seed)}
            >
              <SeedIcon cropId={seed} />
              <span>{CROPS[seed].name}</span>
            </button>
          ))}
        </div>

      </main>

      <footer className="p1-dock cozy-dock">
        <div className="cozy-dock-side">
          <button type="button" className="cozy-dock-mini" onClick={openWardrobe} aria-label="商店">
            <CozyIcon id="shop" alt="" />
          </button>
          <button type="button" className="cozy-dock-mini" aria-label="仓库">
            <CozyIcon id="storage" alt="" />
          </button>
        </div>
        <button
          type="button"
          className={`p1-primary cozy-primary kind-${farm.primaryKind}`}
          onClick={onPrimaryWithSfx}
          aria-label={farm.primaryLabel}
        >
          {farm.primaryKind === 'water' ? (
            <CozyIcon id="btn_water" className="cozy-primary-art" alt="" />
          ) : (
            <span className="cozy-primary-pill">
              <CozyIcon id={primaryActionIconId(farm.primaryKind)} className="cozy-primary-icon" alt="" />
              <span>{farm.primaryLabel}</span>
            </span>
          )}
        </button>
        <div className="cozy-dock-side">
          <button type="button" className="cozy-dock-mini" onClick={takePhoto} aria-label="好友">
            <CozyIcon id="friends" alt="" />
          </button>
          <button type="button" className="cozy-dock-mini" onClick={openJournal} aria-label="活动">
            <CozyIcon id="calendar" alt="" />
          </button>
        </div>
      </footer>

      {farm.harvestBurstId > 0 && (
        <div key={farm.harvestBurstId} className="harvest-burst" aria-hidden>
          <span className="harvest-pop a" />
          <span className="harvest-pop b" />
          <span className="harvest-pop c" />
        </div>
      )}
    </div>
    </ThemeRuntimeContext.Provider>
  );
}
