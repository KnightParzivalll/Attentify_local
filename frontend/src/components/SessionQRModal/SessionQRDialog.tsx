import { Box, Button, Spinner, Text } from '@chakra-ui/react'
import { useMutation } from '@tanstack/react-query'
import { checkSessionKey } from 'api/checkSessionKey'
import {
	DialogActionTrigger,
	DialogBody,
	DialogCloseTrigger,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogRoot,
	DialogTitle
} from 'components/ui/dialog'
import { toaster } from 'components/ui/toaster'
import { useAuth } from 'contexts/AuthContext'
import useSessionKey from 'hooks/useSessionKey'
import { QRCodeSVG } from 'qrcode.react'
import React, { useEffect, useRef, useState } from 'react'
import { BaseID } from 'types/core'
import { encryptPayload } from 'utils/encryptPayload'

interface SessionQRDialogProps {
	isOpen: boolean
	setOpen: React.Dispatch<React.SetStateAction<boolean>>
	schedule_id: BaseID
}

export const SessionQRDialog: React.FC<SessionQRDialogProps> = ({
	isOpen,
	setOpen,
	schedule_id
}) => {
	const [qrValue, setQRValue] = useState<string | null>(null)
	const [validationError, setValidationError] = useState<string | null>(null)
	const intervalRef = useRef<NodeJS.Timeout | null>(null)

	const { token, user } = useAuth()

	const { data, isFetching, isError } = useSessionKey(isOpen, token)

	// Mutation to validate session key
	const validateSessionKey = useMutation({
		mutationFn: checkSessionKey,
		onError: (error: any) => {
			setValidationError(error.message)
			setQRValue(null)
			stopTimer() // stop regenerating on error
			toaster.create({
				title: 'Invalid Session Key',
				description: error.message,
				type: 'error'
			})
		}
	})

	const stopTimer = () => {
		if (intervalRef.current) {
			clearInterval(intervalRef.current)
			intervalRef.current = null
		}
	}

	const encryptAndSetQR = async (sessionKey: string) => {
		try {
			// Validate session key before proceeding
			await validateSessionKey.mutateAsync(sessionKey)

			const payload = {
				schedule_id,
				timestamp: Math.floor(Date.now() / 1000)
			}

			const encrypted = await encryptPayload(sessionKey, payload)

			// Full QR content
			const qrContent = JSON.stringify({
				teacher_id: user?.id,
				data: encrypted
			})

			console.log('QR Content:', qrContent) // Debugging log

			setValidationError(null)
			setQRValue(qrContent)
		} catch {
			// error already handled in onError
			stopTimer() // safety net
		}
	}

	useEffect(() => {
		if (isOpen && data?.session_key && user?.id) {
			encryptAndSetQR(data.session_key)

			intervalRef.current = setInterval(() => {
				encryptAndSetQR(data.session_key)
			}, 1000)
		}

		return () => {
			stopTimer()
			setQRValue(null)
			setValidationError(null)
		}
	}, [isOpen, data?.session_key, schedule_id, user?.id])

	return (
		<DialogRoot
			open={isOpen}
			onOpenChange={e => setOpen(e.open)}
			size='cover'
			placement='center'
		>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>QR Code</DialogTitle>
				</DialogHeader>
				<DialogBody
					display='flex'
					flexDir='column'
					alignItems='center'
					justifyContent='center'
				>
					{isFetching ? (
						<Spinner size='xl' />
					) : isError ? (
						<Text color='red.500'>Failed to fetch session key.</Text>
					) : validationError ? (
						<Text color='red.500' textAlign='center'>
							{validationError}
						</Text>
					) : qrValue ? (
						<Box>
							<QRCodeSVG value={qrValue} size={window.innerHeight * 0.7} />
						</Box>
					) : (
						<Text>No QR code available.</Text>
					)}
				</DialogBody>
				<DialogFooter>
					<DialogActionTrigger asChild>
						<Button variant='outline'>Close</Button>
					</DialogActionTrigger>
				</DialogFooter>
				<DialogCloseTrigger />
			</DialogContent>
		</DialogRoot>
	)
}
