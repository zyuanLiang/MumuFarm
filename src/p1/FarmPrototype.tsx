import {useCallback, useEffect, useMemo, useState} from 'react';
import {CottageView} from './CottageView';
import {CROPS, SEED_ORDER} from './crops';
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
import {PlotTile} from './PlotTile';
import {loadSave, writeSave} from './save';
import {useFarmPrototype} from './useFarmPrototype';
import {VISTA_ORDER, VISTAS, vistasUnlockedBy, type VistaId} from './vistas';
import {WardrobeView} from './WardrobeView';

type Scene = 'farm' | 'cottage' | 'wardrobe';

const SHOWOFF_MS = 1600;
const PHOTO_MS = 900;
const CELEBRATE_MS = 2200;
const TOAST_MS = 2400;

function readMeta() {
  const saved = loadSave();
  const harvestCount = saved?.harvestCount ?? 0;
  return {
    outfit: (saved?.outfit ?? 'raincoat') as OutfitId,
    accessory: (saved?.accessory ?? 'none') as AccessoryId,
    unlockedAccessories: (saved?.unlockedAccessories?.length
      ? saved.unlockedAccessories
      : (['none'] as AccessoryId[])),
    unlockedOutfits: saved?.unlockedOutfits?.length
      ? saved.unlockedOutfits
      : outfitsUnlockedBy(harvestCount),
    unlockedVistas: saved?.unlockedVistas?.length
      ? saved.unlockedVistas
      : vistasUnlockedBy(harvestCount),
    activeVista: (saved?.activeVista ?? 'westlake') as VistaId,
    catGiftClaimed: Boolean(saved?.catGiftClaimed),
    birdGiftClaimed: Boolean(saved?.birdGiftClaimed),
    sunflowerCelebrated: Boolean(saved?.sunflowerCelebrated),
    lastBubble: saved?.lastBubble ?? pickBubble(),
  };
}

