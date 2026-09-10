import {SEED_ORDER, CROPS} from './crops';
import {PlotTile} from './PlotTile';
import {useFarmPrototype} from './useFarmPrototype';

export function FarmPrototype() {
  const farm = useFarmPrototype();

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
          <div className="mushroom-house" aria-hidden>
            <div className="mh-cap" />
            <div className="mh-stem" />
            <div className="mh-door" />
            <div className="mh-glow" />
          </div>

          <div className="p1-actors" aria-hidden>
            <div className="girl-raincoat">
              <div className="girl-head" />
              <div className="girl-hood" />
              <div className="girl-body" />
              <div className="girl-boots" />
            </div>
            <div className="black-cat">
              <div className="cat-body" />
              <div className="cat-head" />
              <div className="cat-crescent" />
            </div>
          </div>
        </section>

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
          {farm.lastAction}
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
