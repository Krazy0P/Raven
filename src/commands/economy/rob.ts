import { ChatInputCommandInteraction, InteractionContextType, SlashCommandBuilder } from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("rob")
    .setDescription("Rob another user!")
    .setContexts(InteractionContextType.Guild)
    .addUserOption((option) =>
      option.setName("user").setDescription("User to rob").setRequired(true),
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    return interaction.reply({
      content: "Work in porgress..."
    })
  }
};
