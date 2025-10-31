class PageConfig {
	home = '/'
	register = '/auth/register'
	login = '/auth/login'
	auth = '/auth'
	verifyEmail = '/verify-email'
	resendVerification = '/resend-verification'
	notFound = '*'
	dashboard = '/dashboard'
	githubRepoLink = 'https://github.com/huziichuk/Nazary'
	githubAuthorLink = 'https://github.com/huziichuk'
	authorEmailLink = 'mailto:nazar.huziichuk@gmail.com'
	resetPassword = '/reset-password'
	createNote = `${this.dashboard}/create-note`
	noteRoute = `${this.dashboard}/notes/:id`

	noteLink(id: string) {
		return `${this.dashboard}/notes/${id}`
	}
}

export const pageConfig = new PageConfig()
