import {ValidateNested} from "class-validator";
import {Type} from "class-transformer";
import {ApiProperty} from "@nestjs/swagger";
import {CreateActivityDto} from "./create.activity.dto";

export class CreateActivityListDto {
    @ValidateNested({ each: true })
    @Type(() => CreateActivityDto)
    @ApiProperty({ type: [CreateActivityDto] })
    data: CreateActivityDto[]
}