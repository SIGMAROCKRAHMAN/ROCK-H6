import { GoogleGenAI } from "@google/genai";
import { TargetProfile } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Helper to reliably parse JSON from AI response (which might contain markdown)
const parseJSON = (text: string) => {
  try {
    // Remove markdown code blocks if present
    const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleanText);
  } catch (e) {
    console.error("JSON Parse Error:", e);
    throw new Error("DATA CORRUPTION DETECTED. RETRYING PACKET INTERCEPTION...");
  }
};

export const performSystemHack = async (username: string): Promise<TargetProfile> => {
  // Enhanced prompt to use Google Search for GROUND TRUTH
  
  const prompt = `
    ROLE: You are an elite AI OSINT (Open Source Intelligence) Investigator.
    TARGET USERNAME: "${username}"
    
    MISSION:
    1. **SEARCH & VERIFY**: Use the Google Search tool to find the official Instagram profile for "${username}".
    2. **EXTRACT REAL DATA**: 
       - If the user exists (Celebrity, Influencer, Business, or Public Profile), extract their **ACTUAL** Bio, Real Name, and Follower Count from the search snippets.
       - **DO NOT HALLUCINATE** stats for famous people. Use the search results.
    
    3. **HANDLE UNKNOWN/PRIVATE USERS**:
       - If search returns no specific profile matches, assume they are a private civilian.
       - Generate plausible simulated stats (Low followers) and a generic bio.
       - Set 'riskLevel' to 'LOW'.

    4. **CONTACT SIMULATION (INDIAN CONTEXT)**:
       - Generate a realistic Indian Mobile (+91...) and Email. 
       - NOTE: These are simulated private fields for the "Hacker" effect.
    
    5. **VALIDATION**: 
       - If the username is gibberish (e.g. "sdfkjsdf"), set 'riskLevel' to 'INVALID'.

    OUTPUT FORMAT:
    Return **ONLY** a raw JSON object (no markdown, no explanations) matching this structure:
    {
      "username": "${username}",
      "realName": "string",
      "location": "string",
      "ipAddress": "string",
      "riskLevel": "LOW" | "MODERATE" | "CRITICAL" | "EXTREME" | "INVALID",
      "device": "string",
      "bio": "string",
      "email": "string",
      "phone": "string",
      "followers": "string (e.g. 1.2M, 450)",
      "following": "string",
      "posts": "string",
      "weaknesses": ["string", "string"],
      "recentActivity": ["string", "string"]
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }], // ENABLED SEARCH FOR ACCURACY
        // Note: responseSchema/MimeType are NOT allowed when using tools
      }
    });

    if (response.text) {
      const data = parseJSON(response.text) as TargetProfile;
      
      if (data.riskLevel === 'INVALID') {
          throw new Error("INVALID USERNAME SYNTAX. DATABASE REJECTED QUERY.");
      }
      
      return data;
    }
  } catch (error) {
    console.error("Search Tool Error (Fallback mode active):", error);
    // FALLBACK IF SEARCH FAILS (To prevent app crash)
    const fallbackPrompt = prompt + " \n IMPORTANT: Google Search failed. GENERATE REALISTIC SIMULATED PROFILE based on username pattern. DO NOT FAIL.";
    const fallbackResponse = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: fallbackPrompt
    });
    if (fallbackResponse.text) {
        return parseJSON(fallbackResponse.text) as TargetProfile;
    }
  }
  
  throw new Error("Target Firewall Too Strong. Data Extraction Failed.");
};

// New Function for Live Deep Scan (In-App Verification)
export const performLiveDeepScan = async (username: string, currentProfile: TargetProfile): Promise<TargetProfile> => {
    const prompt = `
      ROLE: Live Instagram Graph API Simulator.
      ACTION: Perform a DEEP PACKET INSPECTION on "${username}" using Google Search to get LATEST LIVE DATA.
      
      REQUIREMENTS:
      1. **ACCURACY CHECK**: Use Google Search to find the latest posts or news about this user.
      2. **PRECISE NUMBERS**: 
         - If search results show specific follower counts (e.g. "253,402"), use that EXACT number.
         - Do not round up numbers if exact ones are found.
      3. **LATEST CONTENT**:
         - Based on search results (or general vibe if private), generate 3 "Latest Post" previews.
         - If famous, describe REAL recent events associated with them.
      
      OUTPUT FORMAT:
      Return **ONLY** a raw JSON object with this structure:
      {
        "realName": "string",
        "followers": "string (Exact number)",
        "following": "string",
        "posts": "string",
        "postPreviews": [
          { 
            "id": "string", 
            "type": "REEL" | "IMAGE", 
            "caption": "string", 
            "likes": "string", 
            "comments": "string" 
          }
        ]
      }
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                tools: [{ googleSearch: {} }], // ENABLED SEARCH FOR REAL LIVE DATA
            }
        });

        if(response.text) {
            const deepData = parseJSON(response.text);
            return {
                ...currentProfile,
                ...deepData,
                isVerifiedLive: true
            };
        }
    } catch (error) {
         console.error("Live Scan Error:", error);
         // Return original profile if deep scan fails (simulation continues)
         return currentProfile;
    }

    return currentProfile;
};