// OpenAI integration for the Finnish learning app
import { OPENAI_API_KEY } from '@env';

interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface OpenAIResponse {
  message: {
    role: string;
    content: string;
  };
  feedback?: {
    errors: Array<{
      word: string;
      correction: string;
      explanation: string;
    }>;
    suggestions: string[];
    overallFeedback: string;
  };
}

// Store your API key safely (in a real app, you should use environment variables)
// For demo, we'll read from .env file and fallback to manual setting
let API_KEY = OPENAI_API_KEY || '';

// Function to set the API key manually if needed
export const setApiKey = (apiKey: string) => {
  API_KEY = apiKey;
};

// Check if API key is set
export const hasApiKey = () => {
  return API_KEY !== '' && API_KEY !== 'your_openai_api_key_here';
};

// Function to call the OpenAI API
export async function getChatResponse(
  messages: Message[],
  isFeedbackRequest: boolean = false
): Promise<OpenAIResponse> {
  // If API key isn't set, use mock responses
  if (!hasApiKey()) {
    console.log('No valid API key set, using mock responses');
    return await mockCashierResponse(messages, isFeedbackRequest);
  }
  
  try {
    if (isFeedbackRequest) {
      // Create a special prompt for feedback
      const feedbackMessages = [
        ...messages,
        {
          role: 'system',
          content: 'Analyze the conversation above and provide feedback on the user\'s Finnish language skills. Format your response as JSON with the following structure: {"errors": [{"word": "word used", "correction": "correct form", "explanation": "explanation"}], "suggestions": ["suggestion 1", "suggestion 2"], "overallFeedback": "overall feedback"}'
        }
      ];
      
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
          model: 'gpt-4o',
          messages: feedbackMessages,
          temperature: 0.7,
          response_format: { type: 'json_object' }
        }),
      });
      
      const data = await response.json();
      
      if (data.error) {
        throw new Error(`OpenAI API Error: ${data.error.message}`);
      }
      
      const content = data.choices[0].message.content;
      let feedback;
      
      try {
        feedback = JSON.parse(content);
      } catch (e) {
        console.error('Failed to parse feedback JSON:', content);
        throw new Error('Failed to parse feedback response');
      }
      
      return {
        message: {
          role: 'assistant',
          content: 'Here is your feedback on the conversation.'
        },
        feedback
      };
    } else {
      // Add system prompt to ensure the cashier responds correctly
      const conversationMessages = [
        {
          role: 'system',
          content: 'You are a friendly Finnish cashier in a supermarket. Speak to the customer in Finnish, providing translations in parentheses. Use spoken Finnish language, not formal or textbook Finnish. Be conversational, helpful, and friendly, but never offensive. Teach common Finnish phrases and vocabulary related to shopping as you speak. Remember to be patient, as the customer is a Finnish language learner.'
        },
        ...messages
      ];
      
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
          model: 'gpt-4o', // You can change this to gpt-3.5-turbo to reduce costs
          messages: conversationMessages,
          temperature: 0.8, // Slightly higher temperature for more conversational responses
        }),
      });
      
      const data = await response.json();
      
      if (data.error) {
        throw new Error(`OpenAI API Error: ${data.error.message}`);
      }
      
      return {
        message: data.choices[0].message
      };
    }
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    // Fallback to mock responses in case of API failure
    return await mockCashierResponse(messages, isFeedbackRequest);
  }
}

