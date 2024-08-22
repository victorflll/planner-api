import {PrismaService} from "../prisma.service";
import {CreateTripDto} from "../../domain/models/trip/create.trip.dto";
import {Trip} from "@prisma/client";
import {UpdateTripDto} from "../../domain/models/trip/update.trip.dto";
import {ITripRepository} from "../../domain/ports/trip/interface.trip.repository";
import {Injectable} from "@nestjs/common";
import {LocationModel, mapToCity} from "../../domain/models/trip/location.model";
import {firstValueFrom} from "rxjs";
import {HttpService} from "@nestjs/axios";
import {TripOwner} from "../../domain/models/trip/trip.owner.model";

@Injectable()
export class TripRepository implements ITripRepository {
    constructor(private readonly prismaService: PrismaService, private readonly httpService: HttpService) {
    }

    async getCities(): Promise<LocationModel[]> {
        const url = 'https://servicodados.ibge.gov.br/api/v1/localidades/municipios?view=nivelado&orderBy=nome';

        const response = await firstValueFrom(this.httpService.get(url));

        return mapToCity(response.data);
    }

    async create(data: CreateTripDto): Promise<TripOwner> {
        const trip = await this.prismaService.trip.create({
            data: {
                city: data.city,
                country: data.country,
                startDate: data.startDate,
                endDate: data.endDate,
            },
            select: {
                id: true
            }
        });

        const result = new TripOwner(trip.id);
        result.ownerName = data.ownerName;

        return result;
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