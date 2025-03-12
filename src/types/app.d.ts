// Application-specific types

// Message type for the chat interface
interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant' | 'system';
  timestamp: Date;
}

// Feedback type for language evaluation
interface Feedback {
  errors: Array<{
    word: string;
    correction: string;
    explanation: string;
  }>;
  suggestions: string[];
  overallFeedback: string;
}

// Scenario type for learning scenarios
interface Scenario {
  id: string;
  title: string;
  image: string;
  difficulty: string;
  route: string | null;
} 