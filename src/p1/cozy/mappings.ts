/** Map game ids → cozy-kit atlas icon ids for 1:1 mockup UI. */
import type {BootsId, DressId, HatId} from '../pieces';
import type {CropId, GrowthStage} from '../types';
import type {CozyIconId} from './CozyIcon';

export function plotIconId(stage: GrowthStage, watered: boolean, cropId: CropId | null): CozyIconId {
  if (stage === 'empty') return watered ? 'plot_wet' : 'plot_empty';
  if (stage === 'seed' || stage === 'sprout') return 'plot_sprout';
  if (stage === 'growing') return 'plot_leafy';
  return matureCropIconId(cropId);
}

export function matureCropIconId(cropId: CropId | null): CozyIconId {
  switch (cropId) {
    case 'carrot':
      return 'crop_carrot';
    case 'sunflower':
      return 'crop_sunflower';
    case 'star_pumpkin':
      return 'crop_pumpkin';
    case 'wheat':
      return 'crop_daisy';
    default:
      return 'plot_leafy';
  }
}

export function seedTrayIconId(cropId: CropId): CozyIconId {
  return matureCropIconId(cropId);
}

export function primaryActionIconId(kind: 'plant' | 'water' | 'harvest' | 'noop'): CozyIconId {
  switch (kind) {
    case 'water':
      return 'btn_water';
    case 'plant':
      return 'seed_sack';
    case 'harvest':
      return 'basket_full';
    default:
      return 'btn_water';
  }
}

export function hatIconId(id: HatId): CozyIconId | undefined {
  switch (id) {
    case 'rain_hood':
      return 'hat_yellow_polka';
    case 'witch_hat':
      return 'hat_witch';
    case 'straw_hat':
      return 'hat_straw';
    case 'beret':
      return 'clip_daisy';
    default:
      return undefined;
  }
}

export function dressIconId(id: DressId | string): CozyIconId | undefined {
  switch (id) {
    case 'raincoat':
      return 'coat_raincoat';
    case 'witch':
    case 'garden':
    case 'picnic':
    case 'spore':
      return 'dress_floral';
    case 'denim':
      return 'skirt_denim';
    case 'sweater':
    case 'moonlight':
      return 'coat_raincoat';
    default:
      return 'coat_raincoat';
  }
}

export function bootsIconId(id: BootsId): CozyIconId | undefined {
  switch (id) {
    case 'yellow':
      return 'boots_yellow';
    case 'witch':
      return 'boots_red_polka';
    case 'denim':
    case 'moss':
      return 'boots_brown';
    case 'peach':
    case 'check':
    case 'moon':
      return 'shoes_bow';
    default:
      return 'boots_yellow';
  }
}
