/**
 * Polished components for HeyAgain home screen
 */

import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, Pressable } from 'react-native';
import * as AC from '@bacons/apple-colors';
import { IconSymbol } from '@/components/ui/icon-symbol';
import TouchableBounce from '@/components/ui/touchable-bounce';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useBottomTabOverflow } from '@/components/ui/tab-bar-background';
import { getInitials, getAvatarColor, formatTimeSlot } from '@/utils/ui-helpers';

// Types
export type Friend = {
    id: string;
    name: string;
    phone: string;
    frequency: 'weekly' | 'biweekly' | 'monthly';
    personalNote?: string;
    lastCallAt?: string;
};

export type FreeSlot = {
    startTime: Date;
    endTime: Date;
};

// Avatar Component
function Avatar({ name, size = 48 }: { name: string; size?: number }) {
    const initials = getInitials(name);
    const backgroundColor = getAvatarColor(name);

    return (
        <View
            style={{
                width: size,
                height: size,
                borderRadius: size / 2,
                backgroundColor,
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <Text
                style={{
                    color: 'white',
                    fontSize: size * 0.4,
                    fontWeight: '600',
                    includeFontPadding: false,
                }}
            >
                {initials}
            </Text>
        </View>
    );
}

// App Header Component
export function AppHeader() {
    const insets = useSafeAreaInsets();

    return (
        <View
            style={{
                paddingTop: insets.top,
                paddingHorizontal: 20,
                paddingBottom: 12,
                backgroundColor: AC.systemGroupedBackground,
                borderBottomWidth: 0.5,
                borderBottomColor: AC.separator,
            }}
        >
            <View
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    height: 44,
                }}
            >
                <Text
                    style={{
                        fontSize: 28,
                        fontWeight: '600',
                        color: AC.label,
                        includeFontPadding: false,
                    }}
                >
                    HeyAgain
                </Text>

                <Avatar name="You" size={32} />
            </View>
        </View>
    );
}

// Bottom Toast Component
export function BottomToast({
    message,
    type,
    visible
}: {
    message: string;
    type: 'success' | 'info';
    visible: boolean;
}) {
    const insets = useSafeAreaInsets();
    const tabBarHeight = useBottomTabOverflow();
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(50)).current;

    useEffect(() => {
        if (visible) {
            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 200,
                    useNativeDriver: true,
                }),
                Animated.timing(slideAnim, {
                    toValue: 0,
                    duration: 200,
                    useNativeDriver: true,
                }),
            ]).start();
        } else {
            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 0,
                    duration: 150,
                    useNativeDriver: true,
                }),
                Animated.timing(slideAnim, {
                    toValue: 50,
                    duration: 150,
                    useNativeDriver: true,
                }),
            ]).start();
        }
    }, [visible]);

    const isSuccess = type === 'success';
    const iconName = isSuccess ? 'checkmark.circle.fill' : 'info.circle.fill';
    const backgroundColor = isSuccess ? AC.systemGreen : AC.systemBlue;

    if (!visible) return null;

    return (
        <Animated.View
            style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                zIndex: 1000,
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
            }}
            accessibilityLiveRegion="polite"
            accessibilityLabel={message}
        >
            <View
                style={{
                    marginHorizontal: 20,
                    marginBottom: Math.max(insets.bottom, 16) + tabBarHeight + 18, // Safe area + actual tab bar height + extra padding
                    backgroundColor,
                    paddingHorizontal: 16,
                    paddingVertical: 14,
                    borderRadius: 16,
                    shadowColor: AC.label,
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.3,
                    shadowRadius: 12,
                    elevation: 8,
                }}
            >
                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 8,
                    }}
                >
                    <IconSymbol
                        name={iconName}
                        size={18}
                        color="white"
                    />
                    <Text
                        style={{
                            color: 'white',
                            fontSize: 15,
                            fontWeight: '600',
                            includeFontPadding: false,
                        }}
                    >
                        {message}
                    </Text>
                </View>
            </View>
        </Animated.View>
    );
}

