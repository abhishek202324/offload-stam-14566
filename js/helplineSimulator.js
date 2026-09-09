/**
 * Saksham Helpline 14566 Simulator
 * Virtual emergency voice dialer with AI IVR interaction, live transcript, and speech synthesis
 */

class HelplineSimulator {
  constructor() {
    this.callActive = false;
    this.timerInterval = null;
    this.seconds = 0;

    this.modal = document.getElementById("helplineModal");
    this.timerEl = document.getElementById("callTimer");
    this.transcriptEl = document.getElementById("callTranscript");
    this.btnEndCall = document.getElementById("btnEndCall");
    this.btnCloseCallModal = document.getElementById("btnCloseCallModal");

    this.bindEvents();
  }

  bindEvents() {
    // Open helpline triggers
    document.querySelectorAll(".trigger-helpline").forEach(btn => {
      btn.addEventListener("click", () => this.startCall());
    });

    if (this.btnEndCall) {
      this.btnEndCall.addEventListener("click", () => this.endCall());
    }

    if (this.btnCloseCallModal) {
      this.btnCloseCallModal.addEventListener("click", () => this.endCall());
    }
  }

  startCall() {
    if (!this.modal) return;

    this.callActive = true;
    this.seconds = 0;
    this.modal.classList.add("active");

    if (this.timerEl) this.timerEl.textContent = "Connecting to 14566...";
    if (this.transcriptEl) this.transcriptEl.innerHTML = `<em>Establishing encrypted voice channel...</em>`;

    // Simulate connection after 1.2s
    setTimeout(() => {
      if (!this.callActive) return;
      this.startTimer();
      const greeting = "Namaste. You have reached Saksham National Helpline 14566. You are in a completely safe space. Please tell me what help you need.";
      
      if (this.transcriptEl) {
        this.transcriptEl.innerHTML = `
          <div style="color:#7C5CE9; margin-bottom:6px;"><strong>[14566 Saksham AI IVR]:</strong> ${greeting}</div>
          <div style="color:#2ECC71; font-size:0.75rem;">🔴 Mic Active: Speak now to communicate...</div>
        `;
      }

      window.speechService.speak(greeting);

      // Start speech recognition
      window.speechService.startListening(
        (transcript) => {
          if (!this.callActive) return;
          const analysis = window.sakshamAI.analyzeDistress(transcript);

          const userEntry = document.createElement("div");
          userEntry.style.cssText = "color:#FFFFFF; margin-top:8px;";
          userEntry.innerHTML = `<strong>[Caller]:</strong> ${transcript}`;
          this.transcriptEl.appendChild(userEntry);

          const response = window.sakshamAI.generateResponse(transcript);
          setTimeout(() => {
            if (!this.callActive) return;
            const ivrEntry = document.createElement("div");
            ivrEntry.style.cssText = "color:#7C5CE9; margin-top:8px;";
            ivrEntry.innerHTML = `<strong>[14566 Saksham AI IVR]:</strong> ${response.text.replace(/\n/g, '<br>')}`;
            this.transcriptEl.appendChild(ivrEntry);
            this.transcriptEl.scrollTop = this.transcriptEl.scrollHeight;

            window.speechService.speak(response.text);
          }, 800);
        },
        null,
        (err) => console.log("Helpline speech error:", err)
      );
    }, 1200);
  }

  startTimer() {
    clearInterval(this.timerInterval);
    this.timerInterval = setInterval(() => {
      this.seconds++;
      const mins = String(Math.floor(this.seconds / 60)).padStart(2, '0');
      const secs = String(this.seconds % 60).padStart(2, '0');
      if (this.timerEl) this.timerEl.textContent = `${mins}:${secs}`;
    }, 1000);
  }

  endCall() {
    this.callActive = false;
    clearInterval(this.timerInterval);
    window.speechService.stopSpeaking();
    window.speechService.stopListening();

    if (this.modal) this.modal.classList.remove("active");
    window.app.showToast("Helpline call ended. Session transcript securely cleared.", "info");
  }
}

// Global instance
window.helplineSimulator = new HelplineSimulator();
