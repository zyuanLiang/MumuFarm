import type {CropId} from './types';

/** Mini paper-cut icons for the seed tray — same silhouette language as CropSprite. */
export function SeedIcon({cropId}: {cropId: CropId}) {
  return (
    <span className={`seed-icon seed-icon-${cropId}`} aria-hidden>
      {cropId === 'wheat' && (
        <>
          <i className="ear a" />
          <i className="ear b" />
          <i className="ear c" />
        </>
      )}
      {cropId === 'carrot' && (
        <>
          <i className="tops" />
          <i className="root" />
        </>
      )}
      {cropId === 'sunflower' && (
        <>
          <i className="petals" />
          <i className="center" />
        </>
      )}
      {cropId === 'star_pumpkin' && (
        <>
          <i className="body" />
          <i className="star" />
        </>
      )}
    </span>
  );
}
