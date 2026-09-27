# Raven

Raven is a Discord bot built with Bun and Discord.js. It provides chat experience points, a full economy system, moderation tools, server utilities integration backed by Supabase.

## Features

- Chat XP and leveling system
- Economy commands: balance, daily, work, withdraw, deposit, robbery, slots, coinflip
- Moderation commands: ban, kick, timeout, purge, warn, mod log, action log=
- Misc utilities like about, avatar, serverinfo, and whois
- Slash command registration with deploy/delete scripts

## Commands

<details>
  <summary><b>chat</b></summary>

  * `leaderboard`
  * `rank`
  * `reset_level_up_channel`
  * `set_level_up_channel`
</details>

<details>
  <summary><b>economy</b></summary>

  * `balance`
  * `coinflip`
  * `crime`
  * `daily`
  * `deposit`
  * `rob`
  * `slots`
  * `withdraw`
  * `work`
</details>

<details>

<details>
<summary><b>misc</b></summary>

  * `about`
  * `avatar`
  * `serverinfo`
  * `whois`
</details>

<details>
<summary><b>mod</b></summary>

  * `actionlog`
  * `ban`
  * `kick`
  * `lock`
  * `modlog`
  * `purge`
  * `timeout`
  * `unban`
  * `unlock`
  * `warn`
</details>

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

3. Create a `.env` file at the project root using `.env.example` values.

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
