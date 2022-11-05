/* eslint-disable prettier/prettier */
import { AerolineaController } from './aerolinea.controller';
import { AerolineaService } from './aerolinea.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AerolineaEntity } from './aerolinea.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AerolineaEntity])],
  controllers: [
    AerolineaController,],
  providers: [AerolineaService],
})
export class AerolineaModule { }
