export type IdPropertyFunction<T> = (element: T) => string;

export const getIdentityMap = <T>(array: Array<T>, idPropertyFun: IdPropertyFunction<T>): Record<string, T> => {
  const resultMap: Record<string, T> = {};
  array.forEach((element) => {
    const propertyKey = idPropertyFun(element);
    resultMap[propertyKey] = element;
  });
  return resultMap;
};