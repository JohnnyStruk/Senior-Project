import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Moon, Sun, Keyboard, Wifi, WifiOff, Play, X, Package, Save, RotateCcw, HelpCircle } from "lucide-react";
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
  const [showHelpPanel, setShowHelpPanel] = useState(false);
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
            {/* Deep space gradient base with subtle color shifts */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900" />

            {/* Floating nebula clouds - original sizes with more variety */}
            <motion.div
              className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-indigo-500/20 rounded-full blur-3xl"
              animate={{
                x: [0, 100, 0],
                y: [0, -50, 0],
                scale: [1, 1.3, 1],
                opacity: [0.25, 0.5, 0.25]
              }}
              transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-purple-500/18 rounded-full blur-3xl"
              animate={{
                x: [0, -80, 0],
                y: [0, 60, 0],
                scale: [1.2, 1, 1.2],
                opacity: [0.3, 0.55, 0.3]
              }}
              transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute bottom-0 left-1/3 w-[550px] h-[550px] bg-cyan-500/15 rounded-full blur-3xl"
              animate={{
                x: [0, -100, 0],
                y: [0, -80, 0],
                scale: [1, 1.4, 1],
                opacity: [0.2, 0.45, 0.2]
              }}
              transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute bottom-1/4 right-1/3 w-[400px] h-[400px] bg-blue-500/16 rounded-full blur-3xl"
              animate={{
                x: [0, 120, 0],
                y: [0, 100, 0],
                scale: [1.1, 1, 1.1],
                opacity: [0.25, 0.5, 0.25]
              }}
              transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute top-1/2 left-1/2 w-[450px] h-[450px] bg-pink-500/14 rounded-full blur-3xl"
              animate={{
                x: [0, -90, 0],
                y: [0, -70, 0],
                scale: [1, 1.3, 1],
                opacity: [0.22, 0.48, 0.22]
              }}
              transition={{ duration: 28, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute top-0 right-0 w-[380px] h-[380px] bg-violet-500/15 rounded-full blur-3xl"
              animate={{
                x: [0, -60, 0],
                y: [0, 80, 0],
                scale: [1.2, 1, 1.2],
                opacity: [0.24, 0.52, 0.24]
              }}
              transition={{ duration: 24, repeat: Infinity, ease: "easeInOut" }}
            />

            {/* Cosmic dust layers - subtle depth */}
            <motion.div
              className="absolute top-1/4 left-0 w-full h-[200px] bg-gradient-to-r from-transparent via-indigo-500/5 to-transparent blur-2xl"
              animate={{
                x: ['-100%', '100%'],
                opacity: [0, 0.3, 0]
              }}
              transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
            />
            <motion.div
              className="absolute bottom-1/3 right-0 w-full h-[150px] bg-gradient-to-r from-transparent via-purple-500/4 to-transparent blur-2xl"
              animate={{
                x: ['100%', '-100%'],
                opacity: [0, 0.25, 0]
              }}
              transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
            />

            {/* Shooting stars */}
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={`shooting-${i}`}
                className="absolute w-[2px] h-[2px] bg-white rounded-full"
                style={{
                  top: `${Math.random() * 50}%`,
                  left: '-10%',
                  boxShadow: '0 0 4px 1px rgba(255, 255, 255, 0.8), 0 0 8px 2px rgba(147, 197, 253, 0.4)'
                }}
                animate={{
                  x: ['0vw', '120vw'],
                  y: ['0vh', '60vh'],
                  opacity: [0, 1, 1, 0],
                  scale: [0, 1.5, 1, 0]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 8 + Math.random() * 5,
                  repeatDelay: 15,
                  ease: "easeOut"
                }}
              />
            ))}

            {/* Twinkling stars with varied colors */}
            {[...Array(60)].map((_, i) => {
              const size = Math.random() > 0.7 ? 'w-1.5 h-1.5' : 'w-1 h-1';
              const colors = [
                'bg-white',
                'bg-blue-100',
                'bg-indigo-100',
                'bg-purple-100',
                'bg-cyan-100'
              ];
              const color = colors[Math.floor(Math.random() * colors.length)];
              return (
                <motion.div
                  key={i}
                  className={`absolute ${size} ${color} rounded-full`}
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    boxShadow: '0 0 2px 0.5px rgba(255, 255, 255, 0.5)'
                  }}
                  animate={{
                    opacity: [0.3, 1, 0.3],
                    scale: [1, 1.8, 1],
                  }}
                  transition={{
                    duration: 2 + Math.random() * 5,
                    repeat: Infinity,
                    delay: Math.random() * 5,
                    ease: "easeInOut"
                  }}
                />
              );
            })}

            {/* Distant galaxy clusters - very subtle */}
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={`galaxy-${i}`}
                className="absolute w-16 h-16 rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  background: 'radial-gradient(circle, rgba(147, 197, 253, 0.08) 0%, transparent 70%)',
                  filter: 'blur(8px)'
                }}
                animate={{
                  opacity: [0.1, 0.3, 0.1],
                  scale: [0.8, 1.2, 0.8],
                }}
                transition={{
                  duration: 8 + Math.random() * 4,
                  repeat: Infinity,
                  delay: Math.random() * 3,
                  ease: "easeInOut"
                }}
              />
            ))}
          </>
        ) : (
          <>
            {/* Light mode - vibrant ethereal aura - enhanced */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50" />

            {/* Floating colorful auras - enhanced */}
            <motion.div
              className="absolute top-0 left-1/4 w-[900px] h-[900px] bg-gradient-to-br from-blue-400/40 to-indigo-500/30 rounded-full blur-3xl"
              animate={{
                x: [0, 120, 0],
                y: [0, -60, 0],
                scale: [1, 1.5, 1],
                opacity: [0.5, 0.8, 0.5]
              }}
              transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute top-1/3 right-1/4 w-[800px] h-[800px] bg-gradient-to-br from-purple-400/35 to-pink-500/30 rounded-full blur-3xl"
              animate={{
                x: [0, -100, 0],
                y: [0, 80, 0],
                scale: [1.3, 1, 1.3],
                opacity: [0.45, 0.75, 0.45]
              }}
              transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute bottom-0 left-1/3 w-[850px] h-[850px] bg-gradient-to-br from-cyan-400/40 to-blue-500/30 rounded-full blur-3xl"
              animate={{
                x: [0, -90, 0],
                y: [0, -100, 0],
                scale: [1.1, 1.6, 1.1],
                opacity: [0.4, 0.7, 0.4]
              }}
              transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute bottom-1/4 right-1/3 w-[700px] h-[700px] bg-gradient-to-br from-orange-400/35 to-amber-500/25 rounded-full blur-3xl"
              animate={{
                x: [0, 110, 0],
                y: [0, 70, 0],
                scale: [1.2, 1, 1.2],
                opacity: [0.45, 0.75, 0.45]
              }}
              transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute top-1/2 left-1/2 w-[750px] h-[750px] bg-gradient-to-br from-rose-400/30 to-pink-500/25 rounded-full blur-3xl"
              animate={{
                x: [0, -70, 0],
                y: [0, -90, 0],
                scale: [1, 1.4, 1],
                opacity: [0.35, 0.65, 0.35]
              }}
              transition={{ duration: 24, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute top-0 right-0 w-[650px] h-[650px] bg-gradient-to-br from-violet-400/30 to-fuchsia-500/25 rounded-full blur-3xl"
              animate={{
                x: [0, -80, 0],
                y: [0, 90, 0],
                scale: [1.1, 1, 1.1],
                opacity: [0.4, 0.7, 0.4]
              }}
              transition={{ duration: 26, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-emerald-400/25 to-teal-500/20 rounded-full blur-3xl"
              animate={{
                x: [0, -100, 0],
                y: [0, -70, 0],
                scale: [1.2, 1, 1.2],
                opacity: [0.3, 0.6, 0.3]
              }}
              transition={{ duration: 23, repeat: Infinity, ease: "easeInOut" }}
            />

            {/* Floating light particles - enhanced */}
            {[...Array(35)].map((_, i) => {
              const size = Math.random() > 0.6 ? 'w-3 h-3' : 'w-2 h-2';
              const colors = [
                'rgba(147, 197, 253, 0.8)', // blue
                'rgba(196, 181, 253, 0.8)', // purple
                'rgba(251, 207, 232, 0.8)', // pink
                'rgba(254, 215, 170, 0.8)', // orange
                'rgba(167, 243, 208, 0.8)', // emerald
                'rgba(253, 186, 116, 0.8)', // amber
              ];
              return (
                <motion.div
                  key={i}
                  className={`absolute ${size} rounded-full`}
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    background: `radial-gradient(circle, ${colors[Math.floor(Math.random() * colors.length)]} 0%, transparent 70%)`
                  }}
                  animate={{
                    y: [0, -40, 0],
                    opacity: [0.4, 0.9, 0.4],
                    scale: [1, 1.5, 1],
                  }}
                  transition={{
                    duration: 3 + Math.random() * 4,
                    repeat: Infinity,
                    delay: Math.random() * 4,
                    ease: "easeInOut"
                  }}
                />
              );
            })}
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
                  Layout Editor
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
                title="Toggle theme"
              >
                {theme.isDark ? (
                  <Sun className="w-5 h-5 text-amber-400" />
                ) : (
                  <Moon className="w-5 h-5 text-indigo-400" />
                )}
              </motion.button>

              {/* Help button */}
              <motion.button
                onClick={() => setShowHelpPanel(!showHelpPanel)}
                className={cn(
                  "p-2 rounded-lg transition-all duration-200",
                  theme.colors.surface,
                  theme.colors.surfaceHover,
                  theme.colors.border,
                  "border backdrop-blur-sm hover:shadow-lg",
                  showHelpPanel && "ring-2 ring-indigo-500"
                )}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                title="Help & Guide"
              >
                <HelpCircle className="w-5 h-5 text-indigo-400" />
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
                Welcome to the Untitled Super Keyboard Editor
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

      {/* Help Panel */}
      <AnimatePresence>
        {showHelpPanel && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowHelpPanel(false)}
            />

            {/* Help Modal */}
            <motion.div
              className={cn(
                "fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
                "w-full max-w-2xl max-h-[80vh] overflow-y-auto",
                "rounded-2xl p-6 shadow-2xl z-50",
                theme.colors.surface,
                theme.colors.border,
                "border backdrop-blur-md"
              )}
              initial={{ opacity: 0, scale: 0.9, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -20 }}
              transition={{ type: "spring", duration: 0.5 }}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "p-2 rounded-xl",
                    "bg-indigo-500/20 border border-indigo-500/30"
                  )}>
                    <HelpCircle className="w-6 h-6 text-indigo-400" />
                  </div>
                  <h2 className={cn("text-2xl font-bold", theme.colors.text)}>
                    How to Use
                  </h2>
                </div>
                <motion.button
                  onClick={() => setShowHelpPanel(false)}
                  className={cn(
                    "p-2 rounded-lg transition-colors",
                    "hover:bg-red-500/20 text-red-400 hover:text-red-300"
                  )}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>

              {/* Content */}
              <div className="space-y-6">
                {/* Getting Started */}
                <section>
                  <h3 className={cn("text-lg font-semibold mb-3 text-indigo-400")}>
                    Getting Started
                  </h3>
                  <ol className={cn("space-y-2 text-sm", theme.colors.textSecondary)}>
                    <li className="flex gap-2">
                      <span className="font-bold text-indigo-400">1.</span>
                      <span>Click <strong className={theme.colors.text}>Connect Hardware</strong> to connect your physical keyboard, or <strong className={theme.colors.text}>Demo Mode</strong> to try the interface without hardware.</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-bold text-indigo-400">2.</span>
                      <span>Once connected, you'll see your split keyboard layout with left and right halves.</span>
                    </li>
                  </ol>
                </section>

                {/* Customizing Keys */}
                <section>
                  <h3 className={cn("text-lg font-semibold mb-3 text-cyan-400")}>
                    Customizing Keys
                  </h3>
                  <ol className={cn("space-y-2 text-sm", theme.colors.textSecondary)}>
                    <li className="flex gap-2">
                      <span className="font-bold text-cyan-400">1.</span>
                      <span>Click any key on the keyboard to select it.</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-bold text-cyan-400">2.</span>
                      <span>Click the <Package className="w-4 h-4 inline" /> icon to open the keycodes panel.</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-bold text-cyan-400">3.</span>
                      <span>Browse categories or search for a keycode, then click to assign it to your selected key.</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-bold text-cyan-400">4.</span>
                      <span>Keys with custom assignments show a cyan dot indicator.</span>
                    </li>
                  </ol>
                </section>

                {/* Layers */}
                <section>
                  <h3 className={cn("text-lg font-semibold mb-3 text-purple-400")}>
                    Working with Layers
                  </h3>
                  <ul className={cn("space-y-2 text-sm", theme.colors.textSecondary)}>
                    <li className="flex gap-2">
                      <span className="text-purple-400">•</span>
                      <span>Use the <strong className={theme.colors.text}>Layer dropdown</strong> to switch between 5 different keyboard layouts (0-4).</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-purple-400">•</span>
                      <span>Each layer can have completely different key assignments.</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-purple-400">•</span>
                      <span>The dropdown shows how many keys are assigned in each layer.</span>
                    </li>
                  </ul>
                </section>

                {/* Saving */}
                <section>
                  <h3 className={cn("text-lg font-semibold mb-3 text-green-400")}>
                    Saving Changes
                  </h3>
                  <ul className={cn("space-y-2 text-sm", theme.colors.textSecondary)}>
                    <li className="flex gap-2">
                      <span className="text-green-400">•</span>
                      <span>When you make changes, a <strong className={theme.colors.text}>Save Changes</strong> button appears in the header.</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-green-400">•</span>
                      <span>Click it to save your keymap configuration locally in your browser.</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-green-400">•</span>
                      <span>Use <strong className={theme.colors.text}>Reset Layer</strong> to restore a layer to its default configuration.</span>
                    </li>
                  </ul>
                </section>

                {/* Tips */}
                <section className={cn(
                  "p-4 rounded-lg border",
                  "bg-indigo-500/10 border-indigo-500/30"
                )}>
                  <h3 className={cn("text-lg font-semibold mb-2 text-indigo-400")}>
                    💡 Pro Tips
                  </h3>
                  <ul className={cn("space-y-1 text-sm", theme.colors.textSecondary)}>
                    <li>• Remember to click <strong className={theme.colors.text}>Save Changes</strong> to persist your keymap configuration</li>
                    <li>• Click the X button to close the keycodes panel</li>
                    <li>• The connection status indicators above each half show if it's connected</li>
                    <li>• Toggle between dark and light themes using the <Sun className="w-3 h-3 inline" />/<Moon className="w-3 h-3 inline" /> button</li>
                    <li>• Your saved configuration is stored locally in your browser</li>
                  </ul>
                </section>
              </div>
            </motion.div>
          </>
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
