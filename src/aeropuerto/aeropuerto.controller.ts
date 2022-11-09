/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, HttpCode, HttpException, HttpStatus, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { BusinessErrorsInterceptor } from 'src/shared/interceptors/business-errors.interceptor';
import { AeropuertoDto } from './aeropuerto.dto';
import { AeropuertoEntity } from './aeropuerto.entity';
import { AeropuertoService } from './aeropuerto.service';

@Controller('airports')
@UseInterceptors(BusinessErrorsInterceptor)
export class AeropuertoController {
    constructor(private readonly aeroPuertoService: AeropuertoService){}

    @Get()
    async findAll(){
        return await this.aeroPuertoService.findAll();
    }

    @Get(':airportId')
    async findOne(@Param('airportId') aeropuertoId: string){
        return await this.aeroPuertoService.findOne(aeropuertoId);
    }

    @Post()
    async create(@Body() aeropuertoDto: AeropuertoDto){
        if(isNaN(parseInt(aeropuertoDto.codigo))){
            throw new HttpException("Codigo requerido", HttpStatus.NOT_FOUND);
        }
        const aeropuerto: AeropuertoEntity = plainToInstance(AeropuertoEntity, aeropuertoDto);
        return this.aeroPuertoService.create(aeropuerto);
    }

    @Put(':airportId')
    async update(@Param('airportId') aeropuertoId: string, @Body() aeropuertoDto: AeropuertoDto){
        const aeropuerto: AeropuertoEntity = plainToInstance(AeropuertoEntity, aeropuertoDto);
        return await this.aeroPuertoService.update(aeropuertoId, aeropuerto);
    }

    @Delete(':airportId')
    @HttpCode(204)
    async delete(@Param('airportId') aeropuertoId: string){
        return await this.aeroPuertoService.delete(aeropuertoId);
    }

    @Get(':airportId/airlines')
    async findAirlines(){
        return await this.aeroPuertoService.findAll;
    }

    @Get(':airportId/airlines/:airlineId')
    async findAirline(@Param('airportId') airportId: string){
        return await this.aeroPuertoService.findOne(airportId);
    }
}
