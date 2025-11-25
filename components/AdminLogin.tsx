import React, { useState, useEffect } from 'react';
import { ShieldAlert, Skull, Lock, Fingerprint, Radio } from 'lucide-react';

interface AdminLoginProps {
  onLogin: () => void;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [shake, setShake] = useState(false);
  const [glitch, setGlitch] = useState(false);
  const [bgScanLine, setBgScanLine] = useState(0);

  // Biometric State
  const [scanning, setScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [bioStatus, setBioStatus] = useState<string>('HOLD TO SCAN');

  // Random glitch effect
  useEffect(() => {
    const interval = setInterval(() => {
      setGlitch(true);
      setTimeout(() => setGlitch(false), 150);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Background Scan line animation
  useEffect(() => {
    const interval = setInterval(() => {
      setBgScanLine(prev => (prev + 1) % 100);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  // REAL Biometric Authentication Logic
  const triggerRealBiometric = async () => {
    if (!window.PublicKeyCredential) {
        setError("BIOMETRIC HARDWARE NOT DETECTED");
        setScanProgress(0);
        return;
    }

    try {
        setBioStatus("VERIFYING IDENTITY...");
        
        // We create a dummy credential request to force the device to ask for "User Verification" (Fingerprint/Face)
        // This leverages the device's native security (FaceID/TouchID)
        const challenge = new Uint8Array(32);
        window.crypto.getRandomValues(challenge);

        await navigator.credentials.create({
            publicKey: {
                challenge,
                rp: {
                    name: "ROCK HACKER SYSTEM",
                },
                user: {
                    id: new Uint8Array(16),
                    name: "admin",
                    displayName: "ROCK ADMIN"
                },
                pubKeyCredParams: [{ alg: -7, type: "public-key" }],
                timeout: 60000,
                authenticatorSelection: {
                    authenticatorAttachment: "platform", // Forces built-in sensor
                    userVerification: "required" // Forces the scan (Real Finger)
                }
            }
        });

        // If code reaches here, the Real Finger was accepted by the OS
        if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate([50, 50, 50, 50, 200]);
        setBioStatus("IDENTITY CONFIRMED");
        setTimeout(onLogin, 500);

    } catch (err) {
        // If user cancels or WRONG FINGER is used multiple times
        console.error(err);
        setShake(true);
        setError("ACCESS DENIED: DNA MISMATCH / WRONG FINGER");
        setBioStatus("ACCESS DENIED");
        setScanProgress(0);
        if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(500);
        setTimeout(() => setShake(false), 500);
    }
  };

  // Biometric Simulation Logic (Visual Only)
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (scanning && scanProgress < 100) {
        // Simple haptic pulse if supported
        if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(10);
        setBioStatus(`ANALYZING DNA... ${Math.floor(scanProgress)}%`);

        interval = setInterval(() => {
            setScanProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    // VISUAL SCAN COMPLETE -> TRIGGER REAL SENSOR
                    triggerRealBiometric(); 
                    return 100;
                }
                return prev + 2; // Fill speed
            });
        }, 20);
    } else if (!scanning && scanProgress < 100) {
        setScanProgress(0);
        setBioStatus('HOLD TO SCAN');
    }
    return () => clearInterval(interval);
  }, [scanning, scanProgress]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (username === 'ROCKRAHMAN84070' && password === 'ROCK@2009') {
      onLogin();
    } else {
      setShake(true);
      setError('CRITICAL ALERT: UNAUTHORIZED ACCESS ATTEMPT DETECTED.');
      if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(200);
      setTimeout(() => {
         setShake(false);
         setPassword('');
      }, 500);
    }
  };

  return (
    <div className="z-50 flex flex-col items-center justify-center w-full max-w-lg p-6 relative">
        
        {/* Intimidating Header */}
        <div className={`text-center space-y-6 mb-10 ${shake ? 'translate-x-[-10px]' : ''} transition-transform duration-75`}>
            <div className="relative inline-block group">
                <div className="absolute inset-0 bg-red-600 blur-[60px] opacity-20 animate-pulse"></div>
                <Skull size={110} className={`text-red-600 relative z-10 drop-shadow-[0_0_15px_rgba(255,0,0,0.6)] ${glitch ? 'opacity-50 translate-x-1' : 'opacity-100'}`} />
            </div>
            <div>
                <h1 className="text-5xl md:text-7xl font-black text-white tracking-[0.1em] uppercase glitch-text" style={{ textShadow: '4px 4px 0px #991b1b' }}>
                    SYSTEM <span className="text-red-600">LOCK</span>
                </h1>
                <div className="h-1 w-24 bg-red-600 mx-auto mt-2 shadow-[0_0_15px_#f00]"></div>
            </div>
            <p className="text-red-400 font-bold tracking-[0.3em] text-xs md:text-sm animate-pulse">
                LEVEL 5 CLEARANCE REQUIRED
            </p>
        </div>

        {/* Login Form Container */}
        <div className={`w-full bg-black/80 border border-red-900/50 backdrop-blur-md shadow-[0_0_40px_rgba(220,38,38,0.15)] p-8 md:p-10 relative overflow-hidden rounded-xl`}>
            
            {/* Corner Markers - Clean & Sharp */}
            <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-red-600 rounded-tl"></div>
            <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-red-600 rounded-tr"></div>
            <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-red-600 rounded-bl"></div>
            <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-red-600 rounded-br"></div>

            <form onSubmit={handleLogin} className="space-y-6 relative z-10">
                {error && (
                    <div className="bg-red-950/40 border-l-4 border-red-600 p-3 flex items-center gap-3 text-red-400 text-xs font-bold animate-pulse shadow-inner">
                        <ShieldAlert size={20} className="shrink-0" />
                        {error}
                    </div>
                )}

                <div className="space-y-2">
                    <label className="text-red-500/80 text-[10px] uppercase tracking-[0.2em] font-bold flex items-center gap-2">
                        <Fingerprint size={12} /> Admin Codename
                    </label>
                    <input 
                        type="text" 
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full bg-black/50 border border-red-900/60 text-white px-4 py-3.5 font-mono focus:outline-none focus:border-red-500 focus:bg-red-950/20 transition-all text-center tracking-widest placeholder-red-900/30 uppercase rounded text-sm shadow-inner"
                        placeholder="ENTER ID"
                        autoComplete="off"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-red-500/80 text-[10px] uppercase tracking-[0.2em] font-bold flex items-center gap-2">
                        <Lock size={12} /> Security Passkey
                    </label>
                    <input 
                        type="password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-black/50 border border-red-900/60 text-white px-4 py-3.5 font-mono focus:outline-none focus:border-red-500 focus:bg-red-950/20 transition-all text-center tracking-widest placeholder-red-900/30 rounded text-sm shadow-inner"
                        placeholder="••••••••"
                    />
                </div>

                <button 
                    type="submit" 
                    className="w-full bg-red-700 hover:bg-red-600 text-white font-black py-4 uppercase tracking-[0.2em] transition-all hover:shadow-[0_0_25px_rgba(220,38,38,0.4)] hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3 group rounded shadow-lg text-sm"
                >
                    <Lock size={16} className="group-hover:unlock text-red-200" /> Authenticate
                </button>
            </form>

            {/* DIVIDER */}
            <div className="flex items-center gap-4 my-8 opacity-40 relative z-10">
                <div className="h-px bg-gradient-to-r from-transparent via-red-700 to-transparent flex-1"></div>
                <div className="text-red-500 text-[9px] font-bold tracking-[0.2em]">BIOMETRIC OVERRIDE</div>
                <div className="h-px bg-gradient-to-r from-transparent via-red-700 to-transparent flex-1"></div>
            </div>

            {/* BIOMETRIC SCANNER - HD Style */}
            <div className="relative z-10 flex flex-col items-center">
                <div 
                    className="group relative cursor-pointer select-none"
                    onMouseDown={() => { if(scanProgress < 100) setScanning(true); }}
                    onMouseUp={() => setScanning(false)}
                    onMouseLeave={() => setScanning(false)}
                    onTouchStart={() => { if(scanProgress < 100) setScanning(true); }}
                    onTouchEnd={() => setScanning(false)}
                >
                    {/* Scanner Box */}
                    <div className={`w-28 h-28 border border-red-900/50 ${scanning ? 'bg-red-950/30 shadow-[0_0_30px_rgba(220,38,38,0.3)]' : 'bg-black shadow-[inset_0_0_20px_rgba(0,0,0,1)]'} rounded-2xl flex items-center justify-center relative overflow-hidden transition-all duration-300`}>
                        
                        {/* Fingerprint Icon */}
                        <Fingerprint 
                            size={56} 
                            strokeWidth={1}
                            className={`text-red-800 transition-all duration-300 ${scanning ? 'scale-110 text-red-500 drop-shadow-[0_0_10px_rgba(255,0,0,0.8)]' : 'group-hover:text-red-700'}`} 
                        />
                        
                        {/* Scan Beam */}
                        <div className={`absolute top-0 left-0 w-full h-[2px] bg-red-400 shadow-[0_0_20px_#f00] z-20 ${scanning ? 'animate-[scan_1s_ease-in-out_infinite]' : 'hidden'}`}></div>

                        {/* Progress Fill */}
                        <div 
                            className="absolute bottom-0 left-0 w-full bg-red-600 z-10 opacity-20 transition-all duration-75 ease-linear"
                            style={{ height: `${scanProgress}%` }}
                        ></div>
                    </div>
                    
                    {/* Scan Text */}
                    <div className="text-center mt-4 h-4 w-full">
                        <p className={`text-[10px] font-bold tracking-[0.3em] whitespace-nowrap ${scanning || scanProgress === 100 ? 'text-red-400 animate-pulse' : 'text-red-800 group-hover:text-red-600'} transition-colors`}>
                            {bioStatus}
                        </p>
                    </div>
                </div>
            </div>

            {/* Simulated Bio-Scan Overlay Background */}
            <div className="absolute inset-0 pointer-events-none opacity-10" style={{
                background: `linear-gradient(transparent ${bgScanLine}%, rgba(255, 0, 0, 0.5) ${bgScanLine}%, transparent ${bgScanLine + 5}%)`
            }}></div>
        </div>

        {/* Footer Info */}
        <div className="mt-10 text-center space-y-2 opacity-50">
            <div className="flex items-center justify-center gap-2 text-[9px] text-red-500 uppercase tracking-[0.2em]">
                <Radio size={10} className="animate-ping" />
                <span>Secure Connection Active</span>
            </div>
        </div>

    </div>
  );
};

export default AdminLogin;