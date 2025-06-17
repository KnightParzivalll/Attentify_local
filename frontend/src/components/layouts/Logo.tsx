import { Flex, Text } from '@chakra-ui/react'
import { LogoIcon } from './LogoIcon'

export const Logo = () => (
	<Flex alignItems={'center'} gap={4}>
		<LogoIcon />
		<Text fontSize='xl' fontFamily='Inter' fontWeight='bold'>
			Attentify
		</Text>
	</Flex>
)
