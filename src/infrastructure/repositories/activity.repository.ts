import { PrismaService } from "../prisma.service";
import { CreateActivityDto } from "../../domain/models/activity/create.activity.dto";
import { Activities } from "@prisma/client";
import { UpdateActivityDto } from "../../domain/models/activity/update.activity.dto";
import { IActivityRepository } from "../../domain/ports/activity/interface.activity.repository";
import { Injectable } from "@nestjs/common";

@Injectable()
export class ActivityRepository implements IActivityRepository {
    constructor(private readonly prismaService: PrismaService) {}

    async create(data: CreateActivityDto[], tripId: string): Promise<void> {
        await this.prismaService.activities.createMany({
            data: data.map(activity => ({
                title: activity.title,
                date: activity.date, 
                tripId: tripId,
                status:false
            }))
        });
    }

    async get(tripId: string): Promise<Activities[]> {
        return this.prismaService.activities.findMany({
            where: { tripId: tripId }
        });
    }

    async getById(id: string, tripId: string): Promise<Activities | null> {
        return this.prismaService.activities.findUnique({
            where: { id: id, tripId: tripId }
        });
    }

    async update(id: string, tripId: string, data: UpdateActivityDto) {
        await this.prismaService.activities.update({
            where: { id: id, tripId: tripId },
            data: {
                title: data.title,
                date: new Date(data.date),
            }
        });
    }

    async confirm(id: string, tripId: string) {
        await this.prismaService.activities.update({
            where: {
                id: id,
                tripId: tripId,
            },
            data: {
                status: true,
            },
        });
    }

    async delete(id: string, tripId: string): Promise<void> {
        await this.prismaService.activities.delete({
            where: { id: id, tripId: tripId }
        });
    }
}
