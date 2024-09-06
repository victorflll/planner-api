import { ApiProperty } from "@nestjs/swagger";
import {IsNotEmpty, IsString, IsUrl} from "class-validator";

export class CreateAttachmentDto {
    @IsNotEmpty()
    @IsString()
    @ApiProperty({ example: 'Airbnb Booking' })
    title: string;
    @IsNotEmpty()
    @IsUrl()
    @ApiProperty({ example: 'https://www.airbnb.com/rooms/12345' })
    link: string;
}
