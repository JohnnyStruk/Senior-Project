import { useState } from "react";
import { motion } from "framer-motion";
import { Moon, Sun, Keyboard, Wifi, WifiOff, Play, X, Package } from "lucide-react";
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
  const { connectionState, connectHardware, connectDemo, disconnect, sendCommand } = useKeyboard();
  const { currentLayer, assignKeycode, getKeycode } = useKeymap();
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [showKeycodePanel, setShowKeycodePanel] = useState(false);

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
      console.log(`Assigned ${keycode.code} to key ${selectedKey}`);

      // Send command to hardware if connected
      if (connectionState.connected && !connectionState.demoMode) {
        // VIA protocol: assign keycode
        const payload = new Uint8Array([0x01, currentLayer, 0x00, 0x04]);
        sendCommand(0, payload, selectedKey);
      }
    }
  };

  const handleSendCommand = async () => {
    if (selectedKey) {
      // Example VIA command: change key in layer 0, row 0, col 0
      const payload = new Uint8Array([0x01, 0x00, 0x00, 0x04]);
      const success = await sendCommand(0, payload, selectedKey);
      if (success) {
        console.log("Command sent successfully for key:", selectedKey);
      } else {
        console.error("Failed to send command for key:", selectedKey);
      }
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated background gradients */}
      <div className="absolute inset-0">
        <motion.div 
          className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div 
          className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl"
          animate={{ 
            scale: [1.2, 1, 1.2],
            opacity: [0.5, 0.3, 0.5]
          }}
          transition={{ duration: 10, repeat: Infinity }}
        />
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
                      "transition-all duration-200 border-2",
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
                    "fixed top-20 left-4 z-20 p-3 rounded-xl transition-all",
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

      {/* Action panel */}
      {connectionState.connected && selectedKey && (
        <motion.div
          className={cn(
            "fixed bottom-6 right-6 p-4 rounded-xl backdrop-blur-md border",
            theme.colors.surface,
            theme.colors.border,
            "shadow-2xl"
          )}
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <p className={cn("text-sm font-medium mb-2", theme.colors.text)}>
            Key Actions
          </p>
          <div className="space-y-2">
            <motion.button
              onClick={handleSendCommand}
              className={cn(
                "w-full px-3 py-2 rounded-lg text-sm font-medium transition-all",
                theme.colors.primary,
                theme.colors.primaryHover,
                "text-white"
              )}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {connectionState.demoMode ? "Demo Command" : "Send Test Command"}
            </motion.button>
            
            <motion.button
              onClick={handleDisconnect}
              className={cn(
                "w-full px-3 py-2 rounded-lg text-sm font-medium transition-all",
                "bg-red-600/20 hover:bg-red-500/30 border border-red-500/40",
                "text-red-200 hover:text-red-100"
              )}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {connectionState.demoMode ? "Exit Demo Mode" : "Disconnect"}
            </motion.button>
          </div>
        </motion.div>
      )}
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
