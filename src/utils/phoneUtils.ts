export const formatPhoneNumber = (phone: string) => {
  // Remove any non-digit characters
  let digits = phone.replace(/\D/g, '');
  
  // If the number starts with 964, remove it
  if (digits.startsWith('964')) {
    digits = digits.slice(3);
  }
  
  // If it doesn't start with 964, we'll add it
  if (!digits.startsWith('964')) {
    // Remove leading zeros if present
    while (digits.startsWith('0')) {
      digits = digits.slice(1);
    }
    // Add the country code
    digits = '964' + digits;
  }
  
  // Add the + prefix
  return `+${digits}`;
};

// Helper function to normalize phone numbers for comparison
export const normalizePhoneNumber = (phone: string) => {
  // Remove all non-digit characters including +
  let digits = phone.replace(/\D/g, '');
  
  // Remove leading zeros
  while (digits.startsWith('0')) {
    digits = digits.slice(1);
  }
  
  return digits;
};