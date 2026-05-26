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
        .setName('userinfo')
        .setDescription('Show user info')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('Target user')
                .setRequired(false)
        ),

    new SlashCommandBuilder()
        .setName('serverinfo')
        .setDescription('Show server info'),

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
        )
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('Reason')
                .setRequired(false)
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
        .setDescription('Kick user')
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
        .setName('warn')
        .setDescription('Warn user')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('Target')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('Reason')
                .setRequired(true)
        ),

    new SlashCommandBuilder()
        .setName('nick')
        .setDescription('Change nickname')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('Target')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('nickname')
                .setDescription('Nickname')
                .setRequired(true)
        ),

    new SlashCommandBuilder()
        .setName('role')
        .setDescription('Add/remove role')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('Target')
                .setRequired(true)
        )
        .addRoleOption(option =>
            option.setName('role')
                .setDescription('Role')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('action')
                .setDescription('add/remove')
                .setRequired(true)
                .addChoices(
                    { name: 'add', value: 'add' },
                    { name: 'remove', value: 'remove' }
                )
        ),

    new SlashCommandBuilder()
        .setName('announce')
        .setDescription('Send announcement')
        .addChannelOption(option =>
            option.setName('channel')
                .setDescription('Target channel')
                .addChannelTypes(ChannelType.GuildText)
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('message')
                .setDescription('Message')
                .setRequired(true)
        )
        .addAttachmentOption(option =>
            option.setName('file')
                .setDescription('Optional file')
                .setRequired(false)
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
        )
        .addAttachmentOption(option =>
            option.setName('file')
                .setDescription('Optional file')
                .setRequired(false)
        ),

    new SlashCommandBuilder()
        .setName('dm_all')
        .setDescription('DM everyone')
        .addStringOption(option =>
            option.setName('message')
                .setDescription('Message')
                .setRequired(true)
        )
        .addAttachmentOption(option =>
            option.setName('file')
                .setDescription('Optional file')
                .setRequired(false)
        )

].map(command => command.toJSON());

// ================= REGISTER COMMANDS =================

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
            const reason = interaction.options.getString('reason') || 'No reason';

            const member = await interaction.guild.members.fetch(user.id);

            await member.ban({ reason });

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
                { SendMessages: false }
            );

            return interaction.reply('🔒 Channel locked');
        }

        // UNLOCK
        if (interaction.commandName === 'unlock') {

            await interaction.channel.permissionOverwrites.edit(
                interaction.guild.roles.everyone,
                { SendMessages: true }
            );

            return interaction.reply('🔓 Channel unlocked');
        }

        // SLOWMODE
        if (interaction.commandName === 'slowmode') {

            const seconds = interaction.options.getInteger('seconds');

            await interaction.channel.setRateLimitPerUser(seconds);

            return interaction.reply(`🐌 Slowmode set to ${seconds}s`);
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

            return interaction.reply(`✅ Nickname changed`);
        }

        // ROLE
        if (interaction.commandName === 'role') {

            const user = interaction.options.getUser('user');
            const role = interaction.options.getRole('role');
            const action = interaction.options.getString('action');

            const member = await interaction.guild.members.fetch(user.id);

            if (action === 'add') {
                await member.roles.add(role);
                return interaction.reply(`✅ Role added`);
            }

            if (action === 'remove') {
                await member.roles.remove(role);
                return interaction.reply(`✅ Role removed`);
            }
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
                content: '✅ Announcement sent',
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

            const text = interaction.options.getString('message');
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
                        content: text,
                        files: file ? [file.url] : []
                    });

                    success++;

                } catch {

                    failed++;
                }
            }

            return interaction.followUp({
                content: `✅ Sent to ${success} users\n❌ Failed: ${failed}`,
                ephemeral: true
            });
        }

    } catch (err) {

        console.log(err);

        if (!interaction.replied) {

            interaction.reply({
                content: '❌ Command failed',
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

        if (command === 'ping') {
            return message.reply(`🏓 ${client.ws.ping}ms`);
        }

        if (command === 'members') {
            return message.reply(`👥 Members: ${message.guild.memberCount}`);
        }

        if (command === 'clear') {

            const amount = parseInt(args[0]);

            await message.channel.bulkDelete(amount, true);

            return message.reply(`✅ Deleted ${amount} messages`);
        }

    } catch (err) {

        console.log(err);

        message.reply('❌ Command failed');
    }
});

client.login(process.env.TOKEN);