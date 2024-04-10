export const truncateText = (text: string) => {
  if (text.length > 12) {
    return text.substring(0, 12) + '...';
  }
  return text;
};
