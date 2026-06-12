# TRinko — Premium AI Workplace Productivity Suite

TRinko is a high-performance, SaaS-style AI Productivity Assistant built for the ASA 6 Programme (Week 6). Built with a sophisticated Deep Slate & Emerald design system, TRinko combines robust prompt engineering with dynamic, tier-based workplace workflows.

**[Live App Link](https://assist-wise-flow-16.lovable.app)**

---

## Premium Features & Architecture

### 1. Sophisticated Slate & Emerald UI & UX Caching
- **Design System:** Upgraded to a sleek dark slate background (`#0f172a`) paired with vibrant emerald green (`#10b981`) accent indicators, offering a modern, highly professional dark mode aesthetic.
- **State Persistence:** Implemented input caching across tabs, allowing users to switch between the Planner and the Email Generator without losing active drafts.

### 2. Dynamic SaaS Authentication & Tier Simulation (New!)
- **Interactive Auth Modal:** Replaced static placeholders with a functional mock authentication and pricing interface. Users can invoke a beautiful dark-slate modal displaying **Standard ($15/mo)** and **Pro ($35/mo)** tier cards.
- **Live State Customization:** Captures user email input and plan selection on-the-fly to dynamically re-render the sidebar. The UI instantly updates to showcase a custom initial avatar, the active user's email, a stylized tier badge (`PRO` or `STANDARD`), and a fully operational "Log Out" routine.

### 3. Core Feature Modules & Advanced Guardrails
- **Smart Email Generator:** Context-aware generation with tone selection (Formal, Friendly, Persuasive, Direct) embedded with structural style constraints. Features an interactive "Copy to Clipboard" routine.
- **Meeting Notes Summarizer:** Includes an automatic validation layer that prompts users for high-quality inputs (minimum 50 characters) to ensure summary accuracy. Parses raw transcripts into distinct, structured outputs.
- **AI Task Planner:** A structured calendar and prioritization view for organizing daily workplace objectives.
- **AI Research Assistant:** A clean search-style interface formatting deep insights into structured markdown layouts.
- **AI Chatbot Interface:** Features quick-access interactive "Prompt Chips" for instant framing of standard corporate tasks.

---

## Prompt Engineering & Responsible AI Foundations
- **Input Validation:** Restricting short inputs in the summarizer to prevent low-quality AI outputs.
- **System Constraints:** Hardcoding operational boundaries inside the tone dropdowns to guarantee ethical, professional, and accurate workplace text generation.
