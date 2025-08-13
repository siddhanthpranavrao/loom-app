/**
 * Friend List Components for Friends Management Screen
 */

import React from 'react';
import { View, Text, Pressable, Alert } from 'react-native';
import * as AC from '@bacons/apple-colors';
import { IconSymbol } from '@/components/ui/icon-symbol';
import TouchableBounce from '@/components/ui/touchable-bounce';
import { ContentUnavailable } from '@/components/ui/content-unavailable';
import { getInitials, getAvatarColor } from '@/utils/ui-helpers';
import { formatLastCall, FREQUENCY_COLORS, FREQUENCY_LABELS } from '@/utils/friends-helpers';
import type { Friend } from '@/components/home/HeyAgainComponents';

// Avatar Component (reusing from home but smaller)
function FriendAvatar({ name, size = 40 }: { name: string; size?: number }) {
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
                    fontSize: size * 0.35,
                    fontWeight: '600',
                    includeFontPadding: false,
                }}
            >
                {initials}
            </Text>
        </View>
    );
}

// Frequency Badge Component
function FrequencyBadge({ frequency }: { frequency: Friend['frequency'] }) {
    const backgroundColor = FREQUENCY_COLORS[frequency];
    const label = FREQUENCY_LABELS[frequency];

    return (
        <View
            style={{
                backgroundColor,
                paddingHorizontal: 8,
                paddingVertical: 4,
                borderRadius: 12,
            }}
        >
            <Text
                style={{
                    color: 'white',
                    fontSize: 11,
                    fontWeight: '600',
                    includeFontPadding: false,
                }}
            >
                {label}
            </Text>
        </View>
    );
}

// Individual Friend List Item
export function FriendListItem({
    friend,
    onEdit,
    onDelete,
}: {
    friend: Friend;
    onEdit: (friend: Friend) => void;
    onDelete: (friend: Friend) => void;
}) {
    const lastCallText = formatLastCall(friend.lastCallAt);

    const handleDelete = () => {
        Alert.alert(
            'Remove Friend',
            `Are you sure you want to remove ${friend.name} from your friends list?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Remove',
                    style: 'destructive',
                    onPress: () => onDelete(friend),
                },
            ]
        );
    };

    return (
        <Pressable
            onPress={() => onEdit(friend)}
            style={({ pressed }) => ({
                backgroundColor: AC.secondarySystemGroupedBackground,
                paddingHorizontal: 16,
                paddingVertical: 12,
                opacity: pressed ? 0.8 : 1,
            })}
            accessibilityLabel={`${friend.name}, ${FREQUENCY_LABELS[friend.frequency]} catch-ups, last call ${lastCallText}`}
            accessibilityHint="Tap to edit friend details"
        >
            <View
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 12,
                }}
            >
                {/* Avatar */}
                <FriendAvatar name={friend.name} />

                {/* Friend Details */}
                <View style={{ flex: 1, gap: 4 }}>
                    {/* Name and Frequency */}
                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                        }}
                    >
                        <Text
                            style={{
                                fontSize: 17,
                                fontWeight: '600',
                                color: AC.label,
                                flex: 1,
                            }}
                            numberOfLines={1}
                        >
                            {friend.name}
                        </Text>
                        <FrequencyBadge frequency={friend.frequency} />
                    </View>

                    {/* Personal Note */}
                    {friend.personalNote && (
                        <Text
                            style={{
                                fontSize: 14,
                                color: AC.secondaryLabel,
                                lineHeight: 18,
                            }}
                            numberOfLines={1}
                            ellipsizeMode="tail"
                        >
                            {friend.personalNote}
                        </Text>
                    )}

                    {/* Last Call */}
                    <Text
                        style={{
                            fontSize: 12,
                            color: AC.tertiaryLabel,
                            marginTop: 2,
                        }}
                    >
                        Last call: {lastCallText}
                    </Text>
                </View>

                {/* Delete Button */}
                <TouchableBounce
                    onPress={handleDelete}
                    style={{
                        padding: 8,
                        marginLeft: 8,
                    }}
                    accessibilityLabel={`Delete ${friend.name}`}
                >
                    <IconSymbol
                        name="trash.fill"
                        size={18}
                        color={AC.systemRed}
                    />
                </TouchableBounce>
            </View>
        </Pressable>
    );
}

// Empty State Component
export function FriendsEmptyState({
    onAddFriend,
}: {
    onAddFriend: () => void;
}) {
    return (
        <View
            style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                paddingHorizontal: 32,
                paddingVertical: 64,
            }}
        >
            <ContentUnavailable
                title="No friends yet"
                description="Add someone you'd like to stay in touch with"
                systemImage="person.2.fill"
                actions={
                    <TouchableBounce
                        onPress={onAddFriend}
                        style={{
                            backgroundColor: AC.systemBlue,
                            paddingHorizontal: 24,
                            paddingVertical: 12,
                            borderRadius: 12,
                            marginTop: 16,
                        }}
                    >
                        <View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                gap: 6,
                            }}
                        >
                            <IconSymbol name="plus" size={16} color="white" />
                            <Text
                                style={{
                                    color: 'white',
                                    fontSize: 16,
                                    fontWeight: '600',
                                }}
                            >
                                Add Friend
                            </Text>
                        </View>
                    </TouchableBounce>
                }
            />
        </View>
    );
}
