export const useFormatDate = (
	dateString: string | undefined,
	options: Intl.DateTimeFormatOptions = {
		day: 'numeric',
		month: 'short',
		year: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
	}
) => {
	if (!dateString) return null
	const date = new Date(dateString)
	return new Intl.DateTimeFormat('en-EN', options).format(date)
}
