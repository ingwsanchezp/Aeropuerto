/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AerolineaEntity } from '../aerolinea/aerolinea.entity';
import { AeropuertoEntity } from '../aeropuerto/aeropuerto.entity';
import { BusinessErrors, BusinessLogicException } from '../shared/errors/business-errors';
import { Repository } from 'typeorm';

@Injectable()
export class AerolineaAeropuertoService {
    constructor(
        @InjectRepository(AerolineaEntity)
        private readonly aerolineaRepositorio: Repository<AerolineaEntity>,
        @InjectRepository(AeropuertoEntity)
        private readonly aeropuertoRepositorio: Repository<AeropuertoEntity>
    ){}

    async findAeropuertosDesdeAerolinea(aerolineaId: string): Promise<AerolineaEntity>{
        const aerolinea: AerolineaEntity = await this.aerolineaRepositorio.findOne({where: {id: aerolineaId}, relations: { aeropuertos: true },})
        if (!aerolinea)
            throw new BusinessLogicException('La Aerolinea con id no ha sido encontrada', BusinessErrors.NOT_FOUND)
        if (!aerolinea.aeropuertos){
            throw new BusinessLogicException('No se encontraron aeropuertos para esta aerolinea id', BusinessErrors.NOT_FOUND)
        }
        return aerolinea
    }

    async findAeropuertoDesdeAerolinea(aeropuertoId: string, aerolineaId: string): Promise<AerolineaEntity>{
        const aerolinea: AerolineaEntity = await this.aerolineaRepositorio.findOne({where: {id: aerolineaId}, relations: { aeropuertos: true },})
        if (!aerolinea)
            throw new BusinessLogicException('La Aerolinea con id no ha sido encontrada', BusinessErrors.NOT_FOUND)
        if (!aerolinea.aeropuertos){
            throw new BusinessLogicException('No se encontraron aeropuertos para esta aerolinea id', BusinessErrors.NOT_FOUND)
        }
        aerolinea.aeropuertos = aerolinea.aeropuertos.filter((aeropuerto) =>{ return aeropuerto.id == aeropuertoId })
        return aerolinea;
    }

    async addAeropuertoParaAerolinea(aerolineaId: string, aeropuerto: AeropuertoEntity): Promise<AerolineaEntity>{
        const aerolineaList: AerolineaEntity[] = [];
        const aerolinea: AerolineaEntity = await this.aerolineaRepositorio.findOne({where: {id: aerolineaId}});
        if (!aerolinea)
            throw new BusinessLogicException('La Aerolinea con id no ha sido encontrada', BusinessErrors.NOT_FOUND)
        aerolineaList.push(aerolinea);
        aeropuerto.aerolineas= aerolineaList
        const persistAeroPuerto = await this.aeropuertoRepositorio.save(aeropuerto);
        if (!persistAeroPuerto)
            throw new BusinessLogicException('El aeropuerto no se ha podido añadir a la aerolinea', BusinessErrors.PRECONDITION_FAILED);
        const aeropuertoParaLinea: AerolineaEntity = await this.aerolineaRepositorio.findOne({where: {id: aerolineaId}});
        return aeropuertoParaLinea

    }

    async updateAeropuertoDesdeAerolinea(aerolineaId: string, aeropuertosAntiguoId: string, aerpuertoNuevoId: string): Promise<AerolineaEntity>{
        const persistAerolinea: AerolineaEntity = await this.aerolineaRepositorio.findOne({ where: { id:  aerolineaId} , relations: { aeropuertos: true },});
        if (!persistAerolinea)
            throw new BusinessLogicException('La aerolinea con el id no ha sido encontrada', BusinessErrors.NOT_FOUND);
        if (!persistAerolinea.aeropuertos)
            throw new BusinessLogicException('No se encontraron aeropuertos para esta aerolinea id', BusinessErrors.NOT_FOUND);
        persistAerolinea.aeropuertos.forEach((aeropuerto, index) =>{ if(aeropuerto.id == aeropuertosAntiguoId) delete persistAerolinea.aeropuertos[index]})
        const persistAeroPuerto: AeropuertoEntity = await this.aeropuertoRepositorio.findOne({where: {id: aerpuertoNuevoId}});
        if (!persistAeroPuerto)
            throw new BusinessLogicException('No se encontraron aeropuerto para esta aerolinea id', BusinessErrors.NOT_FOUND);
        persistAerolinea.aeropuertos.push(persistAeroPuerto);
        return await this.aerolineaRepositorio.save(persistAerolinea);
    }

    async deleteAeropuertoDesdeAerolinea(aerolineaId: string, aeropuertoId: string) {
        const persistAerolinea: AerolineaEntity = await this.aerolineaRepositorio.findOne({where: {id: aerolineaId}, relations: { aeropuertos: true },});
        persistAerolinea.aeropuertos = persistAerolinea.aeropuertos.filter((aeropuerto) =>{
            return aeropuerto.id !== aeropuertoId
        })
        return await this.aerolineaRepositorio.save(persistAerolinea);
    }
}
