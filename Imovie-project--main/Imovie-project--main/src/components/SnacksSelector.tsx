import React from 'react';
import { SnackItem, SnackOrder } from '../types';
import { SNACKS } from '../data/snacksData';
import { ArrowLeft, Plus, Minus, Popcorn, Utensils, Wine, Coffee, Flame, CupSoda, Sparkles, ChevronRight, X } from 'lucide-react';

interface SnacksSelectorProps {
  snackOrders: SnackOrder[];
  onUpdateSnacks: (orders: SnackOrder[]) => void;
  onBack: () => void;
  onProceedToCheckout: () => void;
  onClose: () => void;
}

export const SnacksSelector: React.FC<SnacksSelectorProps> = ({
  snackOrders,
  onUpdateSnacks,
  onBack,
  onProceedToCheckout,
  onClose
}) => {
  const getOrderQuantity = (itemId: string) => {
    const existing = snackOrders.find(o => o.item.id === itemId);
    return existing ? existing.quantity : 0;
  };

  const updateQuantity = (item: SnackItem, delta: number) => {
    const currentQty = getOrderQuantity(item.id);
    const newQty = Math.max(0, currentQty + delta);

    let updated: SnackOrder[];
    if (newQty === 0) {
      updated = snackOrders.filter(o => o.item.id !== item.id);
    } else {
      const exists = snackOrders.some(o => o.item.id === item.id);
      if (exists) {
        updated = snackOrders.map(o => o.item.id === item.id ? { ...o, quantity: newQty } : o);
      } else {
        updated = [...snackOrders, { item, quantity: newQty }];
      }
    }
    onUpdateSnacks(updated);
  };

  const snackTotal = snackOrders.reduce((sum, o) => sum + o.item.price * o.quantity, 0);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Combos': return <Sparkles className="w-4 h-4 text-amber-400" />;
      case 'Popcorn': return <Popcorn className="w-4 h-4 text-amber-400" />;
      case 'Beverages': return <CupSoda className="w-4 h-4 text-cyan-400" />;
      default: return <Utensils className="w-4 h-4 text-rose-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-zinc-950/85 backdrop-blur-md overflow-y-auto">
      <div 
        className="relative w-full max-w-4xl bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden my-auto flex flex-col max-h-[94vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-zinc-800 bg-zinc-950/80 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="p-2 rounded-lg bg-zinc-800/80 text-zinc-300 hover:text-white transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <div className="text-xs font-mono text-amber-400 uppercase tracking-wider">
                Step 3 of 4 · Cinema Concessions
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-white">
                Add Popcorn, Combos & Gourmet Bites
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-zinc-800/80 text-zinc-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Snack Items Grid */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-grow space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {SNACKS.map((snack) => {
              const qty = getOrderQuantity(snack.id);
              return (
                <div
                  key={snack.id}
                  className={`p-4 rounded-xl border transition-all flex flex-col justify-between gap-3 ${
                    qty > 0 
                      ? 'bg-zinc-800/80 border-amber-400/50 shadow-md' 
                      : 'bg-zinc-950/50 border-zinc-800/80 hover:border-zinc-700'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between text-xs font-mono text-zinc-400 mb-1">
                      <span className="flex items-center gap-1.5 font-semibold text-zinc-300">
                        {getCategoryIcon(snack.category)}
                        {snack.category}
                      </span>
                      <span className="text-[11px] text-zinc-500">{snack.calories}</span>
                    </div>

                    <h4 className="text-base font-bold text-white mt-0.5">
                      {snack.name}
                    </h4>
                    <p className="text-xs text-zinc-400 mt-1 line-clamp-2 leading-relaxed">
                      {snack.description}
                    </p>
                  </div>

                  {/* Price and Counter */}
                  <div className="flex items-center justify-between pt-2 border-t border-zinc-800/60">
                    <div className="text-sm font-extrabold text-amber-400 font-mono tabular-nums">
                      ${snack.price.toFixed(2)}
                    </div>

                    <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-700/80 rounded-lg p-1">
                      <button
                        onClick={() => updateQuantity(snack, -1)}
                        disabled={qty === 0}
                        className={`w-6 h-6 rounded flex items-center justify-center transition-colors cursor-pointer ${
                          qty > 0 ? 'text-zinc-300 hover:bg-zinc-800' : 'text-zinc-600 cursor-not-allowed'
                        }`}
                      >
                        <Minus className="w-3 h-3" />
                      </button>

                      <span className="w-6 text-center text-xs font-bold font-mono text-white tabular-nums">
                        {qty}
                      </span>

                      <button
                        onClick={() => updateQuantity(snack, 1)}
                        className="w-6 h-6 rounded bg-amber-400 text-zinc-950 font-bold flex items-center justify-center hover:bg-amber-300 transition-colors cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 bg-zinc-950 border-t border-zinc-800 flex items-center justify-between gap-4">
          <div className="text-xs font-mono">
            <span className="text-zinc-400">Snacks Total: </span>
            <span className="text-base font-bold text-white tabular-nums">${snackTotal.toFixed(2)}</span>
            {snackOrders.length > 0 && (
              <span className="text-zinc-500 ml-2">({snackOrders.reduce((s, o) => s + o.quantity, 0)} items)</span>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onProceedToCheckout}
              className="px-4 py-2 text-xs font-medium text-zinc-400 hover:text-white transition-colors cursor-pointer"
            >
              Skip Snacks
            </button>

            <button
              onClick={onProceedToCheckout}
              className="px-6 py-2.5 text-xs font-bold text-zinc-950 bg-amber-400 hover:bg-amber-300 rounded-xl flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-all cursor-pointer active:scale-95"
            >
              <span>Continue to Checkout</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
