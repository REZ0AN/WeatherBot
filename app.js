import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import readLineSync from 'readline-sync';
dotenv.config();

// keys
const LLM_API_KEY = process.env.GEMINI_API_KEY
const WEATHER_API_KEY = process.env.WEATHER_API_KEY;

// LLM initialization
const GenAI = new GoogleGenAI({
    apiKey: LLM_API_KEY
});

// tools

const getWeatherByCityName = async (city) => {
         try {
              const response = await fetch(
                `http://api.weatherapi.com/v1/current.json?key=${WEATHER_API_KEY}&q=${city}`
              );

              if (!response.ok) throw new Error("Weather fetch failed");

              const data = await response.json();
              return `${data.current.temp_c}°C`
            } catch (err) {
                return 'Failed to Fetch Weather Data'
            }
}

const tools = {
    "getWeatherByCityName": getWeatherByCityName,
}

// Prompt Pipeline
const SYSTEM_PROMPT = `
 You are an AI Assistant with START, PLAN, ACTION, OBSERVATION, and OUTPUT states.
 - Wait for the user prompt and first PLAN using available tools.
 - After Planning, take the ACTION with appropriate tools and wait for the OBSERVATION based on ACTION.
 - Once you get the observations, return the AI response based on START prompt and observations.

 NOTE: Strictly follow the JSON output format 

 Available Tools :
 - function getWeatherByCityName(city : string) : string
 getWeatherByCityName is a function that accepts city name as string and retruns the weather in celcius.

 Example:
 {"type": "user", "user": "What is the sum of the weather of Barisal and Dhaka?"}
 {"type": "plan", "plan": "I will call the getWeatherByCityName for Barisal"}
 {"type": "action", "function": "getWeatherByCityName", "input":"Barisal"}
 {"type": "observation", "observation":"31°C"}
 {"type": "plan", "plan": "I will call the getWeatherByCityName for Dhaka"}
 {"type": "action", "function": "getWeatherByCityName", "input":"Dhaka"}
 {"type": "observation", "observation":"33°C"}
 {"type": "output", "output":"The sum of weather of Barisal and Dhaka is 64°C"}
`

const getResponse = async ()=>{

   // this is the context window (chat history)
   let contents = [];

    while(true) {

        // getting User Prompt
        const query = readLineSync.question('>> ');

        const q = {
            type:"user",
            user: query,
        }

        // populating context
        contents.push({
            role:"user",
            parts:[
                {text:JSON.stringify(q)},
            ]
        })
        
        while(true) {

    const response = await GenAI.models.generateContent({

        model:'gemini-2.5-flash',
        config:{
            systemInstruction:{
                text:SYSTEM_PROMPT,
            },
            responseMimeType:"application/json"
        },
        contents: contents
    })

    // current step
    const call = JSON.parse(response.text);

    if(call.type == "action") {
        
        // console.log('-------- AI is Taking Action -------\n');
        // console.log(JSON.stringify(call));
        // console.log('\n');

        // calling the tools to perform tasks 
        const temp_c = await tools[call.function](call.input);

        
        const observation = {
            type:"observation",
            observation: temp_c,
        }

        // populating context
        contents.push({
            role:"user",
            parts:[
                {text: JSON.stringify(observation)},
            ]
        }

       );

       continue;
    }

    if(call.type == "output") {
        console.log(`BOT: ${call.output}`);
        break;
    }

    else {

        // populating context
        contents.push({
            role:"user",
            parts:[
                {text: response.text},
            ]
        }
       );
        // console.log('-------- AI is Thinking -------\n');
        // console.log(JSON.stringify(call));
        // console.log('\n');
    }
    }
    // clearing the chat history 
    // if we do this then the LLM has to work a little bit more
    // contents = [];
    //  console.log(JSON.stringify(contents));
    }
}



await getResponse();