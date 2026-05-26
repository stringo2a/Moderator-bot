require('dotenv').config();

const {
    Client,
    GatewayIntentBits,
    Partials,
    REST,
    Routes,
    SlashCommandBuilder,
    PermissionFlagsBits
} = require('discord.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.DirectMessages
    ],
    partials: [Partials.Channel]
});

const prefix = '.';

// ================= SLASH COMMANDS =================

const commands = [

    // ================= BAN =================

    new SlashCommandBuilder()
        .setName('ban')
        .setDescription('Ban a member')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('User to ban')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('Reason')
                .setRequired(false))
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

    // ================= UNBAN =================

    new SlashCommandBuilder()
        .setName('unban')
        .setDescription('Unban a user')
        .addStringOption(option =>
            option.setName('userid')
                .setDescription('User ID')
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

    // ================= KICK =================

    new SlashCommandBuilder()
        .setName('kick')
        .setDescription('Kick a member')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('User to kick')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('Reason')
                .setRequired(false))
        .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),

    // ================= TIMEOUT =================

    new SlashCommandBuilder()
        .setName('timeout')
        .setDescription('Timeout a member')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('User')
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName('minutes')
                .setDescription('Minutes')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('Reason')
                .setRequired(false))
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

    // ================= DM =================

    new SlashCommandBuilder()
        .setName('dm')
        .setDescription('DM a user')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('Target user')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('message')
                .setDescription('Message')
                .setRequired(true))
        .addAttachmentOption(option =>
            option.setName('file')
                .setDescription('Optional file')
                .setRequired(false))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

    // ================= DM ALL =================

    new SlashCommandBuilder()
        .setName('dm_all')
        .setDescription('DM all members')
        .addStringOption(option =>
            option.setName('message')
                .setDescription('Message')
                .setRequired(true))
        .addAttachmentOption(option =>
            option.setName('file')
                .setDescription('Optional file')
                .setRequired(false))
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    // ================= ANNOUNCE =================

    new SlashCommandBuilder()
        .setName('announce')
        .setDescription('Send announcement')
        .addChannelOption(option =>
            option.setName('channel')
                .setDescription('Target channel')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('message')
                .setDescription('Announcement')
                .setRequired(true))
        .addAttachmentOption(option =>
            option.setName('file')
                .setDescription('Optional file')
                .setRequired(false))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),

    // ================= CLEAR =================

    new SlashCommandBuilder()
        .setName('clear')
        .setDescription('Delete messages')
        .addIntegerOption(option =>
            option.setName('amount')
                .setDescription('Amount')
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

    // ================= LOCK =================

    new SlashCommandBuilder()
        .setName('lock')
        .setDescription('Lock a channel')
        .addChannelOption(option =>
            option.setName('channel')
                .setDescription('Channel')
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),

    // ================= UNLOCK =================

    new SlashCommandBuilder()
        .setName('unlock')
        .setDescription('Unlock a channel')
        .addChannelOption(option =>
            option.setName('channel')
                .setDescription('Channel')
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),

    // ================= SLOWMODE =================

    new SlashCommandBuilder()
        .setName('slowmode')
        .setDescription('Set slowmode')
        .addChannelOption(option =>
            option.setName('channel')
                .setDescription('Channel')
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName('seconds')
                .setDescription('Seconds')
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),

    // ================= WARN =================

    new SlashCommandBuilder()
        .setName('warn')
        .setDescription('Warn a user')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('User')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('Reason')
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

    // ================= ROLE =================

    new SlashCommandBuilder()
        .setName('role')
        .setDescription('Add or remove role')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('User')
                .setRequired(true))
        .addRoleOption(option =>
            option.setName('role')
                .setDescription('Role')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('action')
                .setDescription('add/remove')
                .setRequired(true)
                .addChoices(
                    { name: 'add', value: 'add' },
                    { name: 'remove', value: 'remove' }
                ))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles),

    // ================= NICK =================

    new SlashCommandBuilder()
        .setName('nick')
        .setDescription('Change nickname')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('User')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('nickname')
                .setDescription('Nickname')
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageNicknames),

    // ================= USERINFO =================

    new SlashCommandBuilder()
        .setName('userinfo')
        .setDescription('Get user info')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('User')
                .setRequired(true)),

    // ================= SERVERINFO =================

    new SlashCommandBuilder()
        .setName('serverinfo')
        .setDescription('Get server info')

].map(command => command.toJSON());

// ================= REGISTER COMMANDS =================

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

(async () => {

    try {

        console.log('Registering slash commands...');

        await rest.put(
            Routes.applicationCommands(process.env.CLIENT_ID),
            { body: commands }
        );

        console.log('Commands registered.');

    } catch (err) {

        console.error(err);
    }

})();

// ================= READY =================

client.once('ready', () => {

    console.log(`${client.user.tag} is online.`);
});

// ================= SLASH COMMANDS =================

