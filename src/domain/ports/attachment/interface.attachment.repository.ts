import { Attachment } from "@prisma/client";
import { CreateAttachmentDto } from "src/domain/models/attachment/create.attachment.dto";
import { UpdateAttachmentDto } from "src/domain/models/attachment/update.attachment.dto";

export abstract class IAttachmentRepository {
    
    abstract create(data: CreateAttachmentDto, tripId: string): Promise<Attachment>;

    abstract get(tripId: string): Promise<Attachment[]>;

    abstract getById(id: string, tripId: string): Promise<Attachment | null>;

    abstract update(id: string, tripId: string, data: UpdateAttachmentDto): Promise<Attachment>;
    
    abstract delete(id: string, tripId: string): Promise<void>;
}
