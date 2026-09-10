import {useCallback, useEffect, useState} from 'react';
import {CottageView} from './CottageView';
import {CROPS, SEED_ORDER} from './crops';
import {BlackCat, GirlFigure} from './GirlFigure';
import type {OutfitId} from './outfits';
import {PlotTile} from './PlotTile';
import {useFarmPrototype} from './useFarmPrototype';
import {WardrobeView} from './WardrobeView';

type Scene = 'farm' | 'cottage' | 'wardrobe';

const SHOWOFF_MS = 1600;

export function FarmPrototype() {
  const farm = useFarmPrototype();
  const [scene, setScene] = useState<Scene>('farm');
  const [outfit, setOutfit] = useState<OutfitId>('raincoat');
  const [preview, setPreview] = useState<OutfitId>('raincoat');
  const [showoff, setShowoff] = useState(false);

  useEffect(() => {
    if (!showoff) return;
    const id = window.setTimeout(() => setShowoff(false), SHOWOFF_MS);
    return () => window.clearTimeout(id);
  }, [showoff]);

  const openCottage = useCallback(() => {
    setScene('cottage');
    setShowoff(false);
  }, []);

  const openWardrobe = useCallback(() => {
    setPreview(outfit);
    setScene('wardrobe');
  }, [outfit]);

  const equipAndShowOff = useCallback(() => {
    setOutfit(preview);
    setScene('farm');
    setShowoff(true);
  }, [preview]);

  if (scene === 'cottage') {
    return (
      <div className="p1-shell">
        <CottageView
          outfit={outfit}
          onBack={() => setScene('farm')}
          onOpenWardrobe={openWardrobe}
        />
      </div>
    );
  }

  if (scene === 'wardrobe') {
    return (
      <div className="p1-shell">
        <WardrobeView
          equipped={outfit}
          preview={preview}
          onPreview={setPreview}
          onEquip={equipAndShowOff}
          onBack={() => setScene('cottage')}
        />
      </div>
    );
  }

  return (
    <div className="p1-shell">
      <div className="p1-sky" aria-hidden>
        <div className="p1-westlake">
          <div className="wl-pagoda" />
          <div className="wl-bridge" />
          <div className="wl-willow wl-left" />
          <div className="wl-willow wl-right" />
          <div className="wl-mist" />
        </div>
      </div>

      <header className="p1-topbar">
        <button type="button" className="p1-chip" aria-label="菜单">
          <span className="p1-burger" />
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

          <div className="p1-actors">
            <GirlFigure outfit={outfit} size="farm" pose={showoff ? 'showoff' : 'idle'} />
            <BlackCat size="farm" />
          </div>
        </section>

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
          {showoff ? `穿上了${outfit === 'witch' ? '小魔女' : '黄雨衣'}` : farm.lastAction}
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

        <button type="button" className="seed-chip cottage-chip" onClick={openCottage}>
          进小屋换装
        </button>
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
