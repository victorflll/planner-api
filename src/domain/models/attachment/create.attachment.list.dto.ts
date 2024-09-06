import {ValidateNested} from "class-validator";
import {Type} from "class-transformer";
import {ApiProperty} from "@nestjs/swagger";
import {CreateAttachmentDto} from "./create.attachment.dto";

export class CreateAttachmentListDto {
    @ValidateNested({ each: true })
    @Type(() => CreateAttachmentDto)
    @ApiProperty({ type: [CreateAttachmentDto] })
    data: CreateAttachmentDto[]
}