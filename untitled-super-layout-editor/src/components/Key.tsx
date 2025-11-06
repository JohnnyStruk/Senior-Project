import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import type { KeyPosition } from '../types/keyboard';
import { findKeycode } from '../data/keycodes';
import { cn } from '../utils/cn';

interface KeyProps {
  keyData: KeyPosition;
  isSelected?: boolean;
  assignedKeycode?: string; // QMK keycode like "KC_A"
  category?: 'basic' | 'modifier' | 'function' | 'navigation' | 'system' | 'layer';
  onKeyClick?: (keyData: KeyPosition) => void;
  scale?: number;
}

const KEY_SIZE = 48; // Base key size in pixels
const KEY_GAP = 4; // Gap between keys

export function Key({
  keyData,
  isSelected = false,
  assignedKeycode,
  category = 'basic',
  onKeyClick,
  scale = 1
}: KeyProps) {
  const { theme } = useTheme();

  // Get keycode info if assigned
  const keycodeInfo = assignedKeycode ? findKeycode(assignedKeycode) : null;
  
  const width = (keyData.w || 1) * KEY_SIZE * scale + ((keyData.w || 1) - 1) * KEY_GAP;
  const height = (keyData.h || 1) * KEY_SIZE * scale + ((keyData.h || 1) - 1) * KEY_GAP;
  
  const getKeyStyle = () => {
    if (isSelected) {
      return theme.colors.keySelected;
    }
    
    switch (category) {
      case 'modifier':
        return theme.colors.keyModifier;
      case 'function':
      case 'navigation':
      case 'system':
        return theme.colors.keyFunction;
      default:
        return theme.colors.keyDefault;
    }
  };

  const getKeyCategory = (label: string): typeof category => {
    const modifiers = ['Ctrl', 'Alt', 'Win', 'Shift', 'Caps'];
    const functions = ['Esc', 'F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12', 'PrtSc', 'Del'];
    const navigation = ['↑', '↓', '←', '→', 'Home', 'PgUp', 'PgDn'];
    
    if (modifiers.some(mod => label.includes(mod))) return 'modifier';
    if (functions.some(func => label.includes(func))) return 'function';
    if (navigation.some(nav => label.includes(nav))) return 'navigation';
    
    return 'basic';
  };

  const actualCategory = category === 'basic' ? getKeyCategory(keyData.label) : category;

  return (
    <motion.button
      className={cn(
        "relative rounded-lg border backdrop-blur-sm transition-all duration-200 ease-out",
        "flex items-center justify-center text-sm font-medium",
        "shadow-lg hover:shadow-xl active:scale-95",
        getKeyStyle(),
        isSelected && "ring-2 ring-cyan-400/50 shadow-lg shadow-cyan-500/20"
      )}
      style={{
        width: `${width}px`,
        height: `${height}px`,
        position: 'absolute',
        left: `${keyData.x * KEY_SIZE * scale + keyData.x * KEY_GAP}px`,
        top: `${keyData.y * KEY_SIZE * scale + keyData.y * KEY_GAP}px`,
      }}
      onClick={() => onKeyClick?.(keyData)}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ 
        type: "spring", 
        stiffness: 400, 
        damping: 30,
        delay: (keyData.x + keyData.y) * 0.02 // Stagger animation
      }}
      whileHover={{ 
        scale: 1.05,
        transition: { type: "spring", stiffness: 500, damping: 30 }
      }}
      whileTap={{ scale: 0.95 }}
    >
      {/* Glassmorphism inner glow */}
      <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-white/10 to-transparent opacity-50" />
      
      {/* Key content */}
      <div className="relative z-10 flex flex-col items-center justify-center px-2 py-1">
        {/* Main key label */}
        <span className="text-xs font-semibold leading-none">
          {keycodeInfo ? keycodeInfo.label : keyData.label}
        </span>

        {/* Show keycode if assigned and different from label */}
        {keycodeInfo && keycodeInfo.label !== keyData.label && (
          <span className="text-[9px] opacity-50 leading-none mt-0.5 font-mono">
            {keyData.label}
          </span>
        )}

        {/* Assignment indicator */}
        {keycodeInfo && (
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-cyan-400 rounded-full shadow-sm" />
        )}
      </div>
      
      {/* Selection indicator */}
      {isSelected && (
        <motion.div
          className="absolute -inset-1 rounded-lg border-2 border-cyan-400/60"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
        />
      )}
      
      {/* Subtle category indicator */}
      <div className={cn(
        "absolute bottom-0.5 right-0.5 w-1.5 h-1.5 rounded-full opacity-40",
        actualCategory === 'modifier' && "bg-indigo-400",
        actualCategory === 'function' && "bg-emerald-400", 
        actualCategory === 'navigation' && "bg-amber-400",
        actualCategory === 'basic' && "bg-gray-400"
      )} />
    </motion.button>
  );
}