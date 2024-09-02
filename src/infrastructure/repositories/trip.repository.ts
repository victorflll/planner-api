import { PrismaService } from "../prisma.service";
import { CreateTripDto } from "../../domain/models/trip/create.trip.dto";
import { Trip } from "@prisma/client";
import { UpdateTripDto } from "../../domain/models/trip/update.trip.dto";
import { ITripRepository } from "../../domain/ports/trip/interface.trip.repository";
import {
    BadRequestException,
    NotFoundException,
    ServiceUnavailableException,
    InternalServerErrorException,
    ConflictException,
    Injectable
} from "@nestjs/common";
import { LocationModel, mapToCity } from "../../domain/models/trip/location.model";
import { firstValueFrom } from "rxjs";
import { HttpService } from "@nestjs/axios";

@Injectable()
export class TripRepository implements ITripRepository {
    private primaryKeyViolationCode: string = "P2002";

    constructor(private readonly prismaService: PrismaService, private readonly httpService: HttpService) {
    }

    private validateDate(date: string): Date {
        if (typeof date !== 'string' || !date.trim()) {
            throw new BadRequestException('Date must be a non-empty string.');
        }

        const formattedDate = date.includes(' ') ? date.replace(' ', 'T') : date;
        const parsedDate = new Date(formattedDate);

        if (isNaN(parsedDate.getTime()) || 
            !/^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z)$/.test(formattedDate)) {
            throw new BadRequestException('Date must be a valid ISO 8601 string.');
        }
    
        return parsedDate;
    }
        
    private validateDateRange(startDate: Date, endDate: Date): void {
        if (startDate >= endDate) {
            throw new BadRequestException('End date must be greater than start date.');
        }
    }

    async getCities(startsWith: string): Promise<LocationModel[]> {
        const url = 'https://servicodados.ibge.gov.br/api/v1/localidades/municipios?view=nivelado&orderBy=nome';

        try {
            const response = await firstValueFrom(this.httpService.get(url));

            if (response.status !== 200) {
                throw new ServiceUnavailableException("Cities unavailable because the 'servicodados.ibge.gov.br' cannot be found.");
            }

            const locations = mapToCity(response.data);
            const result = locations.filter(item => item.city.toLowerCase().startsWith(startsWith.toLowerCase()));

            return result;
        } catch (error) {
            throw new InternalServerErrorException('Failed to fetch cities.');
        }
    }

    async create(data: CreateTripDto): Promise<string> {
        const startDate = this.validateDate(data.startDate);
        const endDate = this.validateDate(data.endDate);

        this.validateDateRange(startDate, endDate);

        try {
            const trip = await this.prismaService.trip.create({
                data: {
                    city: data.city,
                    country: data.country,
                    startDate: startDate,
                    endDate: endDate,
                },
                select: {
                    id: true
                }
            });

            return trip.id;
        } catch (error) {
            if (error.code === this.primaryKeyViolationCode) {
                throw new ConflictException('A trip with the same details already exists.');
            } else {
                throw new InternalServerErrorException();
            }
        }
    }

    async get(): Promise<Trip[]> {
        try {
            return await this.prismaService.trip.findMany();
        } catch (error) {
            throw new InternalServerErrorException('Failed to fetch trips.');
        }
    }

    async getById(id: string): Promise<Trip> {
        try {
            const result = await this.prismaService.trip.findUnique({
                where: {
                    id: id,
                },
                include: {
                    members: true,
                    attachments: true,
                }
            });

            if (!result) {
                throw new NotFoundException('Trip not found.');
            }

            return result;
        } catch (error) {
            throw new InternalServerErrorException('Failed to fetch trip.');
        }
    }

    async update(id: string, data: UpdateTripDto): Promise<void> {
        try {
            const trip = await this.getById(id);

            const startDate = this.validateDate(data.startDate);
            const endDate = this.validateDate(data.endDate);

            this.validateDateRange(startDate, endDate);

            await this.prismaService.trip.update({
                where: {
                    id: trip.id,
                },
                data: {
                    city: data.city,
                    country: data.country,
                    startDate: startDate,
                    endDate: endDate,
                },
            });
        } catch (error) {
            if (error.code === this.primaryKeyViolationCode) {
                throw new ConflictException('A trip with the same details already exists.');
            } else {
                throw new InternalServerErrorException('An unexpected error occurred.');
            }
        }
    }

    async delete(id: string): Promise<void> {
        try {
            const trip = await this.getById(id);

            await this.prismaService.trip.delete({
                where: {
                    id: trip.id,
                }
            });
        } catch (error) {
            if (error.code === this.primaryKeyViolationCode) {
                throw new ConflictException('Trip could not be deleted because it does not exist.');
            } else {
                throw new InternalServerErrorException('An unexpected error occurred.');
            }
        }
    }
}