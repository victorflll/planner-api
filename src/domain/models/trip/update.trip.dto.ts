import {ApiProperty} from "@nestjs/swagger";
import {IsNotEmpty, IsString} from "class-validator";

export class UpdateTripDto {
    @IsNotEmpty()
    @IsString()
    @ApiProperty({ example: 'Caruaru' })
    city: string;
    @IsNotEmpty()
    @IsString()
    @ApiProperty({ example: 'BR' })
    country: string;
    @IsNotEmpty()
    @IsString()
    @ApiProperty({ example: '2024-08-15 00:00:00.000Z' })
    startDate: string;
    @IsNotEmpty()
    @IsString()
    @ApiProperty({ example: '2024-08-25 00:00:00.000Z' })
    endDate: string;
}