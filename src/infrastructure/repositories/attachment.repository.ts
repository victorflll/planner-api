import {BadRequestException, ConflictException, Injectable, InternalServerErrorException, NotFoundException} from "@nestjs/common";
import {PrismaService} from "../prisma.service";
import {IAttachmentRepository} from "../../domain/ports/attachment/interface.attachment.repository";
import {CreateAttachmentDto} from "../../domain/models/attachment/create.attachment.dto";
import {UpdateAttachmentDto} from "../../domain/models/attachment/update.attachment.dto";
import {Attachment} from "@prisma/client";
import {ITripRepository} from "../../domain/ports/trip/interface.trip.repository";

@Injectable()
export class AttachmentRepository implements IAttachmentRepository {
    private primaryKeyViolationCode: string = "P2002";

    constructor(private readonly prismaService: PrismaService, private readonly tripRepository: ITripRepository) {
    }

    async create(data: CreateAttachmentDto[], tripId: string): Promise<void> {
        if (!tripId || typeof tripId !== 'string') {
            throw new BadRequestException('Invalid trip ID.');
        }

        const trip = await this.tripRepository.getById(tripId);
        if (!trip) {
            throw new NotFoundException('Trip not found.');
        }

        data.forEach(attachment => {
            if (!attachment.title || typeof attachment.title !== 'string' || attachment.title.trim() === '') {
                throw new BadRequestException('Title must be a non-empty string.');
            }

            if (!attachment.link || typeof attachment.link !== 'string' || attachment.link.trim() === '') {
                throw new BadRequestException('Link must be a non-empty string.');
            }

            try {
                new URL(attachment.link);
            } catch {
                throw new BadRequestException('Link must be a valid URL.');
            }
        });

        try {
            await this.prismaService.attachment.createMany({
                data: data.map(attachment => ({
                    title: attachment.title,
                    link: attachment.link,
                    tripId: tripId,
                }))
            });
        } catch (error) {
            if (error.code === this.primaryKeyViolationCode) {
                throw new ConflictException("An attachment with the same link and trip already exists.");
            } else {
                throw new InternalServerErrorException();
            }
        }
    }

    async get(tripId: string): Promise<Attachment[]> {
        if (!tripId || typeof tripId !== 'string') {
            throw new BadRequestException('Invalid trip ID.');
        }

        const trip = await this.tripRepository.getById(tripId);
        if (!trip) {
            throw new NotFoundException('Trip not found.');
        }

        return this.prismaService.attachment.findMany({
            where: {
                tripId: trip.id
            },
        });
    }

    async getById(id: string, tripId: string): Promise<Attachment> {
        if (!id || typeof id !== 'string' || !tripId || typeof tripId !== 'string') {
            throw new BadRequestException('Invalid ID or trip ID.');
        }

        const trip = await this.tripRepository.getById(tripId);
        if (!trip) {
            throw new NotFoundException('Trip not found.');
        }

        const result = await this.prismaService.attachment.findUnique({
            where: {
                id: id,
                tripId: trip.id
            },
        });

        if (!result) {
            throw new NotFoundException('Attachment cannot be found because there is no attachment with the id.');
        }

        return result;
    }

    async update(id: string, tripId: string, data: UpdateAttachmentDto): Promise<Attachment> {
        if (!id || typeof id !== 'string' || !tripId || typeof tripId !== 'string') {
            throw new BadRequestException('Invalid ID or trip ID.');
        }

        const trip = await this.tripRepository.getById(tripId);
        if (!trip) {
            throw new NotFoundException('Trip not found.');
        }

        const attachment = await this.getById(id, tripId);

        if (!data.title || typeof data.title !== 'string' || data.title.trim() === '') {
            throw new BadRequestException('Title must be a non-empty string.');
        }

        if (!data.link || typeof data.link !== 'string' || data.link.trim() === '') {
            throw new BadRequestException('Link must be a non-empty string.');
        }

        try {
            new URL(data.link);
        } catch {
            throw new BadRequestException('Link must be a valid URL.');
        }

        try {
            const result = await this.prismaService.attachment.update({
                where: {
                    id: attachment.id,
                    tripId: trip.id
                },
                data: data,
            });

            return result;
        } catch (error) {
            if (error.code === this.primaryKeyViolationCode) {
                throw new ConflictException('An attachment with the same link and trip already exists.');
            } else {
                throw new InternalServerErrorException();
            }
        }
    }

    async delete(id: string, tripId: string): Promise<void> {
        if (!id || typeof id !== 'string' || !tripId || typeof tripId !== 'string') {
            throw new BadRequestException('Invalid ID or trip ID.');
        }

        const trip = await this.tripRepository.getById(tripId);
        if (!trip) {
            throw new NotFoundException('Trip not found.');
        }

        const attachment = await this.getById(id, tripId);

        await this.prismaService.attachment.delete({
            where: {
                id: attachment.id,
                tripId: trip.id
            },
        });
    }
}
