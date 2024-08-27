import { Injectable } from "@nestjs/common";
import { IAttachmentService } from "../../domain/ports/attachment/interface.attachment.service";
import { IAttachmentRepository } from "../../domain/ports/attachment/interface.attachment.repository";
import { CreateAttachmentDto } from "../../domain/models/attachment/create.attachment.dto";
import { UpdateAttachmentDto } from "../../domain/models/attachment/update.attachment.dto";
import { Attachment } from "@prisma/client";

@Injectable()
export class AttachmentService implements IAttachmentService {
    constructor(private readonly attachmentRepository: IAttachmentRepository) {}

    async create(data: CreateAttachmentDto, tripId: string): Promise<void> {
        await this.attachmentRepository.create(data, tripId);
    }

    async get(tripId: string): Promise<Attachment[]> {
        return this.attachmentRepository.get(tripId); 
    }

    async getById(id: string, tripId: string): Promise<Attachment | null> {
        return this.attachmentRepository.getById(id, tripId); 
    }

    async update(id: string, tripId: string, data: UpdateAttachmentDto): Promise<void> {
        await this.attachmentRepository.update(id, tripId, data);
    }

    async delete(id: string, tripId: string): Promise<void> {
        await this.attachmentRepository.delete(id, tripId);
    }
}
