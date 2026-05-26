require('dotenv').config();

const {
    Client,
    GatewayIntentBits,
    Partials,
    REST,
    Routes,
    SlashCommandBuilder,
    PermissionFlagsBits,
    ChannelType
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

    new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Show bot ping'),

    new SlashCommandBuilder()
        .setName('members')
        .setDescription('Show server members'),

    new SlashCommandBuilder()
        .setName('clear')
        .setDescription('Delete messages')
        .addIntegerOption(option =>
            option.setName('amount')
                .setDescription('1-100')
                .setRequired(true)
        ),

    new SlashCommandBuilder()
        .setName('ban')
        .setDescription('Ban a user')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('Target')
                .setRequired(true)
        ),

    new SlashCommandBuilder()
        .setName('unban')
        .setDescription('Unban user')
        .addStringOption(option =>
            option.setName('id')
                .setDescription('User ID')
                .setRequired(true)
        ),

    new SlashCommandBuilder()
        .setName('kick')
        .setDescription('Kick a user')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('Target')
                .setRequired(true)
        ),

    new SlashCommandBuilder()
        .setName('timeout')
        .setDescription('Timeout user')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('Target')
                .setRequired(true)
        )
        .addIntegerOption(option =>
            option.setName('minutes')
                .setDescription('Minutes')
                .setRequired(true)
        ),

    new SlashCommandBuilder()
        .setName('lock')
        .setDescription('Lock channel'),

    new SlashCommandBuilder()
        .setName('unlock')
        .setDescription('Unlock channel'),

    new SlashCommandBuilder()
        .setName('slowmode')
        .setDescription('Set slowmode')
        .addIntegerOption(option =>
            option.setName('seconds')
                .setDescription('Seconds')
                .setRequired(true)
        ),

    new SlashCommandBuilder()
        .setName('announce')
        .setDescription('Send announcement')
        .addChannelOption(option =>
            option.setName('channel')
                .setDescription('Channel')
                .addChannelTypes(ChannelType.GuildText)
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('message')
                .setDescription('Message')
                .setRequired(true)
        ),

    new SlashCommandBuilder()
        .setName('dm')
        .setDescription('DM user')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('Target')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('message')
                .setDescription('Message')
                .setRequired(true)
        ),

    new SlashCommandBuilder()
        .setName('dm_all')
        .setDescription('DM everyone')
        .addStringOption(option =>
            option.setName('message')
                .setDescription('Message')
                .setRequired(true)
        )

].map(command => command.toJSON());

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

        console.log(err);
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

        // PING
        if (interaction.commandName === 'ping') {

            return interaction.reply(`🏓 ${client.ws.ping}ms`);
        }

        // MEMBERS
        if (interaction.commandName === 'members') {

            return interaction.reply(`👥 Members: ${interaction.guild.memberCount}`);
        }

        // CLEAR
        if (interaction.commandName === 'clear') {

            const amount = interaction.options.getInteger('amount');

            await interaction.channel.bulkDelete(amount, true);

            return interaction.reply({
                content: `✅ Deleted ${amount} messages`,
                ephemeral: true
            });
        }

        // BAN
        if (interaction.commandName === 'ban') {

            const user = interaction.options.getUser('user');

            const member = await interaction.guild.members.fetch(user.id);

            await member.ban();

            return interaction.reply(`✅ Banned ${user.tag}`);
        }

        // UNBAN
        if (interaction.commandName === 'unban') {

            const id = interaction.options.getString('id');

            await interaction.guild.members.unban(id);

            return interaction.reply(`✅ Unbanned ${id}`);
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

        // LOCK
        if (interaction.commandName === 'lock') {

            await interaction.channel.permissionOverwrites.edit(
                interaction.guild.roles.everyone,
                {
                    SendMessages: false
                }
            );

            return interaction.reply('🔒 Channel locked');
        }

        // UNLOCK
        if (interaction.commandName === 'unlock') {

            await interaction.channel.permissionOverwrites.edit(
                interaction.guild.roles.everyone,
                {
                    SendMessages: true
                }
            );

            return interaction.reply('🔓 Channel unlocked');
        }

        // SLOWMODE
        if (interaction.commandName === 'slowmode') {

            const seconds = interaction.options.getInteger('seconds');

            await interaction.channel.setRateLimitPerUser(seconds);

            return interaction.reply(`🐌 Slowmode: ${seconds}s`);
        }

        // ANNOUNCE
        if (interaction.commandName === 'announce') {

            const channel = interaction.options.getChannel('channel');
            const message = interaction.options.getString('message');

            await channel.send(message);

            return interaction.reply({
                content: '✅ Announcement sent',
                ephemeral: true
            });
        }

        // DM
        if (interaction.commandName === 'dm') {

            const user = interaction.options.getUser('user');
            const message = interaction.options.getString('message');

            await user.send(message);

            return interaction.reply({
                content: `✅ Sent DM to ${user.tag}`,
                ephemeral: true
            });
        }

        // DM ALL
        if (interaction.commandName === 'dm_all') {

            const text = interaction.options.getString('message');

            await interaction.reply({
                content: '📨 Sending...',
                ephemeral: true
            });

            const members = await interaction.guild.members.fetch();

            let success = 0;

            for (const [, member] of members) {

                if (member.user.bot) continue;

                try {

                    await member.send(text);

                    success++;

                } catch {}
            }

            return interaction.followUp({
                content: `✅ Sent to ${success} users`,
                ephemeral: true
            });
        }

    } catch (err) {

        console.log(err);

        if (!interaction.replied) {

            interaction.reply({
                content: '❌ Error while executing command',
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

        // PING
        if (command === 'ping') {

            return message.reply(`🏓 ${client.ws.ping}ms`);
        }

        // MEMBERS
        if (command === 'members') {

            return message.reply(`👥 Members: ${message.guild.memberCount}`);
        }

        // CLEAR
        if (command === 'clear') {

            const amount = parseInt(args[0]);

            await message.channel.bulkDelete(amount, true);

            return message.reply(`✅ Deleted ${amount} messages`);
        }

    } catch (err) {

        console.log(err);

        message.reply('❌ Command error');
    }
});

// ================= LOGIN =================

client.login(process.env.TOKEN);