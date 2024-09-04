import {Injectable} from "@nestjs/common";
import {ConflictException} from "../exceptions/ConflictException";
import {InternalServerErrorException} from "../exceptions/InternalServerErrorException";
import {NotFoundException} from "../exceptions/NotFoundException";import {PrismaService} from "../prisma.service";
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
                throw new ConflictException("An activity with the same link and trip already exists.");
            } else {
                throw new InternalServerErrorException();
            }
        }
    }

    async get(tripId: string): Promise<Attachment[]> {
        const trip = await this.tripRepository.getById(tripId);

        return this.prismaService.attachment.findMany({
            where: {
                tripId: trip.id
            },
        });
    }

    async getById(id: string, tripId: string): Promise<Attachment> {
        const trip = await this.tripRepository.getById(tripId);

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
        const trip = await this.tripRepository.getById(tripId);

        const attachment = await this.getById(id, tripId);

        const result = await this.prismaService.attachment.update({
            where: {
                id: attachment.id,
                tripId: trip.id
            },
            data: data,
        });

        return result;
    }

    async delete(id: string, tripId: string): Promise<void> {
        const trip = await this.tripRepository.getById(tripId);

        const attachment = await this.getById(id, tripId);

        await this.prismaService.attachment.delete({
            where: {
                id: attachment.id,
                tripId: trip.id
            },
        });
    }
}
