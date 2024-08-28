import {ApiProperty} from "@nestjs/swagger";

export class ActivityDto {
    @ApiProperty({example: ''})
    id: string;
    @ApiProperty({example: ''})
    tripId: string
    @ApiProperty({example: 'Museu'})
    title: string
    @ApiProperty({example: '2024-08-23 00:00:00.000Z'})
    date: string
    @ApiProperty({example: true})
    status: boolean
}