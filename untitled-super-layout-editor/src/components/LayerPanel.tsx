import { motion } from 'framer-motion';
import { X, Layers } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { cn } from '../utils/cn';

interface LayerPanelProps {
  currentLayer: number;
  maxLayers: number;
  onLayerSwitch: (layer: number) => void;
  getLayerKeycodeCount: (layer: number) => number;
  onClose?: () => void;
}

export function LayerPanel({
  currentLayer,
  maxLayers,
  onLayerSwitch,
  getLayerKeycodeCount,
  onClose
}: LayerPanelProps) {
  const { theme } = useTheme();

  return (
    <motion.div
      className={cn(
        'w-80 h-full flex flex-col border-r backdrop-blur-md',
        theme.colors.surface,
        theme.colors.border
      )}
      initial={{ x: -320, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -320, opacity: 0 }}
      transition={{ duration: 0.5, type: 'spring' }}
    >
      {/* Header */}
      <div className="p-4 border-b" style={{ borderColor: 'inherit' }}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Layers className={cn('w-5 h-5', theme.colors.text)} />
            <h3 className={cn('text-lg font-bold', theme.colors.text)}>
              Layers
            </h3>
          </div>
          {onClose && (
            <motion.button
              onClick={onClose}
              className={cn(
                'p-1.5 rounded-lg transition-colors',
                'hover:bg-red-500/20 text-red-400 hover:text-red-300'
              )}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              title="Close layers panel"
            >
              <X className="w-4 h-4" />
            </motion.button>
          )}
        </div>

        <p className={cn('text-xs', theme.colors.textSecondary)}>
          Active: Layer {currentLayer}
        </p>
      </div>

      {/* Layer list */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {Array.from({ length: maxLayers }, (_, i) => {
          const keycodeCount = getLayerKeycodeCount(i);
          const isActive = currentLayer === i;

          return (
            <motion.button
              key={i}
              onClick={() => onLayerSwitch(i)}
              className={cn(
                'w-full flex items-center justify-between p-3 rounded-lg',
                'transition-all duration-200 border',
                isActive && 'ring-2 ring-indigo-500 bg-indigo-500/20 border-indigo-500/50',
                !isActive && cn(
                  theme.colors.surface,
                  theme.colors.surfaceHover,
                  theme.colors.border,
                  'hover:border-indigo-500/30'
                )
              )}
              whileHover={{ scale: 1.02, x: 4 }}
              whileTap={{ scale: 0.98 }}
              title={`Switch to Layer ${i} (${keycodeCount} keys assigned)`}
            >
              <div className="flex items-center gap-3">
                <div className={cn(
                  'w-10 h-10 rounded-lg flex items-center justify-center font-bold text-lg',
                  isActive ? 'bg-indigo-500/30 text-indigo-300' : cn(theme.colors.surface, theme.colors.text)
                )}>
                  {i}
                </div>
                <div className="text-left">
                  <p className={cn(
                    'text-sm font-semibold',
                    isActive ? 'text-indigo-300' : theme.colors.text
                  )}>
                    Layer {i}
                  </p>
                  <p className={cn(
                    'text-xs',
                    isActive ? 'text-indigo-400' : theme.colors.textSecondary
                  )}>
                    {keycodeCount > 0 ? `${keycodeCount} keys assigned` : 'Empty layer'}
                  </p>
                </div>
              </div>

              {isActive && (
                <motion.div
                  className="w-2 h-2 rounded-full bg-indigo-400"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring' }}
                />
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Footer */}
      <div className={cn(
        'p-3 border-t text-xs text-center',
        theme.colors.textSecondary,
        theme.colors.border
      )}>
        Click a layer to switch between keyboard layouts
      </div>
    </motion.div>
  );
}
