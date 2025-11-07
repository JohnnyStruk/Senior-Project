import { useState, useCallback } from 'react';
import type { Keycode } from '../data/keycodes';
import { getDefaultKeymap, DEFAULT_LAYER_0 } from '../data/defaultKeymap';

export interface KeymapEntry {
  keyId: string; // Format: "left-0-0" or "right-2-3"
  keycode: string; // QMK keycode like "KC_A"
}

export interface LayerKeymap {
  [keyId: string]: string; // keyId -> keycode
}

const MAX_LAYERS = 16;
const STORAGE_KEY = 'untitled-super-keyboard-keymap';

export function useKeymap() {
  const [currentLayer, setCurrentLayer] = useState(0);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const [layers, setLayers] = useState<LayerKeymap[]>(() => {
    // Try to load from localStorage first
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length === MAX_LAYERS) {
          return parsed;
        }
      } catch (e) {
        console.error('Failed to parse saved keymap:', e);
      }
    }

    // If nothing saved or parse failed, use default keymap
    return getDefaultKeymap();
  });

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
      const newLayers = Array(MAX_LAYERS).fill(null).map(() => ({}));
      data.layers.forEach((layerData: any) => {
        if (layerData?.layer >= 0 && layerData?.layer < MAX_LAYERS && layerData?.keycodes) {
          newLayers[layerData.layer] = layerData.keycodes;
        }
      });
      setLayers(newLayers);
      setHasUnsavedChanges(true);
    }
  }, []);

  // Save current keymap to localStorage
  const saveKeymap = useCallback(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(layers));
      setHasUnsavedChanges(false);
      return true;
    } catch (e) {
      console.error('Failed to save keymap:', e);
      return false;
    }
  }, [layers]);

  // Reset a specific layer to default
  const resetLayerToDefault = useCallback((layerIndex: number) => {
    if (layerIndex >= 0 && layerIndex < MAX_LAYERS) {
      setLayers(prevLayers => {
        const newLayers = [...prevLayers];

        // Layer 0 resets to DEFAULT_LAYER_0, others reset to empty
        if (layerIndex === 0) {
          newLayers[0] = { ...DEFAULT_LAYER_0 };
        } else {
          newLayers[layerIndex] = {};
        }

        return newLayers;
      });
      setHasUnsavedChanges(true);
    }
  }, []);

  // Reset all layers to factory default
  const resetAllToDefault = useCallback(() => {
    setLayers(getDefaultKeymap());
    setHasUnsavedChanges(true);
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
    maxLayers: MAX_LAYERS
  };
}
