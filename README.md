# Raven

Raven is a Discord bot built with Bun and Discord.js. It provides chat experience points, a full economy system, moderation tools, server utilities integration backed by Supabase.

## Features

- Chat XP and leveling system
- Economy commands: balance, daily, work, withdraw, deposit, robbery, slots, coinflip
- Moderation commands: ban, kick, timeout, purge, warn, mod log, action log
- Server management utilities for roles and channels `(UNSTABLE)`
- Misc utilities like about, avatar, serverinfo, and whois
- Slash command registration with deploy/delete scripts

## Getting Started

### Prerequisites

- Bun installed
- A Discord bot application with a valid bot token
- A Supabase project for storing data and generating types

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/Krazy0P/Raven.git
   cd Raven
   ```

2. Install dependencies:

   ```bash
   bun install
   ```

3. Create a `.env` file at the project root with the following values:

   ```env
    DISCORD_TOKEN="DISCORD_BOT_TOKEN"
    CLIENT_ID="DISCORD_BOT_ID"
    THRESHOLD_XP="CHAT_XP_THRESHOLD"
    SUPABASE_PROJECT_ID="SELF_EXPLAINATORY"
    SUPABASE_SERVICE_ROLE_KEY="FOR_SECURELY_ACCESSING_DATABASE"
   ```

### Running the bot

- Register slash commands:

  ```bash
  bun run deploycmd
  ```

- Start the bot:

  ```bash
  bun run start
  ```

- Start in development mode (register commands first, then run):

  ```bash
  bun run dev
  ```

### Additional scripts

- Delete all registered application commands:

  ```bash
  bun run delcmd all
  ```

- Delete one or more commands by ID:

  ```bash
  bun run delcmd <command-ids>
  ```

- Generate Supabase TypeScript types:

  ```bash
  bun run refreshdb
  ```

## Project Structure

Under `src` directory:

- `index.ts` — bot bootstrap and client initialization
- `deploy.ts` — script to register slash commands with Discord
- `delcmd.ts` — script to delete registered commands
- `syncdb.ts` — script to generate Supabase database types
- `commands/` — slash command definitions organized by category
- `events/` — event handlers for Discord events
- `components/` — button and modal interaction handlers
- `util/` — helper utilities, logging, Supabase client, and Twitter feed process
- `types/` — generated and shared TypeScript types



## License

This repository does not include a license file. Add one if you want to make the project publicly reusable.
