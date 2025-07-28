import type { ResetPasswordStage } from '@/types/authTypes'
import React, { useState } from 'react'
import NotFound from '../notFound/NotFound'
import NewResetPassword from './newResetPassword/NewResetPassword'
import RequestResetPassword from './requestResetPassword/RequestResetPassword'
import VerifyResetPassword from './verifyResetPassword/VerifyResetPassword'
import SuccessResetPassword from './successResetPassword/SuccessResetPassword'

const ResetPassword: React.FC = () => {
	const [stage, setStage] = useState<ResetPasswordStage>('request')
	const [email, setEmail] = useState<string>('')
	const [code, setCode] = useState<string>('')

	if (stage === 'request')
		return (
			<RequestResetPassword
				onSuccess={(email: string) => {
					setStage('verify')
					setEmail(email)
				}}
			/>
		)

	if (stage === 'verify')
		return (
			<VerifyResetPassword
				email={email}
				back={() => {
					setStage('request')
				}}
				onSuccess={(code: string) => {
					setCode(code)
					setStage('newPassword')
				}}
				resendCode={() => {}}
			/>
		)

	if (stage === 'newPassword')
		return (
			<NewResetPassword
				code={code}
				back={() => {
					setStage('verify')
				}}
				onSuccess={() => {
					setStage('success')
				}}
			/>
		)

	if (stage === 'success') return <SuccessResetPassword />

	return <NotFound />
}

export default ResetPassword
