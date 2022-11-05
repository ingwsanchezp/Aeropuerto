/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { AerolineaDto } from './aerolinea.dto';
import { AerolineaEntity } from './aerolinea.entity';
import { AerolineaService } from './aerolinea.service';

@Controller('airlines')
@UseInterceptors(BusinessErrorsInterceptor)
export class AerolineaController {
    constructor(private readonly aerolineaService: AerolineaService){}

    @Get()
    async findAll(){
        return await this.aerolineaService.findAll();
    }

    @Get(':airlineId')
    async findOne(@Param('airlineId') aerolineaId: string){
        return await this.aerolineaService.findOne(aerolineaId);
    }

    @Post()
    async create(@Body() aerolineaDto: AerolineaDto){
        aerolineaDto.fechaFundacion = new Date(aerolineaDto.fechaFundacion)
        const aerolinea: AerolineaEntity = plainToInstance(AerolineaEntity, aerolineaDto)
        return await this.aerolineaService.create(aerolinea);
    }

    @Put(':airlineId')
    async update(@Param('airlineId') aerolieaId: string, @Body() aerolineaDto: AerolineaDto){
        aerolineaDto.fechaFundacion = new Date(aerolineaDto.fechaFundacion)
        const aerolinea: AerolineaEntity = plainToInstance(AerolineaEntity, aerolineaDto)
        return await this.aerolineaService.update(aerolieaId, aerolinea);
    }

    @Delete(':airlineId')
    @HttpCode(204)
    async delete(@Param('regionId') regionId: string){
        return await this.aerolineaService.delete(regionId);
    }
}
