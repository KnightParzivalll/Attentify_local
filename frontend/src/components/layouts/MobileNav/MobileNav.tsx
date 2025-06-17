import { Flex } from '@chakra-ui/react'
import { useColorModeValue } from 'components/ui/color-mode'
import { HeaderControls } from './HeaderControls'
import { MobileMenuButton } from './MobileMenuButton'

// components/layouts/MobileNav.tsx
export const MobileNav = ({ onOpen }: { onOpen: () => void }) => {
	const borderColor = useColorModeValue('gray.200', 'gray.700')

	return (
		<Flex
			ml={{ base: 0, md: 60 }}
			px={{ base: 4, md: 4 }}
			height='20'
			alignItems='center'
			borderBottomWidth='1px'
			borderBottomColor={borderColor}
			justifyContent={{ base: 'space-between', md: 'flex-end' }}
		>
			<MobileMenuButton onOpen={onOpen} />
			<HeaderControls />
		</Flex>
	)
}
