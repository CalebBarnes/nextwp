function isObject(item: any): item is Record<string, unknown> {
  return item && typeof item === "object" && !Array.isArray(item);
}

export function deepMerge<T extends Record<string, any>>(
  target: T,
  source: T
): T {
  const output = { ...target };
  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        const sourceKey = source[key as keyof T];
        const targetKey = target[key as keyof T];

        if (isObject(sourceKey) && isObject(targetKey)) {
          output[key as keyof T] = deepMerge(
            targetKey as Record<string, unknown>,
            sourceKey
          ) as T[keyof T];
        } else if (Array.isArray(sourceKey)) {
          // If the source key is an array, replace the target key with a copy of the array.
          output[key as keyof T] = [...sourceKey] as T[keyof T];
        } else {
          // For primitives and non-object/non-array values, just assign.
          output[key as keyof T] = sourceKey;
        }
      }
    }
  }
  return output;
}
