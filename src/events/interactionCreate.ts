import logger from "@/util/logger";
import { Events, Collection, type Interaction } from "discord.js";

export default {
  name: Events.InteractionCreate,

  async execute(interaction: Interaction) {
    let interactionAction = null;
    let interactionActionName: string | null = null;
    const client: CustomClient = interaction.client;

    if (interaction.isChatInputCommand()) {
      interactionActionName = interaction.commandName;
      interactionAction = client.commands?.get(interactionActionName);
      logger.log(
        `/${interactionActionName} sent by ${interaction.user.id} from ${interaction.guild?.id || "DM"}`,
      );
    } else if (interaction.isButton()) {
      interactionActionName = interaction.customId;
      interactionAction = client.buttons.get(interactionActionName);
      if (!interactionAction) return; // collector-managed, ignore
    } else if (interaction.isModalSubmit()) {
      interactionActionName = interaction.customId;
      const idIndex = interactionActionName.indexOf("_id_");
      if (idIndex !== -1)
        interactionActionName = interactionActionName.substring(0, idIndex);
      interactionAction = client.modals.get(interactionActionName);
    } else {
      return; // ignore context menus etc
    }

    if (!interactionAction) {
      logger.error(`No command matching ${interactionActionName} was found`);
      return;
    }

    // cooldowns
    const cooldowns = client.cooldowns;
    if (!cooldowns.has(interactionActionName!)) {
      cooldowns.set(interactionActionName!, new Collection());
    }

    const now = Date.now();
    const timestamps = cooldowns.get(interactionActionName!);
    const cooldownAmount = (interactionAction.cooldown ?? 1) * 1000;

    if (timestamps.has(interaction.user.id)) {
      const expirationTime = timestamps.get(interaction.user.id) + cooldownAmount;
      if (now < expirationTime) {
        const expiredTimestamp = Math.round(expirationTime / 1000);
        if (interaction.isRepliable()) {
          return interaction.reply({
            content: `You can use \`/${interactionActionName}\` again in <t:${expiredTimestamp}:R>.`,
            flags: "Ephemeral",
          });
        }
        return;
      }
    }

    timestamps.set(interaction.user.id, now);

    try {
      await interactionAction.execute(interaction);
    } catch (error) {
      logger.error(error);
      if (!interaction.isRepliable()) return;
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({
          content: "Well... There was an error while executing this command!",
          flags: "Ephemeral",
        });
      } else {
        await interaction.reply({
          content: "Umm... There was an error while executing this command!",
          flags: "Ephemeral",
        });
      }
    }
  },
};