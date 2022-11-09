/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, HttpCode, HttpException, HttpStatus, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { AerolineaDto } from './aerolinea.dto';
import { AerolineaEntity } from './aerolinea.entity';
import { AerolineaService } from './aerolinea.service';
import { AeropuertoEntity } from '../aeropuerto/aeropuerto.entity';

@Controller('airlines')
@UseInterceptors(BusinessErrorsInterceptor)
export class AerolineaController {
    constructor(private readonly aerolineaService: AerolineaService){}

    @Get()
    async findAll(){
        return this.aerolineaService.findAll();
    }

    @Get(':airlineId')
    async findOne(@Param('airlineId') aerolineaId: string){
        return this.aerolineaService.findOne(aerolineaId);
    }

    @Post()
    async create(@Body() aerolineaDto: AerolineaDto){
        const aeroPuerto = new AeropuertoEntity();
        if(aeroPuerto.nombre === 'Aeropuerto Internacional de El Dorado'){ throw new HttpException("lo encontro", HttpStatus.NOT_FOUND); }
        aerolineaDto.fechaFundacion = new Date(aerolineaDto.fechaFundacion)
        const aerolinea: AerolineaEntity = plainToInstance(AerolineaEntity, aerolineaDto)
        return this.aerolineaService.create(aerolinea);
    }

    @Put(':airlineId')
    async update(@Param('airlineId') aerolieaId: string, @Body() aerolineaDto: AerolineaDto){
        aerolineaDto.fechaFundacion = new Date(aerolineaDto.fechaFundacion)
        const aerolinea: AerolineaEntity = plainToInstance(AerolineaEntity, aerolineaDto)
        return this.aerolineaService.update(aerolieaId, aerolinea);
    }

    @Delete(':airlineId')
    @HttpCode(204)
    async delete(@Param('regionId') regionId: string){
        return this.aerolineaService.delete(regionId);
    }
}
