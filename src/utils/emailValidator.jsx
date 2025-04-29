export const isValidEmail = (email) => {
    if (typeof email !== 'string') return false; // Ensure input is a string

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email.trim()); // Trim whitespace and validate
}