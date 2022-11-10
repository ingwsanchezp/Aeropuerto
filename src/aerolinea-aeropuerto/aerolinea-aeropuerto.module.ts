/* eslint-disable prettier/prettier */
import { AerolineaAeropuertoController } from './aerolinea-aeropuerto.controller';
import { AerolineaAeropuertoService } from './aerolinea-aeropuerto.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AerolineaEntity } from '../aerolinea/aerolinea.entity';
import { AeropuertoEntity } from '../aeropuerto/aeropuerto.entity';

@Module({
    imports: [TypeOrmModule.forFeature([AerolineaEntity, AeropuertoEntity])],
    controllers: [
        AerolineaAeropuertoController,],
    providers: [
        AerolineaAeropuertoService,],
})
export class AerolineaAeropuertoModule { }
