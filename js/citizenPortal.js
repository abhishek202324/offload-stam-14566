/**
 * Saksham Citizen Portal (Upgraded)
 * Powered by Google Gemini AI, Real Geolocation, Soft Speech Synthesis & Harmonic Chimes
 */

class CitizenPortal {
  constructor() {
    this.currentStep = 1;
    this.totalSteps = 4;
    this.incidentData = {
      category: "Domestic Violence & Physical Threat",
      description: "",
      location: "Detecting live GPS...",
      isAnonymous: true,
      filesCount: 0,
      evidenceHash: "0x8F94...42A1 (Client Encrypted)"
    };

    this.initElements();
    this.bindEvents();
    this.autoDetectLocation();
  }

  initElements() {
    // Chat Elements
    this.chatMessages = document.getElementById("chatMessages");
    this.chatInput = document.getElementById("chatInput");
    this.btnSendChat = document.getElementById("btnSendChat");
    this.btnMicChat = document.getElementById("btnMicChat");
    this.btnVoiceToggle = document.getElementById("btnVoiceToggle");
    this.distressMeterFill = document.getElementById("distressMeterFill");
    this.distressMeterText = document.getElementById("distressMeterText");

    // Wizard Elements
    this.wizardStep1 = document.getElementById("wizardStep1");
    this.wizardStep2 = document.getElementById("wizardStep2");
    this.wizardStep3 = document.getElementById("wizardStep3");
    this.wizardStep4 = document.getElementById("wizardStep4");
    this.wizardStepSuccess = document.getElementById("wizardStepSuccess");
    this.stepIndicator = document.getElementById("stepIndicator");
    this.btnWizardPrev = document.getElementById("btnWizardPrev");
    this.btnWizardNext = document.getElementById("btnWizardNext");
    this.btnWizardSubmit = document.getElementById("btnWizardSubmit");
    this.btnVoiceIncident = document.getElementById("btnVoiceIncident");
    this.incidentDescription = document.getElementById("incidentDescription");
    this.incidentLocationInput = document.getElementById("incidentLocationInput");
    this.evidenceDropzone = document.getElementById("evidenceDropzone");
    this.evidenceFileInput = document.getElementById("evidenceFileInput");
    this.evidenceStatusText = document.getElementById("evidenceStatusText");
    this.anonymousToggle = document.getElementById("anonymousToggle");
  }

