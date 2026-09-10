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
} from './dayFeel';
import {BlackCat, GirlFigure, StrayCat} from './GirlFigure';
import type {OutfitId} from './outfits';
import {PlotTile} from './PlotTile';
import {loadSave, writeSave} from './save';
import {useFarmPrototype} from './useFarmPrototype';
import {WardrobeView} from './WardrobeView';

type Scene = 'farm' | 'cottage' | 'wardrobe';

const SHOWOFF_MS = 1600;
const PHOTO_MS = 900;

function readMeta() {
  const saved = loadSave();
  return {
    outfit: (saved?.outfit ?? 'raincoat') as OutfitId,
    accessory: (saved?.accessory ?? 'none') as AccessoryId,
    unlockedAccessories: (saved?.unlockedAccessories?.length
      ? saved.unlockedAccessories
      : (['none'] as AccessoryId[])),
    catGiftClaimed: Boolean(saved?.catGiftClaimed),
    lastBubble: saved?.lastBubble ?? pickBubble(),
  };
}

export function FarmPrototype() {
  const farm = useFarmPrototype();
  const meta = useMemo(() => readMeta(), []);
  const [scene, setScene] = useState<Scene>('farm');
  const [outfit, setOutfit] = useState<OutfitId>(meta.outfit);
  const [accessory, setAccessory] = useState<AccessoryId>(meta.accessory);
  const [preview, setPreview] = useState<OutfitId>(meta.outfit);
  const [previewAccessory, setPreviewAccessory] = useState<AccessoryId>(meta.accessory);
  const [unlockedAccessories, setUnlockedAccessories] = useState<AccessoryId[]>(
    meta.unlockedAccessories.includes('none')
      ? meta.unlockedAccessories
      : ['none', ...meta.unlockedAccessories],
  );
  const [showoff, setShowoff] = useState(false);
  const [photoFlash, setPhotoFlash] = useState(false);
  const [atmosphere, setAtmosphere] = useState<AtmosphereId>(() => pickAtmosphere());
  const [bubble, setBubble] = useState(meta.lastBubble);
  const [catGiftClaimed, setCatGiftClaimed] = useState(meta.catGiftClaimed);
  const [visitorVisible, setVisitorVisible] = useState(false);

  useEffect(() => {
    setVisitorVisible(rollVisitor(atmosphere, catGiftClaimed));
  }, [atmosphere, catGiftClaimed]);

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

  // Persist day state
  useEffect(() => {
    writeSave({
      version: 1,
      gold: farm.gold,
      outfit,
      accessory,
      unlockedAccessories,
      selectedSeed: farm.selectedSeed,
      plots: farm.rawPlots,
      catGiftClaimed,
      lastBubble: bubble,
    });
  }, [
    farm.gold,
    farm.selectedSeed,
    farm.rawPlots,
    outfit,
    accessory,
    unlockedAccessories,
    catGiftClaimed,
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
    setBubble(preview === 'witch' ? '魔女裙在菜地里也很好看。' : '雨衣适合今天出门。');
  }, [preview, previewAccessory]);

  const claimVisitorGift = useCallback(() => {
    if (catGiftClaimed) return;
    setCatGiftClaimed(true);
    setVisitorVisible(false);
    setUnlockedAccessories((prev) =>
      prev.includes('cat_ears') ? prev : [...prev, 'cat_ears'],
    );
    farm.addGold(6, '野猫留下猫耳发夹，还有一点金币');
    setBubble('软雨里的访客，不是来踩菜的。');
    setAccessory('cat_ears');
    setShowoff(true);
  }, [catGiftClaimed, farm]);

  const takePhoto = useCallback(() => {
    setPhotoFlash(true);
    farm.setFeedback('咔嚓，收进手帐了');
  }, [farm]);

  const cycleAtmosphere = useCallback(() => {
    setAtmosphere((prev) => {
      const order: AtmosphereId[] = ['clear', 'soft_rain', 'dusk'];
      return order[(order.indexOf(prev) + 1) % order.length];
    });
  }, []);

  const atm = ATMOSPHERES[atmosphere];

  if (scene === 'cottage') {
    return (
      <div className={`p1-shell ${atm.skyClass}`}>
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
      <div className={`p1-shell ${atm.skyClass}`}>
        <WardrobeView
          equipped={outfit}
          preview={preview}
          accessory={accessory}
          previewAccessory={previewAccessory}
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
    <div className={`p1-shell ${atm.skyClass}`}>
      <div className="p1-sky" aria-hidden>
        <div className="p1-westlake">
          <div className="wl-pagoda" />
          <div className="wl-bridge" />
          <div className="wl-willow wl-left" />
          <div className="wl-willow wl-right" />
          <div className="wl-mist" />
        </div>
        {atmosphere === 'soft_rain' && <div className="rain-layer" />}
      </div>

      {photoFlash && <div className="photo-flash" aria-hidden />}

      <header className="p1-topbar">
        <button type="button" className="p1-chip" onClick={cycleAtmosphere} aria-label="切换氛围天气">
          {atm.name}
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

          {visitorVisible && (
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
                <StrayCat />
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
            ? `穿上了${outfit === 'witch' ? '小魔女' : '黄雨衣'}${accessory === 'cat_ears' ? '·猫耳' : ''}`
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
