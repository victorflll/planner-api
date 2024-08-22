import {PrismaService} from "../prisma.service";
import {CreateTripDto} from "../../domain/models/create.trip.dto";
import {Trip} from "@prisma/client";
import {UpdateTripDto} from "../../domain/models/update.trip.dto";
import {ITripRepository} from "../../domain/ports/interface.trip.repository";
import {Injectable} from "@nestjs/common";

@Injectable()
export class TripRepository implements ITripRepository {
    constructor(private readonly prismaService: PrismaService) {
    }

    async create(data: CreateTripDto) {
        await this.prismaService.trip.create({
            data: {
                city: data.city,
                country: data.country,
                startDate: data.startDate,
                endDate: data.endDate,
            },
        });
    }

    async get(): Promise<Trip[]> {
        return this.prismaService.trip.findMany();
    }

    async getById(id: string): Promise<Trip | null> {
        const trip = await this.prismaService.trip.findUnique({
            where: {
                id: id,
            },
        });

        if (!trip) {
            return null;
        }

        return trip;
    }

    async update(id: string, data: UpdateTripDto) {
        await this.prismaService.trip.update({
            where: {
                id: id,
            },
            data: {
                city: data.city,
                country: data.country,
                startDate: data.startDate,
                endDate: data.endDate,
            },
        });
    }

    async delete(id: string) {
        const trip = await this.getById(id);

        await this.prismaService.trip.delete({
            where: {
                id: trip.id,
            },
        });
    }
}