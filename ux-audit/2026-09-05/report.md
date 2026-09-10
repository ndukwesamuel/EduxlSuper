# UX Audit — 2026-09-05

**App:** EduXL (package `com.samheart.eduxl`), Android
**Persona:** Nigerian university graduate, first time using the app, preparing for an SHL/Dragnet-style graduate aptitude test
**Method:** Maestro-driven flows on an Android emulator (Pixel_10), screenshots reviewed visually after every meaningful screen transition. Flow files live in `./flows/`; screenshots in `./screenshots/`.

**Testing note:** Several interactive elements (tab bar items, "Next Question →", "Finish →") could only be reached reliably via exact-bounds taps or regex text matching that accounted for a trailing arrow character or icon. This suggests these controls may not have explicit `testID`/accessibility identifiers — worth adding for future automated testing, independent of the UX findings below.

---

## Flow: First launch / onboarding

### Screen: Landing / auth screen (screenshot: 01_first_launch_landing.png)
- **What a first-time student sees:** App name and tagline, a rotating hero headline (varies between app opens — observed "Your notes. Your coach. Your results.", "Study smarter. Score higher.", "From notes to exam-ready fast.", "Exam coming. Not ready?"), a social-proof line ("Join 30+ students studying smarter 🇳🇬"), and a Sign In / Create Account tab control defaulting to Sign In.
- **What they'd likely try next:** Tap "Create Account" (or the "Create a free account" link below the Sign In form) since this is their first time.
- **Friction found:** None — the app skips a forced onboarding carousel and goes straight to a real choice, which is good for a fast first impression.
- **Heuristic(s) violated:** None on this screen. (Minor stylistic note: the rotating headline changing on every app open is a small consistency wrinkle, not a real problem.)

---

## Flow: Sign up / account creation

