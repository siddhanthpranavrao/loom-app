/**
 * Add/Edit Friend Modal Component
 */

import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import * as AC from '@bacons/apple-colors';
import * as Form from '@/components/ui/form';
import { IconSymbol } from '@/components/ui/icon-symbol';
import TouchableBounce from '@/components/ui/touchable-bounce';

import { isValidPhone, FREQUENCY_LABELS, type FrequencyType } from '@/utils/friends-helpers';
import type { Friend } from '@/components/home/HeyAgainComponents';

export type FriendFormData = {
    name: string;
    phone: string;
    frequency: Friend['frequency'];
    personalNote: string;
};

// Frequency Selector Component
function FrequencySelector({
    value,
    onChange,
}: {
    value: Friend['frequency'];
    onChange: (frequency: Friend['frequency']) => void;
}) {
    const frequencies = [
        { key: 'weekly', label: 'Weekly', description: 'Catch up every week' },
        { key: 'biweekly', label: 'Biweekly', description: 'Catch up every 2 weeks' },
        { key: 'monthly', label: 'Monthly', description: 'Catch up once a month' },
    ] as const;

    return (
        <View style={{ gap: 12 }}>
            {frequencies.map((freq) => (
                <TouchableBounce
                    key={freq.key}
                    onPress={() => onChange(freq.key)}
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        paddingVertical: 16,
                        paddingHorizontal: 16,
                        backgroundColor: value === freq.key
                            ? AC.systemBlue + '15'
                            : AC.secondarySystemGroupedBackground,
                        borderRadius: 12,
                        borderWidth: value === freq.key ? 1.5 : 0.5,
                        borderColor: value === freq.key ? AC.systemBlue : AC.separator,
                    }}
                >
                    {/* Radio button */}
                    <View
                        style={{
                            width: 20,
                            height: 20,
                            borderRadius: 10,
                            borderWidth: 2,
                            borderColor: value === freq.key ? AC.systemBlue : AC.systemGray3,
                            backgroundColor: value === freq.key ? AC.systemBlue : 'transparent',
                            marginRight: 12,
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        {value === freq.key && (
                            <View
                                style={{
                                    width: 6,
                                    height: 6,
                                    borderRadius: 3,
                                    backgroundColor: 'white',
                                }}
                            />
                        )}
                    </View>

                    {/* Content */}
                    <View style={{ flex: 1 }}>
                        <Text
                            style={{
                                fontSize: 17,
                                color: AC.label,
                                fontWeight: value === freq.key ? '600' : '500',
                                marginBottom: 2,
                            }}
                        >
                            {freq.label}
                        </Text>
                        <Text
                            style={{
                                fontSize: 13,
                                color: AC.secondaryLabel,
                            }}
                        >
                            {freq.description}
                        </Text>
                    </View>
                </TouchableBounce>
            ))}
        </View>
    );
}

