# FundFlow

> Decentralized grant management and distribution platform built on Stellar and Soroban smart contracts.

![Stellar](https://img.shields.io/badge/built%20on-Stellar-7dd3fc?style=flat-square)
![Soroban](https://img.shields.io/badge/smart%20contracts-Soroban-orange?style=flat-square)
![Next.js](https://img.shields.io/badge/frontend-Next.js-black?style=flat-square)
![License](https://img.shields.io/badge/license-MIT-green?style=flat-square)
![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen?style=flat-square)

---

## What is FundFlow?

FundFlow is an open-source decentralized application that enables organizations, DAOs, and protocols to create on-chain grant pools on the Stellar network and distribute funding to open-source contributors transparently and automatically via Soroban smart contracts.

Grant creators deposit XLM into a smart contract pool. Contributors submit proposals on-chain. The community votes on applications, and funds are distributed automatically to approved contributors — no intermediaries, no trust required.

---

## Features

### Grant pool creation
Organizations deposit XLM or Stellar tokens into a Soroban smart contract pool with a defined deadline and voting rules. The pool is fully on-chain and transparent.

### Contributor applications
Contributors submit grant proposals directly on-chain. Each application includes a proposal description and requested amount. Applications are publicly visible and verifiable.

### On-chain voting
Community members vote on applications through the smart contract. Votes are recorded on-chain and cannot be tampered with.

### Automatic fund distribution
Pool creators distribute funds to approved applicants via the Soroban contract. Tokens are transferred directly to the contributor's Stellar wallet with no intermediary.

### Freighter wallet integration
Connect your Stellar wallet via the Freighter browser extension. All transactions are signed locally and submitted to the Stellar network.

---

## Architecture
fundflow/
├── contract/          # Rust/Soroban smart contract
│   └── fundflow-contract/
│       ├── src/
│       │   └── lib.rs         # Contract logic
│       └── Cargo.toml
├── backend/           # Node.js/TypeScript REST API
│   └── src/
│       ├── index.ts           # Express server entry point
│       ├── routes/
│       │   ├── pools.ts       # Pool endpoints
│       │   └── applications.ts # Application endpoints
│       └── services/
│           └── stellar.ts     # Stellar SDK integration
└── frontend/          # Next.js frontend
└── app/
├── page.tsx           # Homepage
├── pools/             # Pool explorer + creation
├── apply/             # Grant application form
└── dashboard/         # Creator dashboard

---

## Tech stack

| Layer | Technology |
|-------|------------|
| Smart contract | Rust + Soroban SDK |
| Blockchain | Stellar Network (Testnet/Mainnet) |
| Backend | Node.js + TypeScript + Express |
| Frontend | Next.js 14 + React + TypeScript |
| Styling | TailwindCSS |
| Wallet | Freighter (Stellar wallet extension) |
| Stellar SDK | @stellar/stellar-sdk |

---

## Getting started

### Prerequisites
- Node.js 18+
- Rust + Cargo
- [Freighter wallet](https://freighter.app) browser extension
- A Stellar testnet account (get one at [Stellar Laboratory](https://laboratory.stellar.org))

### 1. Clone the repository

```bash
git clone https://github.com/Ugasutun/fundflow.git
cd fundflow
```

### 2. Set up the smart contract

```bash
cd contract/fundflow-contract
cargo build
```

### 3. Set up the backend

```bash
cd backend
npm install
cp .env.example .env
# Fill in your CONTRACT_ID and ADMIN_ADDRESS in .env
npm run dev
```

### 4. Set up the frontend

```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Smart contract functions

| Function | Description |
|----------|-------------|
| `create_pool` | Create a new grant pool with XLM deposit |
| `apply` | Submit a grant application to a pool |
| `vote` | Vote on a grant application |
| `distribute` | Distribute funds to an approved applicant |
| `get_pool` | Fetch a pool by ID |
| `get_application` | Fetch an application by ID |
| `get_pool_applications` | Fetch all applications for a pool |
| `pool_count` | Get total number of pools |

---

## API endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/pools` | Fetch all grant pools |
| GET | `/pools/:id` | Fetch a single pool |
| POST | `/pools` | Create a new pool |
| GET | `/pools/:id/applications` | Fetch applications for a pool |
| GET | `/applications/:id` | Fetch a single application |
| POST | `/applications` | Submit an application |
| POST | `/applications/:id/vote` | Vote on an application |
| POST | `/applications/:id/distribute` | Distribute funds |
| GET | `/health` | API health check |

---

## Contributing

We welcome contributions of all kinds! Please read [CONTRIBUTING.md](CONTRIBUTING.md) before submitting a pull request.

Looking for something to work on? Check our [open issues](https://github.com/Ugasutun/fundflow/issues) — issues labeled `good first issue` are great for newcomers.

---

## Roadmap

- [ ] Deploy contract to Stellar Testnet
- [ ] Deploy frontend to Vercel
- [ ] Add token support beyond XLM (USDC, custom tokens)
- [ ] Add proposal IPFS storage for long-form content
- [ ] Add multi-sig voting support
- [ ] Add grant milestone tracking
- [ ] Mobile responsive improvements
- [ ] Add leaderboard for top funded contributors

---

## License

MIT

---

## Acknowledgements

Built on [Stellar](https://stellar.org) and [Soroban](https://soroban.stellar.org) smart contracts.