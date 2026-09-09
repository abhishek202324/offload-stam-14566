/**
 * Saksham STAM (Stress & Trauma Assessment Module) Mock Data
 * Aligned with Ministry of Social Justice and Empowerment (DoSJE) & NHAA 14566
 * Covers SC/ST (Prevention of Atrocities) Act 1989/2016, SVI Index, Relief Schedules & Support Ecosystem
 */

const MOCK_DATA = {
  // Pre-loaded realistic SC/ST Atrocity & Distress Cases for NHAA 14566 Command Center
  distressCases: [
    {
      id: "NHAA-2026-8812",
      timestamp: "Just now (2 mins ago)",
      timeAgoMinutes: 2,
      category: "Social Boycott & Physical Intimidation (PoA Sec 3(1)(zc))",
      riskLevel: "critical", // critical, high, moderate, low
      sviScore: 94, // Stress Vulnerability Index (0-100)
      status: "Emergency Escalation",
      channel: "Helpline 14566 (IVRS Voice)",
      callerName: "Rameshwar M. (Panchayat Resident)",
      contactNumber: "+91 94140-XXXXX (Masked for Safety)",
      location: "Village Rampur, District Hathras, Uttar Pradesh",
      subIndices: {
        traumaScore: 92,
        fearScore: 98,
        anxietyScore: 88,
        suicideIdeation: 75,
        socialIsolation: 96,
        acousticStressScore: 90
      },
      keywordsDetected: ["social boycott", "water supply stopped", "village panchayat threat", "burning huts", "cannot leave home", "suicide"],
      sentimentTrajectory: [50, 68, 82, 91, 94],
      audioStress: {
        speechRate: "Rapid & Stuttering (170 wpm)",
        hesitationPauses: "6 prolonged pauses (>2.8s)",
        pitchJitter: "Severe Tremor (+48Hz Jitter)",
        backgroundAcoustic: "Aggressive shouting outside door",
        distressAcousticLevel: "Critical (89dB)"
      },
      summary: "Complainant and 14 families from Scheduled Caste community subjected to total social boycott, drinking water access cut off, and death threats following land boundary dispute. Severe acute trauma.",
      transcript: [
        { sender: "Caller", text: "14566 helpline pe madad chahiye... gaon ke dabang logon ne hamari basti ka paani band kar diya hai aur ghar jalane ki dhamki de rahe hain. Hum bahar nahi nikal pa rahe.", urgent: true, time: "22:54:10" },
        { sender: "Saksham AI (STAM)", text: "Rameshwar ji, aap surakshit hain. Aapki baat sun li gayi hai. SVI Index 94 (CRITICAL) detect hua hai. District SP SC/ST Cell aur DM ko turant alert bhej diya gaya hai.", urgent: false, time: "22:54:18" },
        { sender: "Caller", text: "Bachche bhookhe hain, agar kal subah tak madad nahi aayi toh hum sab zeher kha lenge...", urgent: true, time: "22:54:35" },
        { sender: "Saksham AI (STAM)", text: "Kripya himmat rakhein. Tele-MANAS emergency counselor line connect ki ja rahi hai aur Police PCR Van dispatch ho chuki hai.", urgent: false, time: "22:54:42" }
      ],
      poaEntitlements: {
        relevantSection: "Section 3(1)(u), 3(1)(za), 3(1)(zc) SC/ST (PoA) Act",
        entitledCompensation: "₹8,25,000 per affected family + Immediate Ration/Water Relief",
        immediateDisbursement: "₹4,12,500 (50% on FIR Registration)",
        witnessProtection: "Grade-A 24/7 Armed Police Picket at Basti",
        specialCounselor: "Tele-MANAS Trauma Specialist Assigned"
      },
      recommendedAction: "Immediate Armed Police Picket + DM Emergency Relief Order + Tele-MANAS Suicide Prevention Team"
    },
    {
      id: "NHAA-2026-8805",
      timestamp: "18 mins ago",
      timeAgoMinutes: 18,
      category: "Land Alienation, Assault & Caste Abuse (PoA Sec 3(1)(f)(g))",
      riskLevel: "high",
      sviScore: 78,
      status: "In Review (DM / SP Desk)",
      channel: "NHAA Integrated Web Portal",
      callerName: "Kavita Bai (ST Farmer)",
      contactNumber: "+91 98260-XXXXX",
      location: "Block Mandla, District Dindori, Madhya Pradesh",
      subIndices: {
        traumaScore: 80,
        fearScore: 84,
        anxietyScore: 74,
        suicideIdeation: 20,
        socialIsolation: 70,
        acousticStressScore: 72
      },
      keywordsDetected: ["ancestral land seized", "standing crop destroyed", "caste abuse", "threatened with lathis", "police refused fir"],
      sentimentTrajectory: [60, 68, 75, 78, 78],
      audioStress: {
        speechRate: "Slow & Choked (90 wpm)",
        hesitationPauses: "4 hesitation pauses (>2.0s)",
        pitchJitter: "Moderate Jitter (+24Hz)",
        backgroundAcoustic: "Crying in background",
        distressAcousticLevel: "Elevated (64dB)"
      },
      summary: "Tribal woman's patta land forcefully encroached and harvested crop set on fire by influential local landlords. Local police outpost delayed FIR.",
      transcript: [
        { sender: "Complainant", text: "Hamari pushtaini zameen par kabza kar liya aur jati-suchak gaaliyan dekar peeta. Thana incharge FIR darj nahi kar raha.", urgent: true, time: "22:38:15" },
        { sender: "Saksham AI (STAM)", text: "Kavita ji, PoA Act Sec 4 ke tehat FIR darj na karna punishable offence hai. Hamne SP Special Cell ko direct notice trigger kar diya hai.", urgent: false, time: "22:38:22" }
      ],
      poaEntitlements: {
        relevantSection: "Section 3(1)(f), 3(1)(g), 3(1)(r), 3(1)(s) SC/ST (PoA) Act",
        entitledCompensation: "₹4,25,000 for Land Restoration & Crop Loss",
        immediateDisbursement: "₹2,12,500 (50% on FIR)",
        witnessProtection: "Patrol monitoring & Free DLSA Legal Advocate",
        specialCounselor: "District Welfare Rehabilitation Officer"
      },
      recommendedAction: "Mandatory FIR Direction under PoA Sec 4 + ₹2.12L Immediate Relief Processing + Revenue Dept Land Survey"
    },
    {
      id: "NHAA-2026-8798",
      timestamp: "45 mins ago",
      timeAgoMinutes: 45,
      category: "Educational & Institutional Harassment (PoA Sec 3(1)(u))",
      riskLevel: "moderate",
      sviScore: 56,
      status: "Assigned to Counselor",
      channel: "Mobile App Companion",
      callerName: "Suraj K. (PhD Scholar, SC Category)",
      contactNumber: "+91 97110-XXXXX",
      location: "Central University Campus, Hyderabad, Telangana",
      subIndices: {
        traumaScore: 52,
        fearScore: 48,
        anxietyScore: 78,
        suicideIdeation: 42,
        socialIsolation: 65,
        acousticStressScore: 45
      },
      keywordsDetected: ["guide withheld fellowship", "caste discrimination in lab", "mental harassment", "threatened to fail viva", "feeling isolated"],
      sentimentTrajectory: [40, 48, 55, 58, 56],
      audioStress: {
        speechRate: "Normal (125 wpm)",
        hesitationPauses: "2 pauses",
        pitchJitter: "Low (+10Hz)",
        backgroundAcoustic: "Quiet indoor hostel room",
        distressAcousticLevel: "Normal (45dB)"
      },
      summary: "Doctoral research scholar experiencing systemic caste prejudice, fellowship disbursement blocked for 8 months, and threats of academic termination by faculty guide.",
      transcript: [
        { sender: "Student", text: "My research fellowship has been stopped for 8 months and guide openly makes derogatory remarks. I am sinking into severe depression.", urgent: false, time: "22:12:05" },
        { sender: "Saksham AI (STAM)", text: "Suraj, you have statutory protection under UGC Anti-Discrimination Guidelines and PoA Act. Connecting you with university SC/ST Grievance Cell and Tele-MANAS counselor.", urgent: false, time: "22:12:14" }
      ],
      poaEntitlements: {
        relevantSection: "Section 3(1)(p), 3(1)(u) PoA Act & UGC Equal Opportunity Framework",
        entitledCompensation: "₹2,00,000 for Mental Trauma & Fellowship Arrears",
        immediateDisbursement: "₹1,00,000 on Formal Inquiry Initiation",
        witnessProtection: "Guide change & Academic protection committee",
        specialCounselor: "Tele-MANAS Youth Psychologist"
      },
      recommendedAction: "Schedule Tele-MANAS Psychological Counseling + Notice to University Equal Opportunity Cell & DoSJE Observer"
    },
    {
      id: "NHAA-2026-8790",
      timestamp: "1 hour ago",
      timeAgoMinutes: 65,
      category: "Witness Intimidation & Trial Coercion (PoA Sec 15A)",
      riskLevel: "high",
      sviScore: 82,
      status: "Witness Protection Active",
      channel: "Helpline 14566",
      callerName: "Pooja D. (Key Witness)",
      contactNumber: "+91 99201-XXXXX",
      location: "District Court Area, Muzaffarpur, Bihar",
      subIndices: {
        traumaScore: 84,
        fearScore: 92,
        anxietyScore: 80,
        suicideIdeation: 15,
        socialIsolation: 68,
        acousticStressScore: 78
      },
      keywordsDetected: ["witness in atrocity case", "threatened before court testimony", "car followed", "withdraw statement", "scared for family"],
      sentimentTrajectory: [55, 72, 85, 84, 82],
      audioStress: {
        pitchJitter: "High Jitter (+36Hz)",
        hesitationPauses: "5 pauses",
        backgroundAcoustic: "Court complex street noise",
        distressAcousticLevel: "Elevated (74dB)"
      },
      summary: "Eyewitness in a Special PoA Court trial threatened with lethal consequences by accused relatives to turn hostile prior to deposition.",
      transcript: [
        { sender: "Witness", text: "Kal Special Court me meri gawahi hai. Aaj sham 4 log ghar aaye aur bole gawahi di toh parivar nahi bachega.", urgent: true, time: "21:52:10" },
        { sender: "Saksham AI (STAM)", text: "PoA Act Section 15A aur Witness Protection Scheme 2018 ke tahat aapko complete protection ka adhikar hai. Special Public Prosecutor aur SP ko emergency alert bheja gaya.", urgent: true, time: "21:52:18" }
      ],
      poaEntitlements: {
        relevantSection: "Section 15A SC/ST (PoA) Act (Witness Protection) & IPC/BNS Sec 195A",
        entitledCompensation: "Travel & Daily Maintenance Allowance + Security Escort",
        immediateDisbursement: "Immediate Safe House Accommodation",
        witnessProtection: "Armed Security Guard + In-Camera Trial Request",
        specialCounselor: "Victim-Witness Support Officer"
      },
      recommendedAction: "Immediate Armed Escort for Court Appearance + Application for In-Camera Video Conferencing Deposition"
    },
    {
      id: "NHAA-2026-8782",
      timestamp: "3 hours ago",
      timeAgoMinutes: 190,
      category: "Welfare Scheme Denial & Procedural Grievance",
      riskLevel: "low",
      sviScore: 28,
      status: "Resolved",
      channel: "Integrated Web Portal",
      callerName: "Mahesh T.",
      contactNumber: "+91 94441-XXXXX",
      location: "District Balasore, Odisha",
      subIndices: {
        traumaScore: 22,
        fearScore: 18,
        anxietyScore: 35,
        suicideIdeation: 0,
        socialIsolation: 20,
        acousticStressScore: 25
      },
      keywordsDetected: ["post matric scholarship delay", "hostel allowance", "bank account validation"],
      sentimentTrajectory: [25, 28, 28, 26, 28],
      audioStress: {
        pitchJitter: "Normal (+4Hz)",
        hesitationPauses: "0 pauses",
        backgroundAcoustic: "Quiet",
        distressAcousticLevel: "Normal (38dB)"
      },
      summary: "Inquiry regarding status of Post-Matric Scholarship for SC Students disbursement under DoSJE DBT portal.",
      transcript: [
        { sender: "Complainant", text: "Post matric scholarship ka DBT verification pending dikha raha hai.", urgent: false, time: "20:05:30" },
        { sender: "Saksham AI (STAM)", text: "Aapka PFMS token verified ho gaya hai. 7 working days me account me credit ho jayega.", urgent: false, time: "20:05:35" }
      ],
      poaEntitlements: {
        relevantSection: "DoSJE Centrally Sponsored Scholarship Scheme",
        entitledCompensation: "Full Tuition + Maintenance Allowance Disbursed",
        immediateDisbursement: "Direct Bank Transfer (DBT)",
        witnessProtection: "N/A",
        specialCounselor: "District Welfare Officer Helpdesk"
      },
      recommendedAction: "DBT Portal Ticket Generated #SCH-2026-9014 - Resolved"
    }
  ],

  // Statutory Compensation Schedule under SC/ST (PoA) Rules 2016 (Schedule Annexure-I)
  poaReliefSchedule: [
    {
      offenceType: "Murder / Death of SC/ST Family Member (PoA Sec 3(2)(v))",
      totalRelief: "₹8,50,000",
      stage1: "₹4,25,000 (50% on FIR Registration & Post-Mortem)",
      stage2: "₹4,25,000 (50% on Chargesheet in Special Court)",
      additionalRelief: "Pension of ₹5,000/month to widow/dependent + Government employment or agricultural land + Free education for children up to graduation."
    },
    {
      offenceType: "Rape / Gang Rape (PoA Sec 3(2)(v) & IPC/BNS)",
      totalRelief: "₹8,25,000",
      stage1: "₹4,12,500 (50% on Medical Examination & FIR)",
      stage2: "₹4,12,500 (50% on Chargesheet Filing)",
      additionalRelief: "Full medical treatment expenses + Trauma psychological therapy + Safe shelter stay."
    },
    {
      offenceType: "Social Boycott & Economic Blockade (PoA Sec 3(1)(zc))",
      totalRelief: "₹8,25,000",
      stage1: "₹4,12,500 (50% after spot inspection by DM/SP)",
      stage2: "₹4,12,500 (50% on Chargesheet Filing)",
      additionalRelief: "Immediate supply of essential water, food, and daily necessities by District Administration + Armed police protection."
    },
    {
      offenceType: "Wrongful Occupation / Dispossession of Land (PoA Sec 3(1)(f)(g))",
      totalRelief: "₹4,25,000",
      stage1: "₹2,12,500 (50% on FIR & Revenue Demarcation)",
      stage2: "₹2,12,500 (50% on Charge-sheet Filing)",
      additionalRelief: "Immediate physical restoration of possession with police assistance at state cost."
    },
    {
      offenceType: "Casteist Abuse, Humiliation & Assault (PoA Sec 3(1)(r)(s))",
      totalRelief: "₹1,00,000 - ₹2,00,000",
      stage1: "₹1,00,000 (50% on FIR Registration)",
      stage2: "Balance on Charge-sheet in Special Court",
      additionalRelief: "Free legal representation by Special Public Prosecutor + Daily conveyance and dietary allowance."
    }
  ],

  // Specialized Stakeholder Support & Crisis Network (DoSJE, NHAA, Tele-MANAS, Special Courts)
  supportEcosystem: [
    {
      name: "NHAA 14566 National Command Center",
      type: "National Helpline Against Atrocities",
      city: "New Delhi (National 24/7)",
      address: "Ministry of Social Justice and Empowerment, Shastri Bhawan, New Delhi 110001",
      phone: "14566 (Toll-Free 24x7)",
      services: ["Real-time SVI Trauma Triage", "Direct SP/DM Escalation", "Inter-State Emergency Coordination", "Victim Compensation Tracking"],
      distance: "Primary National Gateway",
      rating: "5.0 ★ (Ministry Central Desk)"
    },
    {
      name: "Tele-MANAS (NIMHANS Trauma Psychological Network)",
      type: "Mental Health & Suicide Prevention Cell",
      city: "National (Integrated with 14566)",
      address: "National Tele Mental Health Programme of India",
      phone: "14416 / 1800-891-4416",
      services: ["Trauma-Informed Psychological First-Aid", "Suicide Prevention Intervention", "Post-Atrocity PTSD Counseling", "Multi-lingual Dialect Support"],
      distance: "Instant Telephonic Linkage",
      rating: "5.0 ★ (Ministry of Health & DoSJE)"
    },
    {
      name: "Special SC/ST Protection Cell & PCR Emergency Unit",
      type: "Law Enforcement & Protection Unit",
      city: "District Headquarters",
      address: "Office of the Superintendent of Police (SP SC/ST Cell)",
      phone: "112 / 1090 / 14566",
      services: ["Armed Witness Protection Escorts", "Zero FIR Enforcement under PoA Sec 4", "Spot Inspection within 24h", "Investigation by DSP Rank Officer"],
      distance: "2.4 km away (Local Jurisdiction)",
      rating: "4.9 ★ (Statutory Enforcement)"
    },
    {
      name: "District Legal Services Authority (DLSA / NALSA)",
      type: "Free Legal Aid & Special Court Defense",
      city: "District Court Complex",
      address: "Legal Aid Clinic, District Sessions & Special PoA Court",
      phone: "15100 / 14566",
      services: ["100% Free Senior Legal Counsel", "Witness Protection Scheme 2018 Filing", "PoA Relief Application Advocacy", "Appeals to High Court"],
      distance: "3.1 km away",
      rating: "4.8 ★ (Statutory Free Legal Aid)"
    }
  ]
};

// Global assignment
window.MOCK_DATA = MOCK_DATA;
