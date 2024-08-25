import {Body, Controller, Delete, Get, Param, Patch, Post, Put, Query} from '@nestjs/common';
import {ApiBody, ApiParam, ApiTags} from "@nestjs/swagger";
import {IMemberService} from "../../domain/ports/member/interface.member.service";
import {CreateMemberDto} from "../../domain/models/member/create.member.dto";
import {UpdateMemberDto} from "../../domain/models/member/update.member.dto";
import {MemberQueryParams} from "../../domain/utils/member.query.params";
import {TripOwner} from "../../domain/models/trip/trip.owner.model";

@ApiTags('Member')
@Controller('members')
export class MemberController {
    constructor(private readonly memberService: IMemberService) {
    }

    @Get('/')
    async get(@Query() params: MemberQueryParams) {
        return await this.memberService.get(params.tripId);
    }

    @Post('/')
    @ApiBody({type: [CreateMemberDto]})
    create(@Body() data: CreateMemberDto[], @Query() params: MemberQueryParams) {
        this.memberService.create(data, params.tripId);
    }

    @Get('/:id')
    async getById(@Param('id') id: string, @Query() params: MemberQueryParams) {
        return await this.memberService.getById(id, params.tripId);
    }

    @Patch('confirm/:id')
    update(
        @Body() data: UpdateMemberDto,
        @Param('id') id: string,
        @Query() params: MemberQueryParams,
    ) {
        this.memberService.confirm(id, params.tripId, data);
    }

    @Delete('/:id')
    delete(@Param('id') id: string, @Query() params: MemberQueryParams) {
        return this.memberService.delete(id, params.tripId);
    }
}