export const formatPhoneNumber = (phone: string) => {
  // Remove all non-digit characters (spaces, dashes, etc)
  let digits = phone.replace(/\D/g, '');
  
  // If the number starts with 964, remove it
  if (digits.startsWith('964')) {
    digits = digits.slice(3);
  }
  
  // Remove leading zeros
  while (digits.startsWith('0')) {
    digits = digits.slice(1);
  }
  
  // Add the country code if not present
  if (!digits.startsWith('964')) {
    digits = '964' + digits;
  }
  
  return `+${digits}`;
};

export const normalizePhoneNumber = (phone: string) => {
  // Remove all non-digit characters including +
  let digits = phone.replace(/\D/g, '');
  
  // Remove leading zeros
  while (digits.startsWith('0')) {
    digits = digits.slice(1);
  }
  
  // Remove country code if present
  if (digits.startsWith('964')) {
    digits = digits.slice(3);
  }
  
  // Ensure exactly 10 digits for Iraqi phone numbers
  if (digits.length > 10) {
    digits = digits.slice(-10);
  }
  
  return digits;
};