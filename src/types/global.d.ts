import type { Client, Collection, SlashCommandBuilder } from "discord.js"

export {}

declare global {
    class CustomClient extends Client {
        commands?: Collection<string, (interaction: ChatInputCommandInteraction<CacheType>) => Promise<void>>
        cooldowns?: Collection
        buttons?: Collection
        modals?: Collection
    }
    const THRESHOLD_XP = 10;
} 
    

