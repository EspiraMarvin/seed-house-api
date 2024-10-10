/** deletes user password from response */
export const deletePwdFromResponse = (user: any) => {
  delete user.password;
  return user;
};

// Function to generate a random password
export const generateRandomPassword = (length = 12) => {
  let pass = '';
  const str =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZ' + 'abcdefghijklmnopqrstuvwxyz0123456789@#$';

  for (let i = 1; i <= length; i++) {
    const char = Math.floor(Math.random() * str.length + 1);

    pass += str.charAt(char);
  }

  return pass;
};
