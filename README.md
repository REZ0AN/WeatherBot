# WeatherBot

A command-line interface chatbot powered by Google's Gemini AI that can fetch and analyze weather data for different cities.

## Features

- Interactive command-line interface
- Real-time weather data fetching using WeatherAPI
- Natural language processing using Google's Gemini AI
- Ability to perform calculations and comparisons with weather data
- Maintains conversation context

## Prerequisites

- Node.js (v14 or higher)
- NPM (Node Package Manager)
- API keys for:
  - Google Gemini AI
  - WeatherAPI

## Installation

1. Clone the repository:
```sh
git clone https://github.com/REZ0AN/WeatherBot.git
cd WeatherBot
```

2. Install dependencies:
```sh
npm install
```

3. Create a `.env` file in the root directory with your API keys:
```
GEMINI_API_KEY=<your_gemini_api_key>
WEATHER_API_KEY=<your_weather_api_key>
```

## Usage

Start the bot:
```sh
npm run cli
```

You can then interact with the bot using natural language. For example:
- "What's the temperature in London?"
- "Compare the weather between New York and Tokyo"
- "What is the sum of temperatures in Paris and Berlin?"

## Dependencies

- @google/genai - Google's Gemini AI SDK
- dotenv - Environment variable management
- readline-sync - Command-line input handling

## Note

Please ensure your API keys are kept secure and never commit them