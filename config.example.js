// Configuration for the chatbot
// Copy this file to config.js and add your API keys
const CONFIG = {
    // HuggingFace API configuration (free tier)
    huggingface: {
        apiKey: '', // Optional - can be used without an API key
        model: 'google/flan-t5-small' // This is a free model that works without authentication
    },
    
    // OpenAI API configuration (requires payment)
    // Uncomment and fill in details if you want to use OpenAI instead
    /*
    openai: {
        apiKey: 'YOUR_OPENAI_API_KEY_HERE',
        model: 'gpt-3.5-turbo',
        maxTokens: 150,
        temperature: 0.7
    }
    */
}; 