import { Attachment } from "@prisma/client";
import { CreateAttachmentDto } from "src/domain/models/attachment/create.attachment.dto";
import { UpdateAttachmentDto } from "src/domain/models/attachment/update.attachment.dto";

export abstract class IAttachmentService {
    
    abstract create(data: CreateAttachmentDto[], tripId: string): void;

    abstract get(tripId: string): Promise<Attachment[]>;

    abstract getById(id: string, tripId: string): Promise<Attachment>;

    abstract update(id: string, tripId: string, data: UpdateAttachmentDto): Promise<void>;
    
    abstract delete(id: string, tripId: string): void;
}