// Primary Catch-up Card
export function CatchUpCard({
    friend,
    timeSlot,
    onCall,
    onSkip,
}: {
    friend: Friend;
    timeSlot: FreeSlot;
    onCall: () => void;
    onSkip: () => void;
}) {
    const timeSlotText = formatTimeSlot(timeSlot.startTime, timeSlot.endTime);
    const firstName = friend.name.split(' ')[0];

    return (
        <View
            style={{
                marginHorizontal: 20,
                marginTop: 20,
                borderRadius: 20,
                backgroundColor: AC.secondarySystemGroupedBackground,
                borderWidth: 0.5,
                borderColor: AC.separator,
                shadowColor: AC.label,
                shadowOffset: { width: 0, height: 12 },
                shadowOpacity: 0.15,
                shadowRadius: 30,
                elevation: 12,
                overflow: 'hidden',
            }}
        >
            {/* Card Content */}
            <View style={{ padding: 24 }}>
                {/* Next up label */}
                <Text
                    style={{
                        fontSize: 12,
                        fontWeight: '600',
                        color: AC.secondaryLabel,
                        textTransform: 'uppercase',
                        letterSpacing: 0.8,
                        marginBottom: 8,
                    }}
                >
                    Next up
                </Text>

                {/* Time slot */}
                <Text
                    style={{
                        fontSize: 16,
                        fontWeight: '500',
                        color: AC.label,
                        marginBottom: 20,
                    }}
                >
                    {timeSlotText}
                </Text>

                {/* Friend row */}
                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginBottom: 16,
                    }}
                >
                    <Avatar name={friend.name} size={48} />
                    <View style={{ marginLeft: 16, flex: 1 }}>
                        <Text
                            style={{
                                fontSize: 23,
                                fontWeight: '600',
                                color: AC.label,
                                marginBottom: 4,
                            }}
                        >
                            {friend.name}
                        </Text>
                    </View>
                </View>

                {/* Personal note */}
                {friend.personalNote && (
                    <Text
                        style={{
                            fontSize: 14,
                            color: AC.secondaryLabel,
                            lineHeight: 20,
                            opacity: 0.7,
                            marginBottom: 24,
                        }}
                        numberOfLines={2}
                        ellipsizeMode="tail"
                    >
                        {friend.personalNote}
                    </Text>
                )}

                {/* Actions */}
                <View>
                    {/* Primary action button */}
                    <TouchableBounce
                        accessibilityLabel={`Call ${friend.name}`}
                        onPress={onCall}
                        style={{
                            backgroundColor: AC.systemBlue,
                            paddingVertical: 16,
                            borderRadius: 14,
                            alignItems: 'center',
                            marginBottom: 12,
                        }}
                    >
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                            <IconSymbol name="phone.fill" size={18} color="white" />
                            <Text
                                style={{
                                    color: 'white',
                                    fontSize: 16,
                                    fontWeight: '600',
                                }}
                            >
                                Ring {firstName}
                            </Text>
                        </View>
                    </TouchableBounce>

                    {/* Secondary action */}
                    <Pressable
                        accessibilityLabel="Skip suggestion"
                        onPress={onSkip}
                        style={({ pressed }) => ({
                            alignItems: 'center',
                            paddingVertical: 8,
                            opacity: pressed ? 0.6 : 1,
                        })}
                    >
                        <Text
                            style={{
                                color: AC.secondaryLabel,
                                fontSize: 15,
                                fontWeight: '500',
                            }}
                        >
                            Skip for now
                        </Text>
                    </Pressable>
                </View>
            </View>
        </View>
    );
}

// Footer with ghost buttons
export function AppFooter() {
    const handleEditAvailability = () => {
        console.log('Edit availability pressed');
    };

    const handleFriends = () => {
        console.log('Friends pressed');
    };

    return (
        <View
            style={{
                paddingHorizontal: 20,
                paddingVertical: 32,
                alignItems: 'center',
            }}
        >
            <View
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 32,
                }}
            >
                <Pressable
                    onPress={handleEditAvailability}
                    style={({ pressed }) => ({
                        opacity: pressed ? 0.6 : 1,
                    })}
                >
                    <Text
                        style={{
                            fontSize: 15,
                            color: AC.secondaryLabel,
                            fontWeight: '500',
                        }}
                    >
                        Edit availability
                    </Text>
                </Pressable>

                <View
                    style={{
                        width: 1,
                        height: 16,
                        backgroundColor: AC.separator,
                    }}
                />

                <Pressable
                    onPress={handleFriends}
                    style={({ pressed }) => ({
                        opacity: pressed ? 0.6 : 1,
                    })}
                >
                    <Text
                        style={{
                            fontSize: 15,
                            color: AC.secondaryLabel,
                            fontWeight: '500',
                        }}
                    >
                        Friends
                    </Text>
                </Pressable>
            </View>
        </View>
    );
}
