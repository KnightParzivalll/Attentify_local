// components/layouts/Sidebar/Sidebar.tsx

import { Box, CloseButton, Flex } from '@chakra-ui/react'
import { useColorModeValue } from 'components/ui/color-mode'
import { Logo } from '../Logo'
import { SidebarProps } from '../types'
import { NavItem } from './NavItem'

export const SidebarContent = ({
	navItems,
	onClose,
	...rest
}: SidebarProps) => {
	const borderColor = useColorModeValue('gray.200', 'gray.700')

	return (
		<Box
			borderRight='1px'
			borderRightColor={borderColor}
			// w='20rem' // TODO: make responsive
			pos='fixed'
			h='full'
			{...rest}
		>
			<Flex h='20' alignItems='center' mx='8' justifyContent='space-between'>
				<Logo />
				<CloseButton display={{ base: 'flex', md: 'none' }} onClick={onClose} />
			</Flex>
			{navItems?.map(item => (
				<NavItem key={item.name} icon={item.icon} path={item.path}>
					{item.name}
				</NavItem>
			))}
		</Box>
	)
}
