/**
 * Utilities for Friends Management
 */

import type { Friend } from '@/components/home/HeyAgainComponents';

// Format last call timestamp
export function formatLastCall(lastCallAt?: string): string {
    if (!lastCallAt) return 'Never';

    const lastCall = new Date(lastCallAt);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - lastCall.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) {
        const weeks = Math.floor(diffDays / 7);
        return weeks === 1 ? '1 week ago' : `${weeks} weeks ago`;
    }
    const months = Math.floor(diffDays / 30);
    return months === 1 ? '1 month ago' : `${months} months ago`;
}

// Sort friends alphabetically by name
export function sortFriends(friends: Friend[]): Friend[] {
    return [...friends].sort((a, b) => a.name.localeCompare(b.name));
}

// Validate phone number (basic validation)
export function isValidPhone(phone: string): boolean {
    // Remove all non-digits
    const cleaned = phone.replace(/\D/g, '');
    // Must be 10-15 digits
    return cleaned.length >= 10 && cleaned.length <= 15;
}

// Format phone number for display
export function formatPhone(phone: string): string {
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 10) {
        return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
    }
    return phone; // Return as-is if not 10 digits
}

// Frequency display helpers
export const FREQUENCY_COLORS = {
    weekly: '#34C759',    // systemGreen
    biweekly: '#007AFF',  // systemBlue  
    monthly: '#AF52DE',   // systemPurple
} as const;

export const FREQUENCY_LABELS = {
    weekly: 'Weekly',
    biweekly: 'Biweekly',
    monthly: 'Monthly',
} as const;

export type FrequencyType = keyof typeof FREQUENCY_LABELS;
