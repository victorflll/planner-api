import { ApiProperty } from "@nestjs/swagger";

export class CreateAttachmentDto {
    @ApiProperty({ example: 'Airbnb Booking' })
    title: string;
    @ApiProperty({ example: 'https://www.airbnb.com/rooms/12345' })
    link: string;
}
