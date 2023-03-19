import {
    InteractionType,
    InteractionResponseType,
    InteractionResponseFlags,
    MessageComponentTypes,
    ButtonStyleTypes,
} from 'discord-interactions';
import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export function helloWorld() {
    return {
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
            // Fetches a random emoji to send from a helper function
            content: 'hello world',
        },
    }
}

export async function helloGPT(prompt) {
    if (prompt === undefined) { return; }

    return {
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
            // Fetches a random emoji to send from a helper function
            content: await createGPTPrompt(prompt),
        },
    }
}

export async function basicChatGPT(prompt) {
    if (prompt === undefined) { return; }

    return {
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
            // Fetches a random emoji to send from a helper function
            content: await createChatGPTPrompt(prompt),
        },
    }
}

async function createGPTPrompt(prompt) {
    if (prompt === undefined) {
        console.log("animal null");
        return;
    }
    try {
        const completion = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: prompt,  //generatePrompt(prompt),
            temperature: 0.6,
        });
        return completion.data.choices[0].text;
    } catch (error) {
        console.log(error);
    }

}

async function createChatGPTPrompt(prompt) {
    if (prompt === undefined) {
        console.log("prompt null");
        return;
    }
    try {
        console.log("before");

        const completion = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: [{ "role": "system", "content": "You are a friendly Assistant" }, { "role": "user", "content": prompt }],
        });
        console.log("res: ", completion.data.choices[0].message['content']); // TODO

        return completion.data.choices[0];
    } catch (error) {
        console.log(error);
    }
}

function generatePrompt(animal) {
    const capitalizedAnimal =
        animal[0].toUpperCase() + animal.slice(1).toLowerCase();
    return `Suggest three names for an animal that is a superhero.

Animal: Cat
Names: Captain Sharpclaw, Agent Fluffball, The Incredible Feline
Animal: Dog
Names: Ruff the Protector, Wonder Canine, Sir Barks-a-Lot
Animal: ${capitalizedAnimal}
Names:`;
}