// Main Modal Component
export function AddEditFriendModal({
    visible,
    friend,
    onSave,
    onCancel,
}: {
    visible: boolean;
    friend?: Friend | null;
    onSave: (data: FriendFormData) => void;
    onCancel: () => void;
}) {
    const [formData, setFormData] = useState<FriendFormData>({
        name: '',
        phone: '',
        frequency: 'weekly',
        personalNote: '',
    });

    const [errors, setErrors] = useState<Partial<FriendFormData>>({});
    const isEditing = !!friend;

    // Pre-fill form when editing
    useEffect(() => {
        if (friend) {
            setFormData({
                name: friend.name,
                phone: friend.phone,
                frequency: friend.frequency,
                personalNote: friend.personalNote || '',
            });
        } else {
            // Reset form for new friend
            setFormData({
                name: '',
                phone: '',
                frequency: 'weekly',
                personalNote: '',
            });
        }
        setErrors({});
    }, [friend, visible]);

    const validateForm = (): boolean => {
        const newErrors: Partial<FriendFormData> = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
        }

        if (!formData.phone.trim()) {
            newErrors.phone = 'Phone number is required';
        } else if (!isValidPhone(formData.phone)) {
            newErrors.phone = 'Please enter a valid phone number';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = () => {
        console.log('Save button pressed', { formData, isEditing });
        if (validateForm()) {
            console.log('Form is valid, calling onSave');
            onSave(formData);
        } else {
            console.log('Form validation failed', errors);
            // Add haptic feedback for validation errors
            if (Platform.OS === 'ios') {
                // Could add haptic feedback here if needed
            }
        }
    };

    const handleCancel = () => {
        // Show confirmation if form has been modified
        const hasChanges = friend ? (
            formData.name !== friend.name ||
            formData.phone !== friend.phone ||
            formData.frequency !== friend.frequency ||
            formData.personalNote !== (friend.personalNote || '')
        ) : (
            formData.name.trim() || formData.phone.trim() || formData.personalNote.trim()
        );

        if (hasChanges) {
            Alert.alert(
                'Discard Changes',
                'Are you sure you want to discard your changes?',
                [
                    { text: 'Keep Editing', style: 'cancel' },
                    { text: 'Discard', style: 'destructive', onPress: onCancel },
                ]
            );
        } else {
            onCancel();
        }
    };

    if (!visible) return null;

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{
                flex: 1,
                backgroundColor: AC.systemGroupedBackground,
            }}
        >
            {/* Header */}
            <View
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingHorizontal: 20,
                    paddingVertical: 16,
                    borderBottomWidth: 0.5,
                    borderBottomColor: AC.separator,
                    backgroundColor: AC.secondarySystemGroupedBackground,
                }}
            >
                <TouchableBounce onPress={handleCancel}>
                    <Text
                        style={{
                            fontSize: 17,
                            color: AC.systemBlue,
                            fontWeight: '500',
                        }}
                    >
                        Cancel
                    </Text>
                </TouchableBounce>

                <Text
                    style={{
                        fontSize: 18,
                        fontWeight: '600',
                        color: AC.label,
                    }}
                >
                    {isEditing ? 'Edit Friend' : 'Add Friend'}
                </Text>

                {/* Invisible placeholder to center title */}
                <View style={{ width: 60 }} />
            </View>

            {/* Form */}
            <Form.List>
                <Form.Section title="Basic Information">
                    {/* Name Field */}
                    <View>
                        <TextInput
                            placeholder="Full name"
                            value={formData.name}
                            onChangeText={(text) => setFormData(prev => ({ ...prev, name: text }))}
                            style={{
                                fontSize: 17,
                                color: AC.label,
                                paddingVertical: 12,
                                borderBottomWidth: errors.name ? 1 : 0,
                                borderBottomColor: errors.name ? AC.systemRed : 'transparent',
                            }}
                            accessibilityLabel="Friend's name"
                            autoCapitalize="words"
                            autoCorrect={false}
                        />
                        {errors.name && (
                            <View
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    marginTop: 6,
                                    gap: 4,
                                }}
                            >
                                <IconSymbol name="exclamationmark.circle.fill" size={14} color={AC.systemRed} />
                                <Text style={{
                                    fontSize: 13,
                                    color: AC.systemRed,
                                    fontWeight: '500',
                                }}>
                                    {errors.name}
                                </Text>
                            </View>
                        )}
                    </View>

                    {/* Phone Field */}
                    <View>
                        <TextInput
                            placeholder="Phone number"
                            value={formData.phone}
                            onChangeText={(text) => setFormData(prev => ({ ...prev, phone: text }))}
                            style={{
                                fontSize: 17,
                                color: AC.label,
                                paddingVertical: 12,
                                borderBottomWidth: errors.phone ? 1 : 0,
                                borderBottomColor: errors.phone ? AC.systemRed : 'transparent',
                            }}
                            accessibilityLabel="Phone number"
                            keyboardType="phone-pad"
                            autoCorrect={false}
                        />
                        {errors.phone && (
                            <View
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    marginTop: 6,
                                    gap: 4,
                                }}
                            >
                                <IconSymbol name="exclamationmark.circle.fill" size={14} color={AC.systemRed} />
                                <Text style={{
                                    fontSize: 13,
                                    color: AC.systemRed,
                                    fontWeight: '500',
                                }}>
                                    {errors.phone}
                                </Text>
                            </View>
                        )}
                    </View>
                </Form.Section>

                <Form.Section title="Catch-up Frequency">
                    <FrequencySelector
                        value={formData.frequency}
                        onChange={(frequency) => setFormData(prev => ({ ...prev, frequency }))}
                    />
                </Form.Section>

                <Form.Section
                    title="Personal Note"
                    footer="Optional reminder about why you want to stay in touch"
                >
                    <TextInput
                        placeholder="e.g., College roommate, loves hiking..."
                        value={formData.personalNote}
                        onChangeText={(text) => setFormData(prev => ({ ...prev, personalNote: text }))}
                        style={{
                            fontSize: 17,
                            color: AC.label,
                            paddingVertical: 12,
                            minHeight: 80,
                            textAlignVertical: 'top',
                        }}
                        accessibilityLabel="Personal note"
                        multiline
                        numberOfLines={3}
                        autoCapitalize="sentences"
                    />
                </Form.Section>

                {/* Beautiful Add/Save Button */}
                <Form.Section>
                    <TouchableBounce
                        onPress={handleSave}
                        style={{
                            backgroundColor: (formData.name.trim() && formData.phone.trim())
                                ? isEditing ? AC.systemBlue : AC.systemGreen
                                : AC.systemGray4,
                            paddingVertical: 18,
                            borderRadius: 16,
                            alignItems: 'center',
                            marginHorizontal: 16,
                            marginVertical: 12,
                            shadowColor: AC.label,
                            shadowOffset: { width: 0, height: 4 },
                            shadowOpacity: 0.15,
                            shadowRadius: 8,
                            elevation: 4,
                        }}
                        accessibilityLabel={isEditing ? 'Save friend changes' : 'Add new friend'}
                    >
                        <View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                gap: 8,
                            }}
                        >
                            <IconSymbol
                                name={isEditing ? 'checkmark.circle.fill' : 'person.badge.plus.fill'}
                                size={20}
                                color="white"
                            />
                            <Text
                                style={{
                                    color: 'white',
                                    fontSize: 18,
                                    fontWeight: '600',
                                }}
                            >
                                {isEditing ? 'Save Changes' : 'Add Friend'}
                            </Text>
                        </View>
                    </TouchableBounce>

                    {/* Validation hint */}
                    {(!formData.name.trim() || !formData.phone.trim()) && (
                        <View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginTop: 8,
                                marginHorizontal: 16,
                                gap: 4,
                            }}
                        >
                            <IconSymbol name="info.circle" size={14} color={AC.secondaryLabel} />
                            <Text
                                style={{
                                    fontSize: 14,
                                    color: AC.secondaryLabel,
                                    textAlign: 'center',
                                }}
                            >
                                Please fill in name and phone number
                            </Text>
                        </View>
                    )}
                </Form.Section>
            </Form.List>
        </KeyboardAvoidingView>
    );
}
