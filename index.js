require('dotenv').config();
const { Client, GatewayIntentBits, Partials } = require('discord.js');
const express = require('express'); 
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
  partials: [Partials.Message, Partials.Channel],
});

// === RULE EMOTE PER CHANNEL ===
const EMOTE_RULES = {
  "🚗pos-1": ["✅", "👌", "🚨", "0️⃣", "1️⃣", "2️⃣", "3️⃣", "➕"],
  "🛗pos-2": ["✅", "👌", "🚨"]
};

client.once('ready', async () => {
  console.log(`✅ Bot aktif sebagai ${client.user.tag}`);

  await client.guilds.fetch();
});

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// === AUTO REACT LOGIC ===
client.on('messageCreate', async (message) => {
  if (message.author.bot) return;
  const channelName = message.channel.name;
  const emojis = EMOTE_RULES[channelName];

  if (!emojis) return;

  Promise.allSettled(
    emojis.map(e => message.react(e).catch(err => {
      console.warn(`❗ Gagal react ${e}: ${err.message}`);
    }))
  );
});

// === START ===
client.login(process.env.TOKEN).catch(err => {
  console.error('❌ Gagal login! Pastikan token benar:', err.message);
});

const app = express();
app.get('/', (req, res) => res.send('LogiskemBot is running'));
app.listen(process.env.PORT, () => console.log('🌐 Webserver aktif'));
