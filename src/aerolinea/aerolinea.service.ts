/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  BusinessErrors,
  BusinessLogicException,
} from '../shared/errors/business-errors';
import { Repository } from 'typeorm';
import { AerolineaEntity } from './aerolinea.entity';
import { AeropuertoEntity } from '../aeropuerto/aeropuerto.entity';

@Injectable()
export class AerolineaService {
  constructor(
    @InjectRepository(AerolineaEntity)
    private readonly aerolineaRepositorio: Repository<AerolineaEntity>,
  ) {}

  async findAll(): Promise<AerolineaEntity[]> {
    return await this.aerolineaRepositorio.find({
      relations: { aeropuertos: true },
    });
  }

  async findOne(id: string): Promise<AerolineaEntity> {
    const aerolinea: AerolineaEntity = await this.aerolineaRepositorio.findOne({
      where: { id },
      relations: { aeropuertos: true },
    });
    if (!aerolinea)
      throw new BusinessLogicException('La Aerolinea con id no ha sido encontrada', BusinessErrors.NOT_FOUND);
    return aerolinea;
  }

  async create(aerolinea: AerolineaEntity): Promise<AerolineaEntity> {
    const fechaActual = new Date();
    if (aerolinea.fechaFundacion.getFullYear() > fechaActual.getFullYear() || aerolinea.fechaFundacion.getFullYear() === fechaActual.getFullYear()){
      throw new BusinessLogicException('La fecha de fundacion debe ser menor a la fecha actual', BusinessErrors.PRECONDITION_FAILED);    
    }
    return await this.aerolineaRepositorio.save(aerolinea);
  }

  async update(id: string, aerolinea: AerolineaEntity): Promise<AerolineaEntity> {
    const fechaActual = new Date();
    const persistAerolinea: AerolineaEntity = await this.aerolineaRepositorio.findOne({ where: { id } });
    if (!persistAerolinea)
      throw new BusinessLogicException('La aerolinea con el id no ha sido encontrada', BusinessErrors.NOT_FOUND);
    if (aerolinea.fechaFundacion.getFullYear() > fechaActual.getFullYear() || aerolinea.fechaFundacion.getFullYear() === fechaActual.getFullYear()){
      throw new BusinessLogicException('La fecha de fundacion debe ser menor a la fecha actual', BusinessErrors.PRECONDITION_FAILED);
    }
    return await this.aerolineaRepositorio.save({...persistAerolinea, ...aerolinea});
  }

  async delete(id: string){
    const persistAerolinea: AerolineaEntity = await this.aerolineaRepositorio.findOne({ where: { id } });
    if (!persistAerolinea)
      throw new BusinessLogicException('La aerolinea con el id no ha sido encontrada', BusinessErrors.NOT_FOUND);
    await this.aerolineaRepositorio.remove(persistAerolinea);
  }

  async addAeropuerto(idAerolinea: string, idAeropuerto: string): Promise<AerolineaEntity> {
    const persistAerolinea: AerolineaEntity = await this.aerolineaRepositorio.findOne({ where: { id: idAerolinea } });
    if (!persistAerolinea)
      throw new BusinessLogicException('La aerolinea con el id no ha sido encontrada', BusinessErrors.NOT_FOUND);
    const persistAeropuerto: AeropuertoEntity = await this.aerolineaRepositorio.manager.getRepository(AeropuertoEntity).findOne({ where: { id: idAeropuerto } });
    if (!persistAeropuerto)
      throw new BusinessLogicException('El aeropuerto con el id no ha sido encontrado', BusinessErrors.NOT_FOUND);
    persistAerolinea.aeropuertos.push(persistAeropuerto);
    return await this.aerolineaRepositorio.save(persistAerolinea);
  }
 
 async removeAeropuerto(idAerolinea: string, idAeropuerto: string): Promise<AerolineaEntity> {
  const persistAerolinea: AerolineaEntity = await this.aerolineaRepositorio.findOne({ where: { id: idAerolinea } });
  if (!persistAerolinea)
    throw new BusinessLogicException('La aerolinea con el id no ha sido encontrada', BusinessErrors.NOT_FOUND);
  const persistAeropuerto: AeropuertoEntity = await this.aerolineaRepositorio.manager.getRepository(AeropuertoEntity).findOne({ where: { id: idAeropuerto } });
  if (!persistAeropuerto)
    throw new BusinessLogicException('El aeropuerto con el id no ha sido encontrado', BusinessErrors.NOT_FOUND);
  persistAerolinea.aeropuertos = persistAerolinea.aeropuertos.filter(aeropuerto => aeropuerto.id !== idAeropuerto);
  return await this.aerolineaRepositorio.save(persistAerolinea);
 }

 async updateAeropuerto(idAerolinea: string, idAeropuerto: string, aeropuerto: AeropuertoEntity): Promise<AerolineaEntity> {
  const persistAerolinea: AerolineaEntity = await this.aerolineaRepositorio.findOne({ where: { id: idAerolinea } });
  if (!persistAerolinea)
    throw new BusinessLogicException('La aerolinea con el id no ha sido encontrada', BusinessErrors.NOT_FOUND);
  const persistAeropuerto: AeropuertoEntity = await this.aerolineaRepositorio.manager.getRepository(AeropuertoEntity).findOne({ where: { id: idAeropuerto } });
  if (!persistAeropuerto)
    throw new BusinessLogicException('El aeropuerto con el id no ha sido encontrado', BusinessErrors.NOT_FOUND);
  persistAerolinea.aeropuertos = persistAerolinea.aeropuertos.filter(aeropuerto => aeropuerto.id !== idAeropuerto);
  persistAerolinea.aeropuertos.push(aeropuerto);
  return await this.aerolineaRepositorio.save(persistAerolinea);
 }
}

