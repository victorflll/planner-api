import {ApiProperty} from "@nestjs/swagger";
import {IsNotEmpty, IsString} from "class-validator";

export class UpdateMemberDto {
    @IsNotEmpty()
    @IsString()
    @ApiProperty({ example: 'João da Silva' })
    name: string;
}