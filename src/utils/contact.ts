export const getTelHref = (phone?: string | null): string | null => {
  if (!phone) return null;

  const normalizedPhone = phone.replace(/[^\d+]/g, '');
  return /\d/.test(normalizedPhone) ? `tel:${normalizedPhone}` : null;
};
