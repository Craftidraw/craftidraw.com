export function generateRandomUsername(): string {
    const adjectives = [
        'crazy',
        'happy',
        'sleepy',
        'funny',
        'clever',
        'lazy',
        'smart',
        'wicked',
        'silly',
        'angry',
        'brave',
        'chill',
        'grumpy',
        'curious',
        'wild',
        'fierce',
        'jolly',
        'quirky',
        'sneaky',
        'bold',
    ];

    const nouns = [
        'pufferfish',
        'penguin',
        'raccoon',
        'dolphin',
        'octopus',
        'snail',
        'cat',
        'dog',
        'fish',
        'bird',
        'dragon',
        'unicorn',
        'koala',
        'turtle',
        'rabbit',
        'fox',
        'wolf',
        'shark',
        'parrot',
        'hamster',
    ];

    const number = Math.floor(Math.random() * 1000);

    const randomAdj = adjectives[Math.floor(Math.random() * adjectives.length)];
    const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];

    return `${randomAdj}-${randomNoun}-${number}`;
}