// Mock responses for the shop scenario
async function mockCashierResponse(messages: Message[], isFeedbackRequest: boolean): Promise<OpenAIResponse> {
  // Get the last user message
  const lastUserMessage = messages.filter(m => m.role === 'user').pop()?.content.toLowerCase() || '';
  
  // If this is a feedback request, return evaluation of the conversation
  if (isFeedbackRequest) {
    return {
      message: {
        role: 'assistant',
        content: 'Here is your feedback on the conversation.'
      },
      feedback: {
        errors: [
          {
            word: 'terve',
            correction: 'Terve/Hei',
            explanation: 'Good use of greeting, but remember Finnish capitalizes greetings less often than English.'
          },
          {
            word: 'kiitos',
            correction: 'Kiitos',
            explanation: 'Well done on using "thank you" appropriately in context.'
          }
        ],
        suggestions: [
          'Try using "Saanko" (May I have) instead of just naming items',
          'Practice numbers more for prices',
          'Learn more product names in Finnish'
        ],
        overallFeedback: 'You did well with basic greetings and courtesy phrases. Work on expanding your vocabulary for shopping items and practice asking questions about products.'
      }
    };
  }

  // Initial greeting - more conversational tone
  if (messages.length <= 2) {
    return {
      message: {
        role: 'assistant',
        content: 'Moi! Tervetuloa meidän kauppaan. Miten mä voin auttaa sua tänään? (Hi there! Welcome to our shop. How can I help you today?)'
      }
    };
  }

  // Check for common Finnish phrases and respond accordingly - with more conversational tone
  if (lastUserMessage.includes('hei') || lastUserMessage.includes('terve') || lastUserMessage.includes('moi')) {
    return {
      message: {
        role: 'assistant',
        content: 'Hei hei! Mitäs sulle saisi olla tänään? (Hello! What would you like to have today?)'
      }
    };
  }

  if (lastUserMessage.includes('kiitos')) {
    return {
      message: {
        role: 'assistant',
        content: 'Eipä mitään! Tarvitko sä vielä jotain muuta? (You\'re welcome! Do you need anything else?)'
      }
    };
  }

  if (lastUserMessage.includes('leipä') || lastUserMessage.includes('bread')) {
    return {
      message: {
        role: 'assistant',
        content: 'Leipää, hyvä valinta! Meillä on ruisleipää ja vaaleaa leipää. Kumpaa sä haluaisit? (Bread, good choice! We have rye bread and white bread. Which one would you like?)'
      }
    };
  }

  if (lastUserMessage.includes('maito') || lastUserMessage.includes('milk')) {
    return {
      message: {
        role: 'assistant',
        content: 'Maitoa, selvä. Meillä on rasvatonta, kevytmaitoa ja täysmaitoa. Mitä näistä haluaisit? (Milk, sure. We have skimmed, semi-skimmed and whole milk. Which one would you like?)'
      }
    };
  }

  if (lastUserMessage.includes('paljonko') || lastUserMessage.includes('maksaa') || lastUserMessage.includes('hinta')) {
    return {
      message: {
        role: 'assistant',
        content: 'Se maksaa neljä euroa ja viisikymmentä senttiä. Haluatko maksaa käteisellä vai kortilla? (It costs 4 euros and 50 cents. Would you like to pay with cash or card?)'
      }
    };
  }

  if (lastUserMessage.includes('kortti') || lastUserMessage.includes('card')) {
    return {
      message: {
        role: 'assistant',
        content: 'Kortti käy hyvin. Ole hyvä ja laita kortti lukijaan. (Card is fine. Please insert your card into the reader.)'
      }
    };
  }

  if (lastUserMessage.includes('käteinen') || lastUserMessage.includes('cash')) {
    return {
      message: {
        role: 'assistant',
        content: 'Käteinen sopii. Se tekee neljä euroa ja viisikymmentä senttiä. (Cash is fine. That\'ll be 4 euros and 50 cents.)'
      }
    };
  }

  if (lastUserMessage.includes('näkemiin') || lastUserMessage.includes('hyvästi') || lastUserMessage.includes('moi moi') || lastUserMessage.includes('goodbye')) {
    return {
      message: {
        role: 'assistant',
        content: 'Kiitti käynnistä! Moi moi ja hyvää päivänjatkoa! (Thanks for your visit! Bye bye and have a nice day!)'
      }
    };
  }

  // Default response
  return {
    message: {
      role: 'assistant',
      content: 'Anteeksi, en ihan ymmärtänyt. Voitko sanoa uudestaan? (Sorry, I didn\'t quite understand. Can you say that again?)'
    }
  };
}

// Create a default export with the main API functions
const OpenAIService = {
  getChatResponse,
  setApiKey,
  hasApiKey
};

export default OpenAIService; 