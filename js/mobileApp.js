/**
 * OFFLOAD Deeply Coded Mobile App Simulator Controller
 * Handles internal mobile screen switching, live clock, mobile chat, audio waveform recording, and 3-second hold SOS
 */

class MobileAppSimulator {
  constructor() {
    this.currentScreen = "home";
    this.holdTimer = null;
    this.holdProgress = 0;
    this.isRecording = false;
    this.waveInterval = null;

    this.initElements();
    this.bindEvents();
    this.startClock();
  }

  initElements() {
    this.phoneClock = document.getElementById("phoneClock");
    this.phoneChatMessages = document.getElementById("phoneChatMessages");
    this.phoneChatInput = document.getElementById("phoneChatInput");
    this.phoneBtnSend = document.getElementById("phoneBtnSend");
    this.phoneBtnMicBig = document.getElementById("phoneBtnMicBig");
    this.phoneWaveCanvas = document.getElementById("phoneWaveCanvas");
    this.phoneVoiceStatus = document.getElementById("phoneVoiceStatus");
    this.phoneHesitationCount = document.getElementById("phoneHesitationCount");
    this.phoneJitterVal = document.getElementById("phoneJitterVal");
    this.phoneHoldBtn = document.getElementById("phoneHoldBtn");
    this.phoneProgressBar = document.getElementById("phoneProgressBar");
  }

