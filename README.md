# DripsFlow

> A contributor funding dashboard for Web3 open-source projects, built on the [Drips protocol](https://drips.network).

![DripsFlow](https://img.shields.io/badge/built%20on-Drips-7dd3fc?style=flat-square)
![SvelteKit](https://img.shields.io/badge/SvelteKit-TypeScript-orange?style=flat-square)
![License](https://img.shields.io/badge/license-MIT-green?style=flat-square)

## What it does

DripsFlow lets open-source contributors connect their wallet and see:

- **Live funding streams** — real-time DAI/ETH streams flowing to/from your address on Drips
- **Contributor profile** — merge your GitHub identity with your on-chain wallet into a single view
- **GitHub repositories** — your repos displayed alongside your on-chain funding activity
- **Project explorer** — browse Web3 projects actively funding contributors via Drips

## Tech stack

| Layer | Tech |
|-------|------|
| Frontend | SvelteKit + TypeScript |
| Styling | TailwindCSS + custom CSS |
| Web3 | ethers.js, ENS resolution |
| Data | Drips GraphQL API, GitHub REST API |
| Deploy | Vercel |

## Getting started

```bash
git clone https://github.com/Ugasutun/dripsflow.git
cd dripsflow
npm install
npm run dev
```

Open http://localhost:5173 in your browser. You need a browser wallet (MetaMask, Rabby).

## Project structure

```
src/
├── lib/
│   ├── api/
│   │   ├── drips.ts        # Drips GraphQL queries
│   │   └── github.ts       # GitHub REST API client
│   ├── components/
│   │   ├── Navbar.svelte
│   │   ├── StreamCard.svelte
│   │   └── ProjectCard.svelte
│   └── stores/
│       └── wallet.ts       # Wallet connection state
└── routes/
    ├── +page.svelte
    ├── explore/+page.svelte
    └── profile/[address]/+page.svelte
```

## Deploying

```bash
npm install -g vercel
vercel
```

## Roadmap

- [ ] ENS reverse lookup on profile pages
- [ ] Token price conversion (DAI → USD)
- [ ] Contribution history linked to GitHub issues
- [ ] Drips splits visualizer
- [ ] WalletConnect v2 support

## License

MIT
