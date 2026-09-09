/**
 * Saksham STAM Command Dashboard - NHAA 14566
 * Real-time Stress Vulnerability Index (SVI), PoA Act Relief Calculator, Tele-MANAS Referral, and Witness Protection
 */

class CaseworkerDashboard {
  constructor() {
    this.selectedCaseId = "NHAA-2026-8812"; // Default selected
    this.activeFilter = "all";

    this.initElements();
    this.bindEvents();
    this.renderStats();
    this.renderQueue();
    this.renderSelectedCase();
    this.drawAnalyticsCharts();
  }

  initElements() {
    this.queueContainer = document.getElementById("caseworkerQueueList");
    this.statCritical = document.getElementById("statCriticalCount");
    this.statActive = document.getElementById("statActiveCount");
    this.statResolved = document.getElementById("statResolvedCount");
    this.statAvgTime = document.getElementById("statAvgTime");
    
    // Inspector elements
    this.inspCaseId = document.getElementById("inspCaseId");
    this.inspRiskBadge = document.getElementById("inspRiskBadge");
    this.inspCategory = document.getElementById("inspCategory");
    this.inspCallerName = document.getElementById("inspCallerName");
    this.inspContact = document.getElementById("inspContact");
    this.inspLocation = document.getElementById("inspLocation");
    
    // Sub-indices
    this.inspTraumaVal = document.getElementById("inspTraumaVal");
    this.inspTraumaBar = document.getElementById("inspTraumaBar");
    this.inspFearVal = document.getElementById("inspFearVal");
    this.inspFearBar = document.getElementById("inspFearBar");
    this.inspAnxietyVal = document.getElementById("inspAnxietyVal");
    this.inspAnxietyBar = document.getElementById("inspAnxietyBar");
    this.inspSuicideVal = document.getElementById("inspSuicideVal");
    this.inspSuicideBar = document.getElementById("inspSuicideBar");
    this.inspIsolationVal = document.getElementById("inspIsolationVal");
    this.inspIsolationBar = document.getElementById("inspIsolationBar");

    this.inspKeywords = document.getElementById("inspKeywords");
    this.inspTranscript = document.getElementById("inspTranscript");
    this.inspSummary = document.getElementById("inspSummary");
    this.inspAudioPitch = document.getElementById("inspAudioPitch");
    this.inspAudioTremor = document.getElementById("inspAudioTremor");
    this.inspAudioNoise = document.getElementById("inspAudioNoise");

    // Action buttons
    this.btnDispatchPcr = document.getElementById("btnDispatchPcr");
    this.btnDispatchSakhi = document.getElementById("btnDispatchSakhi");
    this.btnGenerateFir = document.getElementById("btnGenerateFir");
    this.btnPoaRelief = document.getElementById("btnPoaRelief");
    this.btnTeleManas = document.getElementById("btnTeleManas");
  }

