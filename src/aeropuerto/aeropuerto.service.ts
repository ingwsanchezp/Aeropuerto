/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BusinessErrors, BusinessLogicException } from '../shared/errors/business-errors';
import { Repository } from 'typeorm';
import { AeropuertoEntity } from './aeropuerto.entity';

@Injectable()
export class AeropuertoService {
  constructor(
    @InjectRepository(AeropuertoEntity)
    private readonly aeropuertoRepositorio: Repository<AeropuertoEntity>,
  ) {}

  async findAll(): Promise<AeropuertoEntity[]>{
    return await this.aeropuertoRepositorio.find({relations: {aerolineas: true,},});
  }

  async findOne(id: string): Promise<AeropuertoEntity>{
    const aeropuerto: AeropuertoEntity = await this.aeropuertoRepositorio.findOne({where: {id}, relations: {aerolineas: true,},});
    if(!aeropuerto)
        throw new BusinessLogicException('El aeropuerto con id no ha sido encontrado',BusinessErrors.NOT_FOUND);
    return aeropuerto;
  }

  async create(aeropuerto: AeropuertoEntity): Promise<AeropuertoEntity>{
    if (aeropuerto.codigo.length > 3){
        throw new BusinessLogicException('El codigo del aeropuerto es mayor a 3 digitos',BusinessErrors.PRECONDITION_FAILED);
    }
    return await this.aeropuertoRepositorio.save(aeropuerto);
  }

  async update(id: string, aeropuerto: AeropuertoEntity){
    const persistAeroPuerto: AeropuertoEntity = await this.aeropuertoRepositorio.findOne({where: {id}});
    if (!persistAeroPuerto)
        throw new BusinessLogicException('El aeropuerto con id no ha sido encontrado', BusinessErrors.NOT_FOUND);
    if (aeropuerto.codigo.length > 3){
        throw new BusinessLogicException('El codigo del aeropuerto es mayor a 3 digitos',BusinessErrors.PRECONDITION_FAILED);
    }
    return await this.aeropuertoRepositorio.save({...persistAeroPuerto, ...aeropuerto});
  }

  async delete(id:string){
    const persistAeroPuerto: AeropuertoEntity = await this.aeropuertoRepositorio.findOne({where: {id}});
    if (!persistAeroPuerto)
        throw new BusinessLogicException('El aeropuerto con id no ha sido encontrado', BusinessErrors.NOT_FOUND);
    await this.aeropuertoRepositorio.remove(persistAeroPuerto);
  }
}
