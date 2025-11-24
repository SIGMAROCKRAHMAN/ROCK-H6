import React, { useEffect, useState } from 'react';
import { ShieldAlert, Lock, Unlock, Database, Wifi, Binary } from 'lucide-react';

const logs = [
  "Handshake initiated...",
  "Querying Google Knowledge Graph...",
  "Locating Public Index Nodes...",
  "Verifying Identity via OSINT...",
  "Decryption key found: AES-256...",
  "Accessing cloud database...",
  "Retrieving hidden contact info...",
  "Parsing geolocation meta-tags...",
  "Dumping SQL tables...",
  "ROOT ACCESS GRANTED."
];

const HackLoader: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [logIndex, setLogIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const logInterval = setInterval(() => {
      setLogIndex((prev) => {
        if (prev < logs.length - 1) return prev + 1;
        return prev;
      });
    }, 450); // Faster logs

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setTimeout(onComplete, 200);
          return 100;
        }
        return prev + Math.floor(Math.random() * 8); // Faster progress
      });
    }, 100);

    return () => {
      clearInterval(logInterval);
      clearInterval(progressInterval);
    };
  }, [onComplete]);

  return (
    <div className="flex flex-col items-center justify-center w-full h-full min-h-[400px] space-y-6 font-mono text-green-500 p-4 relative overflow-hidden">
      {/* Background glitch effect */}
      <div className="absolute inset-0 bg-green-500/5 animate-pulse pointer-events-none"></div>

      <div className="relative w-32 h-32 flex items-center justify-center">
        <div className="absolute w-full h-full border-2 border-green-500 rounded-full animate-ping opacity-20"></div>
        <div className="absolute w-full h-full border border-dashed border-green-500 rounded-full animate-[spin_3s_linear_infinite]"></div>
        <div className="absolute w-[80%] h-[80%] border-l-2 border-r-2 border-green-500 rounded-full animate-[spin_2s_reverse_infinite]"></div>
        {progress < 100 ? <Lock size={40} /> : <Unlock size={40} className="animate-bounce" />}
      </div>

      <div className="w-full max-w-lg space-y-1">
        <div className="flex justify-between text-xs uppercase tracking-widest opacity-80">
            <span>Brute Force Attack</span>
            <span>{progress}%</span>
        </div>
        <div className="w-full bg-green-900/30 h-2 relative overflow-hidden">
            <div 
            className="absolute top-0 left-0 h-full bg-green-500 shadow-[0_0_10px_#0f0]"
            style={{ width: `${progress}%` }}
            ></div>
        </div>
      </div>

      <div className="w-full max-w-lg h-40 overflow-hidden font-mono text-xs bg-black/80 p-3 border border-green-500/30 shadow-inner">
        {logs.slice(0, logIndex + 1).map((log, idx) => (
          <div key={idx} className="mb-1 text-green-400/90">
            <span className="text-green-700 mr-2">[{String(1000 + idx).substring(1)}]</span>
             {">"} {log}
          </div>
        ))}
        <div className="animate-pulse">_</div>
      </div>

      <div className="flex justify-center gap-6 text-[10px] uppercase tracking-widest text-green-600">
         <div className="flex items-center gap-1"><Wifi size={10}/> UPLINK_ESTABLISHED</div>
         <div className="flex items-center gap-1"><Binary size={10}/> DATA_PACKETS_RECV</div>
      </div>
    </div>
  );
};

export default HackLoader;