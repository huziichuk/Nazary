import {
	Body,
	Container,
	Head,
	Html,
	Img,
	Section,
	Text,
} from '@react-email/components';
import * as React from 'react';

export const PasswordChanged = (): React.JSX.Element => {
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
							Password changed successfully
						</Text>
					</Section>

					<Section style={{ textAlign: 'left' }}>
						<Text style={{ fontSize: '15px', color: '#e5e5e5' }}>
							Hello!
						</Text>
						<Text
							style={{
								fontSize: '15px',
								color: '#e5e5e5',
								marginTop: 8,
							}}
						>
							Your password has been successfully changed. If it
							was you – no action is needed.
						</Text>

						<Section
							style={{
								backgroundColor: '#2a2a2a',
								borderRadius: 6,
								padding: '16px',
								margin: '32px 0',
							}}
						>
							<Text
								style={{
									fontSize: '15px',
									color: '#a1a1aa',
									margin: 0,
								}}
							>
								To keep your account secure:
							</Text>
							<ul
								style={{
									paddingLeft: '20px',
									marginTop: '10px',
								}}
							>
								<li
									style={{
										color: '#e5e5e5',
										marginBottom: 6,
									}}
								>
									All active sessions were terminated.
								</li>
								<li
									style={{
										color: '#e5e5e5',
										marginBottom: 6,
									}}
								>
									You’ll need to log in again on each device.
								</li>
								<li style={{ color: '#e5e5e5' }}>
									Notification sent to your email.
								</li>
							</ul>
						</Section>

						<Text style={{ fontSize: '13px', color: '#a1a1aa' }}>
							Didn’t change your password? Please secure your
							account by resetting your password again and
							contacting support.
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
