export const titleToHash = (title: string) =>
  title
    ? `#${title
      .split(' ')
      .join('-')
      .toLowerCase()}`
    : null;
