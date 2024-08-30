import {ApiProperty} from "@nestjs/swagger";
import {IsEmail} from "class-validator";

export class CreateMemberDto {
    @IsEmail({}, { message: 'Invalid email format' })
    @ApiProperty({ example: 'joao@email.com' })
    email: string;
}