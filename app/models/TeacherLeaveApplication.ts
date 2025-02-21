//import { DateTime } from 'luxon'
//import { column } from '@ioc:Adonis/Lucid/Orm'
import Base from '#models/base'
import { column } from '@adonisjs/lucid/orm'

export default class TeacherLeaveApplication extends Base {

    @column()
    declare teacher_id: number

    @column()
    declare leave_type_id: number

    @column()
    declare applied_by: number

    @column()
    declare applied_by_self: number

    @column({
        serialize: (value: Date) => Base.serializeDateAsSQLDateString(value),
      })
    declare from_date: Date

    @column({
        serialize: (value: Date) => Base.serializeDateAsSQLDateString(value),
      })
    declare to_date: Date

    @column()
    declare number_of_days: number

    @column()
    declare reason: string

    @column()
    declare is_half_day: boolean

    @column()
    declare half_day_type: 'first_half' | 'second_half'

    @column()
    declare is_hourly_leave: boolean

    @column()
    declare total_hour: number

    @column()
    declare documents: JSON

    @column()
    declare status: 'pending' | 'approved' | 'rejected' | 'cancelled'

}