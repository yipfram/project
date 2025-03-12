import { View, Text, StyleSheet, ScrollView, Pressable, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronRight } from 'lucide-react-native';

export default function LearnScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.greeting}>Hei!</Text>
          <Text style={styles.welcomeText}>Ready to learn Finnish?</Text>
        </View>

        <View style={styles.progressCard}>
          <Text style={styles.progressTitle}>Daily Progress</Text>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: '65%' }]} />
          </View>
          <Text style={styles.progressText}>65% completed today</Text>
        </View>

        <Text style={styles.sectionTitle}>Continue Learning</Text>
        
        <Pressable style={styles.lessonCard}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1528698827591-e19ccd7bc23d' }}
            style={styles.lessonImage}
            resizeMode="cover"
          />
          <View style={styles.lessonContent}>
            <Text style={styles.lessonTitle}>At the Supermarket</Text>
            <Text style={styles.lessonProgress}>4/8 completed</Text>
            <View style={styles.lessonButton}>
              <Text style={styles.lessonButtonText}>Continue</Text>
              <ChevronRight size={16} color="#007AFF" />
            </View>
          </View>
        </Pressable>

        <Text style={styles.sectionTitle}>Quick Practice</Text>
        <View style={styles.practiceGrid}>
          {['Pronunciation', 'Vocabulary', 'Grammar', 'Listening'].map((item) => (
            <Pressable key={item} style={styles.practiceCard}>
              <Text style={styles.practiceTitle}>{item}</Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  scrollContent: {
    padding: 20,
  },
  header: {
    marginBottom: 24,
  },
  greeting: {
    fontFamily: 'Nunito-Bold',
    fontSize: 32,
    color: '#007AFF',
    marginBottom: 4,
  },
  welcomeText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#8E8E93',
  },
  progressCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  progressTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#000000',
    marginBottom: 12,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E5E5EA',
    borderRadius: 4,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#007AFF',
    borderRadius: 4,
  },
  progressText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#8E8E93',
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 20,
    color: '#000000',
    marginBottom: 16,
  },
  lessonCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  lessonImage: {
    width: '100%',
    height: 160,
  },
  lessonContent: {
    padding: 16,
  },
  lessonTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#000000',
    marginBottom: 4,
  },
  lessonProgress: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 12,
  },
  lessonButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  lessonButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#007AFF',
    marginRight: 4,
  },
  practiceGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  practiceCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    width: '48%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  practiceTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#000000',
    textAlign: 'center',
  },
});