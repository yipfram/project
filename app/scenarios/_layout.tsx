import { Stack } from 'expo-router';

export default function ScenariosLayout() {
  return (
    <Stack>
      <Stack.Screen name="shop/index" options={{ headerShown: true }} />
    </Stack>
  );
} 