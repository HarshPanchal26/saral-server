import Classes from '#models/Classes'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    // Write your database queries inside the run method

    await Classes.createMany([
      {
        id: 1,
        class: 1,
        division: 'A',
        school_id: 1,
      },
      {
        id: 2,
        class: 2,
        division: 'A',
        school_id: 1,
      },
      {
        id: 3,
        class: 3,
        division: 'A',
        school_id: 1,
      },
      {
        id: 4,
        class: 4,
        division: 'A',
        school_id: 1,
      },
    ])
  }
}