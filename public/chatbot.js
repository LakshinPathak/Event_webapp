// Create an instance of Eliza
const eliza = new Eliza();

// Function to initialize the chat
function initializeChat() {
    // Event listener for the "Send" button
    document.getElementById('send-button').addEventListener('click', sendMessage);

    // Event listener for the "Enter" key in the input field
    document.getElementById('user-input').addEventListener('keydown', function (event) {
        if (event.key === 'Enter') {
            sendMessage();
        }
    });

    // Initial message from Eliza
    appendMessage('Eliza', 'Hello! I am Eliza, your chatbot therapist. Type a message to start the conversation.', 'eliza');
}

// Function to send a user message and receive Eliza's response
function sendMessage() {
    const userInput = document.getElementById('user-input').value.trim();

    if (userInput === '') {
        return; // Ignore empty messages
    }

    // Display user message
    appendMessage('You', userInput, 'user');

    // Get Eliza's response
    const elizaResponse = eliza.transform(userInput);

    // Display Eliza's response
    appendMessage('Eliza', elizaResponse, 'eliza');

    // Clear the input field
    document.getElementById('user-input').value = '';
}

// Function to append a message to the chat container
function appendMessage(sender, message, className) {
    const chatContainer = document.getElementById('chat-container');
    const messageElement = document.createElement('div');
    messageElement.classList.add(className);
    messageElement.innerHTML = `<strong>${sender}:</strong> ${message}`;
    chatContainer.appendChild(messageElement);

    // Scroll to the bottom of the chat container
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

// Call the initializeChat function when the page is loaded
document.addEventListener('DOMContentLoaded', initializeChat);
