import React, { useState, useEffect } from 'react';
import { performSystemHack, performLiveDeepScan } from './services/geminiService';
import { TargetProfile, SystemState } from './types';
import MatrixRain from './components/MatrixRain';
import HackLoader from './components/HackLoader';
import AdminLogin from './components/AdminLogin';
import { Terminal, Skull, Smartphone, Mail, AlertTriangle, User, Shield, Lock, Wifi, Binary, LogOut, Users, Image as ImageIcon, ExternalLink, RefreshCw, Radio, CheckCircle, PlayCircle, Heart, MessageCircle } from 'lucide-react';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  const [username, setUsername] = useState('');
  const [systemState, setSystemState] = useState<SystemState>(SystemState.IDLE);
  const [profile, setProfile] = useState<TargetProfile | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // State for decrypting private fields
  const [showPhone, setShowPhone] = useState(false);
  const [showEmail, setShowEmail] = useState(false);
  const [decryptingPhone, setDecryptingPhone] = useState(false);
  const [decryptingEmail, setDecryptingEmail] = useState(false);

  // Live Verification State
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    if (isAuthenticated && !process.env.API_KEY) {
        console.warn("Running in Offline Simulation Mode (No API Key found)");
    }
  }, [isAuthenticated]);

  // --- DARK VOICE WELCOME EFFECT ---
  useEffect(() => {
    if (isAuthenticated) {
      // Small delay to allow screen transition
      setTimeout(() => {
        const text = "Welcome to my hacker, Rock Rahman Bhai.";
        const utterance = new SpeechSynthesisUtterance(text);
        
        // DARK VOICE CONFIGURATION
        utterance.pitch = 0.6; // Low pitch (Deep voice)
        utterance.rate = 0.85; // Slightly slow (Professional/Cinematic)
        utterance.volume = 1.0;

        // Try to select a deeper system voice if available
        const voices = window.speechSynthesis.getVoices();
        const preferredVoice = voices.find(v => v.name.includes("Male") || v.name.includes("David") || v.name.includes("Google US English"));
        if (preferredVoice) {
          utterance.voice = preferredVoice;
        }

        window.speechSynthesis.speak(utterance);
      }, 500);
    }
  }, [isAuthenticated]);

  const handleHack = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // 1. Basic Validation
    if (!username.trim()) return;
    
    // 2. Strict Username Validation
    const validUsernameRegex = /^[a-zA-Z0-9._]+$/;
    if (username.length < 3) {
        setError("ERROR: USERNAME TOO SHORT (MIN 3 CHARS)");
        return;
    }
    if (!validUsernameRegex.test(username)) {
        setError("ERROR: INVALID CHARACTERS IN USERNAME");
        return;
    }

    setSystemState(SystemState.SCANNING);
    setShowPhone(false);
    setShowEmail(false);
    setIsVerifying(false);
    setProfile(null); // Clear previous profile
    
    try {
      const data = await performSystemHack(username);
      setProfile(data);
    } catch (err: any) {
      console.error(err);
      setError("CRITICAL FAILURE: CONNECTION LOST.");
      setSystemState(SystemState.ERROR);
    }
  };

  const onLoaderComplete = () => {
    setSystemState(SystemState.ACCESS_GRANTED);
  };

  const resetSystem = () => {
    setSystemState(SystemState.IDLE);
    setUsername('');
    setProfile(null);
    setError(null);
    setShowPhone(false);
    setShowEmail(false);
    setIsVerifying(false);
  };

  const handleLogout = () => {
      setIsAuthenticated(false);
      resetSystem();
  };

  const handleDecrypt = (type: 'phone' | 'email') => {
    if (type === 'phone') {
        setDecryptingPhone(true);
        setTimeout(() => {
            setDecryptingPhone(false);
            setShowPhone(true);
        }, 1500);
    } else {
        setDecryptingEmail(true);
        setTimeout(() => {
            setDecryptingEmail(false);
            setShowEmail(true);
        }, 1500);
    }
  };

  const handleLiveVerify = async () => {
    if (!profile) return;
    setIsVerifying(true);
    // Simulate connection delay then fetch real data
    try {
        const updatedProfile = await performLiveDeepScan(profile.username, profile);
        setProfile(updatedProfile);
    } catch (e) {
        console.error("Live verify failed", e);
    }
    setIsVerifying(false);
  };

  // --- RENDER LOGIC ---

  if (!isAuthenticated) {
    return (
      <div className="relative min-h-screen bg-black overflow-hidden font-mono">
        <MatrixRain color="#FF0000" /> {/* Red Rain for Login */}
        <div className="scan-line"></div>
        <div className="crt-overlay"></div>
        <div className="relative z-10 flex items-center justify-center min-h-screen">
            <AdminLogin onLogin={() => setIsAuthenticated(true)} />
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-black text-green-500 font-mono overflow-x-hidden">
      <MatrixRain color="#0F0" />
      <div className="scan-line"></div>
      <div className="crt-overlay"></div>

      {/* HEADER */}
      <div className="fixed top-0 w-full bg-black/80 border-b border-green-900 z-30 flex justify-between items-center px-4 py-2 backdrop-blur-sm">
        <div className="flex items-center gap-2">
            <Terminal size={18} />
            <span className="text-sm font-bold tracking-widest">ROCK_HACKER_TERMINAL_V6.0</span>
        </div>
        <button onClick={handleLogout} className="flex items-center gap-1 text-xs bg-red-900/20 text-red-500 px-3 py-1 border border-red-900 hover:bg-red-900/40 transition-colors">
            <LogOut size={12} /> ABORT SESSION
        </button>
      </div>

      <div className="relative z-10 pt-16 pb-10 px-4 max-w-4xl mx-auto min-h-screen flex flex-col justify-center">
        
        {/* VIEW: SCANNING LOADER */}
        {systemState === SystemState.SCANNING && (
             <HackLoader onComplete={onLoaderComplete} />
        )}

        {/* VIEW: SEARCH INPUT (IDLE or ERROR) */}
        {(systemState === SystemState.IDLE || systemState === SystemState.ERROR) && (
          <div className="w-full max-w-lg mx-auto space-y-8">
            <div className="text-center space-y-2">
               <Skull size={64} className="mx-auto text-green-600 animate-pulse" />
               <h1 className="text-4xl md:text-5xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-green-800" style={{ textShadow: '0 0 10px rgba(0,255,0,0.5)' }}>
                 TARGET ACQUISITION
               </h1>
               <p className="text-sm md:text-base opacity-70 max-w-md mx-auto">
                 ENTER USERNAME TO EXTRACT DATA. AI WILL VALIDATE IDENTITY AND CONNECT TO INSTAGRAM SERVERS.
               </p>
            </div>

            <form onSubmit={handleHack} className="space-y-4">
               {error && (
                 <div className="border border-red-500 bg-red-900/20 p-4 flex items-start gap-3 text-red-400 text-sm animate-pulse">
                    <AlertTriangle className="shrink-0 mt-0.5" size={16} />
                    <div className="flex flex-col">
                        <span className="font-bold">SYSTEM ERROR</span>
                        <span>{error}</span>
                        {error.includes("API KEY") && <span className="text-xs mt-1 text-red-300">Set API_KEY in Netlify Settings.</span>}
                    </div>
                 </div>
               )}

               <div className="relative group">
                 <div className="absolute -inset-1 bg-gradient-to-r from-green-600 to-green-900 rounded opacity-20 group-hover:opacity-40 transition duration-500 blur"></div>
                 <div className="relative flex items-center bg-black border border-green-800 p-2">
                    <span className="pl-3 pr-2 text-green-700">{">"}</span>
                    <input 
                      type="text" 
                      value={username}
                      onChange={(e) => setUsername(e.target.value.replace(/\s/g, ''))}
                      placeholder="ENTER_USERNAME"
                      className="flex-1 bg-transparent text-green-400 placeholder-green-900 focus:outline-none font-mono text-lg tracking-wider uppercase"
                      autoComplete="off"
                    />
                    <button 
                      type="submit"
                      className="bg-green-900/30 hover:bg-green-800/50 text-green-400 px-6 py-2 text-sm font-bold tracking-widest border-l border-green-800 transition-all hover:text-green-300"
                    >
                      INITIATE
                    </button>
                 </div>
               </div>

               <div className="flex justify-center gap-8 text-[10px] text-green-800 uppercase tracking-[0.2em]">
                  <span className="flex items-center gap-1"><Wifi size={10} /> LINK_ACTIVE</span>
                  <span className="flex items-center gap-1"><Binary size={10} /> ENCRYPTION_OFF</span>
               </div>
            </form>
          </div>
        )}

        {/* VIEW: RESULT DASHBOARD */}
        {systemState === SystemState.ACCESS_GRANTED && (
            <>
            {/* BLACK SCREEN FIX: If Access Granted but no Data yet, show Decrypting Loader */}
            {!profile ? (
                <div className="flex flex-col items-center justify-center space-y-4 animate-pulse">
                    <RefreshCw size={48} className="animate-spin text-green-600" />
                    <h2 className="text-xl tracking-widest text-green-500">DECRYPTING FINAL PACKETS...</h2>
                    <p className="text-xs text-green-800">BYPASSING FIREWALL LAYERS</p>
                </div>
            ) : (
             <div className="w-full space-y-6 animate-[fadeIn_0.5s_ease-out]">
                {/* Header Profile Info */}
                <div className="border border-green-500/30 bg-black/80 p-6 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-2 opacity-50">
                        <User size={100} className="text-green-900/40" />
                    </div>
                    
                    <div className="relative z-10 space-y-4">
                        <div className="flex items-start justify-between">
                            <div>
                                <h2 className="text-3xl font-bold text-white tracking-wider flex items-center gap-2">
                                    {profile.username}
                                    {profile.isVerifiedLive && <CheckCircle size={20} className="text-blue-500" fill="currentColor" color="white" />}
                                </h2>
                                <p className="text-green-600 text-sm tracking-widest mt-1 uppercase flex items-center gap-2">
                                    <Shield size={12} /> RISK LEVEL: <span className={`${profile.riskLevel === 'CRITICAL' || profile.riskLevel === 'EXTREME' ? 'text-red-500 animate-pulse' : 'text-yellow-500'}`}>{profile.riskLevel}</span>
                                </p>
                            </div>
                            <div className="text-right hidden md:block">
                                <p className="text-xs text-green-800">IP_ADDR</p>
                                <p className="text-green-400 font-mono">{profile.ipAddress}</p>
                            </div>
                        </div>

                        {/* Social Graph Stats */}
                        <div className="grid grid-cols-3 gap-4 border-y border-green-900/50 py-4 my-2">
                            <div className="text-center">
                                <p className="text-[10px] text-green-700 uppercase tracking-widest">Followers</p>
                                <p className="text-xl text-white font-bold">{profile.followers}</p>
                            </div>
                            <div className="text-center border-l border-green-900/50">
                                <p className="text-[10px] text-green-700 uppercase tracking-widest">Following</p>
                                <p className="text-xl text-white font-bold">{profile.following}</p>
                            </div>
                            <div className="text-center border-l border-green-900/50">
                                <p className="text-[10px] text-green-700 uppercase tracking-widest">Posts</p>
                                <p className="text-xl text-white font-bold">{profile.posts}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                            <div className="space-y-1">
                                <span className="text-green-800 text-xs uppercase block">Real Name (Simulated)</span>
                                <span className="text-green-300">{profile.realName}</span>
                            </div>
                            <div className="space-y-1">
                                <span className="text-green-800 text-xs uppercase block">Location</span>
                                <span className="text-green-300">{profile.location}</span>
                            </div>
                             <div className="space-y-1 md:col-span-2">
                                <span className="text-green-800 text-xs uppercase block">Bio</span>
                                <span className="text-white italic opacity-80 border-l-2 border-green-700 pl-3 block">{profile.bio}</span>
                            </div>
                        </div>

                        {/* LIVE VERIFY BUTTON */}
                        <div className="mt-4 pt-4 border-t border-green-900/30 flex justify-end">
                             <button 
                                onClick={handleLiveVerify}
                                disabled={isVerifying || profile.isVerifiedLive}
                                className={`flex items-center gap-2 text-xs px-4 py-2 uppercase font-bold tracking-wider transition-all
                                    ${profile.isVerifiedLive 
                                        ? 'bg-blue-900/20 text-blue-400 border border-blue-800 cursor-default' 
                                        : 'bg-green-900/20 text-green-400 border border-green-600 hover:bg-green-800/40 hover:text-white'
                                    }`}
                             >
                                 {isVerifying ? (
                                     <><RefreshCw className="animate-spin" size={14}/> CONNECTING...</>
                                 ) : profile.isVerifiedLive ? (
                                     <><CheckCircle size={14}/> VERIFIED LIVE</>
                                 ) : (
                                     <><Radio size={14}/> VERIFY LIVE</>
                                 )}
                             </button>
                        </div>
                    </div>
                </div>

                {/* SENSITIVE DATA SECTION */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* PHONE */}
                    <div className="border border-green-900 bg-black/50 p-4 relative overflow-hidden">
                        <div className="flex items-center gap-3 mb-2">
                            <Smartphone size={20} className="text-green-600" />
                            <h3 className="text-green-500 font-bold uppercase tracking-wider">Mobile Number</h3>
                        </div>
                        <div className="bg-black border border-green-900/50 p-3 font-mono text-center relative h-12 flex items-center justify-center">
                            {showPhone ? (
                                <span className="text-white text-lg tracking-widest drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]">
                                    {profile.phone}
                                </span>
                            ) : decryptingPhone ? (
                                <span className="text-green-500 animate-pulse text-xs">CRACKING AES-256...</span>
                            ) : (
                                <span className="text-green-900 tracking-widest text-lg">***********</span>
                            )}
                            
                            {!showPhone && !decryptingPhone && (
                                <button 
                                    onClick={() => handleDecrypt('phone')}
                                    className="absolute inset-0 bg-green-900/10 hover:bg-green-900/30 flex items-center justify-center gap-2 text-green-400 font-bold text-xs uppercase tracking-widest transition-all backdrop-blur-[2px]"
                                >
                                    <Lock size={12} /> Decrypt
                                </button>
                            )}
                        </div>
                    </div>

                    {/* EMAIL */}
                    <div className="border border-green-900 bg-black/50 p-4 relative overflow-hidden">
                        <div className="flex items-center gap-3 mb-2">
                            <Mail size={20} className="text-green-600" />
                            <h3 className="text-green-500 font-bold uppercase tracking-wider">Email Address</h3>
                        </div>
                         <div className="bg-black border border-green-900/50 p-3 font-mono text-center relative h-12 flex items-center justify-center">
                            {showEmail ? (
                                <span className="text-white text-sm tracking-wider drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]">
                                    {profile.email}
                                </span>
                            ) : decryptingEmail ? (
                                <span className="text-green-500 animate-pulse text-xs">BRUTE FORCING...</span>
                            ) : (
                                <span className="text-green-900 tracking-widest text-lg">*****************</span>
                            )}

                            {!showEmail && !decryptingEmail && (
                                <button 
                                    onClick={() => handleDecrypt('email')}
                                    className="absolute inset-0 bg-green-900/10 hover:bg-green-900/30 flex items-center justify-center gap-2 text-green-400 font-bold text-xs uppercase tracking-widest transition-all backdrop-blur-[2px]"
                                >
                                    <Lock size={12} /> Decrypt
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* LIVE FEED PREVIEWS (Only show if Verified) */}
                {profile.postPreviews && profile.postPreviews.length > 0 && (
                     <div className="border border-green-900/30 bg-black/40 p-4">
                        <div className="flex items-center gap-2 mb-4 text-green-500 border-b border-green-900/50 pb-2">
                            <ImageIcon size={16} />
                            <h3 className="text-xs font-bold uppercase tracking-widest">LATEST INTERCEPTED MEDIA</h3>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                            {profile.postPreviews.map((post) => (
                                <div key={post.id} className="aspect-square bg-green-900/10 border border-green-900/30 relative group overflow-hidden">
                                     {/* Simulated Image Content */}
                                     <div className="absolute inset-0 flex items-center justify-center text-green-900/30">
                                         {post.type === 'REEL' ? <PlayCircle size={24}/> : <ImageIcon size={24}/>}
                                     </div>
                                     <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80"></div>
                                     <div className="absolute bottom-1 left-2 text-[8px] text-green-400 space-y-0.5">
                                         <div className="flex items-center gap-1"><Heart size={8} fill="currentColor"/> {post.likes}</div>
                                         <div className="flex items-center gap-1"><MessageCircle size={8}/> {post.comments}</div>
                                     </div>
                                </div>
                            ))}
                        </div>
                     </div>
                )}
                
                {/* SYSTEM LOGS */}
                <div className="border border-green-900/30 bg-black p-4 font-mono text-[10px] text-green-700 h-32 overflow-y-auto custom-scrollbar">
                    {profile.weaknesses.map((w, i) => (
                        <div key={i} className="mb-1">{`> VULNERABILITY DETECTED: ${w}`}</div>
                    ))}
                    {profile.recentActivity.map((a, i) => (
                        <div key={i+10} className="mb-1">{`> LOG: ${a}`}</div>
                    ))}
                    <div className="animate-pulse">{`> AWAITING COMMAND..._`}</div>
                </div>

                <div className="flex justify-center pt-8">
                    <button 
                        onClick={resetSystem}
                        className="text-green-500 hover:text-white border border-green-700 hover:border-white px-8 py-2 uppercase tracking-widest text-xs transition-all"
                    >
                        NEW TARGET
                    </button>
                </div>
             </div>
            )}
            </>
        )}
      </div>
    </div>
  );
}