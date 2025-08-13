import React, { useState, useEffect } from "react";
import { View, Appearance } from "react-native";
import * as AC from "@bacons/apple-colors";
import Stack from "@/components/layout/stack";
import {
  AppHeader,
  CatchUpCard,
  AppFooter,
  type Friend,
  type FreeSlot
} from "@/components/home/HeyAgainComponents";

// Set dark mode as default
if (typeof window !== 'undefined') {
  Appearance.setColorScheme('dark');
}

// Seeded data
const SEEDED_FRIENDS: Friend[] = [
  {
    id: '1',
    name: 'Priya Sharma',
    phone: '+1-555-0123',
    frequency: 'weekly',
    personalNote: 'Always has the best book recommendations and travel stories.',
  },
  {
    id: '2',
    name: 'Marcus Johnson',
    phone: '+1-555-0456',
    frequency: 'biweekly',
    personalNote: 'Fellow coffee enthusiast who started that amazing startup.',
  },
  {
    id: '3',
    name: 'Elena Rodriguez',
    phone: '+1-555-0789',
    frequency: 'monthly',
    personalNote: 'College roommate, now crushing it in product design.',
  },
  {
    id: '4',
    name: 'David Chen',
    phone: '+1-555-0321',
    frequency: 'weekly',
    personalNote: 'Hiking buddy who always finds the best trails.',
  },
];

// Helper function to generate next free slot
function getNextFreeSlot(): FreeSlot {
  const now = new Date();
  const currentHour = now.getHours();

  // If it's past 6 PM today, schedule for tomorrow at 7-8 PM
  if (currentHour >= 18) {
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(19, 0, 0, 0); // 7 PM

    const endTime = new Date(tomorrow);
    endTime.setHours(20, 0, 0, 0); // 8 PM

    return { startTime: tomorrow, endTime };
  } else {
    // Schedule for 1 hour from now
    const startTime = new Date(now.getTime() + 60 * 60 * 1000); // 1 hour from now
    const endTime = new Date(startTime.getTime() + 60 * 60 * 1000); // 1 hour duration

    return { startTime, endTime };
  }
}





export default function Page() {
  // State - keeping existing logic intact
  const [friends] = useState<Friend[]>(SEEDED_FRIENDS);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [freeSlot] = useState<FreeSlot>(getNextFreeSlot());
  const [inlineMessage, setInlineMessage] = useState<{ message: string; type: 'success' | 'info' } | null>(null);

  const currentFriend = friends[currentIndex];

  // Clear inline message after 2.5 seconds (slightly shorter for better UX)
  useEffect(() => {
    if (inlineMessage) {
      const timer = setTimeout(() => {
        setInlineMessage(null);
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [inlineMessage]);

  const handleCall = () => {
    console.log('Call started', currentFriend);

    // Update lastCallAt for current friend
    const updatedFriends = [...friends];
    updatedFriends[currentIndex] = {
      ...currentFriend,
      lastCallAt: new Date().toISOString(),
    };

    // Show success message
    setInlineMessage({
      message: 'Nice! Logged this catch-up.',
      type: 'success',
    });

    // Advance to next friend
    setCurrentIndex((prev) => (prev + 1) % friends.length);
  };

  const handleSkip = () => {
    console.log('Skipped', currentFriend);

    // Show info message
    setInlineMessage({
      message: "We'll suggest someone else next time.",
      type: 'info',
    });

    // Advance to next friend
    setCurrentIndex((prev) => (prev + 1) % friends.length);
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false, // Hide default header to use custom one
        }}
      />

      <View style={{ flex: 1, backgroundColor: AC.systemGroupedBackground }}>
        {/* Custom header */}
        <AppHeader />

        {/* Main content with max width constraint */}
        <View
          style={{
            flex: 1,
            maxWidth: 600,
            width: '100%',
            alignSelf: 'center',
          }}
        >
          {/* Primary card */}
          <CatchUpCard
            friend={currentFriend}
            timeSlot={freeSlot}
            onCall={handleCall}
            onSkip={handleSkip}
            inlineMessage={inlineMessage}
          />

          {/* Spacer */}
          <View style={{ flex: 1 }} />

          {/* Footer */}
          <AppFooter />
        </View>
      </View>
    </>
  );
}
