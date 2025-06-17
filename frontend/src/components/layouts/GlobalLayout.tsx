// components/layouts/GlobalLayout.tsx
import { Box, useDisclosure } from '@chakra-ui/react'
import { DrawerContent, DrawerRoot } from 'components/ui/drawer'
import { MobileNav } from './MobileNav/MobileNav'
import { SidebarContent } from './Sidebar/Sidebar'
import type { GlobalLayoutProps } from './types'

export const GlobalLayout = ({ children, navItems }: GlobalLayoutProps) => {
	const { open, onOpen, onClose, onToggle } = useDisclosure()

	return (
		<Box minH='100vh'>
			{/* Desktop Sidebar */}
			<SidebarContent
				navItems={navItems}
				onClose={onClose}
				display={{ base: 'none', md: 'block' }}
			/>

			{/* Mobile Drawer */}
			<DrawerRoot open={open} placement='start' onOpenChange={onToggle}>
				<DrawerContent bg='{colors.bg}'>
					<SidebarContent navItems={navItems} onClose={onClose} />
				</DrawerContent>
			</DrawerRoot>

			{/* Mobile Navigation */}
			<MobileNav onOpen={onOpen} />

			{/* Main Content */}
			<Box ml={{ base: 0, md: 60 }} p='4'>
				{children}
			</Box>
		</Box>
	)
}
