import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Moon, Sun, Keyboard, Wifi, WifiOff, Play, X, Package, Save, RotateCcw } from "lucide-react";
import { useTheme } from "./contexts/ThemeContext";
import { ThemeProvider } from "./contexts/ThemeProvider";
import { KeyboardView } from "./components/KeyboardView";
import { KeycodePanel } from "./components/KeycodePanel";
import { useKeyboard } from "./hooks/useKeyboard";
import { useKeymap } from "./hooks/useKeymap";
import type { KeyPosition } from "./types/keyboard";
import type { Keycode } from "./data/keycodes";
import { cn } from "./utils/cn";

function AppContent() {
  const { theme, toggleTheme } = useTheme();
  const { connectionState, connectHardware, connectDemo, disconnect } = useKeyboard();
  const {
    currentLayer,
    assignKeycode,
    getKeycode,
    hasUnsavedChanges,
    saveKeymap,
    resetLayerToDefault,
    switchLayer,
    getLayerKeycodeCount,
    maxLayers
  } = useKeymap();
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [showKeycodePanel, setShowKeycodePanel] = useState(false);
  const [showSaveConfirmation, setShowSaveConfirmation] = useState(false);

  const handleConnectHardware = async () => {
    const success = await connectHardware();
    if (!success) {
      console.error("Failed to connect to hardware");
    }
  };

  const handleConnectDemo = () => {
    connectDemo();
  };

  const handleDisconnect = () => {
    disconnect();
    setSelectedKey(null);
  };

  const handleKeySelect = (keyData: KeyPosition, half: 'left' | 'right') => {
    const keyId = `${half}-${keyData.matrix[0]}-${keyData.matrix[1]}`;
    setSelectedKey(selectedKey === keyId ? null : keyId);
    // Open keycode panel when a key is selected
    if (selectedKey !== keyId) {
      setShowKeycodePanel(true);
    }
  };

  const handleKeycodeSelect = (keycode: Keycode) => {
    if (selectedKey) {
      assignKeycode(selectedKey, keycode);
      console.log(`Assigned ${keycode.code} to key ${selectedKey} (Layer ${currentLayer})`);
    }
  };

  const handleSaveChanges = () => {
    const success = saveKeymap();
    if (success) {
      setShowSaveConfirmation(true);
      setTimeout(() => setShowSaveConfirmation(false), 3000);
    }
  };

  const handleResetLayer = () => {
    if (confirm(`Reset Layer ${currentLayer} to default? This cannot be undone.`)) {
      resetLayerToDefault(currentLayer);
    }
  };


  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated space background */}
      <div className="absolute inset-0">
        {theme.isDark ? (
          <>
            {/* Deep space gradient base */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900" />

            {/* Floating nebula clouds */}
            <motion.div
              className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-indigo-500/15 rounded-full blur-3xl"
              animate={{
                x: [0, 100, 0],
                y: [0, -50, 0],
                scale: [1, 1.3, 1],
                opacity: [0.2, 0.4, 0.2]
              }}
              transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-purple-500/15 rounded-full blur-3xl"
              animate={{
                x: [0, -80, 0],
                y: [0, 60, 0],
                scale: [1.2, 1, 1.2],
                opacity: [0.3, 0.5, 0.3]
              }}
              transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute bottom-0 left-1/3 w-[550px] h-[550px] bg-cyan-500/10 rounded-full blur-3xl"
              animate={{
                x: [0, -100, 0],
                y: [0, -80, 0],
                scale: [1, 1.4, 1],
                opacity: [0.15, 0.35, 0.15]
              }}
              transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute bottom-1/4 right-1/3 w-[400px] h-[400px] bg-blue-500/12 rounded-full blur-3xl"
              animate={{
                x: [0, 120, 0],
                y: [0, 100, 0],
                scale: [1.1, 1, 1.1],
                opacity: [0.2, 0.4, 0.2]
              }}
              transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
            />

            {/* Distant stars - small glowing dots */}
            {[...Array(30)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-white rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  opacity: [0.2, 0.8, 0.2],
                  scale: [1, 1.5, 1],
                }}
                transition={{
                  duration: 3 + Math.random() * 4,
                  repeat: Infinity,
                  delay: Math.random() * 5,
                  ease: "easeInOut"
                }}
              />
            ))}
          </>
        ) : (
          <>
            {/* Light mode - vibrant ethereal aura */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50" />

            {/* Floating colorful auras */}
            <motion.div
              className="absolute top-0 left-1/4 w-[700px] h-[700px] bg-gradient-to-br from-blue-300/30 to-indigo-400/20 rounded-full blur-3xl"
              animate={{
                x: [0, 120, 0],
                y: [0, -60, 0],
                scale: [1, 1.4, 1],
                opacity: [0.4, 0.6, 0.4]
              }}
              transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute top-1/3 right-1/4 w-[600px] h-[600px] bg-gradient-to-br from-purple-300/25 to-pink-400/20 rounded-full blur-3xl"
              animate={{
                x: [0, -100, 0],
                y: [0, 80, 0],
                scale: [1.3, 1, 1.3],
                opacity: [0.35, 0.55, 0.35]
              }}
              transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute bottom-0 left-1/3 w-[650px] h-[650px] bg-gradient-to-br from-cyan-300/30 to-blue-400/20 rounded-full blur-3xl"
              animate={{
                x: [0, -90, 0],
                y: [0, -100, 0],
                scale: [1.1, 1.5, 1.1],
                opacity: [0.3, 0.5, 0.3]
              }}
              transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute bottom-1/4 right-1/3 w-[500px] h-[500px] bg-gradient-to-br from-orange-300/25 to-amber-400/15 rounded-full blur-3xl"
              animate={{
                x: [0, 110, 0],
                y: [0, 70, 0],
                scale: [1.2, 1, 1.2],
                opacity: [0.35, 0.55, 0.35]
              }}
              transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute top-1/2 left-1/2 w-[550px] h-[550px] bg-gradient-to-br from-rose-300/20 to-pink-400/15 rounded-full blur-3xl"
              animate={{
                x: [0, -70, 0],
                y: [0, -90, 0],
                scale: [1, 1.3, 1],
                opacity: [0.25, 0.45, 0.25]
              }}
              transition={{ duration: 24, repeat: Infinity, ease: "easeInOut" }}
            />

            {/* Floating light particles */}
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  background: `radial-gradient(circle, ${
                    ['rgba(147, 197, 253, 0.6)', 'rgba(196, 181, 253, 0.6)', 'rgba(251, 207, 232, 0.6)', 'rgba(254, 215, 170, 0.6)'][Math.floor(Math.random() * 4)]
                  } 0%, transparent 70%)`
                }}
                animate={{
                  y: [0, -30, 0],
                  opacity: [0.3, 0.7, 0.3],
                  scale: [1, 1.3, 1],
                }}
                transition={{
                  duration: 4 + Math.random() * 3,
                  repeat: Infinity,
                  delay: Math.random() * 4,
                  ease: "easeInOut"
                }}
              />
            ))}
          </>
        )}
      </div>

      {/* Header */}
      <motion.header 
        className={cn(
          "relative z-10 border-b backdrop-blur-md",
          theme.colors.surface,
          theme.colors.border
        )}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo and title */}
            <motion.div 
              className="flex items-center gap-3"
              whileHover={{ scale: 1.02 }}
            >
              <div className={cn(
                "p-2 rounded-xl",
                theme.colors.surface,
                theme.colors.border,
                "border backdrop-blur-sm"
              )}>
                <Keyboard className="w-6 h-6 text-indigo-400" />
              </div>
              <div>
                <h1 className={cn("text-xl font-bold", theme.colors.text)}>
                  Untitled Super Keyboard
                </h1>
                <p className={cn("text-sm", theme.colors.textSecondary)}>
                  Professional Layout Configurator
                </p>
              </div>
            </motion.div>

            {/* Controls */}
            <div className="flex items-center gap-3">
              {/* Save button - only show when connected and has changes */}
              {connectionState.connected && hasUnsavedChanges && (
                <motion.button
                  onClick={handleSaveChanges}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-lg font-medium",
                    "transition-all duration-200",
                    "bg-green-600 hover:bg-green-500",
                    "text-white shadow-lg hover:shadow-xl active:scale-95"
                  )}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Save className="w-4 h-4" />
                  Save Changes
                </motion.button>
              )}

              {/* Reset layer button - only show when connected */}
              {connectionState.connected && (
                <motion.button
                  onClick={handleResetLayer}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-lg font-medium text-sm",
                    "transition-all duration-200",
                    theme.colors.surface,
                    theme.colors.surfaceHover,
                    theme.colors.border,
                    "border backdrop-blur-sm hover:shadow-lg"
                  )}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  title={`Reset Layer ${currentLayer} to default`}
                >
                  <RotateCcw className={cn("w-4 h-4", "text-amber-500")} />
                  <span className={theme.colors.text}>Reset Layer</span>
                </motion.button>
              )}
              {/* Connection button */}
              {!connectionState.connected ? (
                <div className="flex items-center gap-2">
                  <motion.button
                    onClick={handleConnectHardware}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 rounded-lg font-medium",
                      "transition-all duration-200",
                      theme.colors.primary,
                      theme.colors.primaryHover,
                      "text-white shadow-lg hover:shadow-xl active:scale-95"
                    )}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <WifiOff className="w-4 h-4" />
                    Connect Hardware
                  </motion.button>
                  
                  <span className={cn("text-sm", theme.colors.textSecondary)}>or</span>
                  
                  <motion.button
                    onClick={handleConnectDemo}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 rounded-lg font-medium",
                      "transition-all duration-200",
                      "bg-gradient-to-r from-cyan-500 to-indigo-500 hover:from-cyan-400 hover:to-indigo-400",
                      "text-white shadow-lg hover:shadow-xl active:scale-95"
                    )}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Play className="w-4 h-4" />
                    Demo Mode
                  </motion.button>
                </div>
              ) : (
                <motion.div
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-lg",
                    theme.colors.surface,
                    theme.colors.border,
                    "border backdrop-blur-sm"
                  )}
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                >
                  {connectionState.demoMode ? (
                    <>
                      <Play className="w-4 h-4 text-cyan-400" />
                      <span className={cn("text-sm font-medium", theme.colors.text)}>
                        Demo Mode
                      </span>
                      <motion.button
                        onClick={handleDisconnect}
                        className={cn(
                          "ml-2 p-1 rounded-md transition-colors",
                          "hover:bg-red-500/20 text-red-400 hover:text-red-300"
                        )}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        title="Exit Demo Mode"
                      >
                        <X className="w-3 h-3" />
                      </motion.button>
                    </>
                  ) : (
                    <>
                      <Wifi className="w-4 h-4 text-emerald-400" />
                      <span className={cn("text-sm font-medium", theme.colors.text)}>
                        Hardware Connected
                      </span>
                    </>
                  )}
                </motion.div>
              )}

              {/* Theme toggle */}
              <motion.button
                onClick={toggleTheme}
                className={cn(
                  "p-2 rounded-lg transition-all duration-200",
                  theme.colors.surface,
                  theme.colors.surfaceHover,
                  theme.colors.border,
                  "border backdrop-blur-sm hover:shadow-lg"
                )}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {theme.isDark ? (
                  <Sun className="w-5 h-5 text-amber-400" />
                ) : (
                  <Moon className="w-5 h-5 text-indigo-400" />
                )}
              </motion.button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main content */}
      <main className="relative z-10 flex h-[calc(100vh-80px)]">
        {/* Keycode Panel - shown when connected */}
        {connectionState.connected && showKeycodePanel && (
          <KeycodePanel
            onKeycodeSelect={handleKeycodeSelect}
            selectedKeycode={selectedKey ? getKeycode(selectedKey) : null}
            onClose={() => setShowKeycodePanel(false)}
          />
        )}

        {/* Keyboard area */}
        <div className="flex-1 overflow-auto py-8">
          {connectionState.connected ? (
            <>
              {/* Toggle keycode panel button - only show when panel is closed */}
              {!showKeycodePanel && (
                <motion.button
                  onClick={() => setShowKeycodePanel(true)}
                  className={cn(
                    "fixed top-24 left-4 z-20 p-3 rounded-xl transition-all",
                    theme.colors.surface,
                    theme.colors.border,
                    "border backdrop-blur-sm shadow-lg hover:shadow-xl"
                  )}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  title="Show Keycodes"
                >
                  <Package className={cn("w-5 h-5", theme.colors.text)} />
                </motion.button>
              )}

              <KeyboardView
                selectedKey={selectedKey}
                onKeySelect={handleKeySelect}
                connectedDevices={{
                  left: connectionState.leftHalf,
                  right: connectionState.rightHalf
                }}
                getKeycode={getKeycode}
                currentLayer={currentLayer}
                maxLayers={maxLayers}
                onLayerSwitch={(layer) => {
                  switchLayer(layer);
                  setSelectedKey(null);
                }}
                getLayerKeycodeCount={getLayerKeycodeCount}
              />
            </>
          ) : (
          <motion.div 
            className="max-w-md mx-auto text-center mt-20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <motion.div
              className={cn(
                "p-8 rounded-2xl backdrop-blur-md border",
                theme.colors.surface,
                theme.colors.border
              )}
              whileHover={{ scale: 1.02 }}
            >
              <Keyboard className="w-16 h-16 mx-auto mb-4 text-indigo-400" />
              <h2 className={cn("text-2xl font-bold mb-2", theme.colors.text)}>
                Welcome to Your Configurator
              </h2>
              <p className={cn("mb-6", theme.colors.textSecondary)}>
                Connect your physical split keyboard or try demo mode to explore the interface with your QMK layout.
              </p>
              <div className={cn("text-sm", theme.colors.textSecondary)}>
                <p>Features:</p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Real-time key customization</li>
                  <li>Multi-layer support</li>
                  <li>VIA protocol compatibility</li>
                  <li>Demo mode for testing without hardware</li>
                </ul>
              </div>
            </motion.div>
          </motion.div>
          )}
        </div>
      </main>

      {/* Save confirmation toast */}
      <AnimatePresence>
        {showSaveConfirmation && (
          <motion.div
            className={cn(
              "fixed top-24 right-6 px-4 py-3 rounded-lg shadow-2xl",
              "bg-green-600 text-white font-medium",
              "flex items-center gap-2 z-50"
            )}
            initial={{ opacity: 0, y: -20, x: 20 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, y: -20, x: 20 }}
          >
            <Save className="w-4 h-4" />
            Changes saved successfully!
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}
