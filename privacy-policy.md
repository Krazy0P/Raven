# Privacy Policy

**Last Updated:** September 27, 2026

This Privacy Policy explains how **Raven** ("the Bot", "we", "us", or "our") collects, uses, stores, and protects user and guild data when you interact with the Bot on Discord.

We respect your privacy and are committed to protecting it in compliance with applicable data privacy laws and [Discord Developer Policy](https://discord.com/developers/docs/policies-and-agreements/developer-policy).

---

### 1. Data We Collect
Raven only collects the minimum data necessary to function properly and provide its features:

- **Discord User IDs & Guild (Server) IDs:**
  - Used to identify users and link their data (XP, level, virtual currency balance, warnings, etc.) to the respective Discord server.
- **Experience (XP) and Level Data:**
  - Tracks user message activity to compute chat levels, weekly XP, and rankings within a guild.
- **Economy & Inventory Data:**
  - Tracks virtual currency (wallet, bank balances) and timestamps of daily/work actions.
- **Moderation & Log Records:**
  - Stores moderation event records (such as warnings, timeouts, bans, action log configurations) configured by guild administrators.
- **Guild Configuration:**
  - Channel IDs configured by server administrators (such as level-up notification channels or mod-log channels).

> **Note on Message Content:**
> Raven does **not** store your message text or chat history. Messages are only inspected ephemerally upon arrival to grant experience points (XP) and are discarded immediately.

---

### 2. How We Use Collected Data
The collected data is strictly used to:
- Maintain and update user XP, levels, and rank cards.
- Operate the virtual economy system (balances, transactions, cooldowns).
- Execute moderation actions and display server logs as requested by guild administrators.
- Ensure fair use and enforce rate limits or prevent abuse.

We do **not** sell, rent, trade, or monetize your personal or guild data to third parties.

---

### 3. Data Storage and Security
- **Database:** Data is securely stored using Supabase (PostgreSQL) with encrypted connections (SSL/TLS).
- **In-Memory Caching:** Temporary active user data is held in-memory and periodically flushed to the database to ensure performance and reduce redundant queries. Inactive users are evicted from memory.
- **Security:** Access to the database and API credentials is restricted to the bot owner and authorized infrastructure.

---

### 4. Data Sharing and Third Parties
We do not share your data with third parties, except:
- **Discord API:** To fulfill commands, send messages, and fetch basic metadata (usernames, avatars).
- **Database Infrastructure (Supabase):** Exclusively for storing and persisting bot data.

---

### 5. Data Retention & Deletion
- **Retention:** Data is kept as long as necessary to provide bot services to the server.
- **User Right to Erasure:**
  - Any user may request deletion of their data (such as XP records or economy data) at any time.
  - Server administrators may also request the deletion of all data associated with their guild.
  - To request data deletion, contact the bot owner directly on Discord (see Contact section). Requests are handled within a reasonable timeframe (typically within 14 days).

---

### 6. Children's Privacy
Raven is not directed at children under the age of 13 (or the minimum age of digital consent in your country). In accordance with Discord's Terms of Service, we do not knowingly collect personal information from individuals under this age limit.

---

### 7. Changes to This Privacy Policy
We may update this Privacy Policy from time to time. When changes are made, the "Last Updated" date at the top will be updated. We encourage users to review this policy periodically.

---

### 8. Contact Information
If you have any questions, concerns, or requests regarding this Privacy Policy or your data, please contact the bot owner on Email:
- **Email:** krazy0p@duck.com
