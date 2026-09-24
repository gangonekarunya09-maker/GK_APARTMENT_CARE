import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ServiceCategory } from '../../types';
import { Layers, Plus, CheckCircle2, XCircle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const CategoriesManager: React.FC = () => {
  const { categories, addCategory, toggleCategoryStatus } = useApp();
  const [modalOpen, setModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [iconName, setIconName] = useState('Sparkles');

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    addCategory({
      name,
      description: description || 'Specialized community services',
      iconName,
      active: true,
    });

    setName('');
    setDescription('');
    setModalOpen(false);
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-[#142326]">Service Categories &amp; Niches</h2>
          <p className="text-xs text-[#667085] mt-0.5">
            Organize services into custom resident discovery categories
          </p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="px-4 py-2.5 bg-[#2596be] hover:bg-[#1e7ca0] text-white text-xs font-bold rounded-xl transition-colors shadow-xs flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add Custom Category</span>
        </button>
      </div>

      {/* Grid of Categories - clean vertical cards, no horizontal row overflow */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {categories.map(cat => (
          <div
            key={cat.id}
            className="p-4 bg-white rounded-2xl border border-[#E5E7EB] shadow-xs flex flex-col justify-between space-y-3"
          >
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-[#142326]">{cat.name}</h3>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded font-bold capitalize ${
                    cat.active ? 'bg-[#2E8B57]/10 text-[#2E8B57]' : 'bg-[#DC2626]/10 text-[#DC2626]'
                  }`}
                >
                  {cat.active ? 'Active' : 'Disabled'}
                </span>
              </div>
              <p className="text-xs text-[#667085] leading-relaxed">
                {cat.description}
              </p>
            </div>

            <div className="pt-2 border-t border-[#E5E7EB] flex items-center justify-end">
              <button
                onClick={() => toggleCategoryStatus(cat.id)}
                className={`text-xs font-semibold px-2 py-1 rounded cursor-pointer ${
                  cat.active
                    ? 'text-[#DC2626] hover:bg-[#DC2626]/10'
                    : 'text-[#2E8B57] hover:bg-[#2E8B57]/10'
                }`}
              >
                {cat.active ? 'Disable' : 'Enable'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal to add category */}
      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl border border-[#E5E7EB] shadow-xl max-w-md w-full overflow-hidden"
            >
              <div className="p-4 sm:p-5 border-b border-[#E5E7EB] flex items-center justify-between">
                <h3 className="text-base font-bold text-[#142326]">Add Service Category</h3>
                <button
                  onClick={() => setModalOpen(false)}
                  className="p-1.5 text-[#667085] hover:bg-[#F8F9FA] rounded-lg cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddCategory} className="p-5 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#142326] mb-1">
                    Category Name <span className="text-[#DC2626]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="e.g. Plumbing & Sanitary, Pest Control..."
                    className="w-full px-3.5 py-2.5 bg-white border border-[#E5E7EB] rounded-xl text-sm focus:outline-none focus:border-[#2596be] text-[#142326]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#142326] mb-1">
                    Description
                  </label>
                  <textarea
                    rows={2}
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    placeholder="Brief description of what services fall under this..."
                    className="w-full px-3.5 py-2 bg-white border border-[#E5E7EB] rounded-xl text-xs focus:outline-none focus:border-[#2596be] text-[#142326]"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-4 py-2 border border-[#E5E7EB] rounded-xl text-xs font-semibold text-[#667085] hover:bg-[#F8F9FA]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-[#2596be] hover:bg-[#1e7ca0] text-white text-xs font-bold rounded-xl shadow-xs"
                  >
                    Add Category
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
