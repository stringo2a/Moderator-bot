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

    // BAN
    new SlashCommandBuilder()
        .setName('ban')
        .setDescription('Ban a user')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('Target user')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('Reason')
                .setRequired(false))
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

    // UNBAN
    new SlashCommandBuilder()
        .setName('unban')
        .setDescription('Unban a user')
        .addStringOption(option =>
            option.setName('userid')
                .setDescription('User ID')
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

    // KICK
    new SlashCommandBuilder()
        .setName('kick')
        .setDescription('Kick a user')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('Target user')
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),

    // TIMEOUT
    new SlashCommandBuilder()
        .setName('timeout')
        .setDescription('Timeout a user')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('Target user')
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName('minutes')
                .setDescription('Minutes')
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

    // CLEAR
    new SlashCommandBuilder()
        .setName('clear')
        .setDescription('Delete messages')
        .addIntegerOption(option =>
            option.setName('amount')
                .setDescription('1-100')
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

    // LOCK
    new SlashCommandBuilder()
        .setName('lock')
        .setDescription('Lock channel')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),

    // UNLOCK
    new SlashCommandBuilder()
        .setName('unlock')
        .setDescription('Unlock channel')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),

    // SLOWMODE
    new SlashCommandBuilder()
        .setName('slowmode')
        .setDescription('Set slowmode')
        .addIntegerOption(option =>
            option.setName('seconds')
                .setDescription('Seconds')
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),

    // ANNOUNCE
    new SlashCommandBuilder()
        .setName('announce')
        .setDescription('Send announcement')
        .addChannelOption(option =>
            option.setName('channel')
                .setDescription('Target channel')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('message')
                .setDescription('Message')
                .setRequired(true))
        .addAttachmentOption(option =>
            option.setName('file')
                .setDescription('Optional file')
                .setRequired(false)),

    // DM
    new SlashCommandBuilder()
        .setName('dm')
        .setDescription('DM user')
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
                .setRequired(false)),

    // DM ALL
    new SlashCommandBuilder()
        .setName('dm_all')
        .setDescription('DM everyone')
        .addStringOption(option =>
            option.setName('message')
                .setDescription('Message')
                .setRequired(true))
        .addAttachmentOption(option =>
            option.setName('file')
                .setDescription('Optional file')
                .setRequired(false)),

    // WARN
    new SlashCommandBuilder()
        .setName('warn')
        .setDescription('Warn a user')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('Target user')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('Reason')
                .setRequired(true)),

    // NICK
    new SlashCommandBuilder()
        .setName('nick')
        .setDescription('Change nickname')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('Target user')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('nickname')
                .setDescription('Nickname')
                .setRequired(true)),

    // ROLE
    new SlashCommandBuilder()
        .setName('role')
        .setDescription('Add/remove role')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('Target user')
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
                )),

    // MEMBERS
    new SlashCommandBuilder()
        .setName('members')
        .setDescription('Show member count'),

    // USERINFO
    new SlashCommandBuilder()
        .setName('userinfo')
        .setDescription('Show user info')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('User')
                .setRequired(false)),

    // SERVERINFO
    new SlashCommandBuilder()
        .setName('serverinfo')
        .setDescription('Show server info'),

    // PING
    new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Bot ping')

].map(cmd => cmd.toJSON());

// ================= REGISTER =================

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

