/* eslint-disable prettier/prettier */
import { faker } from "@faker-js/faker";
import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { AerolineaEntity } from "../aerolinea/aerolinea.entity";
import { AeropuertoEntity } from "../aeropuerto/aeropuerto.entity";
import { TypeOrmTestingConfig } from "../shared/testing-utils/typeorm-testing-config";
import { Repository } from "typeorm";
import { AerolineaAeropuertoService } from "./aerolinea-aeropuerto.service"

describe('aerolinea-aeropuerto', () => {
    let service: AerolineaAeropuertoService;
    let repositoryAerolinea: Repository<AerolineaEntity>;
    let repositoryAeroPuerto: Repository<AeropuertoEntity>;
    let aerolineaList: AerolineaEntity[];
    let aeropuertoList: AeropuertoEntity[];

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [...TypeOrmTestingConfig()],
            providers: [AerolineaAeropuertoService]
        }).compile();
        service = module.get<AerolineaAeropuertoService>(AerolineaAeropuertoService);
        repositoryAeroPuerto = module.get<Repository<AeropuertoEntity>>(getRepositoryToken(AeropuertoEntity));
        repositoryAerolinea = module.get<Repository<AerolineaEntity>>(getRepositoryToken(AerolineaEntity));
        await seeDataBase();
    });

    const seeDataBase = async () =>{
        repositoryAerolinea.clear();
        repositoryAeroPuerto.clear();
        const yearOld = new Date();
        yearOld.setFullYear(yearOld.getFullYear() - 1);
        aeropuertoList = [];
        aerolineaList = [];
        for(let i=0; i < 5; i++){
            const aeropuerto: AeropuertoEntity = await repositoryAeroPuerto.save({
                nombre: faker.commerce.productName(),
                ciudad: faker.address.cityName(),
                codigo: "A0"+i,
                pais: faker.address.country(),
            })
            aeropuertoList.push(aeropuerto);
            const aerolinea: AerolineaEntity = await repositoryAerolinea.save({
                nombre: faker.company.name(),
                descripcion: faker.commerce.productDescription(),
                fechaFundacion: yearOld,
                paginaWeb: faker.internet.url(),
                aeropuertos: aeropuertoList,
            })
            aerolineaList.push(aerolinea);
        }
    }

    it('debe ser definido', () =>{
        expect(service).toBeDefined();
    });

    it('findAeropuertosDesdeAerolinea debe retornar listados de aeropuertos para una aerolinea dada', async () =>{
        const persistAerolinea: AerolineaEntity = aerolineaList[0];
        const aerolinea: AerolineaEntity = await service.findAeropuertosDesdeAerolinea(persistAerolinea.id);
        expect(aerolinea).not.toBeNull();
        expect(aerolinea.nombre).toEqual(persistAerolinea.nombre)
        expect(aerolinea.aeropuertos.find((aeropuerto) =>{
            return aeropuerto.id == persistAerolinea.aeropuertos[0].id
        }))
    });

    it('findAeropuertosDesdeAerolinea aerolinea no encontrada', async () =>{
        await expect(() => service.findAeropuertosDesdeAerolinea("0")).rejects.toHaveProperty("message", "La Aerolinea con id no ha sido encontrada")
    });

    it('findAeropuertoDesdeAerolinea debe retornar un aeropuerto que cubre una aerolinea', async () =>{
        const aerolinea: AerolineaEntity = await service.findAeropuertoDesdeAerolinea(aerolineaList[0].aeropuertos[0].id, aerolineaList[0].id);
        expect(aerolinea).not.toBeNull();
        expect(aerolinea.nombre).toEqual(aerolineaList[0].nombre)
        expect(aerolinea.aeropuertos.filter((aeropuerto) =>{
            return aeropuerto.id == aerolineaList[0].aeropuertos[0].id
        }))
    });

    it('findAeropuertoDesdeAerolinea aerolinea no encontrada', async () =>{
        await expect(() => service.findAeropuertoDesdeAerolinea(aerolineaList[0].id, "0")).rejects.toHaveProperty("message", "La Aerolinea con id no ha sido encontrada");
    });

    it('addAeropuertoParaAerolinea agregar un aeropuerto a una aerolienea', async () =>{
        const aerolinea: AerolineaEntity = await service.addAeropuertoParaAerolinea(aerolineaList[0].id, aeropuertoList[0]);
        expect(aerolinea).not.toBeNull();
        expect(aerolinea.nombre).toEqual(aerolineaList[0].nombre);
        expect(aerolinea.descripcion).toEqual(aerolineaList[0].descripcion);
    });

    it('addAeropuertoParaAerolinea aerolinea no encontrada', async () =>{
        await expect(() => service.addAeropuertoParaAerolinea("0", aeropuertoList[0])).rejects.toHaveProperty("message", "La Aerolinea con id no ha sido encontrada")
    });

    it('updateAeropuertoDesdeAerolinea actualiza el aeropuerto entre id viejo id nuevo',async () => {
        const updateAerolinea: AerolineaEntity = await service.updateAeropuertoDesdeAerolinea(aerolineaList[0].id, aerolineaList[0].aeropuertos[0].id, aerolineaList[0].aeropuertos[1].id);
        expect(updateAerolinea).not.toBeNull();
        expect(updateAerolinea.aeropuertos.filter((aeropuerto) =>{ return aeropuerto.id == aerolineaList[0].aeropuertos[0].id})).toHaveLength(0);
        expect(updateAerolinea.aeropuertos.filter((aeropuerto) =>{ return aeropuerto.id == aerolineaList[0].aeropuertos[1].id})).not.toBeNull();
        
    });
    
    it('updateAeropuertoDesdeAerolinea aerolinea y aeropuerto no encontrado', async () =>{
        await expect(() => service.updateAeropuertoDesdeAerolinea("0", aerolineaList[0].aeropuertos[0].id, aerolineaList[0].aeropuertos[1].id)).rejects.toHaveProperty("message", "La aerolinea con el id no ha sido encontrada")
    });

    it('deleteAeropuertoDesdeAerolinea eliminar aeropuerto desde aerolinea id aeropuerto', async () =>{
        const aerolinea: AerolineaEntity = await service.deleteAeropuertoDesdeAerolinea(aerolineaList[0].id, aerolineaList[0].aeropuertos[0].id);
        expect(aerolinea).not.toBeNull();
        expect(aerolinea.aeropuertos.find((aeropuerto) =>{ return aeropuerto.id == aerolineaList[0].aeropuertos[0].id })).toBeUndefined();
    });
})