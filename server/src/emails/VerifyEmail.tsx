import * as React from 'react';

import {
	Html,
	Head,
	Body,
	Container,
	Text,
	Button,
	Section,
	Img,
} from '@react-email/components';

interface VerifyEmailProps {
	userName: string;
	verificationUrl: string;
}

export const VerifyEmail = ({
	userName,
	verificationUrl,
}: VerifyEmailProps): React.JSX.Element => {
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
							Confirm your email address
						</Text>
					</Section>

					<Section>
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
							Thank you for signing up for <strong>Nazary</strong>
							. Please confirm your email address to activate your
							account.
						</Text>

						<Section
							style={{ textAlign: 'center', margin: '32px 0' }}
						>
							<Button
								href={verificationUrl}
								style={{
									backgroundColor: '#7c3aed',
									color: '#fff',
									padding: '12px 24px',
									borderRadius: 6,
									textDecoration: 'none',
									fontWeight: 'bold',
									fontSize: '15px',
									display: 'inline-block',
								}}
							>
								Confirm Email
							</Button>
						</Section>

						<Text
							style={{
								fontSize: '13px',
								color: '#a1a1aa',
								marginTop: 24,
							}}
						>
							If you did not create an account, you can safely
							ignore this email.
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
          a {
            display: block !important;
            width: 100% !important;
            box-sizing: border-box;
          }
        }
      `}
				</style>
			</Body>
		</Html>
	);
};
