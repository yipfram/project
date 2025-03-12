import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Audio } from 'expo-av';
import * as Speech from 'expo-speech';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import { getChatResponse } from '../../services/openai';
import ApiKeyModal from '../../components/ApiKeyModal';
import OpenAIService from '../../services/openai';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant' | 'system';
  timestamp: Date;
}

interface Feedback {
  errors: Array<{
    word: string;
    correction: string;
    explanation: string;
  }>;
  suggestions: string[];
  overallFeedback: string;
}

const ShopScenarioScreen = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isScenarioComplete, setIsScenarioComplete] = useState(false);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [apiKeyModalVisible, setApiKeyModalVisible] = useState(false);
  const [hasApiKey, setHasApiKey] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const router = useRouter();
  const [error, setError] = useState<Error | null>(null);

  // Check if API key exists
  useEffect(() => {
    // Check if API key is already set (from .env or previously saved)
    setHasApiKey(OpenAIService.hasApiKey());
    
    // If the key is not set, show the API key modal automatically after a delay
    if (!OpenAIService.hasApiKey()) {
      const timer = setTimeout(() => {
        setApiKeyModalVisible(true);
      }, 1500); // Show after a short delay to allow the UI to render first
      
      return () => clearTimeout(timer);
    }
  }, []);

  // Initialize the chat with system message
  useEffect(() => {
    const systemMessage: Message = {
      id: 'system-1',
      content: 'You are a Finnish cashier in a supermarket. Speak to the customer in Finnish, providing translations in parentheses. The customer is a Finnish language learner.',
      role: 'system',
      timestamp: new Date(),
    };

    const welcomeMessage: Message = {
      id: 'assistant-1',
      content: 'Hei! Tervetuloa kauppaan. Miten voin auttaa sinua tänään? (Hello! Welcome to the shop. How can I help you today?)',
      role: 'assistant',
      timestamp: new Date(),
    };

    setMessages([systemMessage, welcomeMessage]);
  }, []);

  // Automatically scroll to bottom when messages change
  useEffect(() => {
    if (scrollViewRef.current) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  // Speak the assistant's message
  const speakMessage = async (text: string) => {
    // Extract only the Finnish part (before the parenthesis)
    const finnishText = text.split('(')[0].trim();
    
    setIsSpeaking(true);
    try {
      await Speech.speak(finnishText, {
        language: 'fi-FI',
        rate: 0.9,
        onDone: () => setIsSpeaking(false),
      });
    } catch (error) {
      console.error('Failed to speak:', error);
      setIsSpeaking(false);
    }
  };

  // When a new assistant message arrives, speak it
  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage && lastMessage.role === 'assistant') {
      speakMessage(lastMessage.content);
    }
  }, [messages]);

  // Start recording audio
  const startRecording = async () => {
    try {
      // Request permissions
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      // Start recording
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(recording);
      setIsRecording(true);
    } catch (error) {
      console.error('Failed to start recording:', error);
    }
  };

  // Stop recording and process the audio
  const stopRecording = async () => {
    if (!recording) return;

    setIsRecording(false);
    setIsLoading(true);
    
    try {
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      setRecording(null);
      
      // In a real app, you would send this audio to a speech-to-text service
      // For demo purposes, we'll simulate user input
      setInputText('Hei, haluaisin ostaa leipää, kiitos.'); // Simulated input
      setIsLoading(false);
      
      // Simulate sending after a brief delay
      setTimeout(() => {
        handleSendMessage();
      }, 500);
      
    } catch (error) {
      console.error('Failed to stop recording:', error);
      setIsLoading(false);
    }
  };

  // Add this new useEffect to persist messages in AsyncStorage
  useEffect(() => {
    // Recover stored messages when the component mounts
    const loadStoredMessages = async () => {
      try {
        // In a real app you would use AsyncStorage from '@react-native-async-storage/async-storage'
        // For demo purposes, we'll initialize with default messages
        if (messages.length === 0) {
          const systemMessage: Message = {
            id: 'system-1',
            content: 'You are a Finnish cashier in a supermarket. Speak to the customer in Finnish, providing translations in parentheses. The customer is a Finnish language learner.',
            role: 'system',
            timestamp: new Date(),
          };
  
          const welcomeMessage: Message = {
            id: 'assistant-1',
            content: 'Hei! Tervetuloa kauppaan. Miten voin auttaa sinua tänään? (Hello! Welcome to the shop. How can I help you today?)',
            role: 'assistant',
            timestamp: new Date(),
          };
  
          setMessages([systemMessage, welcomeMessage]);
        }
      } catch (e) {
        console.error('Failed to load messages:', e);
      }
    };

    loadStoredMessages();
  }, []);
  
  // Add this function to handle errors gracefully
  const handleError = (error: Error) => {
    console.error('Error in shop scenario:', error);
    setError(error);
    // Prevent the screen from disappearing by handling errors
  };

  // Send a message
  const handleSendMessage = async () => {
    if (!inputText.trim() && !isLoading) return;
    
    try {
      const userMessage: Message = {
        id: `user-${messages.length}`,
        content: inputText.trim(),
        role: 'user',
        timestamp: new Date(),
      };

      // Store the input before clearing it
      const currentInput = inputText.trim();

      // Add user message to the chat
      setMessages((prevMessages: Message[]) => [...prevMessages, userMessage]);
      setInputText('');
      setIsLoading(true);

      // Check if the user said goodbye to end the scenario
      const userSaidGoodbye = 
        currentInput.toLowerCase().includes('näkemiin') || 
        currentInput.toLowerCase().includes('hyvästi') || 
        currentInput.toLowerCase().includes('moi moi') ||
        currentInput.toLowerCase().includes('goodbye');

      // Convert messages to format expected by the API
      const messageHistory = messages.map((msg: Message) => ({
        role: msg.role,
        content: msg.content,
      }));

      // Add the user's new message
      messageHistory.push({
        role: 'user',
        content: currentInput,
      });

      // Get response from the assistant, using the imported service
      const response = await OpenAIService.getChatResponse(messageHistory);

      // Create an assistant message from the response
      const assistantMessage: Message = {
        id: `assistant-${messages.length + 1}`,
        content: response.message.content,
        role: 'assistant',
        timestamp: new Date(),
      };

      // Add assistant message to the chat
      setMessages((prevMessages: Message[]) => [...prevMessages, assistantMessage]);

      // If the user said goodbye, end the scenario after a short delay
      if (userSaidGoodbye) {
        setTimeout(() => {
          setIsScenarioComplete(true);
          getFeedback();
        }, 2000);
      }
    } catch (error: any) {
      handleError(error);
      // Add an error message
      const errorMessage: Message = {
        id: `error-${messages.length + 1}`,
        content: 'Anteeksi, tapahtui virhe. (Sorry, an error occurred.)',
        role: 'assistant',
        timestamp: new Date(),
      };
      setMessages((prevMessages: Message[]) => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Get feedback at the end of the scenario
  const getFeedback = async () => {
    try {
      // Convert messages to format expected by the API
      const messageHistory = messages.map((msg: Message) => ({
        role: msg.role,
        content: msg.content,
      }));

      // Request feedback using the imported service
      const response = await OpenAIService.getChatResponse(messageHistory, true);
      
      if (response.feedback) {
        setFeedback(response.feedback);
      }
    } catch (error: any) {
      handleError(error as Error);
      console.error('Error getting feedback:', error);
    }
  };

  // Add after other useEffect hooks
  const handleOpenApiKeyModal = () => {
    setApiKeyModalVisible(true);
  };

  const handleCloseApiKeyModal = () => {
    setApiKeyModalVisible(false);
    setHasApiKey(OpenAIService.hasApiKey());
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      <Stack.Screen
        options={{
          headerTitle: 'At the Shop',
          headerTitleStyle: styles.headerTitle,
          headerBackTitle: 'Back',
        }}
      />
      
      {error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>Oops! Something went wrong</Text>
          <Text style={styles.errorMessage}>{error.message || 'Unknown error occurred'}</Text>
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={() => {
              setError(null);
              setMessages([]);
            }}
          >
            <Text style={styles.retryButtonText}>Retry Conversation</Text>
          </TouchableOpacity>
        </View>
      ) : !isScenarioComplete ? (
        <View style={styles.chatContainer}>
          {/* Chat messages */}
          <ScrollView 
            ref={scrollViewRef}
            style={styles.messagesContainer}
            contentContainerStyle={styles.messagesContent}
          >
            {messages.map((message: Message, index: number) => {
              // Skip system messages
              if (message.role === 'system') return null;
              
              const isUserMessage = message.role === 'user';
              
              return (
                <View 
                  key={message.id} 
                  style={[
                    styles.messageBubble,
                    isUserMessage ? styles.userBubble : styles.assistantBubble,
                  ]}
                >
                  <Text 
                    style={isUserMessage ? styles.userMessageText : styles.messageText}
                  >
                    {message.content}
                  </Text>
                </View>
              );
            })}
            
            {isLoading && (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color="#007AFF" />
              </View>
            )}
          </ScrollView>

          {/* Input area - now positioned at the bottom with absolute positioning */}
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.inputWrapper}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
          >
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.textInput}
                value={inputText}
                onChangeText={setInputText}
                placeholder="Write in Finnish..."
                placeholderTextColor="#8E8E93"
                multiline
                maxLength={200}
                returnKeyType="send"
                onSubmitEditing={handleSendMessage}
                editable={!isLoading}
              />
              
              {inputText.trim() ? (
                <TouchableOpacity 
                  style={styles.sendButton} 
                  onPress={handleSendMessage}
                  disabled={isLoading}
                >
                  <Ionicons name="send" size={24} color="#007AFF" />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={[styles.micButton, isRecording && styles.micButtonActive]}
                  onPressIn={startRecording}
                  onPressOut={stopRecording}
                  disabled={isLoading}
                >
                  <Ionicons
                    name={isRecording ? "radio" : "mic"}
                    size={24}
                    color={isRecording ? "#FF3B30" : "#007AFF"}
                  />
                </TouchableOpacity>
              )}
            </View>
          </KeyboardAvoidingView>
        </View>
      ) : (
        <ScrollView style={styles.feedbackContainer}>
          <View style={styles.feedbackHeader}>
            <Text style={styles.feedbackTitle}>Conversation Complete</Text>
            <Text style={styles.feedbackSubtitle}>
              Here's some feedback on your Finnish:
            </Text>
          </View>

          {feedback ? (
            <>
              <View style={styles.feedbackSection}>
                <Text style={styles.sectionTitle}>Overall Feedback</Text>
                <Text style={styles.feedbackText}>{feedback.overallFeedback}</Text>
              </View>

              <View style={styles.feedbackSection}>
                <Text style={styles.sectionTitle}>Words & Phrases</Text>
                {feedback.errors.map((error: { word: string; correction: string; explanation: string }, index: number) => (
                  <View key={index} style={styles.wordItem}>
                    <View style={styles.wordHeader}>
                      <Text style={styles.wordText}>{error.word}</Text>
                      <Text style={styles.correctionText}>{error.correction}</Text>
                    </View>
                    <Text style={styles.explanationText}>{error.explanation}</Text>
                  </View>
                ))}
              </View>

              <View style={styles.feedbackSection}>
                <Text style={styles.sectionTitle}>Suggestions</Text>
                {feedback.suggestions.map((suggestion: string, index: number) => (
                  <View key={index} style={styles.suggestionItem}>
                    <Text style={styles.suggestionText}>• {suggestion}</Text>
                  </View>
                ))}
              </View>
            </>
          ) : (
            <View style={styles.loadingFeedback}>
              <ActivityIndicator size="large" color="#007AFF" />
              <Text style={styles.loadingText}>Analyzing your conversation...</Text>
            </View>
          )}

          <TouchableOpacity
            style={styles.doneButton}
            onPress={() => router.back()}
          >
            <Text style={styles.doneButtonText}>Return to Scenarios</Text>
          </TouchableOpacity>
        </ScrollView>
      )}

      {/* API Key Modal */}
      <ApiKeyModal visible={apiKeyModalVisible} onClose={handleCloseApiKeyModal} />
      
      {/* Add this floating button at the bottom */}
      {!hasApiKey && (
        <TouchableOpacity 
          style={styles.apiKeyButton}
          onPress={handleOpenApiKeyModal}
        >
          <Text style={styles.apiKeyButtonText}>Connect OpenAI API</Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  headerTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
  },
  chatContainer: {
    flex: 1,
    position: 'relative',
    width: '100%',
    height: '100%',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  messagesContainer: {
    flex: 1,
    padding: 16,
    paddingBottom: 80,
  },
  messagesContent: {
    paddingBottom: 90,
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 20,
    marginBottom: 12,
  },
  userBubble: {
    backgroundColor: '#007AFF',
    alignSelf: 'flex-end',
    borderTopRightRadius: 4,
  },
  assistantBubble: {
    backgroundColor: '#E9E9EB',
    alignSelf: 'flex-start',
    borderTopLeftRadius: 4,
  },
  messageText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#000000',
  },
  userMessageText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#FFFFFF',
  },
  loadingContainer: {
    padding: 8,
    alignItems: 'center',
  },
  inputWrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    width: '100%',
    backgroundColor: 'transparent',
    zIndex: 100,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
  },
  textInput: {
    flex: 1,
    minHeight: 40,
    maxHeight: 100,
    backgroundColor: '#F2F2F7',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    marginRight: 8,
  },
  sendButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  micButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  micButtonActive: {
    backgroundColor: 'rgba(255, 59, 48, 0.1)',
    borderRadius: 20,
  },
  feedbackContainer: {
    flex: 1,
    padding: 16,
  },
  feedbackHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  feedbackTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: '#000000',
    marginBottom: 8,
  },
  feedbackSubtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#8E8E93',
  },
  feedbackSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#000000',
    marginBottom: 12,
  },
  feedbackText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#000000',
    lineHeight: 24,
  },
  wordItem: {
    marginBottom: 16,
  },
  wordHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  wordText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#007AFF',
    marginRight: 8,
  },
  correctionText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#34C759',
  },
  explanationText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#8E8E93',
  },
  suggestionItem: {
    marginBottom: 8,
  },
  suggestionText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#000000',
  },
  loadingFeedback: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  loadingText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#8E8E93',
    marginTop: 12,
  },
  doneButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 24,
  },
  doneButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#FFFFFF',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  errorTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: '#000000',
    marginBottom: 16,
  },
  errorMessage: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#8E8E93',
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  retryButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#FFFFFF',
  },
  apiKeyButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#5856D6',
    borderRadius: 28,
    padding: 12,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 100,
  },
  apiKeyButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#FFFFFF',
  },
});

export default ShopScenarioScreen; 