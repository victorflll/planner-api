import { PrismaService } from "../prisma.service";
import { CreateActivityDto } from "../../domain/models/activity/create.activity.dto";
import { Activities } from "@prisma/client";
import { UpdateActivityDto } from "../../domain/models/activity/update.activity.dto";
import { IActivityRepository } from "../../domain/ports/activity/interface.activity.repository";
import { Injectable } from "@nestjs/common";
import {ActivityGroupDto} from "../../domain/models/activity/activity.group.dto";
import {ActivityDto} from "../../domain/models/activity/activity.dto";

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

    async get(tripId: string): Promise<ActivityGroupDto[]> {
        const query = await this.prismaService.activities.findMany({
            where: { tripId: tripId },
            orderBy: {
                date: 'asc', 
            },
        });

        const formatDate = (date: string) => {
            return date.split('T')[0];
        };

        const groupedActivities = query.reduce((groups, activity) => {
            const dateDay = formatDate(activity.date.toISOString());
            if (!groups[dateDay]) {
                groups[dateDay] = [];
            }
            groups[dateDay].push({
                id: activity.id,
                tripId: activity.tripId,
                title: activity.title,
                date: activity.date.toISOString(),
                status: activity.status,
            });
            return groups;
        }, {} as Record<string, ActivityDto[]>);

        const result: ActivityGroupDto[] = Object.keys(groupedActivities).map(dateDay => ({
            dateDay,
            activities: groupedActivities[dateDay].map(activity => ({
                id: activity.id,
                tripId: activity.tripId,
                title: activity.title,
                date: activity.date,
                status: activity.status
            })),
        }));

        return result;
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
