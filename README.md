# VTU Connect - Terminal Edition

VTU Connect is a high-performance, terminal-themed web application for Virtual Top-Up (VTU) services. It provides a sleek, retro-themed interface for purchasing mobile data, airtime, and electricity tokens with zero latency.


## 🚀 Key Features

- **Interactive Terminal Subsystem**: A fully functional command-line interface (CLI) for power users.
  - Commands: `DATA`, `AIRTIME`, `ELECT`, `LOGIN`, `SIGNUP`, `BALANCE`, `CLEAR`, `HELP`.
  - Multi-step interactive flows with password masking.
  - Persistent sessions within the terminal environment.
- **Graphical Dashboard**: A neubrutalist/retro-themed dashboard for managing services and wallet resources.
- **Service Support**:
  - **Data**: Support for major networks (MTN, GLO, Airtel, 9mobile).
  - **Airtime**: Rapid voice credit allocation.
  - **Electricity**: Grid power token injection for various DISCOs (Ikeja, Eko, Abuja, etc.).
- **Wallet & Security**: Secure user authentication and real-time wallet balance synchronization.
- **Transaction Logs**: Detailed history of all operations with status markers and reference tracking.

## 🛠️ Tech Stack

- **Framework**: [Next.js 15+](https://nextjs.org/) (App Router)
- **Library**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **API Integration**: Custom resilient Fetch-based API client.

## 📦 Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your carrier-grade browser.


## 🖥️ Terminal Usage

Access the terminal via the `RUN_TERMINAL` prompt on the homepage or the `TERMINAL_PROMPT` in the dashboard sidebar.

Type `HELP` for a list of all available kernel commands.

---
**VTU_CONNECT_KERNEL v1.0.4-STABLE**
*ESTABLISHING SECURE ENCLAVE... ACCESS_GRANTED*
