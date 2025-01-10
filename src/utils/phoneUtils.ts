export const formatPhoneNumber = (phone: string) => {
  // Remove all non-digit characters
  let digits = phone.replace(/\D/g, '');
  
  // Handle different Iraqi number formats
  if (digits.startsWith('964')) {
    // Remove country code if it starts with 964
    digits = digits.slice(3);
  } else if (digits.startsWith('00964')) {
    // Handle international format starting with 00964
    digits = digits.slice(5);
  }
  
  // Remove leading zeros
  while (digits.startsWith('0')) {
    digits = digits.slice(1);
  }
  
  // Ensure the number starts with 7
  if (!digits.startsWith('7')) {
    return '';
  }
  
  // Ensure we have exactly 10 digits for Iraqi numbers
  if (digits.length !== 10) {
    return '';
  }
  
  return `+964${digits}`;
};

export const normalizePhoneNumber = (phone: string) => {
  // Remove all non-digit characters including +
  let digits = phone.replace(/\D/g, '');
  
  // Handle different Iraqi number formats
  if (digits.startsWith('964')) {
    digits = digits.slice(3);
  } else if (digits.startsWith('00964')) {
    digits = digits.slice(5);
  }
  
  // Remove leading zeros
  while (digits.startsWith('0')) {
    digits = digits.slice(1);
  }
  
  // Ensure exactly 10 digits for Iraqi phone numbers
  if (digits.length > 10) {
    digits = digits.slice(-10);
  }
  
  return digits;
};