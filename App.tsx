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

  // --- DARK HINDI VOICE WELCOME EFFECT ---
  useEffect(() => {
    if (isAuthenticated) {
      const speakWelcome = () => {
        // The exact phrase requested
        const text = "Welcome to my hacker, Rock Rahman Bhai.";
        
        // Cancel any ongoing speech to prevent overlap
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        
        // HINDI & DARK VOICE CONFIGURATION
        utterance.lang = 'hi-IN'; // Hindi accent
        utterance.pitch = 0.5;    // UPDATED: 0.5 (Dark/Professional)
        utterance.rate = 0.8;     // UPDATED: 0.8 (Slow/Dramatic but clear)
        utterance.volume = 1.0;

        const voices = window.speechSynthesis.getVoices();
        
        // Priority: Hindi Voice -> Google Hindi -> Any Voice
        const preferredVoice = voices.find(v => 
            v.lang === 'hi-IN' || v.name.includes('Hindi') || v.name.includes('Google Hindi')
        );

        if (preferredVoice) {
          utterance.voice = preferredVoice;
        }

        window.speechSynthesis.speak(utterance);
      };

      // Ensure voices are loaded (Chrome quirk)
      if (window.speechSynthesis.getVoices().length === 0) {
        window.speechSynthesis.onvoiceschanged = speakWelcome;
      } else {
        // Small delay to allow screen transition visually before audio
        setTimeout(speakWelcome, 800);
      }
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
      <div className="relative min-h-screen bg-black overflow-hidden font-mono bg-[radial-gradient(circle_at_center,_#200000_0%,_#000000_70%)]">
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
    <div className="relative min-h-screen bg-black text-green-500 font-mono overflow-x-hidden selection:bg-green-500/30 selection:text-white bg-[radial-gradient(circle_at_center,_#001100_0%,_#000000_80%)]">
      <MatrixRain color="#0F0" />
      <div className="scan-line"></div>
      <div className="crt-overlay"></div>

      {/* HEADER - HD Glass Effect */}
      <div className="fixed top-0 w-full bg-black/60 border-b border-green-500/30 z-30 flex justify-between items-center px-4 py-3 backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
        <div className="flex items-center gap-3">
            <div className="p-1.5 border border-green-500 rounded bg-green-500/10 shadow-[0_0_10px_rgba(0,255,0,0.3)]">
                <Terminal size={16} />
            </div>
            <div className="flex flex-col">
                <span className="text-sm font-bold tracking-[0.2em] text-white drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]">ROCK_HACKER</span>
                <span className="text-[9px] text-green-600 tracking-widest">SYSTEM_V6.0 // ONLINE</span>
            </div>
        </div>
        <button onClick={handleLogout} className="flex items-center gap-2 text-[10px] bg-red-950/30 text-red-500 px-4 py-1.5 border border-red-900 rounded hover:bg-red-900/50 hover:text-red-300 hover:border-red-500 transition-all shadow-[0_0_10px_rgba(255,0,0,0.1)] backdrop-blur-sm">
            <LogOut size={12} /> ABORT SESSION
        </button>
      </div>

      <div className="relative z-10 pt-24 pb-10 px-4 max-w-4xl mx-auto min-h-screen flex flex-col justify-center">
        
        {/* VIEW: SCANNING LOADER */}
        {systemState === SystemState.SCANNING && (
             <HackLoader onComplete={onLoaderComplete} />
        )}

        {/* VIEW: SEARCH INPUT (IDLE or ERROR) */}
        {(systemState === SystemState.IDLE || systemState === SystemState.ERROR) && (
          <div className="w-full max-w-xl mx-auto space-y-10">
            <div className="text-center space-y-4">
               <div className="relative inline-block">
                    <div className="absolute inset-0 bg-green-500 blur-3xl opacity-10 rounded-full animate-pulse"></div>
                    <Skull size={80} className="mx-auto text-green-500 relative z-10 drop-shadow-[0_0_15px_rgba(0,255,0,0.6)] animate-[pulse_3s_ease-in-out_infinite]" />
               </div>
               
               <div>
                    <h1 className="text-5xl md:text-6xl font-black tracking-tighter text-white uppercase" style={{ textShadow: '0 0 20px rgba(0,255,0,0.4)' }}>
                        Target <span className="text-green-500">Acquisition</span>
                    </h1>
                    <div className="h-0.5 w-32 bg-green-500/50 mx-auto mt-4 shadow-[0_0_10px_#0f0]"></div>
               </div>

               <p className="text-xs md:text-sm text-green-400/70 max-w-md mx-auto tracking-wide leading-relaxed">
                 ENTER USERNAME TO INITIATE DEEP PACKET INSPECTION. <br/>
                 AI NEURAL ENGINE WILL BYPASS FIREWALL & EXTRACT METADATA.
               </p>
            </div>

            <form onSubmit={handleHack} className="space-y-6">
               {error && (
                 <div className="border-l-4 border-red-500 bg-red-950/40 p-4 flex items-start gap-4 text-red-400 text-sm animate-[shake_0.5s_ease-in-out] backdrop-blur-sm shadow-lg">
                    <AlertTriangle className="shrink-0 mt-0.5" size={18} />
                    <div className="flex flex-col gap-1">
                        <span className="font-bold tracking-wider text-red-300">SYSTEM FAILURE</span>
                        <span>{error}</span>
                        {error.includes("API KEY") && <span className="text-xs mt-1 text-red-400/80 bg-black/50 p-1 px-2 rounded w-fit">Set API_KEY in Netlify Settings.</span>}
                    </div>
                 </div>
               )}

               <div className="relative group">
                 {/* Input Glow Effect */}
                 <div className="absolute -inset-0.5 bg-gradient-to-r from-green-500 to-green-900 rounded-lg opacity-30 group-hover:opacity-60 transition duration-500 blur"></div>
                 
                 <div className="relative flex items-center bg-black/90 border border-green-500/30 rounded-lg p-1 backdrop-blur-md shadow-2xl">
                    <div className="pl-4 pr-3 text-green-500 animate-pulse">{">"}</div>
                    <input 
                      type="text" 
                      value={username}
                      onChange={(e) => setUsername(e.target.value.replace(/\s/g, ''))}
                      placeholder="ENTER_USERNAME"
                      className="flex-1 bg-transparent text-white placeholder-green-800 focus:outline-none font-mono text-xl tracking-widest uppercase py-3"
                      autoComplete="off"
                    />
                    <button 
                      type="submit"
                      className="bg-green-600/20 hover:bg-green-500/40 text-green-400 hover:text-white px-8 py-3 rounded-md text-sm font-bold tracking-[0.2em] border border-green-500/30 transition-all hover:shadow-[0_0_15px_rgba(0,255,0,0.3)] hover:scale-105 active:scale-95"
                    >
                      HACK
                    </button>
                 </div>
               </div>

               <div className="flex justify-center gap-8 text-[10px] text-green-600/60 uppercase tracking-[0.2em] font-bold">
                  <span className="flex items-center gap-1.5"><Wifi size={12} className="text-green-500" /> Secure Link</span>
                  <span className="flex items-center gap-1.5"><Binary size={12} className="text-green-500" /> AES-256 Ready</span>
               </div>
            </form>
          </div>
        )}

        {/* VIEW: RESULT DASHBOARD */}
        {systemState === SystemState.ACCESS_GRANTED && (
            <>
            {/* BLACK SCREEN FIX: If Access Granted but no Data yet, show Decrypting Loader */}
            {!profile ? (
                <div className="flex flex-col items-center justify-center space-y-6 animate-pulse">
                    <div className="relative">
                        <RefreshCw size={64} className="animate-spin text-green-500 opacity-50" />
                        <Lock size={24} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white" />
                    </div>
                    <div className="text-center space-y-2">
                        <h2 className="text-2xl tracking-[0.2em] text-white font-bold drop-shadow-[0_0_10px_rgba(0,255,0,0.5)]">DECRYPTING DATA</h2>
                        <p className="text-xs text-green-600 tracking-widest">BYPASSING FINAL SECURITY LAYER...</p>
                    </div>
                </div>
            ) : (
             <div className="w-full space-y-6 animate-[fadeIn_0.5s_ease-out] relative z-20">
                {/* Header Profile Info Card */}
                <div className="border border-green-500/40 bg-black/80 p-8 relative overflow-hidden group shadow-[0_0_30px_rgba(0,255,0,0.05)] backdrop-blur-md rounded-lg">
                    {/* Background decorations */}
                    <div className="absolute top-0 right-0 p-4 opacity-20 transform rotate-12 translate-x-4 -translate-y-4 transition-transform group-hover:rotate-0">
                        <User size={120} className="text-green-500" />
                    </div>
                    <div className="absolute top-0 left-0 w-32 h-32 bg-green-500/5 rounded-full blur-3xl pointer-events-none"></div>

                    <div className="relative z-10 space-y-6">
                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                            <div>
                                <h2 className="text-4xl font-black text-white tracking-wider flex items-center gap-3 drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]">
                                    {profile.username}
                                    {profile.isVerifiedLive && <CheckCircle size={24} className="text-blue-500 fill-blue-500/20" />}
                                </h2>
                                <div className="flex items-center gap-4 mt-2">
                                    <p className="text-xs bg-green-900/30 text-green-400 px-2 py-1 rounded border border-green-500/20 uppercase tracking-widest flex items-center gap-2">
                                        <Shield size={10} /> TARGET_STATUS: OPEN
                                    </p>
                                    <p className="text-xs uppercase tracking-widest flex items-center gap-2">
                                        RISK: <span className={`font-bold ${profile.riskLevel === 'CRITICAL' || profile.riskLevel === 'EXTREME' ? 'text-red-500 drop-shadow-[0_0_5px_rgba(255,0,0,0.5)] animate-pulse' : 'text-yellow-400'}`}>{profile.riskLevel}</span>
                                    </p>
                                </div>
                            </div>
                            <div className="text-left md:text-right bg-green-900/10 p-2 rounded border border-green-500/10 md:bg-transparent md:border-none">
                                <p className="text-[10px] text-green-600 uppercase tracking-widest mb-1">Last Known IP</p>
                                <p className="text-green-300 font-mono text-lg tracking-wider">{profile.ipAddress}</p>
                            </div>
                        </div>

                        {/* Social Graph Stats - High Contrast */}
                        <div className="grid grid-cols-3 gap-px bg-green-900/30 border border-green-500/30 rounded-lg overflow-hidden shadow-inner">
                            <div className="text-center bg-black/60 p-4 hover:bg-green-900/10 transition-colors cursor-default">
                                <p className="text-[10px] text-green-500/80 uppercase tracking-widest mb-1">Followers</p>
                                <p className="text-2xl text-white font-bold tracking-tight">{profile.followers}</p>
                            </div>
                            <div className="text-center bg-black/60 p-4 hover:bg-green-900/10 transition-colors cursor-default">
                                <p className="text-[10px] text-green-500/80 uppercase tracking-widest mb-1">Following</p>
                                <p className="text-2xl text-white font-bold tracking-tight">{profile.following}</p>
                            </div>
                            <div className="text-center bg-black/60 p-4 hover:bg-green-900/10 transition-colors cursor-default">
                                <p className="text-[10px] text-green-500/80 uppercase tracking-widest mb-1">Posts</p>
                                <p className="text-2xl text-white font-bold tracking-tight">{profile.posts}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm bg-black/40 p-4 rounded border border-green-500/10">
                            <div className="space-y-1">
                                <span className="text-green-700 text-[10px] uppercase tracking-widest block">Full Name</span>
                                <span className="text-white text-lg tracking-wide">{profile.realName}</span>
                            </div>
                            <div className="space-y-1">
                                <span className="text-green-700 text-[10px] uppercase tracking-widest block">Geolocation</span>
                                <span className="text-white text-lg tracking-wide">{profile.location}</span>
                            </div>
                             <div className="space-y-2 md:col-span-2 mt-2">
                                <span className="text-green-700 text-[10px] uppercase tracking-widest block">Bio Metadata</span>
                                <span className="text-green-100/80 italic text-sm border-l-2 border-green-500 pl-4 block py-1 bg-green-900/5">{profile.bio}</span>
                            </div>
                        </div>

                        {/* LIVE VERIFY BUTTON */}
                        <div className="mt-4 flex justify-end">
                             <button 
                                onClick={handleLiveVerify}
                                disabled={isVerifying || profile.isVerifiedLive}
                                className={`flex items-center gap-2 text-xs px-6 py-2.5 rounded uppercase font-bold tracking-[0.15em] transition-all shadow-lg
                                    ${profile.isVerifiedLive 
                                        ? 'bg-blue-500/10 text-blue-400 border border-blue-500/30 cursor-default' 
                                        : 'bg-green-600 text-black border border-green-400 hover:bg-green-500 hover:shadow-[0_0_15px_rgba(0,255,0,0.4)] hover:scale-105'
                                    }`}
                             >
                                 {isVerifying ? (
                                     <><RefreshCw className="animate-spin" size={14}/> SYNCING...</>
                                 ) : profile.isVerifiedLive ? (
                                     <><CheckCircle size={14}/> LIVE CONNECTION VERIFIED</>
                                 ) : (
                                     <><Radio size={14}/> ESTABLISH LIVE UPLINK</>
                                 )}
                             </button>
                        </div>
                    </div>
                </div>

                {/* SENSITIVE DATA SECTION */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* PHONE */}
                    <div className="border border-green-500/30 bg-black/60 p-5 relative overflow-hidden rounded-lg backdrop-blur-sm shadow-lg group hover:border-green-500/60 transition-colors">
                        <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Smartphone size={60} />
                        </div>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-1.5 bg-green-900/30 rounded text-green-400">
                                <Smartphone size={18} />
                            </div>
                            <h3 className="text-white font-bold uppercase tracking-wider text-sm">Mobile Contact</h3>
                        </div>
                        <div className="bg-black/80 border border-green-900/50 rounded p-4 font-mono text-center relative h-14 flex items-center justify-center shadow-inner">
                            {showPhone ? (
                                <span className="text-white text-xl tracking-widest font-bold drop-shadow-[0_0_5px_rgba(255,255,255,0.7)]">
                                    {profile.phone}
                                </span>
                            ) : decryptingPhone ? (
                                <span className="text-green-500 animate-pulse text-xs tracking-widest font-bold">DECRYPTING KEY AES-256...</span>
                            ) : (
                                <span className="text-green-800 tracking-widest text-xl opacity-50">***********</span>
                            )}
                            
                            {!showPhone && !decryptingPhone && (
                                <button 
                                    onClick={() => handleDecrypt('phone')}
                                    className="absolute inset-0 bg-green-500/10 hover:bg-green-500/20 flex items-center justify-center gap-2 text-green-400 font-bold text-xs uppercase tracking-[0.2em] transition-all backdrop-blur-[1px] border border-green-500/20 hover:border-green-500/50"
                                >
                                    <Lock size={12} /> Decrypt
                                </button>
                            )}
                        </div>
                    </div>

                    {/* EMAIL */}
                    <div className="border border-green-500/30 bg-black/60 p-5 relative overflow-hidden rounded-lg backdrop-blur-sm shadow-lg group hover:border-green-500/60 transition-colors">
                        <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Mail size={60} />
                        </div>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-1.5 bg-green-900/30 rounded text-green-400">
                                <Mail size={18} />
                            </div>
                            <h3 className="text-white font-bold uppercase tracking-wider text-sm">Email Address</h3>
                        </div>
                         <div className="bg-black/80 border border-green-900/50 rounded p-4 font-mono text-center relative h-14 flex items-center justify-center shadow-inner">
                            {showEmail ? (
                                <span className="text-white text-sm tracking-wider font-bold drop-shadow-[0_0_5px_rgba(255,255,255,0.7)]">
                                    {profile.email}
                                </span>
                            ) : decryptingEmail ? (
                                <span className="text-green-500 animate-pulse text-xs tracking-widest font-bold">BRUTE FORCING SERVER...</span>
                            ) : (
                                <span className="text-green-800 tracking-widest text-xl opacity-50">*****************</span>
                            )}

                            {!showEmail && !decryptingEmail && (
                                <button 
                                    onClick={() => handleDecrypt('email')}
                                    className="absolute inset-0 bg-green-500/10 hover:bg-green-500/20 flex items-center justify-center gap-2 text-green-400 font-bold text-xs uppercase tracking-[0.2em] transition-all backdrop-blur-[1px] border border-green-500/20 hover:border-green-500/50"
                                >
                                    <Lock size={12} /> Decrypt
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* LIVE FEED PREVIEWS (Only show if Verified) */}
                {profile.postPreviews && profile.postPreviews.length > 0 && (
                     <div className="border border-green-500/20 bg-black/60 p-5 rounded-lg shadow-lg backdrop-blur-md">
                        <div className="flex items-center justify-between mb-4 border-b border-green-500/20 pb-2">
                            <div className="flex items-center gap-2 text-white">
                                <ImageIcon size={16} className="text-green-500" />
                                <h3 className="text-xs font-bold uppercase tracking-[0.2em]">Intercepted Media Feed</h3>
                            </div>
                            <span className="text-[9px] text-green-500 animate-pulse">● LIVE STREAM</span>
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                            {profile.postPreviews.map((post) => (
                                <div key={post.id} className="aspect-square bg-gray-900/80 border border-green-500/20 rounded relative group overflow-hidden shadow-inner hover:border-green-500/50 transition-colors cursor-crosshair">
                                     {/* Simulated Image Content */}
                                     <div className="absolute inset-0 flex items-center justify-center text-green-700/30 group-hover:text-green-500/50 transition-colors">
                                         {post.type === 'REEL' ? <PlayCircle size={32}/> : <ImageIcon size={32}/>}
                                     </div>
                                     <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-90"></div>
                                     <div className="absolute bottom-2 left-2 text-[10px] text-white space-y-1 font-sans">
                                         <div className="flex items-center gap-1.5"><Heart size={10} fill="#ef4444" className="text-red-500"/> {post.likes}</div>
                                         <div className="flex items-center gap-1.5"><MessageCircle size={10} className="text-blue-400"/> {post.comments}</div>
                                     </div>
                                </div>
                            ))}
                        </div>
                     </div>
                )}
                
                {/* SYSTEM LOGS */}
                <div className="border border-green-500/30 bg-black/90 p-4 font-mono text-[10px] text-green-500/80 h-32 overflow-y-auto custom-scrollbar rounded shadow-inner">
                    <div className="sticky top-0 bg-black/90 pb-2 mb-2 border-b border-green-900/50 font-bold text-green-400">SYSTEM_LOGS // ROOT_ACCESS</div>
                    {(profile.weaknesses || []).map((w, i) => (
                        <div key={i} className="mb-1 hover:text-green-300 transition-colors">{`> [VULNERABILITY] ${w}`}</div>
                    ))}
                    {(profile.recentActivity || []).map((a, i) => (
                        <div key={i+10} className="mb-1 hover:text-green-300 transition-colors">{`> [ACTIVITY_LOG] ${a}`}</div>
                    ))}
                    <div className="animate-pulse text-green-400">{`> AWAITING COMMAND..._`}</div>
                </div>

                <div className="flex justify-center pt-6 pb-4">
                    <button 
                        onClick={resetSystem}
                        className="text-white hover:text-green-300 border border-green-500/50 hover:border-green-400 hover:bg-green-500/10 px-8 py-3 rounded uppercase tracking-[0.2em] text-xs font-bold transition-all shadow-[0_0_15px_rgba(0,255,0,0.1)] hover:shadow-[0_0_25px_rgba(0,255,0,0.3)]"
                    >
                        INITIATE NEW TARGET
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