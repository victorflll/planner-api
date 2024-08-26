import { Injectable } from '@nestjs/common';
import { IActivityService } from '../ports/activity/interface.activity.service';
import { IActivityRepository } from '../ports/activity/interface.activity.repository';
import { CreateActivityDto } from '../models/activity/create.activity.dto';
import { UpdateActivityDto } from '../models/activity/update.activity.dto';
import { Activities } from '@prisma/client';

@Injectable()
export class ActivityService implements IActivityService {
    constructor(private readonly activityRepository: IActivityRepository) {}

    async create(data: CreateActivityDto[], tripId: string): Promise<void> {
        await this.activityRepository.create(data, tripId);
    }

    async get(tripId: string): Promise<Activities[]> {
        return this.activityRepository.get(tripId); 
    }

    async getById(id: string, tripId: string): Promise<Activities | null> {
        return this.activityRepository.getById(id, tripId); 
    }

    async update(id: string, tripId: string, dto: UpdateActivityDto): Promise<void> {
        await this.activityRepository.update(id, tripId, dto);
    }

    async confirm(id: string, tripId: string): Promise<void> {
        await this.activityRepository.confirm(id, tripId);
    }

    async delete(id: string, tripId: string): Promise<void> {
        await this.activityRepository.delete(id, tripId);
    }
}
