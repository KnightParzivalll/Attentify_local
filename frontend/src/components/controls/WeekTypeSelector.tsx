import React from 'react'
import { useTranslation } from 'react-i18next'
import SegmentedSelector from './SegmentedSelector'
import { SegmentedSelectorProps } from './SegmentedSelector.types'

export type WeekType = 'upper' | 'bottom'

export interface WeekTypeSelectorProps
	extends Omit<SegmentedSelectorProps<WeekType>, 'items'> {}

// const weekTypeItems: { label: string; value: WeekType }[] = [
// 	{ label: 'Upper', value: 'upper' },
// 	{ label: 'Bottom', value: 'bottom' }
// ]

const WeekTypeSelector: React.FC<WeekTypeSelectorProps> = props => {
	const { t } = useTranslation() // No namespace needed since we use full path keys

	const weekTypeItems: { label: string; value: WeekType }[] = [
		{ label: t('weekTypeSelector.upper'), value: 'upper' },
		{ label: t('weekTypeSelector.bottom'), value: 'bottom' }
	]
	return <SegmentedSelector {...props} items={weekTypeItems} />
}

export default WeekTypeSelector
