import React from 'react';
import {Package, ScrollText, Sprout, X} from 'lucide-react';
import {motion} from 'motion/react';
import {CROPS, type SkinId} from '../constants';
import type {ActiveBuff, CropType, InventoryItem, InventoryTab} from '../types';
import {SkinWardrobe} from './SkinWardrobe';

const INVENTORY_TABS: Array<{id: InventoryTab; label: string}> = [{id: 'items', label: '背包/种子'}, {id: 'skins', label: '皮肤/衣橱'}];

interface InventoryModalProps {
  activeTab: InventoryTab;
  activeSkin: SkinId;
  activeBuffs: ActiveBuff[];
  currentLevel: number;
  gold: number;
  inventory: InventoryItem[];
  onClose: () => void;
  onSelectSeed: (seed: CropType) => void;
  onTabChange: (tab: InventoryTab) => void;
  onUseProp: (itemId: string) => void;
  ownedSkinIds: SkinId[];
  selectedSeed: CropType;
  setSkin: (skinId: SkinId) => void;
}

export const InventoryModal: React.FC<InventoryModalProps> = ({
  activeTab,
  activeSkin,
  activeBuffs,
  currentLevel,
  gold,
  inventory,
  onClose,
  onSelectSeed,
  onTabChange,
  onUseProp,
  ownedSkinIds,
  selectedSeed,
  setSkin,
}) => {
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const inventoryItems = inventory.filter((item) => item.count > 0);
  const availableCrops = Object.values(CROPS).filter(
    (crop) => crop.id !== 'koi_grass' || activeSkin === 'sacred_spring',
  );

  return (
    <div className="fixed inset-0 z-[50] flex flex-col justify-end">
      <button
        type="button"
        aria-label="关闭背包弹窗"
        className="absolute inset-0 backdrop-blur-lg bg-slate-900/80"
        onClick={onClose}
      />

      <motion.div
        initial={{y: '100%'}}
        animate={{y: 0}}
        exit={{y: '100%'}}
        transition={{type: 'spring', bounce: 0.2, duration: 0.7}}
        className="relative z-10 flex h-[90dvh] flex-col overflow-hidden rounded-t-[34px] border border-white/10 bg-[linear-gradient(180deg,rgba(15,23,42,0.94),rgba(15,23,42,0.82))] shadow-[0_-24px_90px_rgba(15,23,42,0.65)]"
      >
        <div className="pointer-events-none absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-white/10 to-transparent" />
        <div className="relative z-10 flex items-center justify-between border-b border-white/10 px-5 py-4 text-white md:px-8">
          <div>
            <div className="text-[11px] font-black uppercase tracking-[0.3em] text-white/45">
              Inventory
            </div>
            <h2 className="mt-1 text-2xl font-black tracking-tight text-white/95">
              沉浸式背包
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/8 text-white/80 transition hover:bg-white/12 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        <div className="relative z-10 flex items-center gap-2 px-5 pb-4 pt-4 md:px-8">
          {INVENTORY_TABS.map((tab) => {
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onTabChange(tab.id)}
                className={`rounded-full px-4 py-2 text-sm font-black transition ${
                  isActive
                    ? 'bg-emerald-300 text-emerald-950 shadow-[0_14px_30px_rgba(110,231,183,0.22)]'
                    : 'border border-white/10 bg-white/6 text-white/70 hover:bg-white/10 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="relative z-10 min-h-0 flex-1 px-5 pb-5 md:px-8 md:pb-8">
          {activeTab === 'skins' ? (
            <SkinWardrobe
              activeSkin={activeSkin}
              ownedSkinIds={ownedSkinIds}
              onEquip={setSkin}
            />
          ) : (
            <div className="flex h-full min-h-0 flex-col gap-4">
              <div className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
                <div className="rounded-[28px] border border-white/10 bg-white/7 p-4 text-white/88 shadow-[0_18px_60px_rgba(15,23,42,0.3)]">
                  <div className="mb-3 flex items-center gap-2 text-sm font-black tracking-[0.16em] text-white/80">
                    <Sprout size={16} />
                    种子收藏
                  </div>
                  <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-5">
                    {availableCrops.map((crop) => {
                      const isLocked = currentLevel < crop.unlockLevel;
                      const isSelected = selectedSeed === crop.id;
                      const canAfford = gold >= crop.seedCost;

                      return (
                        <button
                          key={crop.id}
                          type="button"
                          onClick={() => {
                            if (!isLocked) {
                              onSelectSeed(crop.id);
                            }
                          }}
                          className={`rounded-[22px] border p-4 text-left transition ${
                            isLocked
                              ? 'cursor-not-allowed border-white/6 bg-slate-950/30 text-white/40'
                              : isSelected
                                ? 'border-emerald-300/60 bg-emerald-300/10 text-white shadow-[0_12px_32px_rgba(110,231,183,0.12)]'
                                : 'border-white/10 bg-slate-950/25 text-white/80 hover:border-white/25'
                          }`}
                        >
                          <div className="text-3xl">{crop.icon}</div>
                          <div className="mt-3 text-sm font-black">{crop.name}</div>
                          <div className="mt-1 text-xs text-white/55">
                            {isLocked ? `Lv.${crop.unlockLevel} 解锁` : canAfford ? '可播种' : '金币不足'}
                          </div>
                          <div className="mt-2 text-xs font-bold text-amber-300">
                            ${crop.seedCost}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="rounded-[28px] border border-white/10 bg-white/7 p-4 text-white/88 shadow-[0_18px_60px_rgba(15,23,42,0.3)]">
                  <div className="mb-3 flex items-center gap-2 text-sm font-black tracking-[0.16em] text-white/80">
                    <ScrollText size={16} />
                    农场备忘
                  </div>
                  <div className="space-y-3">
                    {activeBuffs.length > 0 ? (
                      <div className="rounded-[22px] border border-amber-300/15 bg-amber-400/10 p-4">
                        <div className="text-sm font-black text-amber-100">激活中的增益</div>
                        <div className="mt-3 space-y-2">
                          {activeBuffs.map((buff) => {
                            const remaining = Math.max(
                              0,
                              Math.floor((buff.expiresAt - Date.now()) / 1000),
                            );
                            const mins = Math.floor(remaining / 60);
                            const secs = remaining % 60;

                            return (
                              <div
                                key={buff.id}
                                className="flex items-center justify-between rounded-2xl bg-black/20 px-3 py-2"
                              >
                                <div className="text-xs text-amber-50/90">
                                  {buff.type === 'gold_boost' ? '🪙 收获翻倍' : '⚡ 生长加速'}
                                </div>
                                <div className="text-xs font-black text-amber-100">
                                  x{buff.multiplier} · {mins}:{secs.toString().padStart(2, '0')}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ) : null}

                    <div className="rounded-[22px] border border-white/8 bg-slate-950/30 p-4">
                      <div className="flex items-center justify-between text-sm font-black text-white/90">
                        <span>当前选种</span>
                        <span>{CROPS[selectedSeed].name}</span>
                      </div>
                      <div className="mt-2 text-xs leading-6 text-white/55">
                        这里集中查看种子与仓库道具，不再让悬浮皮肤按钮占据主界面视线。
                      </div>
                    </div>
                    <div className="rounded-[22px] border border-white/8 bg-slate-950/30 p-4">
                      <div className="flex items-center justify-between text-sm font-black text-white/90">
                        <span>示例任务</span>
                        <span>2/5</span>
                      </div>
                      <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/8">
                        <div className="h-full w-[40%] rounded-full bg-emerald-300" />
                      </div>
                      <div className="mt-2 text-xs text-white/55">收获 5 次小麦以领取额外奖励。</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="min-h-0 flex-1 rounded-[28px] border border-white/10 bg-white/7 p-4 text-white/88 shadow-[0_18px_60px_rgba(15,23,42,0.3)]">
                <div className="mb-3 flex items-center gap-2 text-sm font-black tracking-[0.16em] text-white/80">
                  <Package size={16} />
                  仓库物品
                </div>

                {inventoryItems.length === 0 ? (
                  <div className="flex h-full min-h-[180px] items-center justify-center rounded-[24px] border border-dashed border-white/10 bg-slate-950/25 text-sm text-white/45">
                    仓库里暂时还没有可用物品
                  </div>
                ) : (
                  <div className="grid max-h-full grid-cols-1 gap-3 overflow-y-auto pr-1 md:grid-cols-2 xl:grid-cols-3">
                    {inventoryItems.map((item) => (
                      <div
                        key={item.id}
                        className="rounded-[24px] border border-white/10 bg-slate-950/30 p-4"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/8 text-2xl">
                              {item.icon}
                            </div>
                            <div>
                              <div className="text-sm font-black text-white">{item.name}</div>
                              <div className="mt-1 text-xs text-white/45">x{item.count}</div>
                            </div>
                          </div>
                          <div className="rounded-full border border-white/10 px-2 py-1 text-[10px] font-black uppercase text-white/55">
                            {item.type}
                          </div>
                        </div>

                        <div className="mt-3 text-xs leading-6 text-white/55">
                          {item.description ?? '收纳在仓库中，随时可在这里查看。'}
                        </div>

                        {item.type === 'prop' ? (
                          <button
                            type="button"
                            onClick={() => onUseProp(item.id)}
                            className="mt-4 inline-flex rounded-full bg-sky-300 px-4 py-2 text-xs font-black text-sky-950 transition hover:-translate-y-0.5"
                          >
                            立即使用
                          </button>
                        ) : (
                          <div className="mt-4 inline-flex rounded-full border border-white/10 px-4 py-2 text-xs font-black text-white/45">
                            已收纳
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
