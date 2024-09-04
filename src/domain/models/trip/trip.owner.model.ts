import {ApiProperty} from "@nestjs/swagger";
import {IsEmail, IsNotEmpty, IsString} from "class-validator";

export class TripOwner {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({example: 'Maria de Souza'})
    name: string;
    @IsEmail()
    @IsNotEmpty()
    @ApiProperty({example: 'maria@email.com'})
    email: string;
}