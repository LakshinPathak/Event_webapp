const readline = require('readline');
const Eliza = require('eliza');

// Create an instance of Eliza
const eliza = new Eliza();

// Create a readline interface for user input
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Function to start the chat with Eliza
function startChat() {
    console.log('Eliza: Hello! I am Eliza, your chatbot therapist. You can start the conversation. Type "exit" to end the chat.');

    // Start the conversation loop
    conversationLoop();
}

// Function to handle the conversation loop
function conversationLoop() {
    rl.question('You: ', (userInput) => {
        // Check if the user wants to exit the chat
        if (userInput.toLowerCase() === 'exit') {
            console.log('Eliza: Goodbye! Have a great day.');
            rl.close();
            return;
        }

        // Get Eliza's response
        const elizaResponse = eliza.transform(userInput);

        // Display Eliza's response
        console.log(`Eliza: ${elizaResponse}`);

        // Continue the conversation loop
        conversationLoop();
    });
}

// Start the chat when the script is run
startChat();
