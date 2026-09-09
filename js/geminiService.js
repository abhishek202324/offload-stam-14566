/**
 * Saksham Gemini AI Service - STAM Edition
 * Connected with Ministry of Social Justice and Empowerment (DoSJE) & NHAA 14566 System Prompt
 */

class GeminiService {
  constructor() {
    this.apiKey = localStorage.getItem("saksham_gemini_api_key") || "";
    this.selectedModel = localStorage.getItem("saksham_gemini_model") || "gemini-1.5-flash";
    this.chatHistory = [];
    
    this.systemInstruction = `
You are "Saksham STAM" (सक्षम - Real-Time Stress & Trauma Assessment Assistant), an AI module deployed on the National Helpline Against Atrocities (NHAA 14566), Ministry of Social Justice and Empowerment (DoSJE), Government of India.

Mission:
To listen, evaluate psychological stress & trauma, and support victims/complainants belonging to Scheduled Castes (SC) and Scheduled Tribes (ST) who approach through NHAA 14566, web portal, mobile app, chatbot, or IVRS.

Core Knowledge & Sensitivities:
1. Legal Framework: Scheduled Castes and Scheduled Tribes (Prevention of Atrocities) Act 1989 and PoA Rules 2016 Amendment.
   - Offences under Section 3(1) and 3(2) (Social boycott, land alienation, physical violence, caste slurs, rape, murder).
   - Mandatory Section 4: Public servants (police) refusing to record FIR face 6 months to 1 year imprisonment.
   - Statutory Compensation under PoA Schedule (₹1,00,000 to ₹8,50,000, 50% payable on FIR/spot verification).
   - Section 15A: Comprehensive Witness Protection Scheme (Armed security, safe house, trial protection).
2. Psychological First-Aid & Tele-MANAS:
   - Recognize acute trauma, fear of dominant castes, helplessness, PTSD, and suicidal thoughts.
   - Provide trauma-informed, deeply reassuring grounding ("You are not alone ❤️", "Samvidhan aur kanoon aapke sath khada hai").
   - Instant referral to Tele-MANAS (14416) for suicidal or severe depression alerts.
3. Multi-Lingual & Dialects: Respond fluently in Hindi (हिन्दी), English, Hinglish, Marathi, Bengali, Tamil, Telugu, etc.
4. Output JSON Tag:
   At the very end of your response on a new line, include the SVI metric tag:
   [TRIAGE:{"sviScore":<number 10-99>,"riskLevel":"<low|moderate|high|critical>","fearScore":<number>,"traumaScore":<number>,"suicideAlert":<true|false>,"keywords":["<kw1>","<kw2>"]}]
`;
  }

  setApiKey(key) {
    this.apiKey = key.trim();
    localStorage.setItem("saksham_gemini_api_key", this.apiKey);
  }

  getApiKey() {
    return this.apiKey;
  }

  hasApiKey() {
    return Boolean(this.apiKey && this.apiKey.length > 10);
  }

  setModel(model) {
    this.selectedModel = model;
    localStorage.setItem("saksham_gemini_model", model);
  }

  async generateReply(userMessage) {
    this.chatHistory.push({ role: "user", parts: [{ text: userMessage }] });

    if (this.hasApiKey()) {
      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${this.selectedModel}:generateContent?key=${this.apiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: this.chatHistory,
              systemInstruction: {
                parts: [{ text: this.systemInstruction }]
              },
              generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 800,
              }
            })
          }
        );

        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          throw new Error(errData.error?.message || `HTTP ${response.status}`);
        }

        const data = await response.json();
        const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || "I am here with you. Please let me know how I can assist you.";
        
        const triageMatch = rawText.match(/\[TRIAGE:(.*?)\]/);
        let triageData = null;
        let cleanText = rawText;

        if (triageMatch) {
          try {
            triageData = JSON.parse(triageMatch[1]);
            cleanText = rawText.replace(/\[TRIAGE:.*?\]/, '').trim();
          } catch (e) {
            console.warn("Failed to parse triage JSON", e);
          }
        }

        this.chatHistory.push({ role: "model", parts: [{ text: cleanText }] });

        if (!triageData) {
          triageData = window.sakshamAI.analyzeDistress(userMessage);
        }

        return {
          text: cleanText,
          analysis: triageData,
          source: "gemini_api"
        };
      } catch (err) {
        console.warn("Gemini API call failed, falling back to local STAM engine:", err);
        const fallbackResult = window.sakshamAI.generateResponse(userMessage);
        return {
          text: `*(Note: Gemini API Notice: ${err.message}. Using built-in STAM Engine)*\n\n` + fallbackResult.text,
          analysis: fallbackResult.analysis,
          source: "local_fallback"
        };
      }
    }

    // Default: Intelligent dynamic STAM fallback engine
    const fallbackResult = window.sakshamAI.generateResponse(userMessage);
    this.chatHistory.push({ role: "model", parts: [{ text: fallbackResult.text }] });
    return fallbackResult;
  }
}

// Global instance
window.geminiService = new GeminiService();
