import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { IAttachmentRepository } from "../../domain/ports/attachment/interface.attachment.repository";
import { CreateAttachmentDto } from "../../domain/models/attachment/create.attachment.dto";
import { UpdateAttachmentDto } from "../../domain/models/attachment/update.attachment.dto";
import { Attachment } from "@prisma/client";

@Injectable()
export class AttachmentRepository implements IAttachmentRepository {
    constructor(private readonly prismaService: PrismaService) {}

    async create(data: CreateAttachmentDto[], tripId: string): Promise<void> {
        await this.prismaService.attachment.createMany({
            data: data.map(attachment => ({
                title: attachment.title,
                link: attachment.link,
                tripId: tripId,  
            }))
        });
    }

    async get(tripId: string): Promise<Attachment[]> {
        return this.prismaService.attachment.findMany({
            where: { tripId: tripId },
        });
    }

    async getById(id: string, tripId: string): Promise<Attachment | null> {
        return this.prismaService.attachment.findUnique({
            where: { id: id, tripId: tripId },
        });
    }

    async update(id: string, tripId: string, data: UpdateAttachmentDto): Promise<Attachment> {
        return this.prismaService.attachment.update({
            where: { id: id, tripId: tripId },
            data: data,
        });
    }

    async delete(id: string, tripId: string): Promise<void> {
        await this.prismaService.attachment.delete({
            where: { id: id, tripId: tripId },
        });
    }
}
