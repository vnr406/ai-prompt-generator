import { useState, useEffect } from "react";

const options = {
  visualTypes: ["film still", "RAW photo", "concept art", "stylized illustration"],
  cameraStyles: ["IMG_4856.CR2", "shot on RED Komodo 6K", "Leica M10 35mm", "Hasselblad H6D-100c 100mm f/2.2"],
  cinematicRefs: ["cinematic lighting by Roger Deakins", "production still from Blade Runner", "directed by Wes Anderson", "from the costume department of Game of Thrones"],
  textureTags: ["liquid crystal mesh", "iridescent mylar overlay", "carbon fiber fabric", "obsidian silk pattern"],
  hallucinations: ["latent diffusion hallucination", "training data artifact", "neural glitch texture", "GPU overflow render"],
  compositionAddons: ["golden ratio composition", "volumetric light bloom", "rule of thirds", "macro lens depth"],
  moods: ["melancholic and dreamlike", "dark and mysterious", "vibrant and energetic", "serene and peaceful"],
  backgrounds: ["foggy Tokyo alley", "ancient temple ruins", "desert at sunset", "neon-lit cyberpunk street"],
  genres: ["sci-fi noir", "retro-futurism", "high fantasy", "post-apocalyptic thriller"]
};

export default function PromptGenerator() {
  const [prompt, setPrompt] = useState("");
  const [customPrompt, setCustomPrompt] = useState("");
  const [isPro, setIsPro] = useState(false);
  const [showUnlockModal, setShowUnlockModal] = useState(false);
  const [enteredCode, setEnteredCode] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  const [selected, setSelected] = useState({
    visualType: "", cameraStyle: "", cinematicRef: "", texture: "", hallucination: "",
    composition: "", mood: "", background: "", genre: ""
  });

  useEffect(() => {
    const storedPro = localStorage.getItem("proUser");
    if (storedPro === "true") setIsPro(true);
  }, []);

  const generatePrompt = () => {
    const selections = Object.values(selected).filter(Boolean).join(", ");
    const finalPrompt = customPrompt ? `${customPrompt}, ${selections}` : selections;
    setPrompt(finalPrompt);
  };

  const handleChange = (key, value) => {
    setSelected(prev => ({ ...prev, [key]: value }));
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(prompt);
    alert("Prompt copied to clipboard!");
  };

  const renderSelect = (label, key, values, locked = false) => {
    if (locked && !isPro) {
      return (
        <div className="mb-4 opacity-50">
          <label className="block mb-1 text-sm font-semibold">{label} 🔒</label>
          <div className="p-2 bg-gray-800 border border-gray-700 rounded text-gray-400 text-sm italic">
            Pro users only – <button className="text-blue-400 underline" onClick={() => setShowUnlockModal(true)}>Unlock Pro</button>
          </div>
        </div>
      );
    }

    return (
      <div className="mb-4">
        <label className="block mb-1 text-sm font-semibold">{label}</label>
        <select className="w-full p-2 bg-gray-800 border border-gray-600 rounded" onChange={(e) => handleChange(key, e.target.value)}>
          <option value="">Select {label}</option>
          {values.map((item) => <option key={item} value={item}>{item}</option>)}
        </select>
      </div>
    );
  };

  const handleUnlock = () => {
    if (enteredCode.trim().toLowerCase() === "unlock-pro-799") {
      localStorage.setItem("proUser", "true");
      setIsPro(true);
      setShowUnlockModal(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 5000);
    } else {
      alert("Invalid unlock code. Please check your purchase confirmation.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-gray-900 rounded-lg shadow-lg mt-10">
      <h1 className="text-3xl font-bold mb-4 text-center">AItrendmaster Prompt Generator</h1>

      <div className="mb-6 p-4 bg-gray-800 rounded text-sm text-gray-300">
        <p><strong>How to use:</strong></p>
        <ol className="list-decimal list-inside mt-2 space-y-1">
          <li>Optionally type a custom idea below</li>
          <li>Select dropdown values</li>
          <li>Click "Generate Prompt" then "Copy Prompt"</li>
        </ol>
        <p className="mt-2 italic text-gray-400">Tip: Combine cinematic and glitch styles for unique visuals.</p>
      </div>

      <input
        type="text"
        className="w-full mb-6 p-2 bg-gray-800 border border-gray-600 rounded text-white"
        placeholder="Enter your own base prompt (optional)"
        value={customPrompt}
        onChange={(e) => setCustomPrompt(e.target.value)}
      />

      {!isPro && (
        <div className="mb-6 p-4 bg-yellow-900 text-yellow-300 rounded text-sm text-center">
          <strong>Want full access?</strong><br />
          Unlock Pro for a one-time $7.99 and get all categories, updates & features for life.<br />
          <button onClick={() => setShowUnlockModal(true)} className="mt-2 underline text-blue-400">Enter Unlock Code</button>
        </div>
      )}

      {showSuccess && (
        <div className="mb-6 p-4 bg-green-800 text-green-200 rounded text-sm text-center">
          ✅ <strong>Pro Unlocked!</strong> You now have full access to all categories and features.
        </div>
      )}

      {renderSelect("Visual Type", "visualType", options.visualTypes)}
      {renderSelect("Camera Style", "cameraStyle", options.cameraStyles)}
      {renderSelect("Cinematic/Artistic Reference", "cinematicRef", options.cinematicRefs)}
      {renderSelect("Texture/Fashion Modifier", "texture", options.textureTags)}
      {renderSelect("AI Hallucination/Glitch Tag", "hallucination", options.hallucinations)}
      {renderSelect("Composition & Lighting Add-on", "composition", options.compositionAddons)}
      {renderSelect("Mood & Emotion", "mood", options.moods, true)}
      {renderSelect("Background Style", "background", options.backgrounds, true)}
      {renderSelect("Genre Tag", "genre", options.genres, true)}

      <button className="w-full mt-6 py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded" onClick={generatePrompt}>Generate Prompt</button>

      {typeof prompt === 'string' && prompt.length > 0 && (
        <div className="mt-6 p-4 bg-gray-800 border border-gray-700 rounded">
          <strong>Prompt:</strong>
          <pre className="mt-2 whitespace-pre-wrap text-white">{prompt}</pre>
          <button onClick={handleCopy} className="mt-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded">📋 Copy Prompt</button>
        </div>
      )}

      {showUnlockModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg shadow-xl text-white w-full max-w-md">
            <h2 className="text-xl font-bold mb-4 text-center">Unlock Pro</h2>
            <p className="mb-4 text-sm text-gray-300 text-center">Enter your Pro access code from Gumroad:</p>
            <input
              className="w-full p-2 mb-4 rounded bg-gray-900 border border-gray-600"
              placeholder="Enter code"
              value={enteredCode}
              onChange={(e) => setEnteredCode(e.target.value)}
            />
            <div className="flex justify-between">
              <button className="bg-green-600 px-4 py-2 rounded" onClick={handleUnlock}>Unlock</button>
              <button className="bg-gray-600 px-4 py-2 rounded" onClick={() => setShowUnlockModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
