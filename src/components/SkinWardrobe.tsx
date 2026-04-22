import React from 'react';
import {Check, Lock} from 'lucide-react';
import {motion} from 'motion/react';
import {SKINS, type SkinId} from '../constants';

interface SkinWardrobeProps {
  activeSkin: SkinId;
  ownedSkinIds: SkinId[];
  onEquip: (skinId: SkinId) => void;
}

const skinEntries = Object.values(SKINS);

export const SkinWardrobe: React.FC<SkinWardrobeProps> = ({
  activeSkin,
  ownedSkinIds,
  onEquip,
}) => {
  const [highlightedSkinId, setHighlightedSkinId] = React.useState<SkinId>(activeSkin);

  React.useEffect(() => {
    setHighlightedSkinId(activeSkin);
  }, [activeSkin]);

  const highlightedSkin = SKINS[highlightedSkinId] ?? SKINS.default;
  const isOwned = ownedSkinIds.includes(highlightedSkin.id);
  const isEquipped = highlightedSkin.id === activeSkin;

  return (
    <div className="flex h-full min-h-0 flex-col gap-4">
      <motion.div
        layout
        className="relative min-h-[250px] overflow-hidden rounded-[32px] border border-white/12 bg-white/8 shadow-[0_24px_80px_rgba(15,23,42,0.45)]"
      >
        <div
          className="absolute inset-0"
          style={
            highlightedSkin.bgImage
              ? {
                  backgroundImage: `url(${highlightedSkin.bgImage})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center center',
                }
              : {
                  background: `linear-gradient(135deg, ${highlightedSkin.secondaryColor} 0%, ${highlightedSkin.color} 100%)`,
                }
          }
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/35 to-slate-950/10" />
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-white/12 to-transparent" />

        <div className="relative z-10 flex h-full min-h-[250px] flex-col justify-between p-6 text-white">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-[11px] font-black uppercase tracking-[0.28em] text-white/60">
                Skin Wardrobe
              </div>
              <h3 className="mt-2 text-3xl font-black tracking-tight text-white">
                {highlightedSkin.name}
              </h3>
            </div>

            <div
              className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-bold ${
                isOwned
                  ? 'border-emerald-300/30 bg-emerald-400/15 text-emerald-100'
                  : 'border-white/15 bg-black/25 text-white/70'
              }`}
            >
              {isOwned ? <Check size={14} /> : <Lock size={14} />}
              {isOwned ? '已拥有' : '未解锁'}
            </div>
          </div>

          <div className="flex items-end justify-between gap-4">
            <div className="max-w-lg text-sm leading-6 text-white/75">
              {isOwned
                ? '预览当前主题氛围，确认后即可将整座农场切换为该皮肤。'
                : '该皮肤暂未拥有，解锁后可在此直接预览并装备。'}
            </div>

            <button
              type="button"
              disabled={!isOwned || isEquipped}
              onClick={() => onEquip(highlightedSkin.id)}
              className={`inline-flex min-w-[132px] items-center justify-center rounded-full px-5 py-3 text-sm font-black transition ${
                !isOwned || isEquipped
                  ? 'cursor-not-allowed border border-white/10 bg-white/8 text-white/40'
                  : 'bg-emerald-400 text-emerald-950 shadow-[0_16px_40px_rgba(52,211,153,0.35)] hover:-translate-y-0.5'
              }`}
            >
              {isEquipped ? '使用中' : '装备'}
            </button>
          </div>
        </div>
      </motion.div>

      <div className="min-h-0 flex-1 overflow-hidden rounded-[28px] border border-white/10 bg-slate-950/35 p-4">
        <div className="mb-3 flex items-center justify-between">
          <div className="text-sm font-black tracking-[0.18em] text-white/85">皮肤列表</div>
          <div className="text-xs text-white/45">点击卡片切换预览</div>
        </div>

        <div className="grid max-h-full grid-cols-2 gap-3 overflow-y-auto pr-1 md:grid-cols-3 xl:grid-cols-4">
          {skinEntries.map((skin) => {
            const owned = ownedSkinIds.includes(skin.id);
            const selected = highlightedSkinId === skin.id;
            const equipped = activeSkin === skin.id;

            return (
              <button
                key={skin.id}
                type="button"
                onClick={() => setHighlightedSkinId(skin.id)}
                className={`group relative overflow-hidden rounded-[24px] border text-left transition ${
                  selected
                    ? 'border-emerald-300/60 bg-white/12 shadow-[0_12px_40px_rgba(52,211,153,0.18)]'
                    : 'border-white/10 bg-white/6 hover:border-white/25'
                } ${owned ? '' : 'opacity-80'}`}
              >
                <div
                  className={`relative h-32 overflow-hidden ${
                    owned ? '' : 'grayscale'
                  }`}
                >
                  <div
                    className="absolute inset-0"
                    style={
                      skin.bgImage
                        ? {
                            backgroundImage: `url(${skin.bgImage})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center center',
                          }
                        : {
                            background: `linear-gradient(135deg, ${skin.secondaryColor} 0%, ${skin.color} 100%)`,
                          }
                    }
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-white/10" />
                  {!owned ? (
                    <div className="absolute inset-0 flex items-center justify-center bg-slate-950/45">
                      <div className="rounded-full border border-white/10 bg-slate-950/70 p-3 text-white/80">
                        <Lock size={18} />
                      </div>
                    </div>
                  ) : null}
                </div>

                <div className="space-y-2 p-4">
                  <div className="flex items-center justify-between gap-2">
                    <div className="text-sm font-black text-white">{skin.name}</div>
                    {equipped ? (
                      <span className="rounded-full bg-emerald-400/20 px-2 py-1 text-[10px] font-black text-emerald-100">
                        使用中
                      </span>
                    ) : null}
                  </div>
                  <div className="text-xs text-white/55">{owned ? 'Owned' : 'Locked'}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