(async () => {

    try {

        console.log('Registering commands...');

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

    try {

        // BAN
        if (interaction.commandName === 'ban') {

            const user = interaction.options.getUser('user');
            const reason = interaction.options.getString('reason') || 'No reason';

            const member = await interaction.guild.members.fetch(user.id);

            await member.ban({ reason });

            return interaction.reply(`✅ Banned ${user.tag}`);
        }

        // UNBAN
        if (interaction.commandName === 'unban') {

            const userid = interaction.options.getString('userid');

            await interaction.guild.members.unban(userid);

            return interaction.reply(`✅ Unbanned ${userid}`);
        }

        // KICK
        if (interaction.commandName === 'kick') {

            const user = interaction.options.getUser('user');

            const member = await interaction.guild.members.fetch(user.id);

            await member.kick();

            return interaction.reply(`✅ Kicked ${user.tag}`);
        }

        // TIMEOUT
        if (interaction.commandName === 'timeout') {

            const user = interaction.options.getUser('user');
            const minutes = interaction.options.getInteger('minutes');

            const member = await interaction.guild.members.fetch(user.id);

            await member.timeout(minutes * 60 * 1000);

            return interaction.reply(`✅ Timed out ${user.tag}`);
        }

        // CLEAR
        if (interaction.commandName === 'clear') {

            const amount = interaction.options.getInteger('amount');

            await interaction.channel.bulkDelete(amount, true);

            return interaction.reply({
                content: `✅ Deleted ${amount} messages.`,
                ephemeral: true
            });
        }

        // LOCK
        if (interaction.commandName === 'lock') {

            await interaction.channel.permissionOverwrites.edit(
                interaction.guild.roles.everyone,
                { SendMessages: false }
            );

            return interaction.reply('🔒 Channel locked.');
        }

        // UNLOCK
        if (interaction.commandName === 'unlock') {

            await interaction.channel.permissionOverwrites.edit(
                interaction.guild.roles.everyone,
                { SendMessages: true }
            );

            return interaction.reply('🔓 Channel unlocked.');
        }

        // SLOWMODE
        if (interaction.commandName === 'slowmode') {

            const seconds = interaction.options.getInteger('seconds');

            await interaction.channel.setRateLimitPerUser(seconds);

            return interaction.reply(`🐌 Slowmode set to ${seconds}s`);
        }

        // ANNOUNCE
        if (interaction.commandName === 'announce') {

            const channel = interaction.options.getChannel('channel');
            const message = interaction.options.getString('message');
            const file = interaction.options.getAttachment('file');

            await channel.send({
                content: message,
                files: file ? [file.url] : []
            });

            return interaction.reply({
                content: '✅ Announcement sent.',
                ephemeral: true
            });
        }

        // DM
        if (interaction.commandName === 'dm') {

            const user = interaction.options.getUser('user');
            const message = interaction.options.getString('message');
            const file = interaction.options.getAttachment('file');

            await user.send({
                content: message,
                files: file ? [file.url] : []
            });

            return interaction.reply({
                content: `✅ DM sent to ${user.tag}`,
                ephemeral: true
            });
        }

        // DM ALL
        if (interaction.commandName === 'dm_all') {

            const message = interaction.options.getString('message');
            const file = interaction.options.getAttachment('file');

            await interaction.reply({
                content: '📨 Sending...',
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

            return interaction.followUp({
                content: `✅ Done\nSuccess: ${success}\nFailed: ${failed}`,
                ephemeral: true
            });
        }

        // WARN
        if (interaction.commandName === 'warn') {

            const user = interaction.options.getUser('user');
            const reason = interaction.options.getString('reason');

            try {
                await user.send(`⚠️ Warning\nReason: ${reason}`);
            } catch {}

            return interaction.reply(`⚠️ Warned ${user.tag}`);
        }

        // NICK
        if (interaction.commandName === 'nick') {

            const user = interaction.options.getUser('user');
            const nickname = interaction.options.getString('nickname');

            const member = await interaction.guild.members.fetch(user.id);

            await member.setNickname(nickname);

            return interaction.reply(`✅ Nickname updated.`);
        }

        // ROLE
        if (interaction.commandName === 'role') {

            const user = interaction.options.getUser('user');
            const role = interaction.options.getRole('role');
            const action = interaction.options.getString('action');

            const member = await interaction.guild.members.fetch(user.id);

            if (action === 'add') {
                await member.roles.add(role);
                return interaction.reply(`✅ Role added.`);
            }

            if (action === 'remove') {
                await member.roles.remove(role);
                return interaction.reply(`✅ Role removed.`);
            }
        }

        // MEMBERS
        if (interaction.commandName === 'members') {

            const guild = interaction.guild;

            const humans = guild.members.cache.filter(m => !m.user.bot).size;
            const bots = guild.members.cache.filter(m => m.user.bot).size;

            return interaction.reply(`
👥 Total Members: ${guild.memberCount}
🧍 Humans: ${humans}
🤖 Bots: ${bots}
`);
        }

        // USERINFO
        if (interaction.commandName === 'userinfo') {

            const user = interaction.options.getUser('user') || interaction.user;

            return interaction.reply(`
👤 Username: ${user.tag}
🆔 ID: ${user.id}
🤖 Bot: ${user.bot}
`);
        }

        // SERVERINFO
        if (interaction.commandName === 'serverinfo') {

            const guild = interaction.guild;

            return interaction.reply(`
🏠 Server: ${guild.name}
👥 Members: ${guild.memberCount}
🆔 ID: ${guild.id}
`);
        }

        // PING
        if (interaction.commandName === 'ping') {

            return interaction.reply(`🏓 ${client.ws.ping}ms`);
        }

    } catch (err) {

        console.error(err);

        if (interaction.replied || interaction.deferred) {

            await interaction.followUp({
                content: '❌ Command failed.',
                ephemeral: true
            }).catch(() => {});

        } else {

            await interaction.reply({
                content: '❌ Command failed.',
                ephemeral: true
            }).catch(() => {});
        }
    }
});

// ================= PREFIX COMMANDS =================

client.on('messageCreate', async message => {

    if (message.author.bot) return;
    if (!message.guild) return;
    if (!message.content.startsWith(prefix)) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    try {

        // MEMBERS
        if (command === 'members') {

            const guild = message.guild;

            const humans = guild.members.cache.filter(m => !m.user.bot).size;
            const bots = guild.members.cache.filter(m => m.user.bot).size;

            return message.reply(`
👥 Total Members: ${guild.memberCount}
🧍 Humans: ${humans}
🤖 Bots: ${bots}
`);
        }

        // PING
        if (command === 'ping') {
            return message.reply(`🏓 ${client.ws.ping}ms`);
        }

    } catch (err) {

        console.error(err);

        message.reply('❌ Command failed.');
    }
});

// ================= ERRORS =================

process.on('unhandledRejection', error => {
    console.error(error);
});

process.on('uncaughtException', error => {
    console.error(error);
});

// ================= LOGIN =================

client.login(process.env.TOKEN);