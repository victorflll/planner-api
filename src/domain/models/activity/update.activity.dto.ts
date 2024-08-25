import {ApiProperty} from "@nestjs/swagger";

export class UpdateActivityDto {
    @ApiProperty({ example: 'Visita ao Museu' })
    title: string;
    @ApiProperty({ example: '2024-08-15 00:00:00.000Z'})
    date: string;
}