### Screen: Create Account form (screenshot: 02_signup_form_v3.png)
- **What a first-time student sees:** Full Name, Email Address, and Password fields, plus a "Forgot password?" link still showing even though this is the sign-up tab, not sign-in.
- **What they'd likely try next:** Fill in their details and tap "Create Account →".
- **Friction found:** Minor — the leftover "Forgot password?" link makes no sense on a sign-up form and could momentarily confuse a first-time user ("do I already have a password?").
- **Heuristic(s) violated:** Consistency and standards; Error prevention (an affordance is shown that doesn't apply in this context).

### Screen: Form filled and submitted (screenshot: 02_signup_filled_v2.png, 03_signup_submitted_v2.png)
- **What a first-time student sees:** Name/email/password entered correctly; tapping "Create Account →" shows a spinner directly on the button while the request is in flight.
- **What they'd likely try next:** Wait for the result.
- **Friction found:** None — clear, standard loading feedback.
- **Heuristic(s) violated:** None. (Positive: good visibility of system status.)

### Screen: Persona selection modal (screenshot: 03_signup_result.png, 04_persona_selected.png)
- **What a first-time student sees:** Immediately after signup, the app auto-logs them in and shows a modal: "What describes you?" with two options — "I'm a University Student" and "I'm a Graduate / Professional" — each with a one-line description, before a "Continue →" button.
- **What they'd likely try next:** Pick the option matching their situation (a graduate prepping for an aptitude test would pick "Graduate / Professional").
- **Friction found:** None — clear, relatable language, no jargon, and it's immediately obvious which option fits.
- **Heuristic(s) violated:** None. (Positive: strong match with real-world language.)

### Screen: Home reached (screenshot: 05_after_persona_continue.png)
- **What a first-time student sees:** A personalized greeting ("Good morning, Ngozi"), a streak/XP card at 0, a short feature pitch ("Know what to study today", "Track weak spots early", "Notes → videos & audio"), and a bottom tab bar: Home / LearnPad / Graduate / Profile.
- **What they'd likely try next:** Look for how to start practicing.
- **Friction found:** None on this screen itself, though the tab labels set up the confusion in the next flow (see below).
- **Heuristic(s) violated:** None here — carried forward into Flow 3.

**Overall for this flow:** Signup → auto-login → light persona onboarding → home is fast and low-friction. No email verification step, no forced tutorial. This is a strength worth preserving.

---

## Flow: Start a drill / practice session

### Screen: Tapped "LearnPad" first (screenshot: 07_learnpad_loaded.png)
- **What a first-time student sees:** A "My Courses" screen, empty state ("No courses yet — Create a course, add your questions from ChatGPT or any AI tool, and start drilling"), with **four** different ways to add content on one screen: a "+" icon in the header, a "Create your first course" button, a "Generate Quiz" button inside an "AI Quiz Generator" box, and a second floating blue "+" button in the bottom-right corner.
- **What they'd likely try next:** Given the persona's goal (practice an SHL/Dragnet-style test, not upload personal notes), they'd likely back out and look elsewhere — which is exactly what happened during testing. This was the wrong tab for the goal.
- **Friction found:** Moderate. (a) The tab label "LearnPad" gives no hint that this is for uploading your *own* material rather than practicing existing question banks — a first-time user preparing for a known aptitude-test format has no signal to skip it. (b) Once on the screen, four overlapping "add content" calls-to-action compete for attention with no visible distinction in purpose.
- **Heuristic(s) violated:** Recognition over recall / Discoverability (wrong tab, no signal); Aesthetic and minimalist design, Consistency (redundant CTAs).

### Screen: Graduate tab → Company Prep Tracks (screenshot: 08_graduate_tab.png)
- **What a first-time student sees:** "Company Prep Tracks" — "Company-specific test simulations — exact formats, difficulty, and context used by each employer's screening platform," with two live tracks: "Banking Exams" (639+ Qs) and "Access Bank" (6 stages).
- **What they'd likely try next:** Tap "Start" on Banking Exams, the more generic-sounding of the two.
- **Friction found:** Minor–Moderate. The tab is labeled "Graduate" on the home tab bar, which reads more like "for graduates" than "company-specific exam simulations." A user scanning tab labels for "general aptitude practice" would not obviously map that need to "Graduate."
- **Heuristic(s) violated:** Match between system and the real world (ambiguous label).

### Screen: BankReady module — Bank Aptitude Test Prep (screenshot: 09_banking_exams_start_v2.png)
- **What a first-time student sees:** "Bank Aptitude Test Prep — practice the exact questions used at GTBank, Zenith, Access, First Bank and UBA," with Numerical Reasoning and Verbal Reasoning cards, each showing topic tags, a Mode selector (Exam / Practice / Speed — **defaulting to Exam**), a topic filter ("Mixed"), and a "Start →" button.
- **What they'd likely try next:** A cautious first-timer would ideally start with "Practice" mode (untimed, "instant feedback" per the app's own home-screen pitch), but the default selection is "Exam" (timed).
- **Friction found:** Minor–Moderate. Defaulting a brand-new user into timed Exam mode — rather than the lower-pressure Practice mode the app markets on its own home screen — risks a discouraging first experience (running out of time, no explanations shown).
- **Heuristic(s) violated:** Error prevention / sensible defaults (the default doesn't match the described first-time value proposition).
- **Positive:** clear topic tags, mode icons, and good information scent about what's inside each module.

### Screen: Quick Tips before starting (screenshot: 11_drill_session_start.png)
- **What a first-time student sees:** "Numerical Quick Tips — Review before you start," a compact cheat-sheet of the key formulas (percentage change, simple/compound interest, ratios, etc.) before a "Start Practice →" button.
- **What they'd likely try next:** Skim it, then start.
- **Friction found:** None — a genuinely nice, low-effort confidence-builder right before a test-like experience.
- **Heuristic(s) violated:** None. (Positive: helps error prevention and reduces first-attempt anxiety.)

### Screen: First question and answer feedback (screenshots: 12_first_question.png, 13_answer_selected.png)
- **What a first-time student sees:** A clear progress bar ("1/10"), a running score ("0/0"), a tagged question (difficulty + topic chips), four lettered options, and a disabled "Next Question →" until an answer is picked. After selecting, the chosen option is highlighted green/red with a checkmark/cross and a worked explanation appears immediately.
- **What they'd likely try next:** Read the explanation, then tap "Next Question →".
- **Friction found:** None — this is the strongest screen in the audit. Instant, specific feedback with worked solutions is exactly what a first-time test-prepper needs.
- **Heuristic(s) violated:** None. (Positive: excellent visibility of system status and error recovery — a wrong answer is immediately explained, not just marked wrong.)

---

## Flow: Complete a drill and view the score

### Screen: Results screen (screenshot: 15_results_screen.png)
- **What a first-time student sees:** A large "50% Accuracy" headline, a qualitative label ("Fair 💪" rather than a harsh "Failed"), "You scored 5 out of 10," time taken (18m 32s), a 3-stat row (Score / Accuracy / Time), an "Areas to Improve" callout naming the specific weak topics ("profit & loss," "averages"), a collapsible "Review Wrong Answers (5 questions with explanations)" section, and "Retake" / "Other Modules" buttons plus a "View My Progress" link.
- **What they'd likely try next:** Expand "Review Wrong Answers" to see what they got wrong, or tap "Retake."
- **Friction found:** None — this is a comprehensive, encouraging, and actionable results screen.
- **Heuristic(s) violated:** None. (Positive: strong match with real-world language and good visibility of progress/status.)

### Screen: Navigating away from Results (screenshot: 16_home_after_quiz.png)
- **What a first-time student sees:** A "← Home" link in the top-left of both the Results screen and the BankReady module screen beneath it.
- **What they'd likely try next:** Tap "← Home" expecting to land back on the main dashboard (streak/XP/home screen).
- **Friction found:** **Blocking-adjacent (Moderate–Blocking).** "← Home" does not go to the app's dashboard — it only steps back one level in the navigation stack. Tapping it from Results goes to the BankReady module list; tapping it again from there goes back to Results. A user just bounces between the two screens instead of reaching Home. Separately, pressing the Android hardware back button twice from this same nested stack **exited the app entirely** rather than surfacing the bottom tab bar.
- **Heuristic(s) violated:** Match between system and the real world (the label "Home" doesn't do what it says); User control and freedom (no reliable way back to the dashboard except relaunching); Consistency (this nested stack isn't integrated with the bottom tab navigator's back behavior).

---

## Flow: Find help or support

### Screen: Profile tab (screenshot: 17_profile_screen.png)
- **What a first-time student sees:** Avatar, name, email, an app-info card, and two account actions ("Sign Out," "Delete Account"). The app-info card reads: **"CareerClarity — Africa's Career Readiness Platform,"** Version 1.0.0, Active Module "🏦 BankReady," Coming Soon: ICAN, ACCA, Interview Prep.
- **What they'd likely try next:** Look for anything resembling "Help," "FAQ," "Contact us," "How is my score calculated?," or feedback — and find nothing.
- **Friction found:** **Blocking.** Home, LearnPad, Graduate, and Profile were all checked; there is no Help/FAQ/Contact/Support entry point anywhere in the app. A first-time user with a question (billing, a wrong-looking question, how scoring works, or just "who made this?") has no discoverable path to an answer.
- **Heuristic(s) violated:** Help and documentation (entirely absent); Discoverability (fails outright — there is nothing to find).
- **Additional finding (branding inconsistency):** The Profile screen calls the product "CareerClarity," while the app icon, splash screen, and every other screen call it "EduXL." Similarly, "Active Module: BankReady" surfaces an internal codename that doesn't match the user-facing labels seen elsewhere ("Bank Aptitude Test Prep," "Company Prep Tracks," the "Graduate" tab). This reads as leftover internal naming that never got cleaned up for the rebrand.
- **Heuristic(s) violated:** Consistency and standards.

---

## Summary

### Top 5 issues, ranked by severity

1. **No Help/Support/FAQ anywhere in the app (Blocking).** Flow 5. Checked all four tabs; nothing. This is the single clearest gap against the brief's Flow 5 goal.
2. **"← Home" is mislabeled and back-navigation can exit the app (Moderate–Blocking).** Flow 4 / cross-cutting. The label promises the dashboard but delivers "go back one screen"; two hardware back-presses from the same stack closed the app outright.
3. **Confusing/ambiguous section naming across the app, repeating in multiple places (Moderate).** Flows 3 & 5. The same feature is called "LearnPad" (tab) and "DrillPad" (home card); the aptitude-practice feature lives under a tab called "Graduate," is titled "Company Prep Tracks" inside, and is called "BankReady" on the Profile screen; the brand itself is "EduXL" everywhere except Profile, where it's "CareerClarity." This pattern of inconsistent naming is the most-repeated issue in the audit and is very likely why testing initially went to the wrong tab ("LearnPad") when looking for aptitude-test practice.
4. **LearnPad's empty state has four redundant, competing calls-to-action (Moderate).** Flow 3. A header "+", a "Create your first course" button, a "Generate Quiz" button, and a second floating "+" button all appear to do overlapping things with no visible distinction.
5. **First practice session defaults to timed "Exam" mode, not "Practice" (Minor–Moderate).** Flow 3. This works against the app's own pitch of low-pressure, instant-feedback practice for newcomers.

### Repeating patterns
- **Naming inconsistency** is the single biggest recurring issue, showing up in the tab bar, the Home screen cards, the Graduate section, and the Profile screen (see #3 above) — this is worth a dedicated content/IA pass rather than a one-off fix.
- **Navigation labels vs. behavior mismatch**: "← Home" not going Home was the only instance of this found, but given the naming-inconsistency pattern above, it's worth auditing other back/breadcrumb links in the app for the same issue.

### What's working well (worth preserving)
- No forced onboarding tutorial — straight to a real choice on first launch.
- Signup → persona pick → home is fast, with good loading-state feedback throughout.
- Practice-mode question feedback (instant correct/incorrect + worked explanation) is excellent.
- The pre-quiz "Quick Tips" cheat-sheet is a thoughtful, low-cost confidence builder.
- The Results screen is genuinely strong: encouraging tone, specific weak-area callouts, and clear next actions.

*This report is a prioritized list to validate with real students next, not a final verdict.*
