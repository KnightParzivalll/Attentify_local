import { HStack, Text, VStack } from '@chakra-ui/react'
import i18next from 'i18next'
import { FiChevronDown } from 'react-icons/fi'
import { UserProfileResponse } from 'types/profile'

export const UserAvatar = (
	{ user }: { user: UserProfileResponse | null } // TODO : type
) => {
	// const currentLang = useTranslation().i18n.language as 'ru' | 'en'
	const currentLang = i18next.resolvedLanguage as 'ru' | 'en'

	if (!user) {
		return null
	}

	return (
		<HStack>
			{/* <Avatar size='sm' src={user?.avatar} name={user?.name} /> */}
			<VStack
				// display={{ base: 'none', md: 'flex' }}
				display='flex'
				alignItems='flex-start'
				gap='1px'
				ml='2'
				justifyContent='center'
			>
				<Text fontSize='sm'>
					{user.profile.last_name[currentLang] +
						' ' +
						user.profile.first_name[currentLang].charAt(0) +
						'. ' +
						user.profile.patronymic[currentLang].charAt(0) +
						'.'}
				</Text>
				<Text w='100%' fontSize='xs'>
					{user.role.name[currentLang]}
				</Text>
			</VStack>
			<FiChevronDown />
		</HStack>
	)
}
