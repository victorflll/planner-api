import {ApiProperty} from "@nestjs/swagger";

export class UpdateMemberDto {
    @ApiProperty({ example: 'João da Silva' })
    name: string;
}