export interface KeyPosition {
  label: string;
  matrix: [number, number];
  x: number;
  y: number;
  w?: number;
  h?: number;
}

export interface KeyboardLayout {
  layout: KeyPosition[];
}

export interface KeyboardHalf {
  name: string;
  pid: string;
  layout: KeyPosition[];
}

export interface KeymapEntry {
  keycode: string;
  label: string;
  category: 'basic' | 'modifier' | 'function' | 'navigation' | 'system' | 'layer';
}

export interface LayerData {
  [key: string]: KeymapEntry;
}

export interface KeyboardState {
  leftHalf: KeyboardHalf;
  rightHalf: KeyboardHalf;
  currentLayer: number;
  layers: LayerData[];
  selectedKey: string | null;
  connectedDevices: {
    left: boolean;
    right: boolean;
  };
}

export interface ThemeConfig {
  isDark: boolean;
  colors: {
    background: string;
    surface: string;
    surfaceHover: string;
    border: string;
    text: string;
    textSecondary: string;
    primary: string;
    primaryHover: string;
    accent: string;
    keyDefault: string;
    keyModifier: string;
    keyFunction: string;
    keySelected: string;
  };
}