import { Box, Flex, HStack } from '@chakra-ui/react'
import { useSessionStorage } from '@uidotdev/usehooks'
import React, { useEffect, useMemo } from 'react'

import {
	AnimatedWeekTypeSelector,
	WeekType,
	WorkMode,
	WorkModeSelector
} from 'components/controls'
import { DaysSchedule, WeeksSchedule } from 'components/schedule'
import {
	AnimatedSelectGroups,
	SelectFieldCollection,
	SelectFieldItem
} from 'components/select'
import { useAuth } from 'contexts/AuthContext'
import useGroups from 'hooks/useGroups'

const TeacherSchedule: React.FC = () => {
	const { token } = useAuth()

	const [mode, setMode] = useSessionStorage<WorkMode>(
		'WorkModeSelector',
		'days'
	)
	const [weekType, setWeekType] = useSessionStorage<WeekType>(
		'WeekTypeSelector',
		'upper'
	)
	const [selectType, setSelectType] = useSessionStorage<string[]>(
		'SelectGroups',
		[]
	)

	const {
		data: groupsData,
		isLoading: isLoadingGroups,
		error: errorGroups
	} = useGroups('groups', token)

	const groups = useMemo<SelectFieldCollection<string>>(() => {
		const items: SelectFieldItem<string>[] = (groupsData || []).map(item => ({
			label: item.group_name,
			value: item.group_id.toString()
		}))
		return { items }
	}, [groupsData])

	useEffect(() => {
		if (isLoadingGroups) return

		const validSelectType: string[] = selectType.filter((type: string) =>
			groups.items.some(value => value.value.toString() === type)
		)

		if (validSelectType.length !== selectType.length) {
			setSelectType(validSelectType)
			alert('Некоторые группы были удалены, так как они не существуют')
		}
	}, [groups.items, selectType])

	return (
		<>
			<Box width='100%' p={4} h='100%'>
				<Flex
					width='100%'
					justifyContent='space-between'
					wrap='wrap'
					gap='25px'
					align={'center'}
				>
					<HStack gap='25px' wrap='wrap'>
						<WorkModeSelector
							value={mode}
							onValueChange={value => setMode(value)}
						/>
						<AnimatedWeekTypeSelector
							isVisible={mode === 'week'}
							value={weekType}
							onValueChange={value => setWeekType(value)}
						/>
					</HStack>

					<AnimatedSelectGroups
						collection={groups}
						isVisible={mode === 'week'}
						value={selectType}
						onValueChange={setSelectType}
						size='sm'
						width='220px'
					/>
				</Flex>
			</Box>
			{mode === 'days' && <DaysSchedule />}
			{mode === 'week' && (
				<WeeksSchedule weekType={weekType} groupIds={selectType} />
			)}
		</>
	)
}

export default TeacherSchedule
