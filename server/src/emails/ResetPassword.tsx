import * as React from 'react';

import {
	Body,
	Container,
	Head,
	Html,
	Img,
	Section,
	Text,
} from '@react-email/components';

interface ResetPasswordEmailProps {
	userName: string;
	resetCode: string;
}

export const ResetPassword = ({
	userName,
	resetCode,
}: ResetPasswordEmailProps): React.JSX.Element => {
	return (
		<Html>
			<Head />
			<Body
				style={{
					backgroundColor: '#121212',
					fontFamily: 'Arial, sans-serif',
					padding: '0',
					margin: '0',
					color: '#e5e5e5',
				}}
			>
				<Container
					className="container"
					style={{
						backgroundColor: '#1f1f1f',
						borderRadius: 8,
						padding: '32px',
						width: '100%',
						maxWidth: '600px',
						margin: '40px auto',
						boxShadow: '0 4px 12px rgba(124, 58, 237, 0.1)',
					}}
				>
					<Section style={{ textAlign: 'center' }}>
						<Img
							src="https://i.imgur.com/Ne0HuOi.png"
							alt="Nazary Logo"
							width="60"
							height="68"
							style={{ marginBottom: 16 }}
						/>
						<Text
							style={{
								fontSize: '26px',
								fontWeight: 'bold',
								color: '#7c3aed',
								margin: 0,
							}}
						>
							Nazary
						</Text>
						<Text
							style={{
								fontSize: '16px',
								color: '#a1a1aa',
								margin: '8px 0 24px 0',
							}}
						>
							Password reset code
						</Text>
					</Section>

					<Section style={{ textAlign: 'left' }}>
						<Text style={{ fontSize: '15px', color: '#e5e5e5' }}>
							Hello, {userName}!
						</Text>
						<Text
							style={{
								fontSize: '15px',
								color: '#e5e5e5',
								marginTop: 8,
							}}
						>
							You requested to reset your password. Use the code
							below to proceed:
						</Text>

						<Section
							style={{
								backgroundColor: '#2a2a2a',
								borderRadius: 6,
								padding: '16px',
								textAlign: 'center',
								margin: '32px 0',
							}}
						>
							<Text
								style={{
									fontSize: '32px',
									fontWeight: 'bold',
									color: '#7c3aed',
									letterSpacing: '6px',
									margin: 0,
								}}
							>
								{resetCode}
							</Text>
						</Section>

						<Text
							style={{
								fontSize: '13px',
								color: '#a1a1aa',
								marginTop: 24,
							}}
						>
							If you didn’t request this, just ignore this email.
						</Text>
					</Section>
				</Container>

				<style>
					{`
        @media only screen and (max-width: 600px) {
          table, td, div, p {
            width: 100% !important;
          }
          .container {
            padding: 16px !important;
          }
        }
      `}
				</style>
			</Body>
		</Html>
	);
};
