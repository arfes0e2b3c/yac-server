export const filterProperties = <T extends object>(
	obj: T,
	filterFn: (key: string, value: unknown) => boolean
): Partial<T> => {
	return Object.fromEntries(
		Object.entries(obj).filter(([key, value]) => filterFn(key, value))
	) as Partial<T>
}

export const filterUndefinedNullProperties = <T extends object>(
	obj: T
): Partial<T> =>
	filterProperties(obj, (_key, value) => value !== undefined || value !== null)
