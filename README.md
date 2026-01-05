# CryptoArmor

**Pre-Transaction Risk Intelligence Platform for Web3 Security**

CryptoArmor is a real-time blockchain security tool that analyzes wallet addresses, transactions, and smart contracts to detect threats before they cause harm. Built for security researchers, developers, and crypto users who need to evaluate risk before interacting with on-chain entities.

## Features

### Transaction Risk Scanner
- Real-time calldata analysis for Ethereum transactions
- Contract verification status checks
- Token approval pattern detection (unlimited approvals, drainer contracts)
- Transaction history and failure rate analysis
- Account age and activity scoring

### Wallet Reputation Analysis
- Trust score calculation based on on-chain behavior
- Multi-factor risk assessment (age, volume, contract status, balance)
- Flag detection for suspicious patterns
- Recent transaction history with success/failure tracking
- Live data from Ethereum mainnet via Etherscan API

### Testnet Dashboard
- Support for Ethereum Sepolia, Holesky, and Bitcoin testnet
- Pre-configured wallet fixtures for testing (low-risk, high-risk, phishing, drainers)
- Read-only mode (no private keys, no signatures)
- RPC connection testing and health monitoring
- Mainnet address blocking for safety

### Attack Simulation
- Educational simulations of common attack vectors:
  - Approval drain attacks
  - Phishing contract interactions
  - Wallet impersonation
  - Honeypot token schemes
- Step-by-step attack walkthroughs
- Detection output visualization
- Linked testnet wallet analysis

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, shadcn/ui components
- **State Management**: TanStack Query
- **Backend**: Supabase Edge Functions (Deno)
- **APIs**: Etherscan API, Public RPC endpoints
- **Routing**: React Router v6

## Architecture