  bindEvents() {
    // Filter buttons
    document.querySelectorAll(".filter-chip-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        document.querySelectorAll(".filter-chip-btn").forEach(b => b.classList.remove("active"));
        const target = e.currentTarget;
        target.classList.add("active");
        this.activeFilter = target.getAttribute("data-filter");
        this.renderQueue();
      });
    });

    // Action Dispatches
    if (this.btnDispatchPcr) {
      this.btnDispatchPcr.addEventListener("click", () => {
        const c = this.getSelectedCase();
        if (!c) return;
        c.status = "Armed Escort Active";
        window.app.showToast(`🚨 SP SC/ST Cell & Armed Police Picket dispatched to ${c.location}!`, "danger");
        this.renderQueue();
        this.renderSelectedCase();
      });
    }

    if (this.btnDispatchSakhi) {
      this.btnDispatchSakhi.addEventListener("click", () => {
        const c = this.getSelectedCase();
        if (!c) return;
        c.status = "Tele-MANAS Connected";
        window.app.showToast(`🏥 Tele-MANAS (14416) Crisis Psychologist assigned to Case ${c.id}`, "success");
        this.renderQueue();
        this.renderSelectedCase();
      });
    }

    if (this.btnGenerateFir) {
      this.btnGenerateFir.addEventListener("click", () => {
        this.openFirModal();
      });
    }

    if (this.btnPoaRelief) {
      this.btnPoaRelief.addEventListener("click", () => {
        this.openPoaReliefModal();
      });
    }
  }

  getSelectedCase() {
    return window.MOCK_DATA.distressCases.find(c => c.id === this.selectedCaseId) || window.MOCK_DATA.distressCases[0];
  }

  renderStats() {
    const cases = window.MOCK_DATA.distressCases;
    const criticalCount = cases.filter(c => c.riskLevel === "critical").length;
    const activeCount = cases.filter(c => c.status !== "Resolved").length;
    const resolvedCount = cases.filter(c => c.status === "Resolved").length;

    if (this.statCritical) this.statCritical.textContent = criticalCount;
    if (this.statActive) this.statActive.textContent = activeCount;
    if (this.statResolved) this.statResolved.textContent = resolvedCount;
    if (this.statAvgTime) this.statAvgTime.textContent = "1.4 mins";
  }

  renderQueue() {
    if (!this.queueContainer) return;

    let cases = window.MOCK_DATA.distressCases;
    if (this.activeFilter !== "all") {
      cases = cases.filter(c => c.riskLevel === this.activeFilter || (this.activeFilter === "resolved" && c.status === "Resolved"));
    }

    this.queueContainer.innerHTML = "";

    cases.forEach(item => {
      const card = document.createElement("div");
      card.className = `case-item-card ${item.id === this.selectedCaseId ? "selected" : ""}`;
      card.setAttribute("data-id", item.id);

      const score = item.sviScore || item.distressScore || 50;

      card.innerHTML = `
        <div class="case-card-top">
          <span class="case-id-tag">#${item.id}</span>
          <span class="badge-risk ${item.riskLevel}">${item.riskLevel.toUpperCase()}</span>
        </div>
        <div class="case-card-middle">
          <span class="case-category-label">${item.category}</span>
          <span class="case-distress-score" style="color: ${score > 80 ? '#DC2626' : score > 60 ? '#EA580C' : '#10B981'}">
            ⚡ SVI: <span class="score-num">${score}</span>/100
          </span>
        </div>
        <div class="case-snippet">${item.summary}</div>
        <div class="case-card-footer">
          <span class="case-channel-tag">📡 ${item.channel}</span>
          <span>⏱️ ${item.timestamp}</span>
        </div>
      `;

      card.addEventListener("click", () => {
        this.selectedCaseId = item.id;
        document.querySelectorAll(".case-item-card").forEach(c => c.classList.remove("selected"));
        card.classList.add("selected");
        this.renderSelectedCase();
      });

      this.queueContainer.appendChild(card);
    });
  }

  renderSelectedCase() {
    const c = this.getSelectedCase();
    if (!c) return;

    const score = c.sviScore || c.distressScore || 50;

    if (this.inspCaseId) this.inspCaseId.textContent = `Case #${c.id}`;
    if (this.inspRiskBadge) {
      this.inspRiskBadge.className = `badge-risk ${c.riskLevel}`;
      this.inspRiskBadge.textContent = `SVI: ${score} - ${c.riskLevel.toUpperCase()}`;
    }
    if (this.inspCategory) this.inspCategory.textContent = c.category;
    if (this.inspCallerName) this.inspCallerName.textContent = c.callerName;
    if (this.inspContact) this.inspContact.textContent = c.contactNumber;
    if (this.inspLocation) this.inspLocation.textContent = c.location;

    // Sub-indices
    const subs = c.subIndices || { traumaScore: 80, fearScore: 85, anxietyScore: 75, suicideIdeation: 20, socialIsolation: 70 };
    
    if (this.inspTraumaVal) this.inspTraumaVal.textContent = `${subs.traumaScore}%`;
    if (this.inspTraumaBar) this.inspTraumaBar.style.width = `${subs.traumaScore}%`;

    if (this.inspFearVal) this.inspFearVal.textContent = `${subs.fearScore}%`;
    if (this.inspFearBar) this.inspFearBar.style.width = `${subs.fearScore}%`;

    if (this.inspAnxietyVal) this.inspAnxietyVal.textContent = `${subs.anxietyScore}%`;
    if (this.inspAnxietyBar) this.inspAnxietyBar.style.width = `${subs.anxietyScore}%`;

    if (this.inspSuicideVal) this.inspSuicideVal.textContent = `${subs.suicideIdeation}%`;
    if (this.inspSuicideBar) {
      this.inspSuicideBar.style.width = `${subs.suicideIdeation}%`;
      this.inspSuicideBar.style.background = subs.suicideIdeation > 50 ? "#DC2626" : "#10B981";
    }

    if (this.inspIsolationVal) this.inspIsolationVal.textContent = `${subs.socialIsolation}%`;
    if (this.inspIsolationBar) this.inspIsolationBar.style.width = `${subs.socialIsolation}%`;

    // Trigger Keywords
    if (this.inspKeywords) {
      this.inspKeywords.innerHTML = "";
      if (c.keywordsDetected && c.keywordsDetected.length > 0) {
        c.keywordsDetected.forEach(kw => {
          const span = document.createElement("span");
          span.className = "keyword-tag";
          span.innerHTML = `⚠️ ${kw}`;
          this.inspKeywords.appendChild(span);
        });
      } else {
        this.inspKeywords.innerHTML = `<span style="font-size:0.75rem; color:var(--text-muted);">No acute triggers</span>`;
      }
    }

    // Summary
    if (this.inspSummary) this.inspSummary.textContent = c.summary;

    // Audio Stress Parameters
    if (this.inspAudioPitch) this.inspAudioPitch.textContent = c.audioStress.pitchJitter || c.audioStress.pitchVariance || "Standard";
    if (this.inspAudioTremor) this.inspAudioTremor.textContent = c.audioStress.hesitationPauses || "Normal";
    if (this.inspAudioNoise) this.inspAudioNoise.textContent = c.audioStress.backgroundAcoustic || c.audioStress.backgroundNoise || "Ambient";

    // Transcript
    if (this.inspTranscript) {
      this.inspTranscript.innerHTML = "";
      c.transcript.forEach(t => {
        const div = document.createElement("div");
        div.className = `transcript-entry ${t.urgent ? 'urgent' : ''}`;
        div.innerHTML = `
          <div style="display:flex; justify-content:space-between; margin-bottom:2px;">
            <strong style="color:var(--navy-deep); font-size:0.78rem;">${t.sender}</strong>
            <small style="color:var(--text-muted); font-size:0.7rem;">${t.time}</small>
          </div>
          <div>${t.text}</div>
        `;
        this.inspTranscript.appendChild(div);
      });
    }

    // Trajectory graph
    this.drawTrajectoryCanvas(c.sentimentTrajectory);
  }

  drawTrajectoryCanvas(dataPoints) {
    const canvas = document.getElementById("trajectoryCanvas");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const width = canvas.width = canvas.parentElement.clientWidth || 300;
    const height = canvas.height = 100;

    ctx.clearRect(0, 0, width, height);

    ctx.strokeStyle = "rgba(124, 92, 233, 0.1)";
    ctx.lineWidth = 1;
    for (let y = 20; y < height; y += 25) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    if (!dataPoints || dataPoints.length < 2) return;

    const stepX = width / (dataPoints.length - 1);
    ctx.beginPath();
    ctx.lineWidth = 3;
    ctx.strokeStyle = "#7C5CE9";

    const coords = [];
    dataPoints.forEach((val, index) => {
      const x = index * stepX;
      const y = height - (val / 100) * (height - 20) - 10;
      coords.push({ x, y, val });
      if (index === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();

    ctx.lineTo(width, height);
    ctx.lineTo(0, height);
    ctx.closePath();
    const grad = ctx.createLinearGradient(0, 0, 0, height);
    grad.addColorStop(0, "rgba(124, 92, 233, 0.2)");
    grad.addColorStop(1, "rgba(124, 92, 233, 0.0)");
    ctx.fillStyle = grad;
    ctx.fill();

    coords.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
      ctx.fillStyle = p.val > 75 ? "#DC2626" : "#7C5CE9";
      ctx.fill();
      ctx.strokeStyle = "#FFFFFF";
      ctx.lineWidth = 1.5;
      ctx.stroke();
    });
  }

  drawAnalyticsCharts() {
    const c1 = document.getElementById("analyticsDistressChart");
    if (c1) {
      const ctx = c1.getContext("2d");
      const w = c1.width = c1.parentElement.clientWidth - 40 || 400;
      const h = c1.height = 180;
      ctx.clearRect(0, 0, w, h);

      const hours = ["12 PM", "2 PM", "4 PM", "6 PM", "8 PM", "10 PM", "Now"];
      const vals = [18, 28, 24, 42, 60, 72, 84];
      const step = (w - 60) / (vals.length - 1);

      vals.forEach((v, i) => {
        const x = 40 + i * step;
        const barH = (v / 90) * (h - 50);
        const y = h - barH - 25;

        const barGrad = ctx.createLinearGradient(0, y, 0, h - 25);
        barGrad.addColorStop(0, "#141038");
        barGrad.addColorStop(1, "#7C5CE9");

        ctx.fillStyle = barGrad;
        ctx.beginPath();
        ctx.roundRect(x - 12, y, 24, barH, [6, 6, 0, 0]);
        ctx.fill();

        ctx.fillStyle = "#645F88";
        ctx.font = "10px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(hours[i], x, h - 10);
        ctx.fillText(v, x, y - 5);
      });
    }

    const c2 = document.getElementById("analyticsCategoryChart");
    if (c2) {
      const ctx = c2.getContext("2d");
      const w = c2.width = c2.parentElement.clientWidth - 40 || 400;
      const h = c2.height = 180;
      ctx.clearRect(0, 0, w, h);

      const categories = [
        { label: "Social Boycott & Water", pct: 36, color: "#DC2626" },
        { label: "Land Alienation / Assault", pct: 28, color: "#EA580C" },
        { label: "Witness Intimidation", pct: 18, color: "#7C5CE9" },
        { label: "Institutional Harassment", pct: 12, color: "#3B82F6" },
        { label: "Procedural / Scholarship", pct: 6, color: "#10B981" }
      ];

      let currentY = 20;
      categories.forEach(item => {
        ctx.fillStyle = "#1F1B3B";
        ctx.font = "11px sans-serif";
        ctx.textAlign = "left";
        ctx.fillText(item.label, 20, currentY + 12);

        ctx.fillStyle = "#EBE4DA";
        ctx.beginPath();
        ctx.roundRect(160, currentY, w - 230, 14, 7);
        ctx.fill();

        ctx.fillStyle = item.color;
        const fillW = ((w - 230) * item.pct) / 100;
        ctx.beginPath();
        ctx.roundRect(160, currentY, fillW, 14, 7);
        ctx.fill();

        ctx.fillStyle = "#1F1B3B";
        ctx.font = "bold 11px sans-serif";
        ctx.textAlign = "right";
        ctx.fillText(`${item.pct}%`, w - 20, currentY + 12);

        currentY += 30;
      });
    }
  }

  openPoaReliefModal() {
    const c = this.getSelectedCase();
    const modal = document.getElementById("firModal");
    const content = document.getElementById("firModalContent");
    if (!modal || !content) return;

    const poa = c.poaEntitlements || {
      relevantSection: "Section 3(1) SC/ST (Prevention of Atrocities) Act",
      entitledCompensation: "₹8,25,000 Total Statutory Relief",
      immediateDisbursement: "₹4,12,500 (50% Immediate on FIR)",
      witnessProtection: "Grade-A 24/7 Armed Guard Escort",
      specialCounselor: "Tele-MANAS Trauma Specialist"
    };

    content.innerHTML = `
      <div style="border: 2px solid #141038; padding: 22px; border-radius: 12px; font-family: -apple-system, BlinkMacSystemFont, sans-serif;">
        <div style="text-align: center; border-bottom: 2px solid #141038; padding-bottom: 10px; margin-bottom: 16px;">
          <h2 style="font-size: 1.25rem; margin:0; color:#141038;">SC/ST (PoA) ACT STATUTORY RELIEF & COMPENSATION MEMO</h2>
          <p style="font-size: 0.82rem; color: #555; margin: 4px 0 0 0;">Under Schedule Annexure-I of Scheduled Castes and Scheduled Tribes (Prevention of Atrocities) Rules 2016</p>
          <p style="font-weight: bold; margin-top: 4px; color: #7C5CE9;">NHAA 14566 Triage Reference: #${c.id}</p>
        </div>

        <div style="background:#FAF8F5; border:1px solid #EBE4DA; padding:12px; border-radius:8px; margin-bottom:14px; font-size:0.85rem;">
          <div><strong>Victim/Complainant:</strong> ${c.callerName}</div>
          <div><strong>District & State:</strong> ${c.location}</div>
          <div><strong>Stress Vulnerability Index (SVI):</strong> <span style="color:#DC2626; font-weight:bold;">${c.sviScore || 94}/100 (${c.riskLevel.toUpperCase()})</span></div>
          <div><strong>Applicable Sections:</strong> ${poa.relevantSection}</div>
        </div>

        <table style="width:100%; font-size:0.83rem; border-collapse:collapse; margin-bottom:14px;">
          <tr style="background:#141038; color:white;">
            <th style="padding:6px; text-align:left;">Relief Stage</th>
            <th style="padding:6px; text-align:left;">Entitled Amount</th>
            <th style="padding:6px; text-align:left;">Trigger Event</th>
          </tr>
          <tr style="border-bottom:1px solid #DDD;">
            <td style="padding:6px;"><strong>Stage 1 (Immediate Advance)</strong></td>
            <td style="padding:6px; color:#15803D; font-weight:bold;">${poa.immediateDisbursement}</td>
            <td style="padding:6px;">Upon FIR Registration & Spot Verification</td>
          </tr>
          <tr style="border-bottom:1px solid #DDD;">
            <td style="padding:6px;"><strong>Stage 2 (Final Relief)</strong></td>
            <td style="padding:6px; color:#15803D; font-weight:bold;">Balance Amount (Total ${poa.entitledCompensation})</td>
            <td style="padding:6px;">Upon Charge-sheet filing in Special PoA Court</td>
          </tr>
        </table>

        <div style="background:#FFF5F5; border-left:4px solid #DC2626; padding:10px; font-size:0.8rem; margin-bottom:14px;">
          <strong>🛡️ Mandatory Witness Protection (Sec 15A PoA Act):</strong><br>
          ${poa.witnessProtection}. Immediate provision for safe house relocation, round-the-clock armed security, and travel allowance for court hearing.
        </div>

        <div style="background:#EEFAF4; border-left:4px solid #10B981; padding:10px; font-size:0.8rem;">
          <strong>🏥 Psychological Rehabilitation:</strong> Assigned to Tele-MANAS (14416) District Mental Health Unit for weekly trauma recovery sessions.
        </div>
      </div>
    `;

    modal.classList.add("active");
  }

  openFirModal() {
    const c = this.getSelectedCase();
    const modal = document.getElementById("firModal");
    const content = document.getElementById("firModalContent");
    if (!modal || !content) return;

    content.innerHTML = `
      <div style="border: 2px solid #141038; padding: 22px; border-radius: 12px; font-family: -apple-system, BlinkMacSystemFont, sans-serif;">
        <div style="text-align: center; border-bottom: 2px solid #141038; padding-bottom: 10px; margin-bottom: 14px;">
          <h2 style="font-size: 1.2rem; margin:0; color:#141038;">FIRST INFORMATION REPORT (MANDATORY DIRECTION MEMO)</h2>
          <p style="font-size: 0.8rem; color: #555; margin: 4px 0 0 0;">Under Section 4 & Section 154 Cr.P.C. / Section 173 BNSS & SC/ST (PoA) Act</p>
          <p style="font-weight: bold; margin-top: 4px; color: #7C5CE9;">NHAA 14566 STAM Triage ID: #${c.id}</p>
        </div>

        <div style="font-size:0.83rem; line-height:1.6; margin-bottom:14px;">
          <strong>To:</strong> Superintendent of Police & In-charge, SC/ST Protection Cell<br>
          <strong>Jurisdiction:</strong> ${c.location}<br>
          <strong>Complainant:</strong> ${c.callerName}<br>
          <strong>Atrocity Category:</strong> <span style="color:#DC2626; font-weight:bold;">${c.category}</span><br>
          <strong>Stress Vulnerability Index (SVI):</strong> <strong>${c.sviScore || 94}/100</strong> (CRITICAL RISK)
        </div>

        <div style="background:#F8F9FA; padding:10px; border-radius:6px; font-size:0.82rem; margin-bottom:12px;">
          <strong>Narrative Brief:</strong><br>
          ${c.summary}
        </div>

        <div style="background:#FFF5F5; border-left:3px solid #DC2626; padding:8px; font-size:0.78rem; margin-bottom:14px;">
          <strong>Statutory Warning under PoA Sec 4:</strong> Any willful neglect of duties by a public servant in registering this FIR or conducting spot inspection attracts mandatory prosecution under Section 4 of the PoA Act.
        </div>
      </div>
    `;

    modal.classList.add("active");
  }
}

// Global instance
window.caseworkerDashboard = new CaseworkerDashboard();
