import { ApiProperty } from "@nestjs/swagger";

export class CreateActivityDto {
    @ApiProperty({ example: 'Visita ao Museu' })
    title: string;
    @ApiProperty({ example: '2024-08-25T13:00:00.000Z' })
    date: string;
}
