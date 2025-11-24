import React, { useState, useEffect } from 'react';
import { performSystemHack, performLiveDeepScan } from './services/geminiService';
import { TargetProfile, SystemState } from './types';
import MatrixRain from './components/MatrixRain';
import HackLoader from './components/HackLoader';
import AdminLogin from './components/AdminLogin';
import { Terminal, Skull, Smartphone, Mail, AlertTriangle, User, Shield, Lock, Wifi, Binary, LogOut, Users, Image as ImageIcon, UserPlus, ExternalLink, Eye, CheckCircle, Radio, PlayCircle, Heart, MessageCircle } from 'lucide-react';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Auth State
  
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

  // Initial check for API Key on mount
  useEffect(() => {
    // Only warn if authenticated to avoid ruining the login screen vibe
    if (isAuthenticated && !process.env.API_KEY) {
        setError("SYSTEM ALERT: API KEY NOT CONFIGURED IN SERVER ENVIRONMENT.");
    }
  }, [isAuthenticated]);

  const handleHack = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // 1. Basic Validation
    if (!username.trim()) return;
    
    // 2. Strict Username Validation (No spaces, min length)
    const validUsernameRegex = /^[a-zA-Z0-9._]+$/;
    if (username.length < 3) {
        setError("ERROR: USERNAME TOO SHORT (MIN 3 CHARS)");
        return;
    }
    if (!validUsernameRegex.test(username)) {
        setError("ERROR: INVALID CHARACTERS IN USERNAME");
        return;
    }

    if (!process.env.API_KEY) {
        setError("CRITICAL ERROR: API KEY NOT FOUND. PLEASE ADD 'API_KEY' IN NETLIFY SETTINGS.");
        return;
    }

    setSystemState(SystemState.SCANNING);
    setShowPhone(false);
    setShowEmail(false);
    setIsVerifying(false);
    
    try {
      const data = await performSystemHack(username);
      setProfile(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "TARGET NOT FOUND OR DOES NOT EXIST.");
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

  const handleAdminLogin = () => {
      setIsAuthenticated(true);
  };

  const handleLiveVerify = async () => {
      if (!profile) return;
      
      setIsVerifying(true);
      try {
          // Simulate network delay for "Hacking/Connecting" feel
          await new Promise(resolve => setTimeout(resolve, 2000));
          
          const deepData = await performLiveDeepScan(profile.username, profile);
          setProfile(deepData);
      } catch (e) {
          console.error("Verification failed", e);
      } finally {
          setIsVerifying(false);
      }
  };

  return (
    <div className="min-h-screen w-full font-mono relative flex flex-col items-center justify-center p-2 md:p-4 bg-black overflow-hidden">
      {/* Matrix Rain changes color based on Auth state: Red for Locked, Green for Unlocked */}
      <MatrixRain color={isAuthenticated ? '#0F0' : '#F00'} />
      
      {/* AUTHENTICATION GATE */}
      {!isAuthenticated ? (
          <AdminLogin onLogin={handleAdminLogin} />
      ) : (
        <>
            {/* Header */}
            <header className="z-10 absolute top-0 left-0 w-full p-4 border-b border-green-900/50 bg-black/90 backdrop-blur-md flex justify-between items-center animate-fade-in">
                <h1 className="text-xl md:text-3xl font-bold tracking-widest flex items-center gap-2 text-white">
                <Skull className="w-6 h-6 text-green-500" /> ROCK <span className="text-green-500">HACKER</span>
                </h1>
                
                <div className="flex items-center gap-4">
                    <div className="hidden md:block text-[10px] text-right text-green-400/60 leading-tight">
                        <p>CONNECTION: ENCRYPTED (TOR)</p>
                        <p>ADMIN: ROCKRAHMAN</p>
                    </div>
                    
                    {/* Logout Button */}
                    <button 
                        onClick={handleLogout}
                        className="flex items-center gap-2 bg-red-900/20 hover:bg-red-600 text-red-500 hover:text-black border border-red-800 px-3 py-1 md:px-4 md:py-2 text-[10px] md:text-xs font-bold uppercase tracking-widest transition-all"
                    >
                        <LogOut size={14} /> <span className="hidden md:inline">ABORT SESSION</span>
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <main className="z-20 w-full max-w-5xl relative mt-20 md:mt-16 animate-scale-in">
                
                {/* Terminal Window */}
                <div className="bg-black/95 border border-green-500/50 shadow-[0_0_50px_rgba(0,255,0,0.15)] rounded-sm overflow-hidden min-h-[600px] flex flex-col relative text-green-500">
                
                {/* Decorative lines */}
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-green-500 to-transparent opacity-50"></div>
                
                {/* Terminal Bar */}
                <div className="bg-zinc-900/90 border-b border-green-500/30 p-2 flex items-center justify-between">
                    <div className="flex gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                    </div>
                    <span className="text-xs text-green-600 font-bold tracking-wider">ROOT@ROCKHACKER:~</span>
                </div>

                {/* Content Area */}
                <div className="p-4 md:p-8 flex-1 flex flex-col relative">
                    
                    {/* Error Display */}
                    {error && (
                        <div className="mb-6 border-l-4 border-red-500 bg-red-900/10 p-4 text-red-500 flex flex-col md:flex-row items-center justify-between animate-shake gap-2">
                            <div className="flex items-center gap-3">
                                <AlertTriangle className="shrink-0"/>
                                <span className="font-bold uppercase text-xs md:text-sm">{error}</span>
                            </div>
                            <button onClick={resetSystem} className="text-xs border border-red-500 px-3 py-1 hover:bg-red-500 hover:text-black transition whitespace-nowrap">RETRY</button>
                        </div>
                    )}

                    {/* IDLE STATE: Input */}
                    {systemState === SystemState.IDLE && (
                    <div className="flex flex-col items-center justify-center flex-1 space-y-8 animate-fade-in py-10">
                        <div className="text-center space-y-4">
                            <div className="relative inline-block">
                                <div className="absolute inset-0 bg-green-500 blur-xl opacity-20 animate-pulse"></div>
                                <Terminal size={80} className="relative z-10 text-green-500" />
                            </div>
                            <h2 className="text-3xl md:text-5xl font-bold tracking-tighter text-white">TARGET <span className="text-green-500">ACQUISITION</span></h2>
                            <p className="text-green-400/60 text-sm md:text-base max-w-lg mx-auto">
                            ENTER USERNAME TO EXTRACT DATA. AI WILL VALIDATE IDENTITY AND CONNECT TO INSTAGRAM SERVERS.
                            </p>
                        </div>

                        <form onSubmit={handleHack} className="w-full max-w-xl relative group">
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-green-500 to-emerald-500 rounded opacity-30 group-hover:opacity-100 transition duration-500 blur"></div>
                            <div className="relative flex items-center bg-black border border-green-500/50 p-4 shadow-2xl">
                                <span className="text-green-500 text-xl font-bold mr-4 animate-pulse">{">"}</span>
                                <input 
                                    type="text" 
                                    value={username}
                                    onChange={(e) => { setUsername(e.target.value); }}
                                    placeholder="ENTER_INSTAGRAM_USERNAME"
                                    className="bg-transparent border-none outline-none text-lg md:text-2xl text-white w-full font-mono placeholder-green-800/50 uppercase tracking-widest"
                                    autoFocus
                                />
                                <button type="submit" className="hidden md:block bg-green-600 text-black px-6 py-2 font-bold hover:bg-green-500 transition-colors uppercase tracking-widest text-sm">
                                    INITIATE
                                </button>
                            </div>
                        </form>
                        
                        <div className="mt-auto pt-10 grid grid-cols-3 gap-4 w-full max-w-2xl opacity-40 text-[10px] md:text-xs text-center uppercase text-green-500">
                            <div className="border border-green-900 p-2">Port 80: OPEN</div>
                            <div className="border border-green-900 p-2">Port 443: OPEN</div>
                            <div className="border border-green-900 p-2">AI ENGINE: ONLINE</div>
                        </div>
                    </div>
                    )}

                    {/* LOADING STATE */}
                    {(systemState === SystemState.SCANNING || systemState === SystemState.BREACHING) && (
                        <HackLoader onComplete={onLoaderComplete} />
                    )}

                    {/* RESULT STATE */}
                    {systemState === SystemState.ACCESS_GRANTED && profile && (
                        <div className="animate-fade-in h-full flex flex-col gap-6 text-sm md:text-base">
                            
                            {/* Header Result */}
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-green-500/50 pb-4 gap-4">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <div className={`w-2 h-2 rounded-full animate-pulse ${profile.isVerifiedLive ? 'bg-blue-500' : 'bg-green-500'}`}></div>
                                        <h2 className="text-2xl font-bold text-white tracking-widest">
                                            {profile.isVerifiedLive ? 'LIVE FEED ACTIVE' : 'DATA EXTRACTED'}
                                        </h2>
                                    </div>
                                    <p className="text-green-400 opacity-70 mt-1">TARGET ID: {profile.username.toUpperCase()}</p>
                                </div>
                                
                                <div className="flex gap-2 w-full md:w-auto">
                                    <button 
                                        onClick={handleLiveVerify}
                                        disabled={isVerifying || profile.isVerifiedLive}
                                        className={`flex-1 md:flex-none flex items-center justify-center gap-2 text-xs border px-4 py-2 transition uppercase tracking-widest font-bold 
                                            ${profile.isVerifiedLive 
                                                ? 'border-blue-500 text-blue-400 bg-blue-900/20 cursor-default' 
                                                : 'border-green-500 bg-green-900/30 hover:bg-green-500 hover:text-black text-green-400'
                                            }`}
                                    >
                                        {isVerifying ? (
                                            <> <Radio size={14} className="animate-ping" /> INTERCEPTING... </>
                                        ) : profile.isVerifiedLive ? (
                                            <> <CheckCircle size={14} /> LIVE VERIFIED </>
                                        ) : (
                                            <> <Radio size={14} /> VERIFY LIVE </>
                                        )}
                                    </button>
                                    <button onClick={resetSystem} className="flex-1 md:flex-none text-xs border border-green-500 px-6 py-2 hover:bg-green-500 hover:text-black transition uppercase tracking-widest font-bold">
                                        NEW TARGET
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                                
                                {/* LEFT COL - Identity & Social Stats */}
                                <div className="md:col-span-7 space-y-6">
                                    {/* Identity Card */}
                                    <div className={`border bg-green-900/5 p-6 relative group transition-all ${profile.isVerifiedLive ? 'border-blue-500/50 shadow-[0_0_20px_rgba(59,130,246,0.2)]' : 'border-green-500/30'}`}>
                                        <div className={`absolute top-0 right-0 p-1 px-3 text-[10px] border-b border-l ${profile.isVerifiedLive ? 'bg-blue-900/50 text-blue-300 border-blue-500/30' : 'bg-green-900/50 text-green-300 border-green-500/30'}`}>
                                            {profile.isVerifiedLive ? 'LIVE_PACKET_STREAM' : 'CACHED_IDENTITY_MATRIX'}
                                        </div>
                                        
                                        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-6">
                                            <div className="relative">
                                                <div className={`w-24 h-24 bg-black border-2 flex items-center justify-center relative overflow-hidden transition-shadow ${profile.isVerifiedLive ? 'border-blue-500 shadow-[0_0_15px_#3b82f6]' : 'border-green-500 group-hover:shadow-[0_0_15px_#0f0]'}`}>
                                                    <User size={48} className={profile.isVerifiedLive ? 'text-blue-500' : 'text-green-700'} />
                                                    <div className="absolute inset-0 bg-green-500/10 scan-line"></div>
                                                </div>
                                            </div>
                                            <div className="text-center md:text-left flex-1 space-y-2">
                                                <div>
                                                    <p className={`text-xs font-bold uppercase ${profile.isVerifiedLive ? 'text-blue-500' : 'text-green-600'}`}>
                                                        FULL NAME {profile.isVerifiedLive && '(CONFIRMED)'}
                                                    </p>
                                                    <p className="text-2xl md:text-3xl text-white font-bold tracking-wider">{profile.realName}</p>
                                                </div>
                                                <div>
                                                    <p className={`text-xs font-bold uppercase ${profile.isVerifiedLive ? 'text-blue-500' : 'text-green-600'}`}>BIO DATA</p>
                                                    <p className={`${profile.isVerifiedLive ? 'text-blue-200' : 'text-green-300'} italic leading-relaxed text-sm`}>"{profile.bio}"</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* SOCIAL STATS GRID */}
                                        <div className={`grid grid-cols-3 gap-2 mb-4 border-t border-b py-4 ${profile.isVerifiedLive ? 'border-blue-500/20' : 'border-green-500/20'}`}>
                                            <div className="text-center">
                                                <div className={`${profile.isVerifiedLive ? 'text-blue-500' : 'text-green-600'} text-[10px] uppercase font-bold mb-1 flex justify-center items-center gap-1`}><ImageIcon size={10}/> POSTS</div>
                                                <div className={`text-white text-lg md:text-xl font-bold tracking-widest ${profile.isVerifiedLive && 'animate-pulse'}`}>{profile.posts}</div>
                                            </div>
                                            <div className={`text-center border-l ${profile.isVerifiedLive ? 'border-blue-500/20' : 'border-green-500/20'}`}>
                                                <div className={`${profile.isVerifiedLive ? 'text-blue-500' : 'text-green-600'} text-[10px] uppercase font-bold mb-1 flex justify-center items-center gap-1`}><Users size={10}/> FOLLOWERS</div>
                                                <div className={`text-white text-lg md:text-xl font-bold tracking-widest ${profile.isVerifiedLive && 'animate-pulse'}`}>{profile.followers}</div>
                                            </div>
                                            <div className={`text-center border-l ${profile.isVerifiedLive ? 'border-blue-500/20' : 'border-green-500/20'}`}>
                                                <div className={`${profile.isVerifiedLive ? 'text-blue-500' : 'text-green-600'} text-[10px] uppercase font-bold mb-1 flex justify-center items-center gap-1`}><UserPlus size={10}/> FOLLOWING</div>
                                                <div className={`text-white text-lg md:text-xl font-bold tracking-widest ${profile.isVerifiedLive && 'animate-pulse'}`}>{profile.following}</div>
                                            </div>
                                        </div>
                                        
                                        {/* LIVE FEED PREVIEWS */}
                                        {profile.isVerifiedLive && profile.postPreviews && (
                                            <div className="mt-4 animate-fade-in">
                                                <p className="text-[10px] text-blue-500 font-bold mb-2 flex items-center gap-1">
                                                    <Radio size={10} className="animate-ping"/> LATEST ENCRYPTED MEDIA STREAMS
                                                </p>
                                                <div className="grid grid-cols-3 gap-2">
                                                    {profile.postPreviews.map((post, idx) => (
                                                        <div key={idx} className="aspect-square bg-black border border-blue-900 relative group overflow-hidden">
                                                            <div className="absolute inset-0 bg-blue-900/10 group-hover:bg-transparent transition"></div>
                                                            {/* Fake image placeholder */}
                                                            <div className="w-full h-full flex items-center justify-center bg-gray-900 text-gray-700 text-[10px]">
                                                                {post.type}
                                                            </div>
                                                            <div className="absolute bottom-0 left-0 w-full bg-black/80 p-1">
                                                                <p className="text-[8px] text-white truncate">{post.caption}</p>
                                                                <div className="flex justify-between text-[8px] text-blue-400 mt-1">
                                                                    <span className="flex items-center gap-0.5"><Heart size={6}/> {post.likes}</span>
                                                                    <span className="flex items-center gap-0.5"><MessageCircle size={6}/> {post.comments}</span>
                                                                </div>
                                                            </div>
                                                            {post.type === 'REEL' && <PlayCircle size={16} className="absolute top-1 right-1 text-white drop-shadow-md" />}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        <div className="grid grid-cols-2 gap-4 text-xs md:text-sm mt-4">
                                            <div className="bg-black/40 p-2 border-l-2 border-green-800">
                                                <span className="block text-green-700 text-[10px] uppercase">RISK LEVEL</span>
                                                <span className={`font-bold tracking-widest ${profile.riskLevel === 'EXTREME' || profile.riskLevel === 'CRITICAL' ? 'text-red-500 animate-pulse' : 'text-green-400'}`}>
                                                    {profile.riskLevel}
                                                </span>
                                            </div>
                                            <div className="bg-black/40 p-2 border-l-2 border-green-800">
                                                <span className="block text-green-700 text-[10px] uppercase">DEVICE ID</span>
                                                <span className="text-white">{profile.device}</span>
                                            </div>
                                            <div className="bg-black/40 p-2 border-l-2 border-green-800">
                                                <span className="block text-green-700 text-[10px] uppercase">IP ADDRESS</span>
                                                <span className="text-white">{profile.ipAddress}</span>
                                            </div>
                                            <div className="bg-black/40 p-2 border-l-2 border-green-800">
                                                <span className="block text-green-700 text-[10px] uppercase">LOCATION</span>
                                                <span className="text-white">{profile.location}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Vulnerabilities */}
                                    <div className="border border-red-900/30 bg-red-950/10 p-4 relative">
                                        <div className="flex items-center gap-2 mb-3 text-red-500 text-sm font-bold uppercase tracking-widest">
                                            <Shield size={14} /> System Vulnerabilities
                                        </div>
                                        <ul className="space-y-2">
                                            {profile.weaknesses.map((w, i) => (
                                                <li key={i} className="flex items-start gap-2 text-red-400/80 text-xs md:text-sm">
                                                    <span className="mt-1 w-1 h-1 bg-red-500 rounded-full"></span>
                                                    {w}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>

                                {/* RIGHT COL - Private Data */}
                                <div className="md:col-span-5 space-y-6">
                                    
                                    {/* Private Comms */}
                                    <div className="border border-green-500/30 bg-green-900/5 p-6 relative h-full">
                                        <div className="absolute top-0 left-0 p-1 px-3 bg-green-500 text-black text-[10px] font-bold">RESTRICTED_DATA</div>
                                        
                                        <div className="space-y-8 mt-4">
                                            
                                            {/* Mobile */}
                                            <div className="space-y-2">
                                                <div className="flex items-center gap-2 text-green-600">
                                                    <Smartphone size={16} />
                                                    <span className="text-xs font-bold uppercase">MOBILE NUMBER</span>
                                                </div>
                                                <div className="relative bg-black border border-green-900 p-3 overflow-hidden group">
                                                    {showPhone ? (
                                                        <span className="text-xl text-white font-mono tracking-widest drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]">
                                                            {profile.phone}
                                                        </span>
                                                    ) : (
                                                        <div className="flex items-center justify-between">
                                                            <span className="text-xl text-green-900 font-mono tracking-widest blur-sm select-none">
                                                                +91 XXXXX XXXXX
                                                            </span>
                                                            <button 
                                                                onClick={() => handleDecrypt('phone')}
                                                                disabled={decryptingPhone}
                                                                className="absolute inset-0 bg-green-900/20 hover:bg-green-500/10 flex items-center justify-center transition backdrop-blur-[2px]"
                                                            >
                                                                {decryptingPhone ? (
                                                                    <span className="text-xs animate-pulse text-green-400 font-bold">DECRYPTING...</span>
                                                                ) : (
                                                                    <div className="flex items-center gap-2 text-xs border border-green-500 px-3 py-1 text-green-400 bg-black/80">
                                                                        <Lock size={12} /> DECRYPT
                                                                    </div>
                                                                )}
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Email */}
                                            <div className="space-y-2">
                                                <div className="flex items-center gap-2 text-green-600">
                                                    <Mail size={16} />
                                                    <span className="text-xs font-bold uppercase">PRIVATE EMAIL</span>
                                                </div>
                                                <div className="relative bg-black border border-green-900 p-3 overflow-hidden group">
                                                    {showEmail ? (
                                                        <span className="text-lg text-white font-mono break-all drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]">
                                                            {profile.email}
                                                        </span>
                                                    ) : (
                                                        <div className="flex items-center justify-between">
                                                            <span className="text-lg text-green-900 font-mono blur-sm select-none">
                                                                ******************
                                                            </span>
                                                            <button 
                                                                onClick={() => handleDecrypt('email')}
                                                                disabled={decryptingEmail}
                                                                className="absolute inset-0 bg-green-900/20 hover:bg-green-500/10 flex items-center justify-center transition backdrop-blur-[2px]"
                                                            >
                                                                {decryptingEmail ? (
                                                                    <span className="text-xs animate-pulse text-green-400 font-bold">DECRYPTING...</span>
                                                                ) : (
                                                                    <div className="flex items-center gap-2 text-xs border border-green-500 px-3 py-1 text-green-400 bg-black/80">
                                                                        <Lock size={12} /> DECRYPT
                                                                    </div>
                                                                )}
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                        </div>

                                        {/* Logs */}
                                        <div className="mt-8 pt-4 border-t border-green-900/50">
                                            <p className="text-xs text-green-600 mb-2 uppercase font-bold">INTERCEPTED PACKETS</p>
                                            <div className="font-mono text-[10px] md:text-xs space-y-1 text-green-500/60">
                                                {profile.recentActivity.map((act, i) => (
                                                    <div key={i} className="truncate">
                                                        <span className="text-green-800 mr-2">{`0${i+1}:`}</span>{act}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                </div>
                
                {/* Footer Bar */}
                <div className="bg-zinc-900 p-2 text-[10px] flex justify-between text-green-600/50 border-t border-green-900/30">
                    <span>ROCK_HACKER_OS // V3.1.5 (ROOT)</span>
                    <span className="hidden md:inline">MEMORY: 64TB // ENCRYPTION: AES-2048</span>
                    <span>STATUS: UNDETECTED</span>
                </div>
                </div>
            </main>
        </>
      )}
    </div>
  );
}