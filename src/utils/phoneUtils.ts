export const formatPhoneNumber = (phone: string) => {
  // Remove any non-digit characters
  let digits = phone.replace(/\D/g, '');
  
  // Remove leading zero if present
  if (digits.startsWith('0')) {
    digits = digits.slice(1);
  }
  
  // If it starts with 964, remove it first
  if (digits.startsWith('964')) {
    digits = digits.slice(3);
  }
  
  // Add the +964 prefix
  return `+964${digits}`;
};