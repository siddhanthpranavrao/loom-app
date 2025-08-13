/**
 * Friends Management Screen
 */

import React, { useState } from 'react';
import { View, FlatList, Pressable, Text } from 'react-native';
import * as AC from '@bacons/apple-colors';
import * as Form from '@/components/ui/form';
import { IconSymbol } from '@/components/ui/icon-symbol';
import TouchableBounce from '@/components/ui/touchable-bounce';
import Stack from '@/components/layout/stack';
import { BottomToast } from '@/components/home/HeyAgainComponents';
import { FriendListItem, FriendsEmptyState } from '@/components/friends/FriendListComponents';
import { AddEditFriendModal, type FriendFormData } from '@/components/friends/AddEditFriendModal';
import { sortFriends } from '@/utils/friends-helpers';
import type { Friend } from '@/components/home/HeyAgainComponents';

// Seeded friends data (same as Home screen for now)
const SEEDED_FRIENDS: Friend[] = [
    {
        id: '1',
        name: 'Priya Sharma',
        phone: '+1-555-0123',
        frequency: 'weekly',
        personalNote: 'Always has the best book recommendations and travel stories.',
        lastCallAt: '2024-01-25T19:30:00Z',
    },
    {
        id: '2',
        name: 'Marcus Johnson',
        phone: '+1-555-0456',
        frequency: 'biweekly',
        personalNote: 'Fellow coffee enthusiast who started that amazing startup.',
        lastCallAt: '2024-01-20T14:15:00Z',
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
        lastCallAt: '2024-01-28T10:45:00Z',
    },
];

export default function FriendsScreen() {
    const [friends, setFriends] = useState<Friend[]>(SEEDED_FRIENDS);
    const [modalVisible, setModalVisible] = useState(false);
    const [editingFriend, setEditingFriend] = useState<Friend | null>(null);
    const [toastMessage, setToastMessage] = useState<{
        message: string;
        type: 'success' | 'info';
    } | null>(null);

    // Show toast message
    const showToast = (message: string, type: 'success' | 'info' = 'success') => {
        setToastMessage({ message, type });
        setTimeout(() => setToastMessage(null), 2500);
    };

    // Generate new ID for friends
    const generateId = (): string => {
        return Date.now().toString() + Math.random().toString(36).substr(2, 9);
    };

    // Add new friend
    const handleAddFriend = () => {
        setEditingFriend(null);
        setModalVisible(true);
    };

    // Edit existing friend
    const handleEditFriend = (friend: Friend) => {
        setEditingFriend(friend);
        setModalVisible(true);
    };

    // Save friend (add or edit)
    const handleSaveFriend = (formData: FriendFormData) => {
        if (editingFriend) {
            // Update existing friend
            setFriends(prev =>
                prev.map(friend =>
                    friend.id === editingFriend.id
                        ? { ...friend, ...formData }
                        : friend
                )
            );
            showToast(`Updated ${formData.name}.`);
        } else {
            // Add new friend
            const newFriend: Friend = {
                id: generateId(),
                ...formData,
            };
            setFriends(prev => [...prev, newFriend]);
            showToast(`Added ${formData.name}.`);
        }

        setModalVisible(false);
        setEditingFriend(null);
    };

    // Delete friend
    const handleDeleteFriend = (friend: Friend) => {
        setFriends(prev => prev.filter(f => f.id !== friend.id));
        showToast(`Removed ${friend.name}.`);
    };

    // Cancel modal
    const handleCancelModal = () => {
        setModalVisible(false);
        setEditingFriend(null);
    };

    // Sort friends alphabetically
    const sortedFriends = sortFriends(friends);

    return (
        <>
            <Stack.Screen
                options={{
                    title: 'Friends',
                    headerRight: () => (
                        <Pressable
                            onPress={handleAddFriend}
                            style={({ pressed }) => ({
                                backgroundColor: AC.systemGreen,
                                paddingHorizontal: 12,
                                paddingVertical: 6,
                                borderRadius: 8,
                                opacity: pressed ? 0.7 : 1,
                            })}
                            accessibilityLabel="Add friend"
                        >
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                                <IconSymbol name="plus" size={16} color="white" />
                                <Text style={{ color: 'white', fontSize: 14, fontWeight: '600' }}>
                                    Add
                                </Text>
                            </View>
                        </Pressable>
                    ),
                }}
            />

            <View style={{ flex: 1, backgroundColor: AC.systemGroupedBackground }}>
                {friends.length === 0 ? (
                    <FriendsEmptyState onAddFriend={handleAddFriend} />
                ) : (
                    <>
                        <FlatList
                            data={sortedFriends}
                            keyExtractor={(item) => item.id}
                            renderItem={({ item, index }) => (
                                <View>
                                    <FriendListItem
                                        friend={item}
                                        onEdit={handleEditFriend}
                                        onDelete={handleDeleteFriend}
                                    />
                                    {/* Separator between items */}
                                    {index < sortedFriends.length - 1 && (
                                        <View
                                            style={{
                                                height: 0.5,
                                                backgroundColor: AC.separator,
                                                marginLeft: 68, // Align with text content
                                            }}
                                        />
                                    )}
                                </View>
                            )}
                            style={{ flex: 1 }}
                            contentInsetAdjustmentBehavior="automatic"
                        />

                        {/* Floating Add Button */}
                        <TouchableBounce
                            onPress={handleAddFriend}
                            style={{
                                position: 'absolute',
                                bottom: 120, // Higher above tab bar to ensure visibility
                                right: 24,
                                backgroundColor: AC.systemGreen,
                                width: 56,
                                height: 56,
                                borderRadius: 28,
                                justifyContent: 'center',
                                alignItems: 'center',
                                shadowColor: '#000',
                                shadowOffset: { width: 0, height: 8 },
                                shadowOpacity: 0.3,
                                shadowRadius: 16,
                                elevation: 12,
                                zIndex: 1000, // Ensure it's above everything
                            }}
                            accessibilityLabel="Add new friend"
                        >
                            <IconSymbol name="plus" size={24} color="white" />
                        </TouchableBounce>
                    </>
                )}

                {/* Add/Edit Modal */}
                {modalVisible && (
                    <View
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backgroundColor: AC.systemGroupedBackground,
                            zIndex: 1000,
                        }}
                    >
                        <AddEditFriendModal
                            visible={modalVisible}
                            friend={editingFriend}
                            onSave={handleSaveFriend}
                            onCancel={handleCancelModal}
                        />
                    </View>
                )}

                {/* Toast */}
                <BottomToast
                    message={toastMessage?.message || ''}
                    type={toastMessage?.type || 'success'}
                    visible={!!toastMessage}
                />
            </View>
        </>
    );
}
