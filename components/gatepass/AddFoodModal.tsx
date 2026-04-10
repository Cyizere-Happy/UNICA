'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Trash2, Image as ImageIcon, Flame, ShieldCheck, Zap, Leaf, Check } from 'lucide-react';
import { FoodItem, MealType } from '@/lib/gatepass/types';
import { cn } from '@/lib/utils';

interface AddFoodModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: FoodItem) => void;
  editingItem: FoodItem | null;
}

export default function AddFoodModal({ isOpen, onClose, onSave, editingItem }: AddFoodModalProps) {
  const [formData, setFormData] = useState<Partial<FoodItem>>({
    name: '',
    meal: 'Breakfast',
    price: 0,
    description: '',
    image: '',
    calories: 0,
    protein: '',
    fat: '',
    carbs: '',
    ingredients: [],
    available: true
  });

  const [newIngredient, setNewIngredient] = useState('');

  useEffect(() => {
    if (editingItem) {
      setFormData(editingItem);
    } else {
      setFormData({
        name: '',
        meal: 'Breakfast',
        price: 0,
        description: '',
        image: '',
        calories: 0,
        protein: '',
        fat: '',
        carbs: '',
        ingredients: [],
        available: true
      });
    }
  }, [editingItem, isOpen]);

  const handleAddIngredient = () => {
    if (newIngredient.trim() && !formData.ingredients?.includes(newIngredient.trim())) {
      setFormData({
        ...formData,
        ingredients: [...(formData.ingredients || []), newIngredient.trim()]
      });
      setNewIngredient('');
    }
  };

  const removeIngredient = (ing: string) => {
    setFormData({
      ...formData,
      ingredients: formData.ingredients?.filter(i => i !== ing)
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData as FoodItem,
      id: editingItem?.id || `food-${Date.now()}`
    });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#292f36]/40 backdrop-blur-md z-[150]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-white rounded-[24px] shadow-2xl z-[151] overflow-hidden flex flex-col max-h-[90vh]"
          >
            {/* Header */}
            <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <div>
                <h3 className="text-lg font-black text-[#292f36]">
                  {editingItem ? 'Edit Dish' : 'Add New Dish'}
                </h3>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">
                  Culinary Inventory
                </p>
              </div>
              <button 
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-white border border-gray-100 flex items-center justify-center text-gray-400 hover:text-[#292f36] transition-all"
              >
                <X size={16} />
              </button>
            </div>

            {/* Form Content */}
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
              {/* Basic Information */}
              <div className="space-y-3">
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#292f36] border-l-3 border-accent pl-2">
                  Essential Data
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-1">Name</label>
                    <input 
                      required
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                      placeholder="e.g. Avocado Toast"
                      className="w-full bg-gray-50 border border-transparent focus:border-accent/20 focus:bg-white rounded-xl p-3 text-[13px] font-bold text-[#292f36] outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-1">Service</label>
                    <select 
                      value={formData.meal}
                      onChange={e => setFormData({...formData, meal: e.target.value as MealType})}
                      className="w-full bg-gray-50 border border-transparent focus:border-accent/20 focus:bg-white rounded-xl p-3 text-[13px] font-bold text-[#292f36] outline-none transition-all appearance-none"
                    >
                      <option value="Breakfast">Breakfast</option>
                      <option value="Lunch">Lunch</option>
                      <option value="Dinner">Dinner</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-1">Price (RWF)</label>
                    <input 
                      type="number"
                      required
                      value={formData.price}
                      onChange={e => setFormData({...formData, price: Number(e.target.value)})}
                      className="w-full bg-gray-50 border border-transparent focus:border-accent/20 focus:bg-white rounded-xl p-3 text-[13px] font-bold text-[#292f36] outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-1">Dish Image</label>
                    <div className="relative group cursor-pointer">
                      <input 
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="absolute inset-0 opacity-0 cursor-pointer z-10"
                      />
                      <div className={cn(
                        "w-full bg-gray-50 border-2 border-dashed rounded-xl p-3 flex items-center justify-between text-[11px] font-bold text-[#292f36] transition-all",
                        formData.image ? "border-accent/50 bg-accent/5" : "border-gray-100 hover:border-gray-200"
                      )}>
                        <div className="flex items-center gap-2">
                           {formData.image ? (
                             <div className="w-8 h-8 rounded-lg overflow-hidden border border-white/50 shadow-sm relative shrink-0">
                               <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                             </div>
                           ) : (
                             <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 shrink-0">
                               <ImageIcon size={14} />
                             </div>
                           )}
                           <span className={cn(formData.image ? "text-[#292f36]" : "text-gray-400")}>
                             {formData.image ? "Image Selected" : "Click to Upload"}
                           </span>
                        </div>
                        <Plus size={14} className="text-gray-300" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-1">Description</label>
                  <textarea 
                    required
                    value={formData.description}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                    rows={2}
                    className="w-full bg-gray-50 border border-transparent focus:border-accent/20 focus:bg-white rounded-xl p-3 text-[13px] font-bold text-[#292f36] outline-none transition-all resize-none"
                  />
                </div>
              </div>

              {/* Nutritional Information */}
              <div className="space-y-3">
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#292f36] border-l-3 border-accent pl-2">
                  Macros
                </h4>
                <div className="grid grid-cols-4 gap-2">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1 ml-1">
                      <Flame size={10} className="text-orange-500" />
                      <label className="text-[8px] font-black uppercase tracking-widest text-gray-400">Cal</label>
                    </div>
                    <input 
                      type="number"
                      value={formData.calories}
                      onChange={e => setFormData({...formData, calories: Number(e.target.value)})}
                      className="w-full bg-gray-50 border border-transparent focus:border-accent/20 focus:bg-white rounded-lg p-2 text-[12px] font-bold text-[#292f36] outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-1 ml-1">
                      <ShieldCheck size={10} className="text-blue-500" />
                      <label className="text-[8px] font-black uppercase tracking-widest text-gray-400">Prot</label>
                    </div>
                    <input 
                      value={formData.protein}
                      onChange={e => setFormData({...formData, protein: e.target.value})}
                      className="w-full bg-gray-50 border border-transparent focus:border-accent/20 focus:bg-white rounded-lg p-2 text-[12px] font-bold text-[#292f36] outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-1 ml-1">
                      <Zap size={10} className="text-yellow-500" />
                      <label className="text-[8px] font-black uppercase tracking-widest text-gray-400">Carb</label>
                    </div>
                    <input 
                      value={formData.carbs}
                      onChange={e => setFormData({...formData, carbs: e.target.value})}
                      className="w-full bg-gray-50 border border-transparent focus:border-accent/20 focus:bg-white rounded-lg p-2 text-[12px] font-bold text-[#292f36] outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-1 ml-1">
                      <Leaf size={10} className="text-green-500" />
                      <label className="text-[8px] font-black uppercase tracking-widest text-gray-400">Fat</label>
                    </div>
                    <input 
                      value={formData.fat}
                      onChange={e => setFormData({...formData, fat: e.target.value})}
                      className="w-full bg-gray-50 border border-transparent focus:border-accent/20 focus:bg-white rounded-lg p-2 text-[12px] font-bold text-[#292f36] outline-none transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Ingredients */}
              <div className="space-y-3">
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#292f36] border-l-3 border-accent pl-2">
                  Ingredients
                </h4>
                <div className="flex gap-2">
                  <input 
                    value={newIngredient}
                    onChange={e => setNewIngredient(e.target.value)}
                    onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), handleAddIngredient())}
                    placeholder="Add..."
                    className="flex-1 bg-gray-50 border border-transparent focus:border-accent/20 focus:bg-white rounded-xl p-2.5 text-[12px] font-bold text-[#292f36] outline-none transition-all"
                  />
                  <button 
                    type="button"
                    onClick={handleAddIngredient}
                    className="w-10 h-10 rounded-xl bg-[#292f36] text-white flex items-center justify-center hover:bg-black transition-all shadow-md"
                  >
                    <Plus size={16} />
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  <AnimatePresence>
                    {formData.ingredients?.map((ing, i) => (
                      <motion.div
                        key={ing}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="px-2 py-1 bg-gray-100 rounded-md flex items-center gap-1.5 group border border-gray-200"
                      >
                        <span className="text-[11px] font-bold text-[#292f36]">{ing}</span>
                        <button 
                          type="button"
                          onClick={() => removeIngredient(ing)}
                          className="text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <X size={12} />
                        </button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            </form>

            {/* Footer */}
            <div className="p-5 bg-gray-50 border-t border-gray-100 flex items-center justify-end gap-2">
              <button 
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-[#292f36] transition-colors"
              >
                Discard
              </button>
              <button 
                onClick={handleSubmit}
                className="px-6 py-2.5 bg-[#292f36] text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-black/10 hover:bg-black transition-all flex items-center gap-1.5"
              >
                <Check size={14} strokeWidth={3} />
                {editingItem ? 'Save Changes' : 'Publish Dish'}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
