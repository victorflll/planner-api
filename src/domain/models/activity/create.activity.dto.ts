import { ApiProperty } from "@nestjs/swagger";
import {IsNotEmpty, IsString} from "class-validator";

export class CreateActivityDto {
    @IsNotEmpty()
    @IsString()
    @ApiProperty({ example: 'Visita ao Museu' })
    title: string;
    @IsNotEmpty()
    @IsString()
    @ApiProperty({ example: '2024-08-25T13:00:00.000Z' })
    date: string;
}
