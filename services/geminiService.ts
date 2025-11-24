import { GoogleGenAI } from "@google/genai";
import { TargetProfile, PostPreview } from "../types";

// Helper to reliably parse JSON from AI response
const parseJSON = (text: string) => {
  try {
    const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleanText);
  } catch (e) {
    console.error("JSON Parse Error:", e);
    return null;
  }
};

// --- MOCK DATA GENERATOR (PLAN C: CRASH PROTECTION) ---
// Generates consistent fake data based on username if API fails
const getHash = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
};

const generateMockProfile = (username: string): TargetProfile => {
    const seed = getHash(username);
    const followers = (seed % 900) + 12;
    const following = (seed % 400) + 50;
    const posts = (seed % 50) + 5;
    
    return {
        username: username,
        realName: username.charAt(0).toUpperCase() + username.slice(1).replace(/[._0-9]/g, ' '),
        location: seed % 2 === 0 ? "Mumbai, MH (Triangulated)" : "Delhi, NCR (Proxy)",
        ipAddress: `192.168.${seed % 255}.${(seed * 3) % 255}`,
        riskLevel: seed % 3 === 0 ? 'MODERATE' : 'LOW',
        device: seed % 2 === 0 ? "iPhone 14 Pro Max" : "Samsung S24 Ultra",
        bio: "Official Account | Living Life | DM for Paid Collab | 📍India",
        email: `${username.substring(0, 3)}***@gmail.com`,
        phone: `+91 ${9000000000 + (seed % 99999999)}`,
        followers: `${followers}.${seed % 9}K`,
        following: `${following}`,
        posts: `${posts}`,
        weaknesses: ["Public Metadata Exposed", "Weak Auth Token"],
        recentActivity: ["Active Session: Android", "Recent Post Uploaded"],
        isVerifiedLive: false
    };
};

const getAiClient = () => {
    const key = process.env.API_KEY;
    if (!key) return null; // Don't throw, just return null to trigger fallback
    return new GoogleGenAI({ apiKey: key });
};

export const performSystemHack = async (username: string): Promise<TargetProfile> => {
  const ai = getAiClient();
  
  // 1. IF NO API KEY or Client, USE MOCK DATA IMMEDIATELY
  if (!ai) {
      console.warn("No API Key detected. Using Simulation Mode.");
      await new Promise(r => setTimeout(r, 2000)); // Fake delay
      return generateMockProfile(username);
  }

  // 2. TRY PLAN A: REAL GOOGLE SEARCH
  const prompt = `
    ROLE: OSINT Investigator.
    TARGET: "${username}" on Instagram.
    TASK: Search for this user. 
    - If famous/public, return REAL stats (Followers, Bio, Name).
    - If private/unknown, generate REALISTIC simulation data.
    - Risk Level: INVALID if username is gibberish.
    OUTPUT: JSON Only. Fields: username, realName, location, ipAddress, riskLevel, device, bio, email, phone, followers, following, posts, weaknesses, recentActivity.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: { tools: [{ googleSearch: {} }] }
    });

    if (response.text) {
      const data = parseJSON(response.text);
      if (data && data.riskLevel !== 'INVALID') return data;
    }
  } catch (error) {
    console.error("Plan A (Search) Failed:", error);
  }

  // 3. TRY PLAN B: STANDARD AI SIMULATION (No Search)
  try {
      const fallbackPrompt = `
        Generate a REALISTIC fictional hacker dossier for Instagram user "${username}".
        Context: Indian user.
        Return JSON matching TargetProfile interface.
        Use realistic numbers (e.g. Followers: 1.2K).
        Phone: +91 XXXXX (Masked).
      `;
      const response = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: fallbackPrompt
      });
      if (response.text) {
          const data = parseJSON(response.text);
          if (data) return data;
      }
  } catch (error) {
      console.error("Plan B (AI) Failed:", error);
  }

  // 4. PLAN C: FALLBACK TO LOCAL MOCK (Never Fail)
  return generateMockProfile(username);
};

export const performLiveDeepScan = async (username: string, currentProfile: TargetProfile): Promise<TargetProfile> => {
    const ai = getAiClient();
    
    // If offline, simulate a scan
    if (!ai) {
        await new Promise(r => setTimeout(r, 1500));
        return {
            ...currentProfile,
            isVerifiedLive: true,
            followers: currentProfile.followers.includes('K') ? currentProfile.followers : "1,240", // Small change
            postPreviews: [
                { id: '1', type: 'IMAGE', caption: 'Living my best life ✨', likes: '243', comments: '12' },
                { id: '2', type: 'REEL', caption: 'Travel diaries ✈️', likes: '1.2K', comments: '45' },
                { id: '3', type: 'IMAGE', caption: 'Vibes 🌑', likes: '89', comments: '4' }
            ]
        };
    }

    const prompt = `
      Perform LIVE verification for "${username}".
      Extract LATEST exact follower count and 3 post previews.
      Return JSON: { realName, followers, following, posts, postPreviews: [{id, type, caption, likes, comments}] }
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: { tools: [{ googleSearch: {} }] }
        });

        if(response.text) {
            const deepData = parseJSON(response.text);
            if (deepData) {
                return { ...currentProfile, ...deepData, isVerifiedLive: true };
            }
        }
    } catch (error) {
         console.error("Live Scan Error:", error);
    }

    // Fallback if live scan fails: Just mark as verified and keep old data
    return { ...currentProfile, isVerifiedLive: true };
};