import {ApiProperty} from "@nestjs/swagger";

export class UpdateTripDto {
    @ApiProperty({ example: 'Caruaru' })
    city: string;
    @ApiProperty({ example: 'BR' })
    country: string;
    @ApiProperty({ example: '2024-08-15 00:00:00.000Z' })
    startDate: string;
    @ApiProperty({ example: '2024-08-25 00:00:00.000Z' })
    endDate: string;
}