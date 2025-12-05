export const splitAndTrim = (str: string) =>
	str
		.split(';')
		.map((s) => s.trim())
		.filter((s) => s);
