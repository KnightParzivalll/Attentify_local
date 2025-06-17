import { Link, Separator } from '@chakra-ui/react'

import {
	MenuContent,
	MenuItem,
	MenuRoot,
	MenuTrigger
} from 'components/ui/menu'

import { useAuth } from 'contexts/AuthContext'
import { UserAvatar } from './UserAvatar'

// components/layouts/UserMenu.tsx
export const UserMenu = () => {
	const { logout, user } = useAuth()

	return (
		<MenuRoot>
			<MenuTrigger>
				<UserAvatar user={user} />
			</MenuTrigger>
			<MenuContent bg='{colors.bg}'>
				<MenuItem asChild value='profile' _hover={{ bg: 'blue.500' }}>
					<Link href='/profile' _hover={{ textDecoration: 'none' }}>
						Profile
					</Link>
				</MenuItem>

				<Separator />
				<MenuItem onClick={logout} value='signout' _hover={{ bg: 'red.500' }}>
					Sign out
				</MenuItem>
			</MenuContent>
		</MenuRoot>
	)
}
