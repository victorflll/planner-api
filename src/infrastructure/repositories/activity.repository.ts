import { PrismaService } from "../prisma.service";
import { CreateActivityDto } from "../../domain/models/activity/create.activity.dto";
import { Activities } from "@prisma/client";
import { UpdateActivityDto } from "../../domain/models/activity/update.activity.dto";
import { IActivityRepository } from "../../domain/ports/activity/interface.activity.repository";
import {
    BadRequestException,
    ConflictException,
    Injectable,
    InternalServerErrorException,
    NotFoundException
} from "@nestjs/common";
import { ActivityGroupDto } from "../../domain/models/activity/activity.group.dto";
import { ActivityDto } from "../../domain/models/activity/activity.dto";
import { ITripRepository } from "../../domain/ports/trip/interface.trip.repository";

@Injectable()
export class ActivityRepository implements IActivityRepository {
    private primaryKeyViolationCode: string = "P2002";

    constructor(private readonly prismaService: PrismaService, private readonly tripRepository: ITripRepository) {
    }

    async create(data: CreateActivityDto[], tripId: string): Promise<void> {
        if (!tripId || typeof tripId !== 'string') {
            throw new BadRequestException('Invalid trip ID.');
        }

        const trip = await this.tripRepository.getById(tripId);
        if (!trip) {
            throw new NotFoundException('Trip not found.');
        }

        data.forEach((activity) => {
            if (!activity.title || typeof activity.title !== 'string' || activity.title.trim() === '') {
                throw new BadRequestException('Title must be a non-empty string.');
            }

            if (!activity.date || typeof activity.date !== 'string') {
                throw new BadRequestException('Date must be a string.');
            }

            const activityDate = new Date(activity.date);
            if (isNaN(activityDate.getTime())) {
                throw new BadRequestException('Date must be a valid ISO string.');
            }

            if (activityDate < trip.startDate || activityDate > trip.endDate) {
                throw new BadRequestException(`Activity date ${activity.date} is outside the trip dates.`);
            }
        });

        try {
            await this.prismaService.activities.createMany({
                data: data.map((activity) => ({
                    title: activity.title,
                    date: new Date(activity.date),
                    tripId: tripId,
                    status: false,
                })),
            });
        } catch (error) {
            if (error.code === this.primaryKeyViolationCode) {
                throw new ConflictException("An activity with the same title, date and trip already exists.");
            } else {
                throw new InternalServerErrorException();
            }
        }
    }

    async get(tripId: string): Promise<ActivityGroupDto[]> {
        if (!tripId || typeof tripId !== 'string') {
            throw new BadRequestException('Invalid trip ID.');
        }

        const trip = await this.tripRepository.getById(tripId);
        if (!trip) {
            throw new NotFoundException('Trip not found.');
        }

        const query = await this.prismaService.activities.findMany({
            where: {
                tripId: trip.id
            },
            orderBy: {
                date: 'asc'
            }
        });

        const formatDate = (date: string) => {
            if (!date) {
                throw new InternalServerErrorException('Date is invalid.');
            }
            return date.split('T')[0];
        };

        const groupedActivities = query.reduce((groups, activity) => {
            if (!activity.date) {
                throw new InternalServerErrorException('Activity date is missing.');
            }
            const dateDay = formatDate(activity.date.toISOString());
            if (!groups[dateDay]) {
                groups[dateDay] = [];
            }
            groups[dateDay].push({
                id: activity.id,
                tripId: activity.tripId,
                title: activity.title,
                date: activity.date.toISOString(),
                status: activity.status
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
            }))
        }));

        return result;
    }

    async getById(id: string, tripId: string): Promise<Activities> {
        if (!id || typeof id !== 'string' || !tripId || typeof tripId !== 'string') {
            throw new BadRequestException('Invalid ID or trip ID.');
        }

        const result = await this.prismaService.activities.findUnique({
            where: {
                id: id,
                tripId: tripId
            }
        });

        if (!result) {
            throw new NotFoundException('Activity not found in this trip.');
        }

        return result;
    }

    async update(id: string, tripId: string, data: UpdateActivityDto): Promise<void> {
        if (!id || typeof id !== 'string' || !tripId || typeof tripId !== 'string') {
            throw new BadRequestException('Invalid ID or trip ID.');
        }

        const trip = await this.tripRepository.getById(tripId);
        if (!trip) {
            throw new NotFoundException('Trip not found.');
        }

        if (!data.title || typeof data.title !== 'string') {
            throw new BadRequestException('Title must be a non-empty string.');
        }

        if (!data.date || typeof data.date !== 'string') {
            throw new BadRequestException('Date must be a string.');
        }

        const activityDate = new Date(data.date);
        if (isNaN(activityDate.getTime())) {
            throw new BadRequestException('Invalid date format.');
        }

        if (activityDate < trip.startDate || activityDate > trip.endDate) {
            throw new BadRequestException(`Activity date ${data.date} is outside the trip dates.`);
        }

        const activity = await this.getById(id, tripId);

        try {
            await this.prismaService.activities.update({
                where: {
                    id: activity.id,
                    tripId: tripId
                },
                data: {
                    title: data.title,
                    date: activityDate
                }
            });
        } catch (error) {
            if (error.code === this.primaryKeyViolationCode) {
                throw new ConflictException('An activity with the same title, date and trip already exists.');
            } else {
                throw new InternalServerErrorException('An unknown error occurred. Please contact the responsible team for more information.');
            }
        }
    }

    async confirm(id: string, tripId: string): Promise<void> {
        if (!id || typeof id !== 'string' || !tripId || typeof tripId !== 'string') {
            throw new BadRequestException('Invalid ID or trip ID.');
        }

        const trip = await this.tripRepository.getById(tripId);
        if (!trip) {
            throw new NotFoundException('Trip not found.');
        }

        const activity = await this.getById(id, tripId);

        await this.prismaService.activities.update({
            where: {
                id: activity.id,
                tripId: trip.id
            },
            data: {
                status: true
            }
        });
    }

    async delete(id: string, tripId: string): Promise<void> {
        if (!id || typeof id !== 'string' || !tripId || typeof tripId !== 'string') {
            throw new BadRequestException('Invalid ID or trip ID.');
        }

        const trip = await this.tripRepository.getById(tripId);
        if (!trip) {
            throw new NotFoundException('Trip not found.');
        }

        const activity = await this.getById(id, tripId);

        await this.prismaService.activities.delete({
            where: {
                id: activity.id,
                tripId: trip.id
            }
        });
    }
}