client.on('interactionCreate', async interaction => {

    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === 'ban') {

        const user = interaction.options.getUser('user');
        const reason = interaction.options.getString('reason') || 'No reason';

        const member = await interaction.guild.members.fetch(user.id).catch(() => null);

        if (!member)
            return interaction.reply({ content: 'User not found.', ephemeral: true });

        await member.ban({ reason });

        interaction.reply(`✅ Banned ${user.tag}`);
    }

    if (interaction.commandName === 'unban') {

        const userId = interaction.options.getString('userid');

        try {

            await interaction.guild.members.unban(userId);

            interaction.reply(`✅ Unbanned ${userId}`);

        } catch {

            interaction.reply({
                content: 'Failed to unban.',
                ephemeral: true
            });
        }
    }

    if (interaction.commandName === 'kick') {

        const user = interaction.options.getUser('user');
        const reason = interaction.options.getString('reason') || 'No reason';

        const member = await interaction.guild.members.fetch(user.id).catch(() => null);

        if (!member)
            return interaction.reply({ content: 'User not found.', ephemeral: true });

        await member.kick(reason);

        interaction.reply(`✅ Kicked ${user.tag}`);
    }

    if (interaction.commandName === 'timeout') {

        const user = interaction.options.getUser('user');
        const minutes = interaction.options.getInteger('minutes');

        const member = await interaction.guild.members.fetch(user.id).catch(() => null);

        if (!member)
            return interaction.reply({ content: 'User not found.', ephemeral: true });

        await member.timeout(minutes * 60 * 1000);

        interaction.reply(`✅ Timed out ${user.tag}`);
    }

    if (interaction.commandName === 'clear') {

        const amount = interaction.options.getInteger('amount');

        await interaction.channel.bulkDelete(amount, true);

        interaction.reply({
            content: `✅ Deleted ${amount} messages.`,
            ephemeral: true
        });
    }

    if (interaction.commandName === 'lock') {

        const channel = interaction.options.getChannel('channel');

        await channel.permissionOverwrites.edit(interaction.guild.roles.everyone, {
            SendMessages: false
        });

        interaction.reply(`🔒 Locked ${channel}`);
    }

    if (interaction.commandName === 'unlock') {

        const channel = interaction.options.getChannel('channel');

        await channel.permissionOverwrites.edit(interaction.guild.roles.everyone, {
            SendMessages: true
        });

        interaction.reply(`🔓 Unlocked ${channel}`);
    }

    if (interaction.commandName === 'slowmode') {

        const channel = interaction.options.getChannel('channel');
        const seconds = interaction.options.getInteger('seconds');

        await channel.setRateLimitPerUser(seconds);

        interaction.reply(`🐌 Slowmode set to ${seconds}s`);
    }

    if (interaction.commandName === 'warn') {

        const user = interaction.options.getUser('user');
        const reason = interaction.options.getString('reason');

        try {
            await user.send(`⚠️ Warning from ${interaction.guild.name}\nReason: ${reason}`);
        } catch {}

        interaction.reply(`⚠️ Warned ${user.tag}`);
    }

    if (interaction.commandName === 'dm') {

        const user = interaction.options.getUser('user');
        const message = interaction.options.getString('message');
        const file = interaction.options.getAttachment('file');

        try {

            await user.send({
                content: message,
                files: file ? [file.url] : []
            });

            interaction.reply({
                content: `✅ DM sent to ${user.tag}`,
                ephemeral: true
            });

        } catch {

            interaction.reply({
                content: 'Failed to DM user.',
                ephemeral: true
            });
        }
    }

    if (interaction.commandName === 'dm_all') {

        const message = interaction.options.getString('message');
        const file = interaction.options.getAttachment('file');

        await interaction.reply({
            content: '📨 Sending DMs...',
            ephemeral: true
        });

        const members = await interaction.guild.members.fetch();

        let success = 0;
        let failed = 0;

        for (const [, member] of members) {

            if (member.user.bot) continue;

            try {

                await member.send({
                    content: message,
                    files: file ? [file.url] : []
                });

                success++;

            } catch {

                failed++;
            }
        }

        interaction.followUp({
            content: `✅ Done\nSuccess: ${success}\nFailed: ${failed}`,
            ephemeral: true
        });
    }

    if (interaction.commandName === 'announce') {

        const channel = interaction.options.getChannel('channel');
        const message = interaction.options.getString('message');
        const file = interaction.options.getAttachment('file');

        await channel.send({
            content: message,
            files: file ? [file.url] : []
        });

        interaction.reply({
            content: '✅ Announcement sent.',
            ephemeral: true
        });
    }

    if (interaction.commandName === 'userinfo') {

        const user = interaction.options.getUser('user');

        interaction.reply(`
👤 Username: ${user.tag}
🆔 ID: ${user.id}
🤖 Bot: ${user.bot}
`);
    }

    if (interaction.commandName === 'serverinfo') {

        const guild = interaction.guild;

        interaction.reply(`
🏠 Server: ${guild.name}
👥 Members: ${guild.memberCount}
🆔 ID: ${guild.id}
`);
    }
});

