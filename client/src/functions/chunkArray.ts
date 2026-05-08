/**
 * Splits an array into chunks of a specified size.
 *
 * @param array - The array to split
 * @param size - The size of each chunk
 * @returns An array of chunks
 */
export const chunkArray = <T>(array: T[], size: number = 4): T[][] => {
  const chunked: T[][] = [];

  for (let i = 0; i < array.length; i += size) {
    chunked.push(array.slice(i, i + size));
  }

  return chunked;
};
