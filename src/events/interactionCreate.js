const { Events, Collection } = require("discord.js");

module.exports = {
    name: Events.InteractionCreate,
    
    async execute(interaction) {
        let interactionAction = null;
        let interactionActionName = null;

        if (interaction.isChatInputCommand()) {
            interactionActionName = interaction.commandName;
            interactionAction = interaction.client.commands.get(interactionActionName);
        } else {
            interactionActionName = interaction.customId;
            let idIndex = interactionActionName.indexOf("_id_");
            if (idIndex !== -1)
                interactionActionName = interactionActionName.substring(0,idIndex);
        }
        
        if (interaction.isButton()) {
            interactionAction = interaction.client.buttons.get(interactionActionName);
        } 
        
        else if (interaction.isModalSubmit()) {
            interactionAction = interaction.client.modals.get(interactionActionName);
        }


        if (!interactionAction) {
            console.log(`No command matching ${interactionActionName} was found`);
            return;
        }

        const cooldowns = interaction.client.cooldowns;

        if (!cooldowns.has(interactionActionName)) {
            cooldowns.set(interactionActionName, new Collection());
        }

        const now = Date.now();
        const timestamps = cooldowns.get(interactionActionName);
        const defaultCooldownDuration = 5;
        const cooldownAmmount = (interactionAction.cooldown ?? defaultCooldownDuration) * 1000;

        if (timestamps.has(interaction.user.id)) {
            const expirationTime = timestamps.get(interaction.user.id) + cooldownAmmount;

            if (now < expirationTime) {
                const expiredTimestamp = Math.round(expirationTime / 1000);
                return interaction.reply({ content: `You can use /\`${interactionActionName}\` again in <t:${expiredTimestamp}:R>.`, ephemeral: true });
            }
        }

        timestamps.set(interaction.user.id, now);

        if (!interactionAction) {
            console.log(`No matching button ${interaction.customId} was found`)
        }

        try {
            await interactionAction.execute(interaction);
        } catch (error) {
            console.log(error)
            if (interaction.replied || interaction.deferred) {
                await interaction.followUp({ content: "Well... There was an error while executing this command!", ephemeral: true });
            } else {
                await interaction.reply({ content: "Umm... There was an error while executing this command!", ephemeral: true });
            }
        }

    },
};
