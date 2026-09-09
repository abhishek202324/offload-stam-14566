/**
 * Saksham Main Application Controller (Revamped)
 * Orchestrates views, Leaflet interactive map with real GPS, Gemini API Key configuration, Voice tuning, and Discreet Calculator.
 */

class SakshamApp {
  constructor() {
    this.currentView = "citizen";
    this.calcScreenValue = "0";
    this.sosTimer = null;
    this.sosCount = 5;
    this.mapInstance = null;

    this.initElements();
    this.bindEvents();
    this.renderSupportEcosystem();
    this.renderLegalHandbook();
    this.populateVoiceSettings();
  }

  initElements() {
    this.calculatorModal = document.getElementById("calculatorModal");
    this.calcScreen = document.getElementById("calcScreen");
    this.sosModal = document.getElementById("sosModal");
    this.sosCountdownText = document.getElementById("sosCountdownText");
    this.toastContainer = document.getElementById("toastContainer");
    this.firModal = document.getElementById("firModal");
    this.settingsModal = document.getElementById("settingsModal");
    this.apiKeyInput = document.getElementById("geminiApiKeyInput");
    this.modelSelect = document.getElementById("geminiModelSelect");
    this.voiceSelect = document.getElementById("voiceSelect");
    this.speechRateSlider = document.getElementById("speechRateSlider");
    this.speechPitchSlider = document.getElementById("speechPitchSlider");
  }

