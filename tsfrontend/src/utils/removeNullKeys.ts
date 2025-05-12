type Cleanable =
    | {
          [key: string]: Cleanable | Cleanable[] | any
      }
    | Cleanable[]
    | any

export function cleanObject<T extends Cleanable>(obj: T): T
export function cleanObject<T extends Cleanable>(
    obj: T | null | undefined,
): T | undefined
export function cleanObject<T extends Cleanable>(
    obj: T | null | undefined,
): T | undefined {
    if (obj === null || obj === undefined || obj === '') {
        return undefined
    }

    if (
        typeof obj !== 'object' ||
        obj instanceof Date ||
        obj instanceof RegExp
    ) {
        return obj
    }

    if (Array.isArray(obj)) {
        const cleanedArray = obj
            .map(cleanObject)
            .filter((item) => item !== undefined)
        return cleanedArray as T
    }

    const result: Record<string, any> = {}
    for (const [key, value] of Object.entries(obj)) {
        const cleanedValue = cleanObject(value)
        if (cleanedValue !== undefined) {
            result[key] = cleanedValue
        }
    }

    return Object.keys(result).length > 0 ? (result as T) : undefined
}
