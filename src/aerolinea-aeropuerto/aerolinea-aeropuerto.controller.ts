/* eslint-disable prettier/prettier */

import { Body, Controller, Delete, Get, HttpCode, HttpException, HttpStatus, Param, Post, Put } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { AerolineaEntity } from 'src/aerolinea/aerolinea.entity';
import { AeropuertoDto } from 'src/aeropuerto/aeropuerto.dto';
import { AeropuertoEntity } from 'src/aeropuerto/aeropuerto.entity';
import { BusinessLogicException, BusinessErrors } from 'src/shared/errors/business-errors';
import { AerolineaAeropuertoService } from './aerolinea-aeropuerto.service';

@Controller('airlines')
export class AerolineaAeropuertoController { 
    constructor(private readonly aerolineaAeropuerto: AerolineaAeropuertoService){}

    @Get(':airlineId/airports')
    async findAeropuertosDesdeAerolinea(@Param('airlineId') aerolineaId: string){
        return await this.aerolineaAeropuerto.findAeropuertosDesdeAerolinea(aerolineaId);
    }

    @Get(':airlineId/airports/:airportId')
    async findAeropuertoDesdeAerolinea(@Param('airportId') aeropuertoId: string, @Param('airlineId') aerolineaId: string){
        try {
            const aerolinea: AerolineaEntity = await this.aerolineaAeropuerto.findAeropuertoDesdeAerolinea(aeropuertoId, aerolineaId);
            if(aerolinea.aeropuertos.length == 0){
                throw new BusinessLogicException('No se encontraron aeropuertos para esta aerolinea id', BusinessErrors.NOT_FOUND);  
            }
            return aerolinea
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.NOT_FOUND);
        }
    }

    @Post(':airlineId/airports')
    async addAeropuertoParaAerolinea(@Param('airlineId') aerolineaId: string, @Body() aeropuertoDto: AeropuertoDto){
        const aeropuerto: AeropuertoEntity = plainToInstance(AeropuertoEntity, aeropuertoDto)
        try {
            const aerolinea: AerolineaEntity = await this.aerolineaAeropuerto.addAeropuertoParaAerolinea(aerolineaId, aeropuerto); 
            return await this.aerolineaAeropuerto.findAeropuertosDesdeAerolinea(aerolinea.id);
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.NOT_FOUND);
        }
    }

    @Put(':airlineId/airport/old/:airportOldId/new/:airportNewId')
    async updateAeropuertoDesdeAerolinea(@Param('airlineId') aerolineaId: string, @Param('airportOldId') aeropuertosAntiguoId: string, @Param('airportNewId') aerpuertoNuevoId: string){
        try {
            return await this.aerolineaAeropuerto.updateAeropuertoDesdeAerolinea(aerolineaId, aeropuertosAntiguoId, aerpuertoNuevoId);    
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.NOT_FOUND);
        }
        
    }

    @Delete(':airlineId/airports/:airportId')
    @HttpCode(204)
    async deleteAeropuertoDesdeAerolinea(@Param('airlineId') aerolineaId: string, @Param('airportId') aeropuertoId: string){
        try {
            return await this.aerolineaAeropuerto.deleteAeropuertoDesdeAerolinea(aerolineaId, aeropuertoId);    
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.NOT_FOUND);
        }
        
    }
}