// ================= PREFIX COMMANDS =================

client.on('messageCreate', async message => {

    if (message.author.bot) return;
    if (!message.guild) return;
    if (!message.content.startsWith(prefix)) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    if (command === 'ban') {

        const user =
            message.mentions.users.first() ||
            await client.users.fetch(args[0]).catch(() => null);

        if (!user)
            return message.reply('Mention user or provide ID.');

        const member = await message.guild.members.fetch(user.id).catch(() => null);

        if (!member)
            return message.reply('User not found.');

        await member.ban();

        message.reply(`✅ Banned ${user.tag}`);
    }

    if (command === 'kick') {

        const user =
            message.mentions.users.first() ||
            await client.users.fetch(args[0]).catch(() => null);

        if (!user)
            return message.reply('Mention user or provide ID.');

        const member = await message.guild.members.fetch(user.id).catch(() => null);

        if (!member)
            return message.reply('User not found.');

        await member.kick();

        message.reply(`✅ Kicked ${user.tag}`);
    }

    if (command === 'timeout') {

        const user =
            message.mentions.users.first() ||
            await client.users.fetch(args[0]).catch(() => null);

        const minutes = parseInt(args[1]);

        if (!user || isNaN(minutes))
            return message.reply('.timeout @user 10');

        const member = await message.guild.members.fetch(user.id).catch(() => null);

        if (!member)
            return message.reply('User not found.');

        await member.timeout(minutes * 60 * 1000);

        message.reply(`✅ Timed out ${user.tag}`);
    }

    if (command === 'clear') {

        const amount = parseInt(args[0]);

        if (isNaN(amount))
            return message.reply('.clear 10');

        await message.channel.bulkDelete(amount, true);

        message.reply(`✅ Deleted ${amount} messages.`);
    }

    if (command === 'lock') {

        await message.channel.permissionOverwrites.edit(
            message.guild.roles.everyone,
            { SendMessages: false }
        );

        message.reply('🔒 Locked.');
    }

    if (command === 'unlock') {

        await message.channel.permissionOverwrites.edit(
            message.guild.roles.everyone,
            { SendMessages: true }
        );

        message.reply('🔓 Unlocked.');
    }

    if (command === 'slowmode') {

        const seconds = parseInt(args[0]);

        if (isNaN(seconds))
            return message.reply('.slowmode 5');

        await message.channel.setRateLimitPerUser(seconds);

        message.reply(`🐌 Slowmode ${seconds}s`);
    }

    if (command === 'warn') {

        const user =
            message.mentions.users.first() ||
            await client.users.fetch(args[0]).catch(() => null);

        if (!user)
            return message.reply('Mention user.');

        const reason = args.slice(1).join(' ');

        try {
            await user.send(`⚠️ Warning\nReason: ${reason}`);
        } catch {}

        message.reply(`⚠️ Warned ${user.tag}`);
    }

    if (command === 'dm') {

        const user =
            message.mentions.users.first() ||
            await client.users.fetch(args[0]).catch(() => null);

        if (!user)
            return message.reply('Mention user.');

        const dmMessage = args.slice(1).join(' ');

        try {

            await user.send({
                content: dmMessage,
                files: [...message.attachments.values()]
            });

            message.reply(`✅ DM sent to ${user.tag}`);

        } catch {

            message.reply('Failed to DM.');
        }
    }

    if (command === 'dmall') {

        const dmMessage = args.join(' ');

        const members = await message.guild.members.fetch();

        let success = 0;
        let failed = 0;

        for (const [, member] of members) {

            if (member.user.bot) continue;

            try {

                await member.send({
                    content: dmMessage,
                    files: [...message.attachments.values()]
                });

                success++;

            } catch {

                failed++;
            }
        }

        message.reply(`✅ Done\nSuccess: ${success}\nFailed: ${failed}`);
    }

    if (command === 'announce') {

        const channel = message.mentions.channels.first();

        if (!channel)
            return message.reply('.announce #channel message');

        const announceMessage = args.slice(1).join(' ');

        await channel.send({
            content: announceMessage,
            files: [...message.attachments.values()]
        });

        message.reply('✅ Announcement sent.');
    }

    if (command === 'userinfo') {

        const user = message.mentions.users.first() || message.author;

        message.reply(`
👤 Username: ${user.tag}
🆔 ID: ${user.id}
🤖 Bot: ${user.bot}
`);
    }

    if (command === 'serverinfo') {

        const guild = message.guild;

        message.reply(`
🏠 Server: ${guild.name}
👥 Members: ${guild.memberCount}
🆔 ID: ${guild.id}
`);
    }
});

client.login(process.env.TOKEN);