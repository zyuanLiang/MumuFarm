import {useCallback, useEffect, useMemo, useRef, useState, type PointerEvent as ReactPointerEvent} from 'react';
import {CottageView} from './CottageView';
import {CROPS, SEED_ORDER, type PrimaryKind} from './crops';
import {
  ATMOSPHERES,
  pickAtmosphere,
  pickBubble,
  rollVisitor,
  type AccessoryId,
  type AtmosphereId,
  type VisitorKind,
} from './dayFeel';
import {BlackCat, GirlFigure, SongBird, StrayCat} from './GirlFigure';
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
import {PlotTile} from './PlotTile';
import {loadSave, writeSave} from './save';
import {playSfx, resumeAudio} from './sfx';
import {useFarmPrototype} from './useFarmPrototype';
import {VISTA_ORDER, VISTAS, vistasUnlockedBy, type VistaId} from './vistas';
import {JournalView} from './JournalView';
import {createJournalEntry, prependJournalEntry, type JournalEntry} from './journal';
import {WardrobeView} from './WardrobeView';

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
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>(meta.journalEntries ?? []);
  const [tipDismissed, setTipDismissed] = useState(false);
  const [dailyTip, setDailyTip] = useState<DailyTip | null>(null);
  const sessionHarvestsRef = useRef(0);

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
        if (kind === 'plant') playSfx('plant');
        if (kind === 'water') playSfx('water');
        if (kind === 'harvest') playSfx('harvest');
        return;
      }
      const mode = brushModeRef.current;
      if (!mode) return;
      brushedRef.current.add(plotId);
      farm.onApplyPlot(plotId, mode);
      if (mode === 'plant') playSfx('plant');
      if (mode === 'water') playSfx('water');
      if (mode === 'harvest') playSfx('harvest');
    },
    [farm],
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

    prevHarvestRef.current = hc;
  }, [
    farm.harvestCount,
    unlockedOutfits,
    unlockedHats,
    unlockedDresses,
    unlockedBoots,
    unlockedVistas,
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
        caption: `丰收小记 · ${note}`,
      });
      setJournalEntries((prev) => prependJournalEntry(prev, entry));
      setToast('丰收小记写进手帐了');
    }

    playSfx('harvest');
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
  ]);

  const openCottage = useCallback(() => {
    setShowoff(false);
    setCottageEntering(true);
    setScene('cottage');
    farm.setFeedback('推开蘑菇门，屋里暖暖的');
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
    });
    setJournalEntries((prev) => prependJournalEntry(prev, entry));
    setPhotoFlash(true);
    playSfx('photo');
    farm.setFeedback(`咔嚓，${VISTAS[activeVista].name}风景收进手帐了`);
    setToast('手帐又多了一页');
  }, [farm, activeVista, look, accessory, atmosphere]);

  const onPrimaryWithSfx = useCallback(() => {
    const kind = farm.primaryKind;
    farm.onPrimary();
    if (kind === 'plant') playSfx('plant');
    if (kind === 'water') playSfx('water');
    // harvest SFX played when lastHarvestCrop effect runs
  }, [farm]);

  const cycleAtmosphere = useCallback(() => {
    setAtmosphere((prev) => {
      const order: AtmosphereId[] = ['clear', 'soft_rain', 'dusk'];
      return order[(order.indexOf(prev) + 1) % order.length];
    });
  }, []);

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

  const atm = ATMOSPHERES[atmosphere];
  const outfitLabel = lookLabel(look);

  if (scene === 'cottage') {
    return (
      <div className={`p1-shell ${atm.skyClass} vista-${activeVista}`}>
        <CottageView
          entering={cottageEntering}
          look={look}
          accessory={accessory}
          onBack={() => setScene('farm')}
          onOpenWardrobe={openWardrobe}
        />
      </div>
    );
  }

  if (scene === 'wardrobe') {
    return (
      <div className={`p1-shell ${atm.skyClass} vista-${activeVista}`}>
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
          onBack={() => setScene('cottage')}
        />
      </div>
    );
  }

  if (scene === 'journal') {
    return (
      <div className={`p1-shell ${atm.skyClass} vista-${activeVista}`}>
        <JournalView
          entries={journalEntries}
          onBack={() => setScene('farm')}
          onTakePhoto={() => {
            setScene('farm');
            window.setTimeout(() => takePhoto(), 80);
          }}
        />
      </div>
    );
  }

  return (
    <div className={`p1-shell ${atm.skyClass} vista-${activeVista}`}>
      <div className="p1-sky" aria-hidden>
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
          <div className="photo-frame">
            <span className="photo-caption">{VISTAS[activeVista].name} · 手帐</span>
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

      <header className="p1-topbar">
        <button type="button" className="p1-chip" onClick={cycleAtmosphere} aria-label="切换氛围天气">
          {atm.name}
        </button>
        <button type="button" className="p1-chip" onClick={cycleVista} aria-label="切换远景">
          {VISTAS[activeVista].name}
          {unlockedVistas.length > 1 ? ` ·${unlockedVistas.length}` : ''}
        </button>
        <div className="p1-chip p1-gold" aria-label={`金币 ${farm.gold}`}>
          <span className="p1-coin" />
          <span>{farm.gold}</span>
        </div>
      </header>

      <main className="p1-stage">
        <section className="p1-homestead" aria-label="蘑菇屋小院">
          <button
            type="button"
            className="mushroom-house is-button"
            onClick={openCottage}
            aria-label="进入蘑菇屋"
          >
            <div className="mh-cap" />
            <div className="mh-stem" />
            <div className="mh-door" />
            <div className="mh-glow" />
          </button>

          {visitor && (
            <div className="visitor-slot">
              <div
                role="button"
                tabIndex={0}
                className="visitor-hit"
                onClick={claimVisitorGift}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') claimVisitorGift();
                }}
              >
                {visitor === 'cat' ? <StrayCat /> : <SongBird />}
                <span className="visitor-hint">点我</span>
              </div>
            </div>
          )}

          <div className="p1-actors">
            <GirlFigure
              look={look}
              accessory={accessory}
              size="farm"
              pose={showoff ? 'showoff' : 'idle'}
            />
            <BlackCat size="farm" onAssist={catAssist} />
          </div>
        </section>

        <p className="day-bubble" role="status">
          {bubble}
        </p>

        {dailyTip && !tipDismissed && !looksEqual(dailyTip.look, look) && !showoff && (
          <div className="daily-tip" role="status">
            <div className="daily-tip-copy">
              <strong>今天穿什么</strong>
              <span>{dailyTip.label}</span>
              <em>{dailyTip.reason}</em>
            </div>
            <div className="daily-tip-actions">
              <button type="button" className="daily-tip-wear" onClick={applyDailyTip}>
                穿上试试
              </button>
              <button
                type="button"
                className="daily-tip-skip"
                aria-label="先不换"
                onClick={() => setTipDismissed(true)}
              >
                先不换
              </button>
            </div>
          </div>
        )}

        {showoff && (
          <p className="showoff-banner" role="status">
            换好啦，回菜地看看～
          </p>
        )}

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
              onSelect={farm.onSelectPlot}
            />
          ))}
        </section>
        <p className="touch-hint">种子粘手：点空地就种 · 手指滑过可浇水/收获 · 点黑猫或下着软雨会帮忙</p>

        <p className="p1-feedback" role="status">
          {showoff
            ? `穿上了${outfitLabel}${accessory === 'cat_ears' ? '·猫耳' : ''}${accessory === 'scarf' ? '·围巾' : ''}${accessory === 'flower_crown' ? '·花冠' : ''}${accessory === 'mushroom_pin' ? '·蘑菇胸针' : ''}`
            : farm.lastAction}
        </p>

        <div className="p1-seeds" role="listbox" aria-label="选择种子">
          {SEED_ORDER.map((seed) => (
            <button
              key={seed}
              type="button"
              role="option"
              aria-selected={farm.selectedSeed === seed}
              className={`seed-chip ${farm.selectedSeed === seed ? 'is-on' : ''}`}
              onClick={() => farm.onSelectSeed(seed)}
            >
              {CROPS[seed].name}
            </button>
          ))}
        </div>

        <div className="p1-seeds">
          <button type="button" className="seed-chip cottage-chip" onClick={openCottage}>
            进小屋换装
          </button>
          <button type="button" className="seed-chip" onClick={takePhoto}>
            拍照
          </button>
          <button type="button" className="seed-chip journal-chip" onClick={openJournal}>
            手帐{journalEntries.length > 0 ? ` ·${journalEntries.length}` : ''}
          </button>
        </div>
        <p className="harvest-hint">已收获 {farm.harvestCount} 次 · 单品 {unlockedHats.filter((h) => h !== 'bare').length + unlockedDresses.length + unlockedBoots.length} · 手帐 {journalEntries.length}</p>
      </main>

      <footer className="p1-dock">
        <button
          type="button"
          className={`p1-primary kind-${farm.primaryKind}`}
          onClick={onPrimaryWithSfx}
        >
          {farm.primaryKind === 'water' && <span className="icon-can" aria-hidden />}
          {farm.primaryKind === 'plant' && <span className="icon-seed" aria-hidden />}
          {farm.primaryKind === 'harvest' && <span className="icon-basket" aria-hidden />}
          <span>{farm.primaryLabel}</span>
        </button>
      </footer>

      {farm.harvestBurstId > 0 && (
        <div key={farm.harvestBurstId} className="harvest-pop" aria-hidden />
      )}
    </div>
  );
}
