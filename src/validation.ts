export const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
export const passwordRegex =
  /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
export const passwordLengthRegex = /^.{8,}$/;
export const englishLetterRegex = /[a-zA-Z]/;
export const containNumberRegex = /\d/;
export const containsSpecialCharacterRegex = /[!@#$%^&*()_+{}[\]:;<>,.?~\\/-]/;
export const nickNameRegex = /^[a-z_]{5,}$/;
