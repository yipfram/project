import { View, Text, StyleSheet, ScrollView, Pressable, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

interface Scenario {
  id: string;
  title: string;
  image: string;
  difficulty: string;
  route: string | null;
}

const scenarios: Scenario[] = [
  {
    id: 'supermarket',
    title: 'At the Supermarket',
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e',
    difficulty: 'Beginner',
    route: 'shop',
  },
  {
    id: 'restaurant',
    title: 'Restaurant Orders',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4',
    difficulty: 'Intermediate',
    route: null, // Not yet implemented
  },
  {
    id: 'transport',
    title: 'Public Transport',
    image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957',
    difficulty: 'Beginner',
    route: null, // Not yet implemented
  },
  {
    id: 'healthcare',
    title: 'Healthcare Visit',
    image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118',
    difficulty: 'Advanced',
    route: null, // Not yet implemented
  },
  {
    id: 'work',
    title: 'At Work',
    image: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72',
    difficulty: 'Intermediate',
    route: null, // Not yet implemented
  },
];

export default function ScenariosScreen() {
  const router = useRouter();

  const handleScenarioPress = (scenario: Scenario) => {
    if (scenario.route) {
      // Fix the navigation path to ensure it properly stays in the screen hierarchy
      router.push({
        pathname: `/scenarios/${scenario.route}`,
        params: { id: scenario.id }
      } as any);
    } else {
      // For scenarios that are not yet implemented
      alert('This scenario is coming soon!');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Learning Scenarios</Text>
        <Text style={styles.subtitle}>Practice real-life conversations</Text>

        {scenarios.map((scenario) => (
          <Pressable 
            key={scenario.id} 
            style={styles.card}
            onPress={() => handleScenarioPress(scenario)}
          >
            <Image
              source={{ uri: scenario.image }}
              style={styles.cardImage}
              resizeMode="cover"
            />
            <View style={styles.cardOverlay} />
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>{scenario.title}</Text>
              <View style={styles.difficultyBadge}>
                <Text style={styles.difficultyText}>{scenario.difficulty}</Text>
              </View>
            </View>
          </Pressable>
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
  scrollContent: {
    padding: 20,
  },
  title: {
    fontFamily: 'Nunito-Bold',
    fontSize: 32,
    color: '#000000',
    marginBottom: 4,
  },
  subtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#8E8E93',
    marginBottom: 24,
  },
  card: {
    height: 200,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  cardOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  cardContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
  },
  cardTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 24,
    color: '#FFFFFF',
    marginBottom: 8,
  },
  difficultyBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  difficultyText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 12,
    color: '#007AFF',
  },
});