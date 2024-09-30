import crypto from 'crypto';

/** deletes user password from response */
export const deletePwdFromResponse = (user: any) => {
  const nUser = user?.id || user;
  delete nUser.password;

  return nUser;
};

// Function to generate a random password
export const generateRandomPassword = (length = 12) => {
  const chars =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$!';
  let password = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = crypto.randomInt(0, chars.length);
    password += chars[randomIndex];
  }
  return password;
};
