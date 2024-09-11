import {ApiProperty} from "@nestjs/swagger";

export class MemberDto {
    @ApiProperty({example: ''})
    id: string;
    @ApiProperty({example: ''})
    tripId: string;
    @ApiProperty({ example: 'joao@email.com' })
    email: string;
    @ApiProperty({ example: 'João da Silva' })
    name: string | null;
    @ApiProperty({ example: false })
    status: boolean;
    @ApiProperty({ example: false })
    owner: boolean;
}