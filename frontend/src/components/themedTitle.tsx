import { Link as ChakraLink, HStack, Heading, Icon } from '@chakra-ui/react'
import type React from 'react'

interface ThemedTitleV2Properties {
	collapsed: boolean
	text: string
	wrapperStyles?: React.CSSProperties
}

export const ThemedTitleV2: React.FC<
	React.PropsWithChildren<ThemedTitleV2Properties>
> = ({ collapsed, text, wrapperStyles, children }) => (
	<ChakraLink
		fontSize='inherit'
		textDecoration='none'
		_hover={{
			textDecoration: 'none'
		}}
	>
		<HStack
			justifyContent='center'
			alignItems='center'
			fontSize='inherit'
			style={{
				...wrapperStyles
			}}
		>
			<Icon height='36px' width='36px' color='brand.500'>
				{children}
			</Icon>

			{!collapsed && (
				<Heading as='h6' fontWeight={700} fontSize='inherit'>
					{text}
				</Heading>
			)}
		</HStack>
	</ChakraLink>
)
