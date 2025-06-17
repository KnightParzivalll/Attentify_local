import { Box, Button, Field, Float, Heading, Input } from '@chakra-ui/react'
import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Checkbox } from '../components/ui/checkbox'
import { ColorModeButton, useColorModeValue } from '../components/ui/color-mode'

import type { BoxProps } from '@chakra-ui/react'
import { LogoIcon } from 'components/layouts/LogoIcon'
import { ThemedTitleV2 } from 'components/themedTitle'
import { PasswordInput } from 'components/ui/password-input'
import { useAuth } from 'contexts/AuthContext'
import { useNavigate } from 'react-router-dom'

export const layoutProps: BoxProps = {
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'center',
	justifyContent: 'center',
	backgroundSize: 'cover',
	minHeight: '100dvh',
	padding: '16px'
}

export const cardProps: BoxProps = {
	width: '100%',
	maxWidth: '400px',
	borderRadius: '12px',
	padding: '32px'
}

const LoginPage: React.FC = ({}) => {
	const {
		handleSubmit,
		register,
		control,
		formState: { errors, isSubmitting }
	} = useForm()

	// const { authorized, cookieLogin } = useAuth()
	const { tokenLogin } = useAuth()
	const navigate = useNavigate()

	// useEffect(() => {
	// 	if (authorized) {
	// 		navigate('/')
	// 	}
	// }, [authorized, navigate])

	function onSubmit(values: any) {
		tokenLogin(values.email, values.password)
	}

	const fieldsBorderColor = useColorModeValue('gray.200', 'whiteAlpha.300')

	const welcomeTextColor = useColorModeValue('blue.500', 'brand.200')
	const buttonBgColor = useColorModeValue('blue.400', 'brand.200')

	const checkedCheckboxStyles = {
		borderColor: welcomeTextColor,
		backgroundColor: welcomeTextColor
	}

	const PageTitle = (
		<div
			style={{
				display: 'flex',
				justifyContent: 'center',
				marginBottom: '32px',
				fontSize: '20px'
			}}
		>
			{/* <ThemedTitleV2 collapsed={false} text='Testing'>
				<HiHeart />
			</ThemedTitleV2> */}

			<ThemedTitleV2 collapsed={false} text='Attentify'>
				<LogoIcon />
			</ThemedTitleV2>
		</div>
	)

	const allContentProps = { ...cardProps }
	const content = (
		<Box
			borderWidth='1px'
			borderColor={fieldsBorderColor}
			backgroundColor={useColorModeValue('white', '#1A202C')}
			{...allContentProps}
		>
			<Heading
				mb='8'
				textAlign='center'
				fontSize='2xl'
				color={welcomeTextColor}
			>
				<p>Sign in to your account</p>
			</Heading>
			<form onSubmit={handleSubmit(onSubmit)} autoComplete='on'>
				<Field.Root mt='6' invalid={!!errors?.email}>
					<Field.Label>Email</Field.Label>
					<Input
						id='email'
						autoComplete='email'
						placeholder='Email'
						type='text'
						borderColor={fieldsBorderColor}
						{...register('email', {
							required: 'Email is required',

							pattern: {
								value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
								message: 'Invalid email address'
							}
						})}
					/>
					<Field.ErrorText>{`${errors.email?.message}`}</Field.ErrorText>
				</Field.Root>

				<Field.Root mt='6' invalid={!!errors?.password}>
					<Field.Label>Password</Field.Label>
					<PasswordInput
						id='password'
						type='password'
						placeholder='Password'
						autoComplete='current-password'
						borderColor={fieldsBorderColor}
						{...register('password', {
							required: 'Password is required'
						})}
					/>
					<Field.ErrorText>{`${errors.password?.message}`}</Field.ErrorText>
				</Field.Root>

				<Controller
					control={control}
					name='rememberMe'
					defaultValue={false}
					render={({ field: { onChange, value, ref } }) => (
						<Checkbox
							onChange={onChange}
							ref={ref}
							checked={value}
							mt='6'
							size='sm'
							borderColor={fieldsBorderColor}
							checkedStyles={checkedCheckboxStyles}
						>
							Remember me
						</Checkbox>
					)}
				/>

				<Button
					mt='6'
					type='submit'
					width='full'
					bg={buttonBgColor}
					color='gray.800'
					fontSize='16px'
					fontWeight='600'
				>
					Sign in
				</Button>
			</form>
		</Box>
	)

	return (
		<Box
			{...layoutProps}
			justifyContent='center'
			paddingTop='16px'
			// bg={useColorModeValue('white', '#171923')}
		>
			<>
				{PageTitle}

				{content}
			</>

			<Float placement='top-end' offset='10'>
				<ColorModeButton />
			</Float>
		</Box>
	)
}

export default LoginPage
