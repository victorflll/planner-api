import {ValidateNested} from "class-validator";
import {Type} from "class-transformer";
import {ApiProperty} from "@nestjs/swagger";
import {CreateMemberDto} from "./create.member.dto";

export class CreateMemberListDto {
    @ValidateNested({ each: true })
    @Type(() => CreateMemberDto)
    @ApiProperty({ type: [CreateMemberDto] })
    data: CreateMemberDto[]
}