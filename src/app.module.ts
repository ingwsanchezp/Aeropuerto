/* eslint-disable prettier/prettier */
import { AerolineaAeropuertoModule } from './aerolinea-aeropuerto/aerolinea-aeropuerto.module';
import { AeropuertoModule } from './aeropuerto/aeropuerto.module';
import { AerolineaModule } from './aerolinea/aerolinea.module';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AerolineaEntity } from './aerolinea/aerolinea.entity';
import { AeropuertoEntity } from './aeropuerto/aeropuerto.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: ':memory:',
      dropSchema: true,
      entities: [AerolineaEntity, AeropuertoEntity],
      synchronize: true,
      keepConnectionAlive: true
    }),
    AerolineaAeropuertoModule, 
    AeropuertoModule, 
    AerolineaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
