import { format, isValid, parseISO } from 'date-fns'

export const formatDate = (dateString) => {
    if (!dateString) {
        // If dateString is null or undefined, return 'Present'
        return 'Present';
    }

    try {
        const date = parseISO(dateString);
        return isValid(date) ? format(date, 'MMM yyyy') : 'Present';
    } catch (error) {
        // Catch any unexpected errors
        console.error("Error parsing date:", error);
        return 'Present';
    }
};
