import {
  ChatInputCommandInteraction,
  InteractionContextType,
  PermissionFlagsBits,
  SlashCommandBuilder,
  type HexColorString,
  type RoleData,
} from "discord.js";
import logger from "@/util/logger";
import supabase from "@/util/supabase";
import theme from "@/theme/roles/colour/catpuccin.json";

export default {
  data: new SlashCommandBuilder()
    .setName("role")
    .setDescription("Manage server roles!")
    .setContexts(InteractionContextType.Guild)
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles)
    .addSubcommandGroup((subcommandgroup) =>
      subcommandgroup
        .setName("colours")
        .setDescription("Manage server colour roles!")
        .addSubcommand((subcommand) =>
          subcommand
            .setName("create")
            .setDescription("Adds the Colour Roles")
            .addStringOption((option) =>
              option
                .setName("theme")
                .setDescription("Select the colour theme")
                .setRequired(true)
                .addChoices(
                  { name: "Latte", value: "latte" },
                  { name: "Frappé", value: "frappe" },
                  { name: "Macchiato", value: "macchiato" },
                  { name: "Mocha", value: "mocha" },
                  { name: "Solid", value: "solid" },
                ),
            ),
        )
        .addSubcommand((subcommand) =>
          subcommand
            .setName("delete")
            .setDescription("Deletes the Colour Roles from the server"),
        ),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("create")
        .setDescription("Create a new role")
        .addStringOption((option) =>
          option
            .setName("name")
            .setDescription("Name for the role")
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName("color")
            .setDescription("Color hex for role")
            .setRequired(false)
        )
        .addBooleanOption((option) =>
          option
            .setName("hoist")
            .setDescription("default: false")
            .setRequired(false)
        )
        .addBooleanOption((option) =>
          option
            .setName("mentionable")
            .setDescription("default: false")
            .setRequired(false)
        )
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply();

    const subcommandGroup = interaction.options.getSubcommandGroup();
    const subcommand = interaction.options.getSubcommand();

    if (subcommandGroup === "colours" && subcommand === "create") {
      return handleCreateColours(interaction);
    }

    if (subcommandGroup === "colours" && subcommand === "delete") {
      return handleDeleteColours(interaction);
    }

    if (!subcommandGroup && subcommand === "create") {
      return interaction.editReply({
        content: "Working..."
      });
    }
  },
};

async function handleCreateColours(interaction: ChatInputCommandInteraction) {
  const roleColor = interaction.options.getString("theme")! as
    | "latte"
    | "frappe"
    | "macchiato"
    | "mocha"
    | "solid";
  const guild = interaction.guild!;

  const colours = theme.catppuccin[roleColor].colors;
  const roleIds: Record<string, string> = {};

  const { data } = await supabase
    .from("colour theme")
    .select("*")
    .eq("guild_id", guild.id);

  if (
    data?.length &&
    data[0]?.colour_list &&
    Object.keys(data[0].colour_list).length > 0
  ) {
    return interaction.editReply({
      content: "Colour roles already exist",
    });
  }

  try {
    await Promise.all(
      Object.entries(colours).map(async ([key, value]) => {
        const hexColor = (value as string).slice(0, 7) as HexColorString;
        const role = await guild.roles.create({
          name: key.charAt(0).toUpperCase() + key.slice(1),
          colors: {
            primaryColor: hexColor,
          },
        });
        roleIds[key] = role.id;
      }),
    );

    await supabase.from("colour theme").upsert({
      guild_id: guild.id,
      colour_list: roleIds,
    });

    return interaction.editReply({
      content: "Created all the roles!",
    });
  } catch (e) {
    logger.error(e);
    return interaction.editReply({
      content: "Something went wrong",
    });
  }
}

async function handleDeleteColours(interaction: ChatInputCommandInteraction) {
  const guild = interaction.guild!;
  const { data, error } = await supabase
    .from("colour theme")
    .select("*")
    .eq("guild_id", guild.id);

  if (!data || error || !data[0]?.colour_list) {
    return interaction.editReply({
      content: "Seems like I never created any color roles",
    });
  }

  const list = data[0].colour_list as Record<string, string>;

  try {
    await Promise.all(
      Object.entries(list).map((value) =>
        guild.roles.delete(value[1]).catch(() => {}),
      ),
    );

    await supabase.from("colour theme").delete().eq("guild_id", guild.id);

    return interaction.editReply({
      content: "Deleted all the roles!",
    });
  } catch (e) {
    logger.error(e);
    return interaction.editReply({
      content: "Seems like something went wrong",
    });
  }
}
