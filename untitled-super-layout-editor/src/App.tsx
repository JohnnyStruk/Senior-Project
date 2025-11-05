import { useKeyboard } from "./hooks/useKeyboard";

export default function App() {
  const { connected, connect, send } = useKeyboard();

  const handleSetKey = async () => {
    // Example VIA command: change key in layer 0, row 0, col 0
    const payload = new Uint8Array([0x01, 0x00, 0x00, 0x04]); // (example)
    await send(0, payload);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Untitled Super Keyboard Configurator</h1>

      {!connected ? (
        <button onClick={connect} className="bg-blue-600 text-white px-4 py-2 rounded">
          Connect Keyboard
        </button>
      ) : (
        <>
          <p className="text-green-600">Connected ✅</p>
          <button onClick={handleSetKey} className="bg-gray-800 text-white px-4 py-2 mt-3 rounded">
            Send Example Command
          </button>
        </>
      )}
    </div>
  );
}
