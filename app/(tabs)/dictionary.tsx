import { View, Text, StyleSheet, TextInput, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, Bookmark, Volume2 } from 'lucide-react-native';
import { useState } from 'react';

const sampleWords = [
  { word: 'Kiitos', translation: 'Thank you', type: 'Expression' },
  { word: 'Hei', translation: 'Hello', type: 'Greeting' },
  { word: 'Anteeksi', translation: 'Sorry/Excuse me', type: 'Expression' },
  { word: 'Kahvi', translation: 'Coffee', type: 'Noun' },
  { word: 'Joo', translation: 'Yes', type: 'Response' },
];

export default function DictionaryScreen() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Dictionary</Text>
        <View style={styles.searchContainer}>
          <Search size={20} color="#8E8E93" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search Finnish words"
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#8E8E93"
          />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {sampleWords.map((item, index) => (
          <View key={index} style={styles.wordCard}>
            <View style={styles.wordHeader}>
              <View>
                <Text style={styles.word}>{item.word}</Text>
                <Text style={styles.wordType}>{item.type}</Text>
              </View>
              <View style={styles.wordActions}>
                <Pressable style={styles.actionButton}>
                  <Volume2 size={20} color="#007AFF" />
                </Pressable>
                <Pressable style={styles.actionButton}>
                  <Bookmark size={20} color="#8E8E93" />
                </Pressable>
              </View>
            </View>
            <Text style={styles.translation}>{item.translation}</Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  header: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  title: {
    fontFamily: 'Nunito-Bold',
    fontSize: 32,
    color: '#000000',
    marginBottom: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
    borderRadius: 12,
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#000000',
    paddingVertical: 12,
  },
  scrollContent: {
    padding: 20,
  },
  wordCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  wordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  word: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 20,
    color: '#000000',
    marginBottom: 4,
  },
  wordType: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#8E8E93',
  },
  wordActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    padding: 8,
  },
  translation: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#000000',
  },
});