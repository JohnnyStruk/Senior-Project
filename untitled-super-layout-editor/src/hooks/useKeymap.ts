import { useState, useCallback } from 'react';
import type { Keycode } from '../data/keycodes';

export interface KeymapEntry {
  keyId: string; // Format: "left-0-0" or "right-2-3"
  keycode: string; // QMK keycode like "KC_A"
}

export interface LayerKeymap {
  [keyId: string]: string; // keyId -> keycode
}

const MAX_LAYERS = 16;

export function useKeymap() {
  const [currentLayer, setCurrentLayer] = useState(0);
  const [layers, setLayers] = useState<LayerKeymap[]>(() => {
    // Initialize with empty layers
    return Array(MAX_LAYERS).fill(null).map(() => ({}));
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
    }
  }, []);

  return {
    currentLayer,
    layers,
    assignKeycode,
    getKeycode,
    clearKeycode,
    switchLayer,
    copyLayer,
    clearLayer,
    getLayerKeycodeCount,
    exportKeymap,
    importKeymap,
    maxLayers: MAX_LAYERS
  };
}
