import OtherStaffMaster from '#models/other_staff';
import StaffMaster from '#models/StaffMaster';
import Teacher from '#models/Teacher';
import { CreateValidatorForStaffRole, UpdateValidatorForStaffRole } from '#validators/StaffMaster';
import type { HttpContext } from '@adonisjs/core/http'
// import db from '@adonisjs/lucid/services/db';

export default class StaffMasterController {

    async indexStaffMasterForSchool(ctx: HttpContext) {
        // let school_id = ctx.auth.user?.school_id;
        if (ctx.params.school_id) {
            let staffs = await StaffMaster.query().where('school_id', ctx.params.school_id);
            return ctx.response.json(staffs);
        } else {
            return ctx.response.status(404).json({ message: 'Please provide valid Class ID.' });
        }
    }

    async createStaffMasterRole(ctx: HttpContext) {

        let school_id = ctx.auth.user?.school_id
        if (ctx.auth.user?.role_id !== 1) {
            return ctx.response.status(403).json({ message: 'You are not allocated to manage this functions.' });
        }
        const payload = await CreateValidatorForStaffRole.validate(ctx.request.body());
        const created_class = await StaffMaster.create({ ...payload, school_id: school_id, permissions: {} });
        return ctx.response.json(created_class.serialize());
    }

    async updateStaffMasterRole(ctx: HttpContext) {
        // let school_id = ctx.auth.user?.school_id
        if (ctx.auth.user?.role_id !== 1) {
            return ctx.response.status(403).json({ message: 'You are not allocated to manage this functions.' });
        }
        const payload = await UpdateValidatorForStaffRole.validate(ctx.request.body());
        const updated_class = await StaffMaster.findOrFail(ctx.params.id);
        updated_class.merge(payload);
        await updated_class.save();
        return ctx.response.json(updated_class.serialize());
    }

    async deleteStaffMasterRole(ctx: HttpContext) {

        const school_id = ctx.auth.user?.school_id
        if (ctx.auth.user?.role_id !== 1) {
            return ctx.response.status(403).json({ message: 'You are not allocated to manage this functions.' });
        }
        const staff_to_delete = await StaffMaster.findOrFail(ctx.params.id);
        if (staff_to_delete && school_id) {

            /**
             *  check if does any staff is been allocated with this role , if yes then don't delete it.
            */
            let total_associated_teacher = 0;
            if (staff_to_delete.is_teaching_role) {
                total_associated_teacher = await Teacher
                    .query()
                    .where('school_id', school_id)
                    .andWhere('staff_role_id', staff_to_delete.id).first() ? 1 : 0;
            } else {
                total_associated_teacher = await OtherStaffMaster
                    .query()
                    .where('school_id', school_id)
                    .andWhere('staff_role_id', staff_to_delete.id).first() ? 1 : 0;
            }

            if (total_associated_teacher > 0) {
                return ctx.response.status(403).json({ message: 'This role is associated with some staff members ! You can not delete this role.' });
            }
            await staff_to_delete.delete();
            return ctx.response.status(201).json({ message: 'Role has been succesfully deleted.' });
        } else {
            return ctx.response.status(404).json({ message: 'Role not found.' });
        }
    }
}