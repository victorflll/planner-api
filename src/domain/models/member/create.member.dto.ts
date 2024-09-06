import {ApiProperty} from "@nestjs/swagger";
import {IsEmail, IsNotEmpty} from "class-validator";

export class CreateMemberDto {
    @IsNotEmpty()
    @IsEmail()
    @ApiProperty({ example: 'joao@email.com' })
    email: string;
}