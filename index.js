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

// ================= COMMANDS =================

const commands = [

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
                .setRequired(false)),

    new SlashCommandBuilder()
        .setName('kick')
        .setDescription('Kick a user')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('Target user')
                .setRequired(true)),

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
                .setRequired(true)),

    new SlashCommandBuilder()
        .setName('clear')
        .setDescription('Delete messages')
        .addIntegerOption(option =>
            option.setName('amount')
                .setDescription('1-100')
                .setRequired(true)),

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
                .setRequired(false))

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

        // ================= BAN =================

        if (interaction.commandName === 'ban') {

            const user = interaction.options.getUser('user');
            const reason = interaction.options.getString('reason') || 'No reason';

            const member = await interaction.guild.members.fetch(user.id);

            await member.ban({ reason });

            return interaction.reply(`✅ Banned ${user.tag}`);
        }

        // ================= KICK =================

        if (interaction.commandName === 'kick') {

            const user = interaction.options.getUser('user');

            const member = await interaction.guild.members.fetch(user.id);

            await member.kick();

            return interaction.reply(`✅ Kicked ${user.tag}`);
        }

        // ================= TIMEOUT =================

        if (interaction.commandName === 'timeout') {

            const user = interaction.options.getUser('user');
            const minutes = interaction.options.getInteger('minutes');

            const member = await interaction.guild.members.fetch(user.id);

            await member.timeout(minutes * 60 * 1000);

            return interaction.reply(`✅ Timed out ${user.tag}`);
        }

        // ================= CLEAR =================

        if (interaction.commandName === 'clear') {

            const amount = interaction.options.getInteger('amount');

            if (amount < 1 || amount > 100) {

                return interaction.reply({
                    content: 'Choose 1-100.',
                    ephemeral: true
                });
            }

            await interaction.channel.bulkDelete(amount, true);

            return interaction.reply({
                content: `✅ Deleted ${amount} messages.`,
                ephemeral: true
            });
        }

        // ================= ANNOUNCE =================

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

        // ================= DM =================

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

        // ================= DM ALL =================

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

        // ================= BAN =================

        if (command === 'ban') {

            const user =
                message.mentions.users.first() ||
                await client.users.fetch(args[0]).catch(() => null);

            if (!user)
                return message.reply('Mention user or ID.');

            const member = await message.guild.members.fetch(user.id);

            await member.ban();

            return message.reply(`✅ Banned ${user.tag}`);
        }

        // ================= KICK =================

        if (command === 'kick') {

            const user =
                message.mentions.users.first() ||
                await client.users.fetch(args[0]).catch(() => null);

            if (!user)
                return message.reply('Mention user or ID.');

            const member = await message.guild.members.fetch(user.id);

            await member.kick();

            return message.reply(`✅ Kicked ${user.tag}`);
        }

        // ================= TIMEOUT =================

        if (command === 'timeout') {

            const user =
                message.mentions.users.first() ||
                await client.users.fetch(args[0]).catch(() => null);

            const minutes = parseInt(args[1]);

            if (!user || isNaN(minutes))
                return message.reply('.timeout @user 10');

            const member = await message.guild.members.fetch(user.id);

            await member.timeout(minutes * 60 * 1000);

            return message.reply(`✅ Timed out ${user.tag}`);
        }

        // ================= CLEAR =================

        if (command === 'clear') {

            const amount = parseInt(args[0]);

            if (isNaN(amount))
                return message.reply('.clear 10');

            await message.channel.bulkDelete(amount, true);

            return message.reply(`✅ Deleted ${amount} messages.`);
        }

        // ================= ANNOUNCE =================

        if (command === 'announce') {

            const channel = message.mentions.channels.first();

            if (!channel)
                return message.reply('.announce #channel message');

            const announceMessage = args.slice(1).join(' ');

            await channel.send({
                content: announceMessage,
                files: [...message.attachments.values()]
            });

            return message.reply('✅ Announcement sent.');
        }

        // ================= DM =================

        if (command === 'dm') {

            const user =
                message.mentions.users.first() ||
                await client.users.fetch(args[0]).catch(() => null);

            if (!user)
                return message.reply('Mention user.');

            const dmMessage = args.slice(1).join(' ');

            await user.send({
                content: dmMessage,
                files: [...message.attachments.values()]
            });

            return message.reply(`✅ DM sent to ${user.tag}`);
        }

        // ================= DMALL =================

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

            return message.reply(`✅ Done\nSuccess: ${success}\nFailed: ${failed}`);
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