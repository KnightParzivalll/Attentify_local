import React, { useState } from 'react'

import DashboardSchedule from 'components/dashboard/DashboardSchedule'
import { SingleDatepicker } from 'components/datePicker/single'
import { format } from 'date-fns'

const Dashboard: React.FC = () => {
	const [date, setDate] = useState(new Date())

	const formattedDate = format(date, 'yyyy-MM-dd')

	console.log('Dashboard rendered with date:', date)
	console.log('Formatted date:', formattedDate)

	return (
		<>
			<SingleDatepicker
				name='date-input'
				date={date}
				onDateChange={setDate}
				usePortal
			/>
			<DashboardSchedule selectedDate={formattedDate} />
		</>
	)
}

export default Dashboard
