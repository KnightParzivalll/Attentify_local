import { HStack, IconButton } from '@chakra-ui/react'
import LanguageToggle from 'components/LanguageToggle'
import { ColorModeButton } from 'components/ui/color-mode'
import { FiBell } from 'react-icons/fi'
import { UserMenu } from '../UserMenu/UserMenu'

export const HeaderControls = () => (
	<HStack gap={{ base: 0, md: 6 }}>
		<LanguageToggle />
		<ColorModeButton />
		<IconButton size='lg' variant='ghost' aria-label='notifications'>
			<FiBell />
		</IconButton>
		<UserMenu />
	</HStack>
)
