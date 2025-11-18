/**
 * Validates an Instagram username according to Instagram's rules
 * @param {string} username - The username to validate
 * @returns {Object} - { isValid: boolean, error: string | null }
 */
export function validateUsername(username) {
  // Check if username is empty
  if (!username || username.trim() === '') {
    return {
      isValid: false,
      error: 'Please enter a username'
    };
  }

  // Check maximum length (Instagram limit is 30 characters)
  if (username.length > 30) {
    return {
      isValid: false,
      error: 'Username must be 30 characters or less'
    };
  }

  // Check for valid characters: alphanumeric, underscores, and periods only
  const validUsernameRegex = /^[a-zA-Z0-9_.]+$/;
  if (!validUsernameRegex.test(username)) {
    return {
      isValid: false,
      error: 'Username can only contain letters, numbers, underscores, and periods'
    };
  }

  // Username is valid
  return {
    isValid: true,
    error: null
  };
}
