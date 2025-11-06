import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { Key } from './Key';
import { leftHalfLayout, rightHalfLayout } from '../data/layouts';
import type { KeyPosition } from '../types/keyboard';
import { cn } from '../utils/cn';

interface KeyboardViewProps {
  selectedKey?: string | null;
  onKeySelect?: (keyData: KeyPosition, half: 'left' | 'right') => void;
  connectedDevices?: {
    left: boolean;
    right: boolean;
  };
  getKeycode?: (keyId: string) => string | undefined;
}

export function KeyboardView({
  selectedKey,
  onKeySelect,
  connectedDevices = { left: false, right: false },
  getKeycode
}: KeyboardViewProps) {
  const { theme } = useTheme();
  const [hoveredHalf, setHoveredHalf] = useState<'left' | 'right' | null>(null);

  const scale = 0.9; // Slightly smaller for better fit

  const getKeyId = (keyData: KeyPosition, half: 'left' | 'right') => 
    `${half}-${keyData.matrix[0]}-${keyData.matrix[1]}`;

  const isKeySelected = (keyData: KeyPosition, half: 'left' | 'right') => 
    selectedKey === getKeyId(keyData, half);

  const handleKeyClick = (keyData: KeyPosition, half: 'left' | 'right') => {
    onKeySelect?.(keyData, half);
  };

  // Calculate layout dimensions
  const leftMaxX = Math.max(...leftHalfLayout.layout.map(k => k.x + (k.w || 1))) * 48 * scale;
  const leftMaxY = Math.max(...leftHalfLayout.layout.map(k => k.y + (k.h || 1))) * 48 * scale;
  const rightMaxX = Math.max(...rightHalfLayout.layout.map(k => k.x + (k.w || 1))) * 48 * scale;
  const rightMaxY = Math.max(...rightHalfLayout.layout.map(k => k.y + (k.h || 1))) * 48 * scale;

  return (
    <div className="w-full max-w-7xl mx-auto p-8">
      {/* Header */}
      <motion.div
        className="text-center mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className={cn("text-3xl font-bold mb-2", theme.colors.text)}>
          Split Keyboard Layout
        </h2>
        <p className={cn("text-sm", theme.colors.textSecondary)}>
          Click any key to customize its function
        </p>
      </motion.div>

      {/* Connection Status */}
      <motion.div 
        className="flex justify-center gap-6 mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <div className="flex items-center gap-2">
          <div className={cn(
            "w-3 h-3 rounded-full transition-all duration-300",
            connectedDevices.left ? "bg-emerald-500 shadow-emerald-500/50" : "bg-gray-500"
          )} />
          <span className={cn("text-sm font-medium", theme.colors.textSecondary)}>
            Left Half {connectedDevices.left ? "Connected" : "Disconnected"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className={cn(
            "w-3 h-3 rounded-full transition-all duration-300",
            connectedDevices.right ? "bg-emerald-500 shadow-emerald-500/50" : "bg-gray-500"
          )} />
          <span className={cn("text-sm font-medium", theme.colors.textSecondary)}>
            Right Half {connectedDevices.right ? "Connected" : "Disconnected"}
          </span>
        </div>
      </motion.div>

      {/* Split Keyboard Layout */}
      <div className="flex justify-center items-start gap-16">
        
        {/* Left Half */}
        <motion.div
          className={cn(
            "relative rounded-2xl p-6 transition-all duration-300",
            theme.colors.surface,
            theme.colors.border,
            "border shadow-2xl",
            hoveredHalf === 'left' && "shadow-indigo-500/20",
            !connectedDevices.left && "opacity-60"
          )}
          style={{
            width: `${leftMaxX + 48}px`,
            height: `${leftMaxY + 48}px`
          }}
          onMouseEnter={() => setHoveredHalf('left')}
          onMouseLeave={() => setHoveredHalf(null)}
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.7, type: "spring" }}
        >
          {/* Left half label */}
          <motion.div 
            className="absolute -top-8 left-1/2 transform -translate-x-1/2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <span className={cn(
              "text-lg font-semibold px-4 py-1 rounded-full",
              theme.colors.surface,
              theme.colors.text,
              "backdrop-blur-md border",
              theme.colors.border
            )}>
              Left Half
            </span>
          </motion.div>

          {/* Glassmorphism background */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/5 to-transparent" />
          
          {/* Keys */}
          <div className="relative">
            {leftHalfLayout.layout.map((keyData) => {
              const keyId = getKeyId(keyData, 'left');
              return (
                <Key
                  key={keyId}
                  keyData={keyData}
                  scale={scale}
                  isSelected={isKeySelected(keyData, 'left')}
                  assignedKeycode={getKeycode?.(keyId)}
                  onKeyClick={(keyData) => handleKeyClick(keyData, 'left')}
                />
              );
            })}
          </div>
        </motion.div>

        {/* Split Indicator */}
        <motion.div 
          className="flex flex-col items-center justify-center mt-16"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <div className={cn(
            "w-1 h-16 rounded-full bg-gradient-to-b from-indigo-500 to-cyan-500",
            "shadow-lg shadow-indigo-500/30"
          )} />
          <div className={cn(
            "mt-2 px-3 py-1 rounded-full text-xs font-medium",
            theme.colors.surface,
            theme.colors.textSecondary,
            "backdrop-blur-md border",
            theme.colors.border
          )}>
            SPLIT
          </div>
        </motion.div>

        {/* Right Half */}
        <motion.div
          className={cn(
            "relative rounded-2xl p-6 transition-all duration-300",
            theme.colors.surface,
            theme.colors.border,
            "border shadow-2xl",
            hoveredHalf === 'right' && "shadow-cyan-500/20",
            !connectedDevices.right && "opacity-60"
          )}
          style={{
            width: `${rightMaxX + 48}px`,
            height: `${rightMaxY + 48}px`
          }}
          onMouseEnter={() => setHoveredHalf('right')}
          onMouseLeave={() => setHoveredHalf(null)}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.7, type: "spring" }}
        >
          {/* Right half label */}
          <motion.div 
            className="absolute -top-8 left-1/2 transform -translate-x-1/2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <span className={cn(
              "text-lg font-semibold px-4 py-1 rounded-full",
              theme.colors.surface,
              theme.colors.text,
              "backdrop-blur-md border",
              theme.colors.border
            )}>
              Right Half
            </span>
          </motion.div>

          {/* Glassmorphism background */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/5 to-transparent" />
          
          {/* Keys */}
          <div className="relative">
            {rightHalfLayout.layout.map((keyData) => {
              const keyId = getKeyId(keyData, 'right');
              return (
                <Key
                  key={keyId}
                  keyData={keyData}
                  scale={scale}
                  isSelected={isKeySelected(keyData, 'right')}
                  assignedKeycode={getKeycode?.(keyId)}
                  onKeyClick={(keyData) => handleKeyClick(keyData, 'right')}
                />
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* Selected Key Info */}
      {selectedKey && (
        <motion.div
          className={cn(
            "mt-8 mx-auto max-w-md p-4 rounded-xl",
            theme.colors.surface,
            theme.colors.border,
            "border backdrop-blur-md"
          )}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <p className={cn("text-center text-sm font-medium", theme.colors.text)}>
            Selected: <span className="text-cyan-400">{selectedKey}</span>
          </p>
          <p className={cn("text-center text-xs mt-1", theme.colors.textSecondary)}>
            Click to customize this key's function
          </p>
        </motion.div>
      )}
    </div>
  );
}