  bindEvents() {
    // Navigation Tabs Switching
    document.querySelectorAll(".nav-tab-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const targetView = e.currentTarget.getAttribute("data-tab");
        this.switchView(targetView);
      });
    });

    // Discreet Mode Toggle button (Top bar and shortcut ESC)
    document.querySelectorAll(".trigger-discreet").forEach(btn => {
      btn.addEventListener("click", () => this.toggleDiscreetMode(true));
    });

    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        this.toggleDiscreetMode(true);
      }
    });

    // Discreet Calculator Logic
    document.querySelectorAll(".calc-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const val = e.currentTarget.getAttribute("data-val");
        this.handleCalculatorInput(val);
      });
    });

    // SOS Emergency Trigger
    document.querySelectorAll(".trigger-sos").forEach(btn => {
      btn.addEventListener("click", () => this.triggerSosModal());
    });

    const btnCancelSos = document.getElementById("btnCancelSos");
    if (btnCancelSos) {
      btnCancelSos.addEventListener("click", () => this.cancelSos());
    }

    const btnSendNowSos = document.getElementById("btnSendNowSos");
    if (btnSendNowSos) {
      btnSendNowSos.addEventListener("click", () => this.executeSosDispatch());
    }

    // Close FIR Modal
    const btnCloseFirModal = document.getElementById("btnCloseFirModal");
    if (btnCloseFirModal && this.firModal) {
      btnCloseFirModal.addEventListener("click", () => {
        this.firModal.classList.remove("active");
      });
    }

    // Settings Modal Triggers
    const btnOpenSettings = document.getElementById("btnOpenSettings");
    if (btnOpenSettings) {
      btnOpenSettings.addEventListener("click", () => this.openSettingsModal());
    }

    const btnCloseSettings = document.getElementById("btnCloseSettings");
    if (btnCloseSettings && this.settingsModal) {
      btnCloseSettings.addEventListener("click", () => {
        this.settingsModal.classList.remove("active");
      });
    }

    const btnSaveSettings = document.getElementById("btnSaveSettings");
    if (btnSaveSettings) {
      btnSaveSettings.addEventListener("click", () => this.saveSettings());
    }

    // Voice tune controls
    if (this.voiceSelect) {
      this.voiceSelect.addEventListener("change", (e) => {
        window.speechService.setVoiceByName(e.target.value);
      });
    }
    if (this.speechRateSlider) {
      this.speechRateSlider.addEventListener("input", (e) => {
        window.speechService.setRate(e.target.value);
      });
    }
    if (this.speechPitchSlider) {
      this.speechPitchSlider.addEventListener("input", (e) => {
        window.speechService.setPitch(e.target.value);
      });
    }

    const btnTestVoice = document.getElementById("btnTestVoice");
    if (btnTestVoice) {
      btnTestVoice.addEventListener("click", () => {
        window.speechService.speak("Namaste. You are connected to Saksham. You are completely safe with us.");
      });
    }

    // Real GPS refresh trigger
    const btnRefreshLocation = document.getElementById("btnRefreshLocation");
    if (btnRefreshLocation) {
      btnRefreshLocation.addEventListener("click", async () => {
        this.showToast("Fetching live GPS coordinates...", "info");
        await window.geoService.getCurrentLocation();
        this.renderSupportEcosystem();
        this.initOrUpdateMap();
        this.showToast(`Location updated: ${window.geoService.currentAddress}`, "success");
      });
    }
  }

  populateVoiceSettings() {
    setTimeout(() => {
      if (!this.voiceSelect) return;
      const voices = window.speechService.getAvailableVoices();
      this.voiceSelect.innerHTML = voices.map(v => `<option value="${v.name}">${v.name} (${v.lang})</option>`).join('');
    }, 500);
  }

  openSettingsModal() {
    if (!this.settingsModal) return;
    if (this.apiKeyInput) this.apiKeyInput.value = window.geminiService.getApiKey();
    if (this.modelSelect) this.modelSelect.value = window.geminiService.selectedModel;
    this.settingsModal.classList.add("active");
  }

  saveSettings() {
    if (this.apiKeyInput) {
      window.geminiService.setApiKey(this.apiKeyInput.value);
    }
    if (this.modelSelect) {
      window.geminiService.setModel(this.modelSelect.value);
    }
    if (this.settingsModal) this.settingsModal.classList.remove("active");
    
    const hasKey = window.geminiService.hasApiKey();
    this.showToast(hasKey ? "Google Gemini API connected successfully!" : "Settings saved (Using built-in intelligent engine)", "success");
    
    const keyBadge = document.getElementById("geminiKeyStatusBadge");
    if (keyBadge) {
      keyBadge.innerHTML = hasKey ? "⚡ Gemini Live" : "🧠 Built-in AI";
    }
  }

  switchView(viewName) {
    if (!viewName) return;
    this.currentView = viewName;

    // Update Nav Tabs
    document.querySelectorAll(".nav-tab-btn").forEach(btn => {
      btn.classList.toggle("active", btn.getAttribute("data-tab") === viewName);
    });

    // Update View Containers
    document.querySelectorAll(".tab-view").forEach(view => {
      view.classList.toggle("active", view.id === `view-${viewName}`);
    });

    // Refresh charts if dashboard selected
    if (viewName === "caseworker" && window.caseworkerDashboard) {
      setTimeout(() => {
        window.caseworkerDashboard.renderQueue();
        window.caseworkerDashboard.drawAnalyticsCharts();
      }, 100);
    }

    // Refresh Leaflet map if ecosystem selected
    if (viewName === "ecosystem") {
      setTimeout(() => {
        this.initOrUpdateMap();
      }, 150);
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  initOrUpdateMap() {
    const mapContainer = document.getElementById("liveSafeSpacesMap");
    if (!mapContainer || typeof L === "undefined") return;

    const coords = window.geoService.currentCoords || { latitude: 28.6139, longitude: 77.2090 };
    const userLat = coords.latitude;
    const userLng = coords.longitude;

    if (!this.mapInstance) {
      this.mapInstance = L.map('liveSafeSpacesMap').setView([userLat, userLng], 13);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(this.mapInstance);
    } else {
      this.mapInstance.setView([userLat, userLng], 13);
      this.mapInstance.invalidateSize();
    }

    // User Location Marker
    const userIcon = L.divIcon({
      html: `<div style="background:#141038; color:white; border-radius:50%; width:32px; height:32px; display:flex; align-items:center; justify-content:center; font-size:16px; border:2px solid white; box-shadow:0 2px 8px rgba(0,0,0,0.3);">📍</div>`,
      className: '',
      iconSize: [32, 32],
      iconAnchor: [16, 16]
    });

    L.marker([userLat, userLng], { icon: userIcon })
      .addTo(this.mapInstance)
      .bindPopup(`<strong>Your Current Location</strong><br>${window.geoService.currentAddress}`)
      .openPopup();

    // Add Support centers nearby
    window.MOCK_DATA.supportEcosystem.forEach(item => {
      // Offset slightly for demonstration around user's actual location if outside default
      const offsetLat = userLat + (Math.random() - 0.5) * 0.04;
      const offsetLng = userLng + (Math.random() - 0.5) * 0.04;
      
      const centerIcon = L.divIcon({
        html: `<div style="background:#7C5CE9; color:white; border-radius:50%; width:28px; height:28px; display:flex; align-items:center; justify-content:center; font-size:14px; border:2px solid white; box-shadow:0 2px 8px rgba(0,0,0,0.3);">🏥</div>`,
        className: '',
        iconSize: [28, 28],
        iconAnchor: [14, 14]
      });

      L.marker([offsetLat, offsetLng], { icon: centerIcon })
        .addTo(this.mapInstance)
        .bindPopup(`<strong>${item.name}</strong><br>${item.address}<br><strong>📞 ${item.phone}</strong>`);
    });
  }

  toggleDiscreetMode(show) {
    if (!this.calculatorModal) return;

    if (show) {
      this.calculatorModal.classList.add("active");
      this.calcScreenValue = "0";
      this.updateCalcScreen();
      if (window.speechService) window.speechService.stopSpeaking();
    } else {
      this.calculatorModal.classList.remove("active");
    }
  }

  handleCalculatorInput(val) {
    if (val === "C") {
      this.calcScreenValue = "0";
    } else if (val === "=") {
      if (this.calcScreenValue === "14566" || this.calcScreenValue === "1456") {
        this.toggleDiscreetMode(false);
        this.showToast("Welcome back to Saksham Portal", "success");
        return;
      }
      try {
        const expression = this.calcScreenValue.replace(/×/g, "*").replace(/÷/g, "/");
        this.calcScreenValue = String(eval(expression) || 0);
      } catch (e) {
        this.calcScreenValue = "Error";
      }
    } else {
      if (this.calcScreenValue === "0" && !isNaN(val)) {
        this.calcScreenValue = val;
      } else {
        this.calcScreenValue += val;
      }
    }

    this.updateCalcScreen();
  }

  updateCalcScreen() {
    if (this.calcScreen) {
      this.calcScreen.textContent = this.calcScreenValue;
    }
  }

  triggerSosModal() {
    if (!this.sosModal) return;

    this.sosCount = 5;
    if (this.sosCountdownText) this.sosCountdownText.textContent = `00:0${this.sosCount}`;
    this.sosModal.classList.add("active");

    clearInterval(this.sosTimer);
    this.sosTimer = setInterval(() => {
      this.sosCount--;
      if (this.sosCountdownText) this.sosCountdownText.textContent = `00:0${this.sosCount}`;
      if (this.sosCount <= 0) {
        clearInterval(this.sosTimer);
        this.executeSosDispatch();
      }
    }, 1000);
  }

  cancelSos() {
    clearInterval(this.sosTimer);
    if (this.sosModal) this.sosModal.classList.remove("active");
    this.showToast("Emergency SOS broadcast cancelled.", "info");
  }

  executeSosDispatch() {
    clearInterval(this.sosTimer);
    if (this.sosModal) this.sosModal.classList.remove("active");

    const realLocation = window.geoService.currentAddress || "Real GPS Coordinates Broadcasted";
    const sosCaseId = "SK-SOS-" + Math.floor(1000 + Math.random() * 9000);
    const sosCase = {
      id: sosCaseId,
      timestamp: "Just now (PANIC BEACON)",
      timeAgoMinutes: 0,
      category: "ONE-TAP PANIC DISTRESS BEACON",
      riskLevel: "critical",
      distressScore: 99,
      status: "PCR Patrol Dispatched",
      channel: "Panic SOS Button",
      callerName: "Citizen Live Beacon",
      contactNumber: "+91 98765-XXXXX",
      location: realLocation,
      fearScore: 99,
      angerScore: 80,
      urgencyScore: 100,
      keywordsDetected: ["one-tap panic beacon", "silent distress", "live coordinates attached"],
      sentimentTrajectory: [70, 85, 95, 99],
      audioStress: {
        pitchVariance: "N/A",
        tremorDetected: "True",
        backgroundNoise: "Silent Beacon",
        distressAcousticLevel: "Critical"
      },
      summary: `Emergency Panic SOS broadcasted by citizen. Auto-GPS location resolved to ${realLocation}. Patrol dispatched.`,
      transcript: [
        { sender: "System", text: `Silent Panic Beacon Activated at ${realLocation}.`, urgent: true, time: new Date().toLocaleTimeString() }
      ],
      recommendedAction: "Patrol Unit DL-04 Dispatched (ETA 3 mins) + Sakhi Rapid Shelter Team"
    };

    window.MOCK_DATA.distressCases.unshift(sosCase);

    if (window.caseworkerDashboard) {
      window.caseworkerDashboard.renderQueue();
      window.caseworkerDashboard.renderStats();
    }

    this.showToast(`🚨 EMERGENCY SOS BROADCASTED! Patrol dispatched to ${realLocation} (ETA: 3 mins)`, "danger");
  }

  showToast(message, type = "info") {
    if (!this.toastContainer) return;

    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    
    let icon = "ℹ️";
    if (type === "success") icon = "✅";
    if (type === "danger") icon = "🚨";
    if (type === "warning") icon = "⚠️";

    toast.innerHTML = `<span>${icon}</span> <div>${message}</div>`;
    this.toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = "translateX(100%)";
      toast.style.transition = "all 0.25s ease";
      setTimeout(() => toast.remove(), 250);
    }, 4000);
  }

  renderSupportEcosystem() {
    const container = document.getElementById("supportEcosystemList");
    if (!container || !window.MOCK_DATA.supportEcosystem) return;

    const userLocationStr = window.geoService.currentAddress || "New Delhi";

    container.innerHTML = "";
    window.MOCK_DATA.supportEcosystem.forEach(item => {
      const card = document.createElement("div");
      card.className = "glass-card";
      card.style.cssText = "padding:20px; border-radius:14px; margin-bottom:12px;";

      card.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:6px;">
          <div>
            <span style="font-size:0.75rem; font-weight:700; color:var(--purple-text); background:var(--purple-bg); padding:2px 8px; border-radius:12px;">${item.type}</span>
            <h4 style="font-size:1.05rem; color:var(--navy-deep); margin-top:4px;">${item.name}</h4>
          </div>
          <span style="font-size:0.78rem; font-weight:700; color:var(--green-text); background:var(--green-bg); padding:2px 8px; border-radius:12px;">📍 Nearby ${userLocationStr.split(',')[0]}</span>
        </div>
        <p style="font-size:0.83rem; color:var(--text-muted); margin-bottom:8px;">${item.address}</p>
        <div style="display:flex; flex-wrap:wrap; gap:6px; margin-bottom:10px;">
          ${item.services.map(s => `<span style="font-size:0.72rem; background:var(--bg-primary); border:1px solid var(--border-subtle); padding:2px 6px; border-radius:6px;">✓ ${s}</span>`).join('')}
        </div>
        <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid var(--border-subtle); padding-top:8px;">
          <span style="font-size:0.82rem; font-weight:700; color:var(--navy-deep);">📞 ${item.phone}</span>
          <button class="btn-primary-hero trigger-helpline" style="padding:5px 12px; font-size:0.75rem;">Direct Connect</button>
        </div>
      `;
      container.appendChild(card);
    });
  }

  renderLegalHandbook() {
    const container = document.getElementById("legalHandbookList");
    if (!container || !window.MOCK_DATA.legalHandbooks) return;

    container.innerHTML = "";
    window.MOCK_DATA.legalHandbooks.forEach(item => {
      const card = document.createElement("div");
      card.className = "glass-card";
      card.style.cssText = "padding:20px; border-radius:14px; margin-bottom:14px;";

      card.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
          <h4 style="font-size:1.1rem; color:var(--navy-deep);">${item.title}</h4>
          <span style="font-size:0.72rem; font-weight:700; color:var(--pink-text); background:var(--pink-bg); padding:2px 8px; border-radius:10px;">${item.category}</span>
        </div>
        <p style="font-size:0.85rem; color:var(--text-muted); margin-bottom:10px; line-height:1.45;">${item.summary}</p>
        <div style="background:var(--bg-primary); border-left:3px solid var(--purple-accent); padding:10px 12px; border-radius:0 6px 6px 0;">
          <strong style="font-size:0.8rem; color:var(--navy-deep); display:block; margin-bottom:4px;">Key Statutory Provisions:</strong>
          <ul style="list-style:none; padding:0; display:flex; flex-direction:column; gap:3px;">
            ${item.keyProvisions.map(p => `<li style="font-size:0.78rem; color:var(--text-dark);">⚖️ ${p}</li>`).join('')}
          </ul>
        </div>
      `;
      container.appendChild(card);
    });
  }
}

// Global initialization
document.addEventListener("DOMContentLoaded", () => {
  window.app = new SakshamApp();
});
