<div align="center">
  <img src="assets/ai-navigator-banner.png" alt="AI Navigator" width="1200" />
</div>

# AI Navigator

**The ultimate platform for navigating the rapidly evolving AI landscape in 2026.**

Semantic search, interactive skill trees with progress tracking, drag-and-drop stack builder with AI simulation, personalized dashboard, intelligent chat assistant, tool comparisons, roadmap generator, and one-click starter exports.

Built with **shadcn/ui**, Vercel AI SDK, and a comprehensive 2026 AI catalog.

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)](https://react.dev/)
[![Tailwind](https://img.shields.io/badge/Tailwind_CSS-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)

## ✨ Features

- **Global Semantic Search** — Press `Cmd/Ctrl + K` for instant AI-powered search across tools, concepts, and recommendations.
- **Interactive Skill Tree** — Visual learning paths with progress tracking, mastery percentages, and AI-suggested next steps.
- **Drag-and-Drop Stack Builder** — Build, simulate, score, and export complete tech stacks with real-time AI analysis and execution flow visualization.
- **Personal Dashboard** — Journey overview with charts, saved stacks, progress analytics, and personalized recommendations.
- **Intelligent AI Assistant** — Persistent chat that understands your current context, compares tools, generates roadmaps, and answers deep technical questions.
- **Tool Comparison Matrix** — Side-by-side "versus" mode with AI-generated verdicts.
- **Personalized Roadmaps** — AI-generated 3-month learning timelines based on your progress and goals.
- **One-Click Starter Exports** — Generate ready-to-run Next.js + Vercel + chosen stack templates.
- **Beautiful shadcn/ui Design** — Dark/light mode toggle, fully accessible, responsive, and consistent.

## Screenshots

![Dashboard](assets/dashboard-screenshot.png)
*Personal Dashboard with progress charts, skill tree integration, and recommendations*

![Stack Builder](assets/stack-builder-screenshot.png)
*Drag-and-drop Stack Builder with AI simulation and execution flow*

![Global Search](assets/cmdk-search-screenshot.png)
*Cmd+K semantic search palette with AI suggestions*

## Quick Start

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/ai-navigator.git
   cd ai-navigator
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Add your Gemini API key (for AI features):
   ```bash
   cp .env.example .env.local
   # Edit .env.local and add GEMINI_API_KEY=your_key_here
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

Open [http://localhost:5173](http://localhost:5173) to explore.

**Pro tip**: Press `Cmd/Ctrl + K` anywhere for instant semantic search.

## Tech Stack

- **Frontend**: React 19, TypeScript, Vite, shadcn/ui, Tailwind CSS v4, Recharts, @dnd-kit
- **AI Layer**: Vercel AI SDK (@ai-sdk/google), structured outputs with Zod, Gemini 1.5 Flash
- **Styling**: Fully tokenized dark/light theme with shadcn primitives
- **State**: React hooks + localStorage (Supabase integration ready)

## Project Structure

```
ai-navigator/
├── components/
│   ├── ui/              # shadcn/ui components
│   ├── SkillTree.tsx
│   ├── StackBuilder.tsx
│   ├── AIChat.tsx
│   └── ...
├── pages/
│   ├── DashboardPage.tsx
│   ├── AllToolsPage.tsx
│   └── ...
├── services/geminiService.ts   # AI integration
├── constants.tsx               # Expanded 2026 AI catalog
├── types.ts
├── App.tsx
├── index.css                   # shadcn theme + custom grid
└── README.md
```

## Roadmap

- [x] Comprehensive 2026 AI catalog with relations
- [x] Global semantic Cmd+K search
- [x] Interactive Skill Tree with progress
- [x] Drag-and-drop Stack Builder + simulation
- [x] Rich Personal Dashboard with charts
- [x] AI Chat Assistant
- [x] Tool comparison matrix
- [x] Personalized roadmap generator
- [x] One-click starter template export
- [x] Dark/Light mode toggle
- [ ] Supabase backend for user accounts and shared roadmaps
- [ ] Real vector embeddings for advanced semantic search
- [ ] Community contributions and ratings

## Contributing

Contributions are welcome! Please open an issue or PR. The catalog can be expanded by editing `constants.tsx` and adding meaningful relations.

## License

MIT © 2026 AI Navigator

---

**Made with ❤️ for the AI community**

*Built as a demonstration of modern AI-powered development tools and beautiful UI with shadcn/ui.*
