# Raven

Raven is a Discord bot built with Bun and Discord.js. It provides chat experience points, a full economy system, moderation tools, server utilities integration backed by Supabase. You can try out the bot [here](https://discord.com/oauth2/authorize?client_id=1041237161367834694).

## Features

- Chat XP and leveling system
- Economy commands: balance, daily, work, withdraw, deposit, robbery, slots, coinflip
- Moderation commands: ban, kick, timeout, purge, warn, mod log, action log
- Misc utilities like about, avatar, serverinfo, and whois
- Slash command registration with deploy/delete scripts

## Commands

<details>
  <summary><b>chat</b></summary>

  * `leaderboard`
  * `rank`
  * `level channel remove`
  * `level channel set`
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

- [Bun](https://bun.sh/) installed
- A Discord bot application with a valid bot token
  - If you dont have a bot yet, you can easily make one from [Discord Developer Portal](https://discord.com/developers/home).
- A [Supabase](https://supabase.com/) project for storing data and generating types

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

- Start in development mode:

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
