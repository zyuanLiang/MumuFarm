import {ATMOSPHERES} from './dayFeel';
import {BlackCat, GirlFigure} from './GirlFigure';
import {VISTAS} from './vistas';
import {
  accessoryLabel,
  entryLook,
  formatJournalTime,
  type JournalEntry,
} from './journal';
import {lookLabel} from './pieces';
import {getTheme, vistaArtUrl} from './themes';
import {useThemeRuntime} from './themes/ThemeRuntimeContext';

interface JournalViewProps {
  entries: JournalEntry[];
  onBack: () => void;
  onTakePhoto: () => void;
}

function entryVistaArt(entry: JournalEntry, fallbackThemeId: string): string | undefined {
  const pack = getTheme(entry.themeId ?? fallbackThemeId);
  return vistaArtUrl(pack, entry.vista) ?? vistaArtUrl(getTheme(fallbackThemeId), entry.vista);
}

/** Scrapbook pages — sky strip uses ThemePack vista stickers when available. */
export function JournalView({entries, onBack, onTakePhoto}: JournalViewProps) {
  const {theme} = useThemeRuntime();

  return (
    <div className="p2-journal scrapbook">
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
          const look = entryLook(entry);
          const acc = accessoryLabel(entry.accessory);
          const skyArt = entryVistaArt(entry, theme.id);
          return (
            <article
              key={entry.id}
              className={`journal-card vista-${entry.vista}${skyArt ? ' has-vista-art' : ''}`}
            >
              <div
                className={`journal-card-sky${skyArt ? ' has-art' : ''}`}
                style={skyArt ? {backgroundImage: `url("${skyArt}")`} : undefined}
                aria-hidden
              />
              <div className="journal-card-stage">
                <GirlFigure look={look} accessory={entry.accessory} size="room" />
                <BlackCat size="room" />
              </div>
              <div className="journal-card-meta">
                <strong>
                  {VISTAS[entry.vista].name} · {ATMOSPHERES[entry.atmosphere].name}
                </strong>
                <span>
                  {lookLabel(look)}
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
