const { Events, Collection } = require("discord.js");

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        if (interaction.isChatInputCommand()) {
            const command = interaction.client.commands.get( interaction.commandName );

            if (!command) {
                console.log(`No command matching ${interaction.commandName} was found`);
                return;
            }

            const cooldowns = interaction.client.cooldowns;

            if (!cooldowns.has(command.data.name)) {
                cooldowns.set(command.data.name, new Collection());
            }

            const now = Date.now();
            const timestamps = cooldowns.get(command.data.name);
            const defaultCooldownDuration = 5;
            const cooldownAmmount = (command.cooldown ?? defaultCooldownDuration) * 1000;

            if (timestamps.has(interaction.user.id)) {
                const expirationTime = timestamps.get(interaction.user.id) + cooldownAmmount;

                if (now < expirationTime) {
                    const expiredTimestamp = Math.round(expirationTime / 1000);
                    return interaction.reply({ content: `You can use /\`${command.data.name}\` again in <t:${expiredTimestamp}:R>.`, ephemeral: true });
                }

            }

            timestamps.set(interaction.user.id, now);

            try {
                await command.execute(interaction);
            } catch (error) {
                console.log(error);
                if (interaction.replied || interaction.deferred) {
                    await interaction.followUp({ content: "Well... There was an error while executing this command!", ephemeral: true });
                } else {
                    await interaction.reply({ content: "Umm... There was an error while executing this command!", ephemeral: true });
                }
            }

        } else if (interaction.isButton()) {
            console.log("yes its a button indeed")
        } else if (interaction.isStringSelectMenu()) {
            // Work in progress
        }

    },
};
