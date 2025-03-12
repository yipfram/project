# Finnish Language Learning App

Welcome to the Finnish Language Learning App! This app helps you learn Finnish through realistic conversations in everyday situations.

## What This App Does

This app lets you practice Finnish by having conversations with a virtual Finnish person. It's like having a Finnish friend who helps you practice the language in real-life situations!

Currently, you can practice a conversation at a supermarket, where you'll talk with a virtual cashier in Finnish.

## Before You Start

This app uses artificial intelligence (AI) to create realistic conversations. To access the full features:

1. You'll need an OpenAI API key (think of this as a special password that lets the app use AI)
2. Don't worry if this sounds complicated - we'll explain how to get one below!

## Getting Your OpenAI API Key

1. Go to the OpenAI website: [https://platform.openai.com/](https://platform.openai.com/)
2. Create an account or sign in
3. Click on your profile picture in the top-right corner
4. Select "API keys"
5. Click "Create new secret key"
6. Give it a name (like "Finnish App") and click "Create"
7. Copy your new key (it looks like a long string of letters and numbers starting with "sk-")

## Setting Up the App

If you're just downloading this app for the first time:

1. Create a file named `.env` in the main folder (the same folder as this README)
2. In that file, write this single line, replacing `your_key_here` with your OpenAI API key:
   ```
   OPENAI_API_KEY=your_key_here
   ```
3. Save the file

If you don't want to create this file, that's okay too! The app will ask you for your API key when you open it.

## Using the App

1. Start the app (see instructions below)
2. Select the "Shop" scenario
3. The virtual cashier will greet you in Finnish
4. Reply by typing in the text box at the bottom
5. Continue the conversation until you say goodbye ("Näkemiin" or "Moi moi")
6. Get helpful feedback on how you did!

## Helpful Finnish Phrases for Shopping

- "Hei" / "Moi" (Hello)
- "Mitä tämä maksaa?" (How much does this cost?)
- "Saanko [tuotteen]?" (May I have [product]?)
- "Kiitos" (Thank you)
- "Näkemiin" / "Moi moi" (Goodbye)

## Common Products in Finnish

- "leipä" (bread)
- "maito" (milk)
- "vesi" (water)
- "kahvi" (coffee)
- "sokeri" (sugar)
- "suola" (salt)

## Starting the App

You'll need to have Node.js installed on your computer to run this app. If you don't have it yet, download it from [nodejs.org](https://nodejs.org/).

Once installed:

1. Open a command prompt (Windows) or terminal (Mac/Linux)
2. Navigate to the folder containing this app
3. Type `npm install` and press Enter (this installs all the necessary components)
4. Type `npm run dev` and press Enter (this starts the app)
5. Open your web browser and go to: http://localhost:8081
   - Or use the Expo Go app on your phone by scanning the QR code that appears

## What's Under the Hood

This app is built with:

- **React Native**: A framework for building mobile apps
- **Expo**: A platform that makes it easier to build and test React Native apps
- **OpenAI API**: Powers the intelligent conversations

Don't worry if these terms don't make sense to you - you don't need to understand them to use the app!

## Privacy Note

When using your OpenAI API key, your conversations are sent to OpenAI through your own account. No data is stored on our servers. The app keeps your API key on your device only. 