import { useState, useCallback, useEffect } from 'react';
import type { Keycode } from '../data/keycodes';
import { getDefaultKeymap } from '../data/defaultKeymap';
import type { KeyboardType } from '../data/layouts';

export interface KeymapEntry {
  keyId: string; // Format: "left-0-0" or "right-2-3"
  keycode: string; // QMK keycode like "KC_A"
}

export interface LayerKeymap {
  [keyId: string]: string; // keyId -> keycode
}

const MAX_LAYERS = 5;
const STORAGE_KEY_PREFIX = 'untitled-super-keyboard-keymap';

// Get storage key for specific keyboard type
function getStorageKey(keyboardType: KeyboardType): string {
  return `${STORAGE_KEY_PREFIX}-${keyboardType}`;
}

export function useKeymap(keyboardType: KeyboardType = 'main') {
  const [currentLayer, setCurrentLayer] = useState(0);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const [layers, setLayers] = useState<LayerKeymap[]>(() => {
    // Try to load from localStorage for this specific keyboard type
    const storageKey = getStorageKey(keyboardType);
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Accept any array, but ensure it has exactly MAX_LAYERS layers
        if (Array.isArray(parsed)) {
          // If saved data has different number of layers, migrate it
          const newLayers = getDefaultKeymap(keyboardType);
          for (let i = 0; i < Math.min(parsed.length, MAX_LAYERS); i++) {
            if (parsed[i] && typeof parsed[i] === 'object') {
              newLayers[i] = parsed[i];
            }
          }
          return newLayers;
        }
      } catch (e) {
        console.error('Failed to parse saved keymap:', e);
      }
    }

    // If nothing saved or parse failed, use default keymap for this keyboard type
    return getDefaultKeymap(keyboardType);
  });

  // Reload layers when keyboard type changes
  useEffect(() => {
    const storageKey = getStorageKey(keyboardType);
    const saved = localStorage.getItem(storageKey);

    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          const newLayers = getDefaultKeymap(keyboardType);
          for (let i = 0; i < Math.min(parsed.length, MAX_LAYERS); i++) {
            if (parsed[i] && typeof parsed[i] === 'object') {
              newLayers[i] = parsed[i];
            }
          }
          setLayers(newLayers);
          setHasUnsavedChanges(false);
          return;
        }
      } catch (e) {
        console.error('Failed to parse saved keymap:', e);
      }
    }

    // Load default keymap for this keyboard type if nothing saved
    setLayers(getDefaultKeymap(keyboardType));
    setHasUnsavedChanges(false);
  }, [keyboardType]);

  // Assign a keycode to a key in the current layer
  const assignKeycode = useCallback((keyId: string, keycode: Keycode) => {
    setLayers(prevLayers => {
      const newLayers = [...prevLayers];
      newLayers[currentLayer] = {
        ...newLayers[currentLayer],
        [keyId]: keycode.code
      };
      return newLayers;
    });
    setHasUnsavedChanges(true);
  }, [currentLayer]);

  // Get the keycode for a specific key in the current layer
  const getKeycode = useCallback((keyId: string): string | undefined => {
    return layers[currentLayer]?.[keyId];
  }, [layers, currentLayer]);

  // Clear keycode assignment for a key
  const clearKeycode = useCallback((keyId: string) => {
    setLayers(prevLayers => {
      const newLayers = [...prevLayers];
      const layerCopy = { ...newLayers[currentLayer] };
      delete layerCopy[keyId];
      newLayers[currentLayer] = layerCopy;
      return newLayers;
    });
    setHasUnsavedChanges(true);
  }, [currentLayer]);

  // Switch to a different layer
  const switchLayer = useCallback((layerIndex: number) => {
    if (layerIndex >= 0 && layerIndex < MAX_LAYERS) {
      setCurrentLayer(layerIndex);
    }
  }, []);

  // Copy current layer to another layer
  const copyLayer = useCallback((fromLayer: number, toLayer: number) => {
    if (fromLayer >= 0 && fromLayer < MAX_LAYERS && toLayer >= 0 && toLayer < MAX_LAYERS) {
      setLayers(prevLayers => {
        const newLayers = [...prevLayers];
        newLayers[toLayer] = { ...prevLayers[fromLayer] };
        return newLayers;
      });
    }
  }, []);

  // Clear all keycodes in a layer
  const clearLayer = useCallback((layerIndex: number) => {
    if (layerIndex >= 0 && layerIndex < MAX_LAYERS) {
      setLayers(prevLayers => {
        const newLayers = [...prevLayers];
        newLayers[layerIndex] = {};
        return newLayers;
      });
    }
  }, []);

  // Get count of assigned keys in a layer
  const getLayerKeycodeCount = useCallback((layerIndex: number): number => {
    return Object.keys(layers[layerIndex] || {}).length;
  }, [layers]);

  // Export keymap as JSON
  const exportKeymap = useCallback(() => {
    return {
      version: 1,
      layers: layers.map((layer, index) => ({
        layer: index,
        keycodes: layer
      }))
    };
  }, [layers]);

  // Import keymap from JSON
  const importKeymap = useCallback((data: any) => {
    if (data?.layers && Array.isArray(data.layers)) {
      const newLayers = getDefaultKeymap();
      data.layers.forEach((layerData: any) => {
        if (layerData?.layer >= 0 && layerData?.layer < MAX_LAYERS && layerData?.keycodes) {
          newLayers[layerData.layer] = layerData.keycodes;
        }
      });
      setLayers(newLayers);
      setHasUnsavedChanges(true);
    }
  }, []);

  // Save current keymap to localStorage for this keyboard type
  const saveKeymap = useCallback(() => {
    try {
      const storageKey = getStorageKey(keyboardType);
      localStorage.setItem(storageKey, JSON.stringify(layers));
      setHasUnsavedChanges(false);
      return true;
    } catch (e) {
      console.error('Failed to save keymap:', e);
      return false;
    }
  }, [layers, keyboardType]);

  // Reset a specific layer to default
  const resetLayerToDefault = useCallback((layerIndex: number) => {
    if (layerIndex >= 0 && layerIndex < MAX_LAYERS) {
      setLayers(prevLayers => {
        const newLayers = [...prevLayers];

        // Layer 0 resets to keyboard type's default, others (1-4) reset to empty
        if (layerIndex === 0) {
          const defaults = getDefaultKeymap(keyboardType);
          newLayers[0] = { ...defaults[0] };
        } else {
          newLayers[layerIndex] = {};
        }

        return newLayers;
      });
      setHasUnsavedChanges(true);
    }
  }, [keyboardType]);

  // Reset all layers to factory default for current keyboard type
  const resetAllToDefault = useCallback(() => {
    setLayers(getDefaultKeymap(keyboardType));
    setHasUnsavedChanges(true);
  }, [keyboardType]);

  // Update an entire layer with new keymap (useful for syncing from hardware)
  const updateLayer = useCallback((layerIndex: number, keymap: LayerKeymap) => {
    console.log('>>> updateLayer called <<<');
    console.log('Layer index:', layerIndex);
    console.log('New keymap:', keymap);
    console.log('Keymap has', Object.keys(keymap).length, 'keys');

    if (layerIndex >= 0 && layerIndex < MAX_LAYERS) {
      setLayers(prevLayers => {
        console.log('Previous layers state:', prevLayers);
        console.log('Previous layer', layerIndex, ':', prevLayers[layerIndex]);
        const newLayers = [...prevLayers];
        newLayers[layerIndex] = keymap;
        console.log('New layers state:', newLayers);
        console.log('New layer', layerIndex, ':', newLayers[layerIndex]);
        return newLayers;
      });
      setHasUnsavedChanges(true);
      console.log('>>> updateLayer completed, hasUnsavedChanges set to true <<<');
    } else {
      console.error('Invalid layer index:', layerIndex);
    }
  }, []);

  return {
    currentLayer,
    layers,
    hasUnsavedChanges,
    assignKeycode,
    getKeycode,
    clearKeycode,
    switchLayer,
    copyLayer,
    clearLayer,
    getLayerKeycodeCount,
    exportKeymap,
    importKeymap,
    saveKeymap,
    resetLayerToDefault,
    resetAllToDefault,
    updateLayer,
    maxLayers: MAX_LAYERS
  };
}
