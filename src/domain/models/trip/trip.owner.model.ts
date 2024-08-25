import {ApiProperty} from "@nestjs/swagger";

export class TripOwner {
    @ApiProperty({example: 'Maria de Souza'})
    name: string;
    @ApiProperty({example: 'maria@email.com'})
    email: string;
}