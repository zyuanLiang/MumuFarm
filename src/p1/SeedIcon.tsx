import type {CropId} from './types';
import {cropArtUrl} from './themes';
import {useThemeRuntime} from './themes/ThemeRuntimeContext';

/** Mini paper-cut icons for the seed tray — prefers SkinPack mature art. */
export function SeedIcon({cropId}: {cropId: CropId}) {
  const {cropSkin} = useThemeRuntime();
  const art = cropArtUrl(cropSkin, cropId, 'mature');
  if (art) {
    return (
      <span className={`seed-icon seed-icon-${cropId} has-art`} aria-hidden>
        <img src={art} alt="" draggable={false} />
      </span>
    );
  }
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
