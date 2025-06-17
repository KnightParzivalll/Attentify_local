import { useTranslation } from 'react-i18next'
import SelectField from './SelectField'
import { SelectFieldProps } from './SelectField.types'

export interface SelectGroupsProps extends SelectFieldProps<string> {}

/**
 * SelectGroups is a specialized version of SelectField preconfigured for groups.
 * It is clearable, supports multiple selection, and displays "All groups" as the placeholder.
 */
const SelectGroups: React.FC<SelectGroupsProps> = props => {
	const { t } = useTranslation() // No need to specify namespace

	return (
		<SelectField
			clearable
			multiple
			placeholder={t('selectGroups.placeholder')}
			{...props}
		/>
	)
}

export default SelectGroups
