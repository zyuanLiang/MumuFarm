import {ATMOSPHERES} from './dayFeel';
import {BlackCat, GirlFigure} from './GirlFigure';
import {OUTFITS} from './outfits';
import {VISTAS} from './vistas';
import {
  accessoryLabel,
  formatJournalTime,
  type JournalEntry,
} from './journal';

interface JournalViewProps {
  entries: JournalEntry[];
  onBack: () => void;
  onTakePhoto: () => void;
}

export function JournalView({entries, onBack, onTakePhoto}: JournalViewProps) {
  return (
    <div className="p2-journal">
      <header className="p1-topbar">
        <button type="button" className="p1-chip" onClick={onBack} aria-label="回农场">
          ←
        </button>
        <div className="p1-chip">手帐本</div>
      </header>

      <p className="p1-feedback">
        {entries.length === 0
          ? '还没有照片。先回农场拍一张吧。'
          : `收藏了 ${entries.length} 页小日子`}
      </p>

      <div className="journal-list" aria-label="手帐页">
        {entries.map((entry) => {
          const acc = accessoryLabel(entry.accessory);
          return (
            <article key={entry.id} className={`journal-card vista-${entry.vista}`}>
              <div className="journal-card-sky" aria-hidden />
              <div className="journal-card-stage">
                <GirlFigure
                  outfit={entry.outfit}
                  accessory={entry.accessory}
                  size="room"
                />
                <BlackCat size="room" />
              </div>
              <div className="journal-card-meta">
                <strong>
                  {VISTAS[entry.vista].name} · {ATMOSPHERES[entry.atmosphere].name}
                </strong>
                <span>
                  {OUTFITS[entry.outfit]?.name ?? '黄雨衣'}
                  {acc ? ` · ${acc}` : ''}
                </span>
                <p>{entry.caption}</p>
                <time dateTime={new Date(entry.createdAt).toISOString()}>
                  {formatJournalTime(entry.createdAt)}
                </time>
              </div>
            </article>
          );
        })}
      </div>

      <footer className="p1-dock">
        <button type="button" className="p1-primary" onClick={onTakePhoto}>
          {entries.length === 0 ? '去农场拍照' : '再拍一张'}
        </button>
      </footer>
    </div>
  );
}
