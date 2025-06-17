import { BoxProps, FlexProps } from '@chakra-ui/react'
import { ReactNode } from 'react'
import { IconType } from 'react-icons'

export interface NavItem {
	name: string
	icon: IconType
	path?: string
}

export interface SidebarProps extends BoxProps {
	onClose: () => void
	navItems: NavItem[]
}

export interface NavItemProps extends FlexProps {
	icon: IconType
	path?: string
	children: React.ReactNode
}

export interface GlobalLayoutProps extends BoxProps {
	children: ReactNode
	navItems: NavItem[]
	logo?: ReactNode
	sidebarWidth?: number | string
	headerHeight?: number | string
}
