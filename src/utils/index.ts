//genUSername function

export const genUsername = (): string => {
    const usernamePrefix = 'user-';
    const randomNumber = Math.random().toString(36).slice(2);
    return usernamePrefix + randomNumber;
}