export function FarmPrototype() {
  const farm = useFarmPrototype();
  const meta = useMemo(() => readMeta(), []);
  const [scene, setScene] = useState<Scene>('farm');
  const [outfit, setOutfit] = useState<OutfitId>(
    meta.unlockedOutfits.includes(meta.outfit) ? meta.outfit : 'raincoat',
  );
  const [accessory, setAccessory] = useState<AccessoryId>(meta.accessory);
  const [preview, setPreview] = useState<OutfitId>(outfit);
  const [previewAccessory, setPreviewAccessory] = useState<AccessoryId>(meta.accessory);
  const [unlockedAccessories, setUnlockedAccessories] = useState<AccessoryId[]>(
    meta.unlockedAccessories.includes('none')
      ? meta.unlockedAccessories
      : ['none', ...meta.unlockedAccessories],
  );
  const [unlockedOutfits, setUnlockedOutfits] = useState<OutfitId[]>(meta.unlockedOutfits);
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
  const [visitor, setVisitor] = useState<VisitorKind>(null);

  useEffect(() => {
    setVisitor(rollVisitor(atmosphere, {cat: catGiftClaimed, bird: birdGiftClaimed}));
  }, [atmosphere, catGiftClaimed, birdGiftClaimed]);

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
    const fromHarvestOutfits = outfitsUnlockedBy(farm.harvestCount);
    const fromHarvestVistas = vistasUnlockedBy(farm.harvestCount);

    const newOutfit = fromHarvestOutfits.find((id) => !unlockedOutfits.includes(id));
    if (newOutfit) {
      setUnlockedOutfits((prev) => Array.from(new Set([...prev, ...fromHarvestOutfits])));
      setToast(`解锁服装：${OUTFITS[newOutfit].name}`);
      setBubble(`${OUTFITS[newOutfit].name}可以去换上试试～`);
    }

    const newVista = fromHarvestVistas.find((id) => !unlockedVistas.includes(id));
    if (newVista) {
      setUnlockedVistas((prev) => Array.from(new Set([...prev, ...fromHarvestVistas])));
      setToast(`收到风景明信片：${VISTAS[newVista].name}`);
    }
  }, [farm.harvestCount, unlockedOutfits, unlockedVistas]);

  // Sunflower first bloom celebration
  useEffect(() => {
    if (!farm.lastHarvestCrop) return;
    const crop = farm.lastHarvestCrop;
    if (crop === 'sunflower' && !sunflowerCelebrated) {
      setSunflowerCelebrated(true);
      setCelebrate(true);
      setBubble('向日葵一开，院子就亮了。');
      farm.setFeedback('向日葵开花啦！');
    }
    farm.clearLastHarvest();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only react to harvest crop id
  }, [farm.lastHarvestCrop, sunflowerCelebrated]);

  useEffect(() => {
    writeSave({
      version: 2,
      gold: farm.gold,
      outfit,
      accessory,
      unlockedAccessories,
      unlockedOutfits,
      unlockedVistas,
      activeVista,
      selectedSeed: farm.selectedSeed,
      plots: farm.rawPlots,
      harvestCount: farm.harvestCount,
      catGiftClaimed,
      birdGiftClaimed,
      sunflowerCelebrated,
      lastBubble: bubble,
    });
  }, [
    farm.gold,
    farm.selectedSeed,
    farm.rawPlots,
    farm.harvestCount,
    outfit,
    accessory,
    unlockedAccessories,
    unlockedOutfits,
    unlockedVistas,
    activeVista,
    catGiftClaimed,
    birdGiftClaimed,
    sunflowerCelebrated,
    bubble,
  ]);

  const openCottage = useCallback(() => {
    setScene('cottage');
    setShowoff(false);
  }, []);

  const openWardrobe = useCallback(() => {
    setPreview(outfit);
    setPreviewAccessory(accessory);
    setScene('wardrobe');
  }, [outfit, accessory]);

  const equipAndShowOff = useCallback(() => {
    setOutfit(preview);
    setAccessory(previewAccessory);
    setScene('farm');
    setShowoff(true);
    setBubble(
      preview === 'witch'
        ? '魔女裙在菜地里也很好看。'
        : preview === 'denim'
          ? '牛仔日常，适合晒太阳。'
          : '雨衣适合今天出门。',
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
    }
  }, [visitor, catGiftClaimed, birdGiftClaimed, farm]);

  const takePhoto = useCallback(() => {
    setPhotoFlash(true);
    farm.setFeedback(`咔嚓，${VISTAS[activeVista].name}风景收进手帐了`);
  }, [farm, activeVista]);

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
  const outfitLabel =
    outfit === 'witch' ? '小魔女' : outfit === 'denim' ? '牛仔日常' : '黄雨衣';

  if (scene === 'cottage') {
    return (
      <div className={`p1-shell ${atm.skyClass} vista-${activeVista}`}>
        <CottageView
          outfit={outfit}
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
          equipped={outfit}
          preview={preview}
          accessory={accessory}
          previewAccessory={previewAccessory}
          unlockedOutfits={unlockedOutfits}
          unlockedAccessories={unlockedAccessories}
          onPreview={setPreview}
          onPreviewAccessory={setPreviewAccessory}
          onEquip={equipAndShowOff}
          onBack={() => setScene('cottage')}
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

      {photoFlash && <div className="photo-flash" aria-hidden />}
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
              outfit={outfit}
              accessory={accessory}
              size="farm"
              pose={showoff ? 'showoff' : 'idle'}
            />
            <BlackCat size="farm" />
          </div>
        </section>

        <p className="day-bubble" role="status">
          {bubble}
        </p>

        {showoff && (
          <p className="showoff-banner" role="status">
            换好啦，回菜地看看～
          </p>
        )}

        <section className="p1-plots" aria-label="六块菜地">
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

        <p className="p1-feedback" role="status">
          {showoff
            ? `穿上了${outfitLabel}${accessory === 'cat_ears' ? '·猫耳' : ''}${accessory === 'scarf' ? '·围巾' : ''}`
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
        </div>
        <p className="harvest-hint">已收获 {farm.harvestCount} 次 · 明信片 {unlockedVistas.length}/{VISTA_ORDER.length}</p>
      </main>

      <footer className="p1-dock">
        <button
          type="button"
          className={`p1-primary kind-${farm.primaryKind}`}
          onClick={farm.onPrimary}
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
