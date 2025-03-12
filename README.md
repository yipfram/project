# Finnish Language Learning App

An interactive app to help you learn Finnish through simulated real-life scenarios.

## Features

- Interactive scenario-based learning
- Text and speech input options
- AI-powered conversation partner
- Feedback on language usage

## Shop Scenario

The app includes a shop scenario where you can practice basic Finnish conversation with a cashier. You'll learn:

- Basic greetings and courtesies
- How to ask for products
- Numbers and prices
- How to pay and say goodbye

## Setting Up OpenAI API Integration

The app supports both mock responses (for demo) and real OpenAI API integration. To use the real AI:

1. Create an account at [OpenAI](https://platform.openai.com/)
2. Navigate to the API section and create a new API key
3. In the app, click the "Connect OpenAI API" button in the shop scenario
4. Enter your API key in the dialog that appears
5. Your key is stored locally on your device only

## How to Use the Shop Scenario

1. From the scenarios tab, select "At the Supermarket"
2. The cashier will greet you in Finnish
3. Respond by typing or using the microphone button
4. Continue the conversation until you say goodbye
5. Receive feedback on your Finnish language skills

## Common Finnish Phrases for Shopping

- "Hei" / "Terve" (Hello)
- "Mitä tämä maksaa?" (How much does this cost?)
- "Saanko [tuotteen]?" (May I have [product]?)
- "Kiitos" (Thank you)
- "Näkemiin" (Goodbye)

## Products in Finnish

- "leipä" (bread)
- "maito" (milk)
- "vesi" (water)
- "kahvi" (coffee)
- "sokeri" (sugar)
- "suola" (salt)

## Privacy Note

When using your own OpenAI API key, your conversations are sent to OpenAI for processing through your own account. No data is stored on our servers.

## Development Notes

This app is built with React Native and Expo, using TypeScript for type safety.

- To run the app: `npm run dev`
- To build for production: `npm run build:web` 