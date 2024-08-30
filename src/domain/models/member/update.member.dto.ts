import {ApiProperty} from "@nestjs/swagger";
import {IsEmail} from "class-validator";

export class UpdateMemberDto {
    @IsEmail({}, { message: 'Invalid email format' })
    @ApiProperty({ example: 'João da Silva' })
    name: string;
}