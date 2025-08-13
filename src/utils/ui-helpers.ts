/**
 * UI Utilities for HeyAgain app
 */

// Get initials from a full name
export function getInitials(name: string): string {
    return name
        .split(' ')
        .map(word => word.charAt(0).toUpperCase())
        .slice(0, 2)
        .join('');
}

// Generate a deterministic color from name hash with soft palette
export function getAvatarColor(name: string): string {
    // Simple hash function
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        const char = name.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32-bit integer
    }

    // Soft color palette that works well with white text
    const colors = [
        '#6366F1', // Indigo
        '#8B5CF6', // Violet
        '#EC4899', // Pink
        '#EF4444', // Red
        '#F97316', // Orange
        '#F59E0B', // Amber
        '#10B981', // Emerald
        '#06B6D4', // Cyan
        '#3B82F6', // Blue
        '#8B5A2B', // Brown
    ];

    const index = Math.abs(hash) % colors.length;
    return colors[index];
}

// Format time slot with improved typography
export function formatTimeSlot(startTime: Date, endTime: Date): string {
    const now = new Date();
    const isToday = startTime.toDateString() === now.toDateString();

    const timeFormat = { hour: 'numeric', minute: '2-digit' } as const;
    const start = startTime.toLocaleTimeString('en-US', timeFormat);
    const end = endTime.toLocaleTimeString('en-US', timeFormat);

    if (isToday) {
        return `Today • ${start}–${end}`;
    } else {
        const dayFormat = { weekday: 'short' } as const;
        const dayName = startTime.toLocaleDateString('en-US', dayFormat);
        return `${dayName} • ${start}–${end}`;
    }
}
