export interface IAttendanceRecord {
	student_id: number
	first_name: string
	last_name: string
	group_name: string | null
	attended: boolean
}
