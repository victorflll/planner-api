import {PrismaService} from "../prisma.service";
import {CreateTripDto} from "../../domain/models/create.trip.dto";
import {Trip} from "@prisma/client";
import {UpdateTripDto} from "../../domain/models/update.trip.dto";
import {ITripRepository} from "../../domain/ports/interface.trip.repository";
import {Injectable} from "@nestjs/common";
import {LocationModel, mapToCity} from "../../domain/models/locationModel";
import {firstValueFrom} from "rxjs";
import {HttpService} from "@nestjs/axios";

@Injectable()
export class TripRepository implements ITripRepository {
    constructor(private readonly prismaService: PrismaService, private readonly httpService: HttpService) {
    }

    async getCities(): Promise<LocationModel[]> {
        const url = 'https://servicodados.ibge.gov.br/api/v1/localidades/municipios?view=nivelado&orderBy=nome';

        const response = await firstValueFrom(this.httpService.get(url));

        return mapToCity(response.data);
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