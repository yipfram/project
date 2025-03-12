import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TextInput,
  TouchableOpacity,
  Alert,
  Linking,
} from 'react-native';
import OpenAIService from '../services/openai';
import { OPENAI_API_KEY } from '@env';

interface ApiKeyModalProps {
  visible: boolean;
  onClose: () => void;
}

const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ visible, onClose }: ApiKeyModalProps) => {
  const [apiKey, setApiKey] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Set API key from environment variable if available
  useEffect(() => {
    if (OPENAI_API_KEY && OPENAI_API_KEY !== 'your_openai_api_key_here') {
      // If there's a valid API key in .env, use it
      OpenAIService.setApiKey(OPENAI_API_KEY);
      // Close the modal if it was shown
      if (visible) {
        onClose();
      }
    }
  }, [visible, onClose]);

  const handleSaveKey = () => {
    if (!apiKey.trim()) {
      Alert.alert('Error', 'Please enter a valid API key');
      return;
    }

    setIsSubmitting(true);
    
    // Simple validation: Check if the key starts with 'sk-'
    if (!apiKey.trim().startsWith('sk-')) {
      Alert.alert('Invalid API Key', 'OpenAI API keys should start with "sk-"');
      setIsSubmitting(false);
      return;
    }
    
    try {
      // Save the API key in the service
      OpenAIService.setApiKey(apiKey.trim());
      
      // In a real app, you would securely store this using
      // react-native-keychain or similar secure storage
      
      Alert.alert('Success', 'API key saved successfully', [
        { text: 'OK', onPress: onClose }
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to save API key');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGetApiKey = () => {
    // Open the OpenAI API key page
    Linking.openURL('https://platform.openai.com/api-keys');
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>Enter OpenAI API Key</Text>
          
          <Text style={styles.description}>
            To use the real AI assistant, you need to provide your OpenAI API key.
            Your key is stored locally on your device and is never sent to our servers.
          </Text>
          
          <TextInput
            style={styles.input}
            value={apiKey}
            onChangeText={setApiKey}
            placeholder="sk-..."
            placeholderTextColor="#8E8E93"
            secureTextEntry={true}
            autoCapitalize="none"
            autoCorrect={false}
          />
          
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={onClose}
              disabled={isSubmitting}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.button, styles.saveButton]}
              onPress={handleSaveKey}
              disabled={isSubmitting}
            >
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity
            style={styles.getKeyButton}
            onPress={handleGetApiKey}
          >
            <Text style={styles.getKeyButtonText}>Get an API Key</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '90%',
    maxWidth: 400,
  },
  modalTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 22,
    color: '#000000',
    marginBottom: 16,
    textAlign: 'center',
  },
  description: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#666666',
    marginBottom: 24,
    textAlign: 'center',
    lineHeight: 22,
  },
  input: {
    width: '100%',
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    borderRadius: 12,
    marginBottom: 24,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    backgroundColor: '#F2F2F7',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 16,
  },
  button: {
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    minWidth: '45%',
    alignItems: 'center',
  },
  saveButton: {
    backgroundColor: '#007AFF',
  },
  cancelButton: {
    backgroundColor: '#F2F2F7',
  },
  saveButtonText: {
    fontFamily: 'Inter-SemiBold',
    color: 'white',
    fontSize: 16,
  },
  cancelButtonText: {
    fontFamily: 'Inter-SemiBold',
    color: '#007AFF',
    fontSize: 16,
  },
  getKeyButton: {
    padding: 12,
  },
  getKeyButtonText: {
    fontFamily: 'Inter-Regular',
    color: '#007AFF',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
});

export default ApiKeyModal; 