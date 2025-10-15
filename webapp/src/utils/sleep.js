/**
 * Pauses execution for a specified number of milliseconds.
 * @param {number} ms - The number of milliseconds to wait.
 * @returns {Promise<void>}
 */
export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
