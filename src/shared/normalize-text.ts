export const normalizeText = (text: string | null): string => {
  if (!text) {
    return text ?? '';
  }

  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
};
