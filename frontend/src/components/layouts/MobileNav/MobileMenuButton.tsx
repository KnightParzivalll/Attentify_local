import { IconButton } from '@chakra-ui/react'
import { FiMenu } from 'react-icons/fi'

export const MobileMenuButton = ({ onOpen }: { onOpen: () => void }) => (
	<IconButton
		display={{ base: 'flex', md: 'none' }}
		onClick={onOpen}
		variant='outline'
		aria-label='open menu'
	>
		<FiMenu />
	</IconButton>
)
