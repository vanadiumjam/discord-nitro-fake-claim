const { Client, GatewayIntentBits, Partials, Events, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, REST, Routes, InteractionType } = require('discord.js');
const dotenv = require('dotenv');
dotenv.config();

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
    partials: [Partials.Channel]
});

const token = process.env.DISCORD_TOKEN;

// Nitro 버튼 인터랙션 응답 핸들링
client.on(Events.InteractionCreate, async (interaction) => {
    if (interaction.isButton()) {
        if (interaction.customId === 'claim_nitro_button') {
            const delay = Math.floor(Math.random() * 3000) + 2000; // 2~5초 딜레이
            await new Promise(resolve => setTimeout(resolve, delay));
            await interaction.reply({ content: 'This gift has already been claimed.', ephemeral: true });
        }
    }

    if (interaction.type === InteractionType.ApplicationCommand && interaction.commandName === 'nitro') {
        await sendNitro(interaction);
    }
});

// 커맨드 등록
client.once(Events.ClientReady, async () => {
    console.log(`✅ Logged in as ${client.user.tag}`);

    const commands = [
        {
            name: 'nitro',
            description: 'Give nitro'
        }
    ];

    const rest = new REST({ version: '10' }).setToken(token);
    try {
        console.log('🔁 Registering slash commands...');
        await rest.put(Routes.applicationCommands(client.user.id), { body: commands });
        console.log('✅ Slash commands registered!');
    } catch (error) {
        console.error('❌ Error registering commands:', error);
    }
});

// Nitro 메시지 + 버튼 생성 함수
async function sendNitro(interactionOrMessage) {
    const user = interactionOrMessage.user || interactionOrMessage.author;

    const embed = new EmbedBuilder()
        .setTitle("You've been gifted a subscription!")
        .setDescription(`${user} has gifted you Nitro for **1 month**!`)
        .setTimestamp(new Date())
        .setImage("https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fassets.beartai.com%2Fuploads%2F2022%2F08%2FDiscordNitro.jpg&f=1&nofb=1&ipt=076550686750667128f3143a8304cc8b55b77d9d44a9106d1c0a65b704ed5ad4&ipo=images")
        .setFooter({ text: "Discord Nitro Generator Beta v1.0" });

    const button = new ButtonBuilder()
        .setCustomId('claim_nitro_button')
        .setLabel('Claim Nitro')
        .setStyle(ButtonStyle.Success);

    const row = new ActionRowBuilder().addComponents(button);

    if ('reply' in interactionOrMessage) {
        await interactionOrMessage.reply({ embeds: [embed], components: [row] });
    } else {
        await interactionOrMessage.channel.send({ embeds: [embed], components: [row] });
    }
}

client.on(Events.MessageCreate, async (message) => {
    if (message.author.bot) return;
    if (message.content === '!nitro') {
        await sendNitro(message);
    }
});

client.login(token);
