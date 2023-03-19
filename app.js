// Require the necessary discord.js classes
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'url';
import { Client, Collection, Events, GatewayIntentBits } from 'discord.js';
import { loadCommands } from './deploy-commands.js';

// Create a new client instance
const client = new Client({
    intents: [
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

(async () => {
    for (const file of eventFiles) {
        const filePath = path.join(eventsPath, file);
        const event = await import(filePath);

        if (event.once) {
            client.once(event.name, (...args) => event.execute(...args));
        } else {
            client.on(event.name, (...args) => event.execute(...args));
        }
    }
})();



