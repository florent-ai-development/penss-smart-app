import { Stack } from 'expo-router';
import { NewEventProvider } from '../../context/NewEventContext';

export default function NewEventLayout() {
  return (
    <NewEventProvider>
      <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }} />
    </NewEventProvider>
  );
}
