import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronRight, Search, X } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { QMK_KEYCODES, CATEGORY_INFO, getKeycodesByCategory, type Keycode } from '../data/keycodes';
import { cn } from '../utils/cn';

interface KeycodePanelProps {
  onKeycodeSelect: (keycode: Keycode) => void;
  selectedKeycode?: string | null;
  onClose?: () => void;
}

export function KeycodePanel({ onKeycodeSelect, selectedKeycode, onClose }: KeycodePanelProps) {
  const { theme } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<Set<Keycode['category']>>(
    new Set(['basic', 'modifier'])
  );

  const toggleCategory = (category: Keycode['category']) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(category)) {
        newSet.delete(category);
      } else {
        newSet.add(category);
      }
      return newSet;
    });
  };

  // Filter keycodes based on search
  const filteredKeycodes = searchTerm
    ? QMK_KEYCODES.filter(
        kc =>
          kc.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
          kc.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
          kc.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : null;

  const categories: Keycode['category'][] = ['basic', 'modifier', 'function', 'navigation', 'media', 'layer', 'numpad', 'system'];

  return (
    <motion.div
      className={cn(
        'w-80 h-full flex flex-col border-r backdrop-blur-md',
        theme.colors.surface,
        theme.colors.border
      )}
      initial={{ x: -320, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, type: 'spring' }}
    >
      {/* Header */}
      <div className="p-4 border-b" style={{ borderColor: 'inherit' }}>
        <div className="flex items-center justify-between mb-3">
          <h3 className={cn('text-lg font-bold', theme.colors.text)}>
            Keycodes
          </h3>
          {onClose && (
            <motion.button
              onClick={onClose}
              className={cn(
                'p-1.5 rounded-lg transition-colors',
                'hover:bg-red-500/20 text-red-400 hover:text-red-300'
              )}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              title="Close keycodes panel"
            >
              <X className="w-4 h-4" />
            </motion.button>
          )}
        </div>

        {/* Search bar */}
        <div className="relative">
          <Search className={cn('absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4', theme.colors.textSecondary)} />
          <input
            type="text"
            placeholder="Search keycodes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={cn(
              'w-full pl-10 pr-10 py-2 rounded-lg text-sm transition-all',
              'focus:outline-none focus:ring-2 focus:ring-indigo-500/50',
              theme.colors.surface,
              theme.colors.text,
              theme.colors.border,
              'border backdrop-blur-sm'
            )}
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className={cn(
                'absolute right-3 top-1/2 -translate-y-1/2',
                'hover:bg-red-500/20 rounded p-1 transition-colors',
                theme.colors.textSecondary
              )}
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* Keycode list */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {searchTerm ? (
          // Search results
          <div className="space-y-2">
            <p className={cn('text-xs font-medium mb-2', theme.colors.textSecondary)}>
              {filteredKeycodes?.length || 0} results
            </p>
            {filteredKeycodes?.map((keycode) => (
              <KeycodeButton
                key={keycode.code}
                keycode={keycode}
                isSelected={selectedKeycode === keycode.code}
                onClick={() => onKeycodeSelect(keycode)}
              />
            ))}
          </div>
        ) : (
          // Category view
          <>
            {categories.map((category) => {
              const categoryKeycodes = getKeycodesByCategory(category);
              const isExpanded = expandedCategories.has(category);
              const categoryInfo = CATEGORY_INFO[category];

              return (
                <div key={category} className="space-y-2">
                  {/* Category header */}
                  <motion.button
                    onClick={() => toggleCategory(category)}
                    className={cn(
                      'w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-all',
                      'hover:bg-white/5 active:scale-98',
                      theme.colors.text
                    )}
                    whileHover={{ x: 2 }}
                  >
                    {isExpanded ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                    <span className="text-lg">{categoryInfo.icon}</span>
                    <span className="font-semibold">{categoryInfo.name}</span>
                    <span className={cn('ml-auto text-xs', theme.colors.textSecondary)}>
                      {categoryKeycodes.length}
                    </span>
                  </motion.button>

                  {/* Category keycodes */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="space-y-1 pl-4 overflow-hidden"
                      >
                        {categoryKeycodes.map((keycode) => (
                          <KeycodeButton
                            key={keycode.code}
                            keycode={keycode}
                            isSelected={selectedKeycode === keycode.code}
                            onClick={() => onKeycodeSelect(keycode)}
                          />
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </>
        )}
      </div>

      {/* Footer */}
      <div className={cn(
        'p-3 border-t text-xs text-center',
        theme.colors.textSecondary,
        theme.colors.border
      )}>
        Click a keycode to assign to selected key
      </div>
    </motion.div>
  );
}

interface KeycodeButtonProps {
  keycode: Keycode;
  isSelected: boolean;
  onClick: () => void;
}

function KeycodeButton({ keycode, isSelected, onClick }: KeycodeButtonProps) {
  const { theme } = useTheme();
  const categoryInfo = CATEGORY_INFO[keycode.category];

  return (
    <motion.button
      onClick={onClick}
      className={cn(
        'w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left transition-all',
        'hover:bg-white/5 active:scale-98',
        isSelected && 'ring-2 ring-indigo-500 bg-indigo-500/10',
        theme.colors.border,
        'border border-transparent hover:border-white/10'
      )}
      whileHover={{ x: 2 }}
      whileTap={{ scale: 0.98 }}
      title={keycode.description}
    >
      <div
        className={cn(
          'px-2 py-1 rounded font-mono text-xs font-bold min-w-[60px] text-center',
          theme.colors.surface,
          categoryInfo.color
        )}
      >
        {keycode.label}
      </div>
      <div className="flex-1 min-w-0">
        <p className={cn('text-xs font-medium truncate', theme.colors.text)}>
          {keycode.code}
        </p>
        <p className={cn('text-xs truncate', theme.colors.textSecondary)}>
          {keycode.description}
        </p>
      </div>
    </motion.button>
  );
}
