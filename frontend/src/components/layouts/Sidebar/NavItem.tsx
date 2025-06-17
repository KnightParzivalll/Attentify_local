import { Flex, Icon } from '@chakra-ui/react'
import { useColorModeValue } from 'components/ui/color-mode'
import { useLocation, useNavigate } from 'react-router-dom'
import { NavItemProps } from '../types'

export const NavItem = ({ icon, children, path, ...rest }: NavItemProps) => {
	const hoverBg = useColorModeValue('cyan.400', 'cyan.600')
	const hoverColor = useColorModeValue('white', 'gray.100')

	const activeBg = useColorModeValue('cyan.200', 'cyan.700')
	const activeColor = useColorModeValue('white', 'gray.100')

	const location = useLocation()
	const navigate = useNavigate()
	const isActive = location.pathname === path

	return (
		<Flex
			// as='a'
			// href={path || '#'}
			align='center'
			p='4'
			mx='4'
			borderRadius='lg'
			cursor='pointer'
			bg={isActive ? activeBg : 'transparent'}
			// color={isActive ? activeColor : 'inherit'}
			_hover={{
				bg: hoverBg,
				color: hoverColor
			}}
			w='100%'
			onClick={() => path && navigate(path)}
			{...rest}
		>
			{/* <Link
				href={path || '#'}
				_hover={{ textDecoration: 'none' }}
				_focus={{ boxShadow: 'none' }}
				h='100%'
			> */}
			<Icon mr='4' fontSize='16' as={icon} />
			{children}
			{/* </Link> */}
		</Flex>
	)
}
