import React from 'react'
import { useTranslation } from 'react-i18next'
import SegmentedSelector from './SegmentedSelector'
import { SegmentedSelectorProps } from './SegmentedSelector.types'

export type WorkMode = 'days' | 'week'

export interface WorkModeSelectorProps
	extends Omit<SegmentedSelectorProps<WorkMode>, 'items'> {}

// const workModeItems: { label: string; value: WorkMode }[] = [
// 	{ label: 'Days', value: 'days' },
// 	{ label: 'Whole Week', value: 'week' }
// ]

const WorkModeSelector: React.FC<WorkModeSelectorProps> = props => {
	const { t } = useTranslation() // No need to specify namespace

	const workModeItems: { label: string; value: WorkMode }[] = [
		{ label: t('workModeSelector.days'), value: 'days' },
		{ label: t('workModeSelector.week'), value: 'week' }
	]

	return <SegmentedSelector {...props} items={workModeItems} />
}
export default WorkModeSelector
