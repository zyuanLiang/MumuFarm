import type {CropId} from './types';
import {CozyIcon} from './cozy/CozyIcon';
import {seedTrayIconId} from './cozy/mappings';

/** Seed tray icons from cozy-kit atlas. */
export function SeedIcon({cropId}: {cropId: CropId}) {
  return (
    <span className={`seed-icon seed-icon-${cropId} has-cozy`} aria-hidden>
      <CozyIcon id={seedTrayIconId(cropId)} className="seed-cozy-art" alt="" />
    </span>
  );
}
