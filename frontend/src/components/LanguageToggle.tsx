import {
	Button,
	HoverCard,
	HStack,
	Icon,
	Portal,
	VStack
} from '@chakra-ui/react'
import i18next from 'i18next'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { IoLanguage } from 'react-icons/io5'
import { RiArrowDownSLine } from 'react-icons/ri'

const LanguageToggle: React.FC = () => {
	const { i18n } = useTranslation()

	// Get current language
	// const currentLanguage = i18n.language
	const currentLanguage = i18next.resolvedLanguage as 'ru' | 'en'

	// Toggle between English and Russian
	const toggleLanguage = () => {
		i18n.changeLanguage(currentLanguage === 'en' ? 'ru' : 'en')
	}

	const setLanguage = (lang: 'ru' | 'en') => {
		i18n.changeLanguage(lang)
	}

	return (
		<HoverCard.Root size='xs' openDelay={100} closeDelay={100}>
			<HoverCard.Trigger asChild>
				<HStack gap='2px'>
					<Icon size='md'>
						<IoLanguage />
					</Icon>
					<Icon size='sm'>
						<RiArrowDownSLine />
					</Icon>
				</HStack>
			</HoverCard.Trigger>
			<Portal>
				<HoverCard.Positioner>
					<HoverCard.Content bg='{colors.bg}' p={1}>
						<HoverCard.Arrow>
							<HoverCard.ArrowTip bg='{colors.bg} !important' />
						</HoverCard.Arrow>
						<VStack>
							<Button
								onClick={() => setLanguage('ru')}
								rounded='full'
								variant='ghost'
								color={currentLanguage === 'ru' ? 'brand.400' : ''}
							>
								Russian
							</Button>
							<Button
								onClick={() => setLanguage('en')}
								rounded='full'
								variant='ghost'
								color={currentLanguage === 'en' ? 'brand.400' : ''}
							>
								English
							</Button>
						</VStack>
					</HoverCard.Content>
				</HoverCard.Positioner>
			</Portal>
		</HoverCard.Root>
	)
}

export default LanguageToggle