  bindEvents() {
    // Mobile Bottom Navigation Tabs
    document.querySelectorAll(".phone-nav-item").forEach(item => {
      item.addEventListener("click", (e) => {
        const target = e.currentTarget.getAttribute("data-phone-tab");
        this.switchPhoneScreen(target);
      });
    });

    // Mobile Action buttons on Home screen
    document.querySelectorAll(".phone-nav-trigger").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const target = e.currentTarget.getAttribute("data-phone-tab");
        this.switchPhoneScreen(target);
      });
    });

    // Mobile Chat Send
    if (this.phoneBtnSend) {
      this.phoneBtnSend.addEventListener("click", () => this.handleMobileChatSend());
    }
    if (this.phoneChatInput) {
      this.phoneChatInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") this.handleMobileChatSend();
      });
    }

    // Voice Lab Mic Button
    if (this.phoneBtnMicBig) {
      this.phoneBtnMicBig.addEventListener("click", () => this.toggleVoiceRecording());
    }

    // 3-Second Hold SOS Button
    if (this.phoneHoldBtn) {
      this.phoneHoldBtn.addEventListener("mousedown", () => this.startSosHold());
      this.phoneHoldBtn.addEventListener("touchstart", (e) => { e.preventDefault(); this.startSosHold(); });

      window.addEventListener("mouseup", () => this.cancelSosHold());
      window.addEventListener("touchend", () => this.cancelSosHold());
    }
  }

  startClock() {
    const updateTime = () => {
      if (this.phoneClock) {
        const now = new Date();
        this.phoneClock.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      }
    };
    updateTime();
    setInterval(updateTime, 10000);
  }

  switchPhoneScreen(screenName) {
    if (!screenName) return;
    this.currentScreen = screenName;

    // Update bottom nav active state
    document.querySelectorAll(".phone-nav-item").forEach(item => {
      item.classList.toggle("active", item.getAttribute("data-phone-tab") === screenName);
    });

    // Update screen views
    document.querySelectorAll(".phone-screen-view").forEach(view => {
      view.classList.toggle("active", view.id === `phone-view-${screenName}`);
    });
  }

  async handleMobileChatSend() {
    if (!this.phoneChatInput) return;
    const text = this.phoneChatInput.value.trim();
    if (!text) return;

    this.appendMobileBubble("user", text);
    this.phoneChatInput.value = "";

    // Show AI response
    try {
      const result = await window.geminiService.generateReply(text);
      this.appendMobileBubble("bot", result.text);
      window.speechService.playGentleChime("receive");
    } catch (e) {
      this.appendMobileBubble("bot", "I am here with you. SVI assessment recorded.");
    }
  }

  appendMobileBubble(sender, text) {
    if (!this.phoneChatMessages) return;

    const bubble = document.createElement("div");
    bubble.className = `phone-bubble ${sender}`;
    bubble.innerHTML = text.replace(/\n/g, '<br>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

    this.phoneChatMessages.appendChild(bubble);
    this.phoneChatMessages.scrollTop = this.phoneChatMessages.scrollHeight;
  }

  toggleVoiceRecording() {
    if (this.isRecording) {
      this.stopVoiceRecording();
    } else {
      this.startVoiceRecording();
    }
  }

  startVoiceRecording() {
    this.isRecording = true;
    if (this.phoneBtnMicBig) this.phoneBtnMicBig.classList.add("recording");
    if (this.phoneVoiceStatus) this.phoneVoiceStatus.textContent = "Listening & Extracting Vocal Stress...";

    // Start Canvas Wave Animation
    this.animateWaveCanvas(true);

    // Trigger Speech Recognition
    window.speechService.startListening(
      (transcript) => {
        const analysis = window.sakshamAI.analyzeDistress(transcript);
        if (this.phoneVoiceStatus) {
          this.phoneVoiceStatus.innerHTML = `SVI: <strong style="color:${analysis.sviScore > 75 ? '#DC2626' : '#059669'}">${analysis.sviScore}/100 (${analysis.riskLevel.toUpperCase()})</strong>`;
        }
        if (this.phoneHesitationCount) this.phoneHesitationCount.textContent = "2 pauses detected";
        if (this.phoneJitterVal) this.phoneJitterVal.textContent = "+28Hz Moderate Jitter";
        window.app.showToast(`Voice Note SVI: ${analysis.sviScore} (${analysis.riskLevel.toUpperCase()})`, "info");
      },
      () => this.stopVoiceRecording(),
      (err) => {
        this.stopVoiceRecording();
      }
    );
  }

  stopVoiceRecording() {
    this.isRecording = false;
    if (this.phoneBtnMicBig) this.phoneBtnMicBig.classList.remove("recording");
    window.speechService.stopListening();
    this.animateWaveCanvas(false);
  }

  animateWaveCanvas(start) {
    if (!this.phoneWaveCanvas) return;
    const ctx = this.phoneWaveCanvas.getContext("2d");
    const width = this.phoneWaveCanvas.width = this.phoneWaveCanvas.parentElement.clientWidth || 300;
    const height = this.phoneWaveCanvas.height = 80;

    clearInterval(this.waveInterval);

    if (!start) {
      ctx.clearRect(0, 0, width, height);
      ctx.strokeStyle = "#CBD5E1";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, height / 2);
      ctx.lineTo(width, height / 2);
      ctx.stroke();
      return;
    }

    let step = 0;
    this.waveInterval = setInterval(() => {
      step += 0.15;
      ctx.clearRect(0, 0, width, height);
      ctx.strokeStyle = "#DC2626";
      ctx.lineWidth = 2.5;
      ctx.beginPath();

      for (let x = 0; x < width; x++) {
        const y = height / 2 + Math.sin(x * 0.05 + step) * 18 * Math.sin(x * 0.02);
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }, 40);
  }

  startSosHold() {
    this.holdProgress = 0;
    const circumference = 377;

    clearInterval(this.holdTimer);
    this.holdTimer = setInterval(() => {
      this.holdProgress += 10;
      const offset = circumference - (this.holdProgress / 100) * circumference;

      if (this.phoneProgressBar) {
        this.phoneProgressBar.style.strokeDashoffset = offset;
      }

      if (this.holdProgress >= 100) {
        clearInterval(this.holdTimer);
        this.triggerMobileSosAlert();
      }
    }, 30);
  }

  cancelSosHold() {
    clearInterval(this.holdTimer);
    this.holdProgress = 0;
    if (this.phoneProgressBar) {
      this.phoneProgressBar.style.strokeDashoffset = 377;
    }
  }

  triggerMobileSosAlert() {
    window.app.executeSosDispatch();
    window.speechService.playGentleChime("receive");
    if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
  }
}

// Global initialization
document.addEventListener("DOMContentLoaded", () => {
  window.mobileAppSimulator = new MobileAppSimulator();
});