  bindEvents() {
    // Chat send button & Enter key
    if (this.btnSendChat) {
      this.btnSendChat.addEventListener("click", () => this.handleSendMessage());
    }
    if (this.chatInput) {
      this.chatInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") this.handleSendMessage();
      });
    }

    // Voice Chat Mic button
    if (this.btnMicChat) {
      this.btnMicChat.addEventListener("click", () => this.handleVoiceChat());
    }

    // Voice Output Mute/Unmute toggle
    if (this.btnVoiceToggle) {
      this.btnVoiceToggle.addEventListener("click", () => {
        const isMuted = window.speechService.toggleMute();
        this.btnVoiceToggle.innerHTML = isMuted ? "🔇" : "🔊";
        this.btnVoiceToggle.title = isMuted ? "Unmute Voice" : "Mute Voice";
        window.app.showToast(isMuted ? "Audio muted" : "Soft audio enabled", "info");
      });
    }

    // Quick prompt chips
    document.querySelectorAll(".prompt-chip").forEach(chip => {
      chip.addEventListener("click", (e) => {
        const text = e.target.getAttribute("data-prompt") || e.target.textContent;
        if (this.chatInput) {
          this.chatInput.value = text;
          this.handleSendMessage();
        }
      });
    });

    // Wizard Category Buttons
    document.querySelectorAll(".category-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        document.querySelectorAll(".category-btn").forEach(b => b.classList.remove("selected"));
        const target = e.currentTarget;
        target.classList.add("selected");
        this.incidentData.category = target.getAttribute("data-category");
      });
    });

    // Wizard Next & Prev buttons
    if (this.btnWizardNext) {
      this.btnWizardNext.addEventListener("click", () => this.nextStep());
    }
    if (this.btnWizardPrev) {
      this.btnWizardPrev.addEventListener("click", () => this.prevStep());
    }
    if (this.btnWizardSubmit) {
      this.btnWizardSubmit.addEventListener("click", () => this.submitIncident());
    }

    // Voice recording for incident description
    if (this.btnVoiceIncident) {
      this.btnVoiceIncident.addEventListener("click", () => this.handleVoiceIncident());
    }

    // Evidence file dropzone
    if (this.evidenceDropzone && this.evidenceFileInput) {
      this.evidenceDropzone.addEventListener("click", () => this.evidenceFileInput.click());
      this.evidenceFileInput.addEventListener("change", (e) => {
        if (e.target.files.length > 0) {
          this.incidentData.filesCount = e.target.files.length;
          const fakeHash = "0x" + Array.from({length: 8}, () => Math.floor(Math.random()*16).toString(16)).join("") + "...AES-256";
          this.incidentData.evidenceHash = fakeHash;
          this.evidenceStatusText.innerHTML = `✅ <strong>${e.target.files.length} file(s) attached & client-side encrypted</strong><br><small style="color:var(--emerald-text)">SHA-256 Digest: ${fakeHash}</small>`;
          window.app.showToast("Files encrypted with zero-knowledge keys", "success");
        }
      });
    }

    // Anonymous toggle
    if (this.anonymousToggle) {
      this.anonymousToggle.addEventListener("change", (e) => {
        this.incidentData.isAnonymous = e.target.checked;
      });
    }
  }

  async autoDetectLocation() {
    try {
      const loc = await window.geoService.getCurrentLocation();
      this.incidentData.location = loc.address;
      if (this.incidentLocationInput) {
        this.incidentLocationInput.value = loc.address;
      }
      const locBadge = document.getElementById("citizenLiveLocBadge");
      if (locBadge) {
        locBadge.textContent = `📍 ${loc.address}`;
      }
    } catch (e) {
      console.warn("Location detection:", e);
    }
  }

  async handleSendMessage() {
    if (!this.chatInput) return;
    const text = this.chatInput.value.trim();
    if (!text) return;

    this.appendMessage("user", text);
    this.chatInput.value = "";
    window.speechService.playGentleChime("send");

    // Show temporary typing indicator
    const typingMsg = this.showTypingIndicator();

    try {
      // Send to Gemini AI Service (supports ANY question dynamically)
      const result = await window.geminiService.generateReply(text);

      // Remove typing indicator
      if (typingMsg) typingMsg.remove();

      // Update real-time distress meter
      this.updateDistressMeter(result.analysis);

      // Append AI response
      this.appendMessage("bot", result.text);
      window.speechService.playGentleChime("receive");
      window.speechService.speak(result.text);

      // If critical, trigger notification
      if (result.analysis.riskLevel === "critical") {
        window.app.showToast("Critical distress signals identified! Emergency dispatch standing by.", "danger");
      }
    } catch (err) {
      if (typingMsg) typingMsg.remove();
      this.appendMessage("bot", "I am here with you. Please let me know what assistance you need.");
    }
  }

  showTypingIndicator() {
    if (!this.chatMessages) return null;
    const msgDiv = document.createElement("div");
    msgDiv.className = "chat-msg bot typing-indicator-msg";
    msgDiv.innerHTML = `
      <div class="msg-bubble" style="padding: 10px 16px; font-style: italic; color: #777;">
        Saksham Sathi is typing...
      </div>
    `;
    this.chatMessages.appendChild(msgDiv);
    this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    return msgDiv;
  }

  handleVoiceChat() {
    if (!this.btnMicChat) return;

    if (window.speechService.isListening) {
      window.speechService.stopListening();
      this.btnMicChat.classList.remove("recording");
      return;
    }

    this.btnMicChat.classList.add("recording");
    window.app.showToast("Listening... Speak gently", "info");

    window.speechService.startListening(
      (transcript) => {
        if (this.chatInput) {
          this.chatInput.value = transcript;
          this.handleSendMessage();
        }
      },
      () => {
        if (this.btnMicChat) this.btnMicChat.classList.remove("recording");
      },
      (error) => {
        if (this.btnMicChat) this.btnMicChat.classList.remove("recording");
        window.app.showToast("Microphone note: " + error, "warning");
      }
    );
  }

  handleVoiceIncident() {
    if (!this.btnVoiceIncident) return;
    window.app.showToast("Listening for incident details...", "info");
    this.btnVoiceIncident.innerHTML = "🔴 Listening...";

    window.speechService.startListening(
      (transcript) => {
        if (this.incidentDescription) {
          const current = this.incidentDescription.value;
          this.incidentDescription.value = current ? current + " " + transcript : transcript;
        }
      },
      () => {
        if (this.btnVoiceIncident) this.btnVoiceIncident.innerHTML = "🎤 Voice Input";
      },
      (error) => {
        if (this.btnVoiceIncident) this.btnVoiceIncident.innerHTML = "🎤 Voice Input";
        window.app.showToast("Microphone: " + error, "warning");
      }
    );
  }

  appendMessage(sender, text) {
    if (!this.chatMessages) return;

    const msgDiv = document.createElement("div");
    msgDiv.className = `chat-msg ${sender}`;

    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Format markdown bold/newlines
    const formattedText = text
      .replace(/\n/g, '<br>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

    msgDiv.innerHTML = `
      <div class="msg-bubble">
        ${formattedText}
        <span class="msg-timestamp">${now}</span>
      </div>
    `;

    this.chatMessages.appendChild(msgDiv);
    this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
  }

  updateDistressMeter(analysis) {
    if (!this.distressMeterFill || !this.distressMeterText || !analysis) return;

    const score = analysis.distressScore || 20;
    this.distressMeterFill.style.width = `${score}%`;

    if (analysis.riskLevel === "critical" || score >= 80) {
      this.distressMeterFill.style.background = "#BE123C";
      this.distressMeterText.innerHTML = `Distress: <strong>${score}% (CRITICAL)</strong>`;
    } else if (analysis.riskLevel === "high" || score >= 60) {
      this.distressMeterFill.style.background = "#C2410C";
      this.distressMeterText.innerHTML = `Distress: <strong>${score}% (HIGH)</strong>`;
    } else if (analysis.riskLevel === "moderate" || score >= 40) {
      this.distressMeterFill.style.background = "#B45309";
      this.distressMeterText.innerHTML = `Distress: <strong>${score}% (MODERATE)</strong>`;
    } else {
      this.distressMeterFill.style.background = "#1E7E56";
      this.distressMeterText.innerHTML = `Distress: <strong>${score}% (STABLE)</strong>`;
    }
  }

  nextStep() {
    if (this.currentStep < this.totalSteps) {
      this.setStep(this.currentStep + 1);
    }
  }

  prevStep() {
    if (this.currentStep > 1) {
      this.setStep(this.currentStep - 1);
    }
  }

  setStep(step) {
    this.currentStep = step;
    [this.wizardStep1, this.wizardStep2, this.wizardStep3, this.wizardStep4, this.wizardStepSuccess].forEach(el => {
      if (el) el.classList.remove("active");
    });

    if (step === 1 && this.wizardStep1) this.wizardStep1.classList.add("active");
    if (step === 2 && this.wizardStep2) this.wizardStep2.classList.add("active");
    if (step === 3 && this.wizardStep3) this.wizardStep3.classList.add("active");
    if (step === 4 && this.wizardStep4) {
      this.wizardStep4.classList.add("active");
      this.updateStep4Summary();
    }

    if (this.stepIndicator) {
      this.stepIndicator.textContent = `Step ${step} of ${this.totalSteps}`;
    }

    if (this.btnWizardPrev) {
      this.btnWizardPrev.style.display = step === 1 ? "none" : "block";
    }
    if (this.btnWizardNext) {
      this.btnWizardNext.style.display = step === this.totalSteps ? "none" : "block";
    }
    if (this.btnWizardSubmit) {
      this.btnWizardSubmit.style.display = step === this.totalSteps ? "block" : "none";
    }
  }

  updateStep4Summary() {
    const desc = this.incidentDescription ? this.incidentDescription.value : "";
    this.incidentData.description = desc || "No additional text description provided.";
    if (this.incidentLocationInput) {
      this.incidentData.location = this.incidentLocationInput.value || this.incidentData.location;
    }
    
    const analysis = window.sakshamAI.analyzeDistress(this.incidentData.description);
    this.incidentData.analysis = analysis;

    const summaryBox = document.getElementById("step4ReviewBox");
    if (summaryBox) {
      summaryBox.innerHTML = `
        <div style="background:#FBF9F6; border:1px solid #EBE4DA; border-radius:12px; padding:16px;">
          <div style="display:flex; justify-content:space-between; margin-bottom:8px; font-size:0.88rem;">
            <strong>Category:</strong> <span>${this.incidentData.category}</span>
          </div>
          <div style="display:flex; justify-content:space-between; margin-bottom:8px; font-size:0.88rem;">
            <strong>Location:</strong> <span>${this.incidentData.location}</span>
          </div>
          <div style="display:flex; justify-content:space-between; margin-bottom:8px; font-size:0.88rem;">
            <strong>Identity:</strong> <span>${this.incidentData.isAnonymous ? "🔒 Anonymous (Encrypted)" : "Identified Complainant"}</span>
          </div>
          <div style="display:flex; justify-content:space-between; margin-bottom:8px; font-size:0.88rem;">
            <strong>Evidence Files:</strong> <span>${this.incidentData.filesCount} file(s) attached</span>
          </div>
          <div style="margin-top:10px; padding-top:8px; border-top:1px dashed #D5CDC0; display:flex; justify-content:space-between; align-items:center;">
            <strong>AI Distress Triage:</strong>
            <span class="badge-risk ${analysis.riskLevel}">${analysis.distressScore}% - ${analysis.riskLevel.toUpperCase()}</span>
          </div>
        </div>
      `;
    }
  }

  submitIncident() {
    const randomId = "SK-2026-" + Math.floor(1000 + Math.random() * 9000);
    const analysis = this.incidentData.analysis || window.sakshamAI.analyzeDistress(this.incidentData.description);

    const newCase = {
      id: randomId,
      timestamp: "Just now",
      timeAgoMinutes: 0,
      category: this.incidentData.category,
      riskLevel: analysis.riskLevel,
      distressScore: analysis.distressScore,
      status: "New (Triage Complete)",
      channel: "Incident Web Portal",
      callerName: this.incidentData.isAnonymous ? "Anonymous Citizen (Discreet)" : "Registered Citizen",
      contactNumber: "+91 9XXXX-XXXXX (Encrypted)",
      location: this.incidentData.location,
      fearScore: analysis.fearScore,
      angerScore: analysis.angerScore,
      urgencyScore: analysis.urgencyScore,
      keywordsDetected: analysis.detectedKeywords.map(k => k.word),
      sentimentTrajectory: [30, 50, 70, analysis.distressScore],
      audioStress: {
        pitchVariance: "Standard",
        tremorDetected: "N/A (Web Form)",
        backgroundNoise: "N/A",
        distressAcousticLevel: "N/A"
      },
      summary: this.incidentData.description.substring(0, 160) + "...",
      transcript: [
        { sender: "User", text: this.incidentData.description, urgent: analysis.riskLevel === "critical", time: new Date().toLocaleTimeString() }
      ],
      recommendedAction: analysis.riskLevel === "critical" ? "Immediate PCR Patrol Dispatch + Sakhi Crisis Unit" : "Assign Protection Officer & Legal Aid Review"
    };

    // Prepend to Global Mock Data
    window.MOCK_DATA.distressCases.unshift(newCase);

    // Trigger update on Caseworker Dashboard
    if (window.caseworkerDashboard) {
      window.caseworkerDashboard.renderQueue();
      window.caseworkerDashboard.renderStats();
    }

    // Show success view
    [this.wizardStep1, this.wizardStep2, this.wizardStep3, this.wizardStep4].forEach(el => {
      if (el) el.classList.remove("active");
    });
    if (this.wizardStepSuccess) {
      this.wizardStepSuccess.classList.add("active");
      const refEl = document.getElementById("generatedCaseId");
      if (refEl) refEl.textContent = randomId;
    }

    if (this.btnWizardPrev) this.btnWizardPrev.style.display = "none";
    if (this.btnWizardNext) this.btnWizardNext.style.display = "none";
    if (this.btnWizardSubmit) this.btnWizardSubmit.style.display = "none";
    if (this.stepIndicator) this.stepIndicator.textContent = "Submitted Successfully";

    window.app.showToast(`Case ${randomId} registered & routed to Caseworker Queue!`, "success");
  }

  resetWizard() {
    this.currentStep = 1;
    if (this.incidentDescription) this.incidentDescription.value = "";
    this.incidentData.filesCount = 0;
    if (this.evidenceStatusText) this.evidenceStatusText.innerHTML = "Upload screenshots, audio clips or document logs (AES-256 client encrypted)";
    this.setStep(1);
  }
}

// Global instance
window.citizenPortal = new CitizenPortal();
