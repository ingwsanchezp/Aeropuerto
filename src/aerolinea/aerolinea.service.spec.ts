/* eslint-disable prettier/prettier */
import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { TypeOrmTestingConfig } from "../shared/testing-utils/typeorm-testing-config";
import { Repository } from "typeorm";
import { AerolineaEntity } from "./aerolinea.entity";
import { AerolineaService } from "./aerolinea.service";
import { AeropuertoEntity } from "../aeropuerto/aeropuerto.entity";
import { faker } from '@faker-js/faker';

describe('aerolinea', () => {
    let service: AerolineaService;
    let repository: Repository<AerolineaEntity>;
    let aerolineaList: AerolineaEntity[];
    let aeropuertosList: AeropuertoEntity[];
    

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [...TypeOrmTestingConfig()],
            providers: [AerolineaService],
        }).compile();
        service = module.get<AerolineaService>(AerolineaService);
        repository = module.get<Repository<AerolineaEntity>>(getRepositoryToken(AerolineaEntity));
        await seeDatabase();
    });

    const seeDatabase = async () =>{
        repository.clear();
        aerolineaList = [];
        const yearOld = new Date();
        yearOld.setFullYear(yearOld.getFullYear() - 1);
        for(let i=0; i < 5; i++){
            const aerolinea: AerolineaEntity = await repository.save({
                nombre: faker.company.name(),
                descripcion: faker.commerce.productDescription(),
                fechaFundacion: yearOld,
                paginaWeb: faker.internet.url(),
            })
            aerolineaList.push(aerolinea);
        }
    }

    it('debe ser definido', () =>{
        expect(service).toBeDefined();
    });

    it('findAll debe retornar todo el listado de aerolineas', async () =>{
        const aerolinea: AerolineaEntity[] = await service.findAll();
        expect(aerolinea).not.toBeNull();
        expect(aerolinea).toHaveLength(aerolineaList.length);
    });

    it('findOne debe retornar una aerolinea por id', async () =>{
        const persistAerolinea: AerolineaEntity = aerolineaList[0];
        const aerolinea: AerolineaEntity = await service.findOne(persistAerolinea.id);
        expect(aerolinea).not.toBeNull();
        expect(aerolinea.nombre).toEqual(persistAerolinea.nombre);
        expect(aerolinea.descripcion).toEqual(persistAerolinea.descripcion);
    });

    it('findOne lanzar excepcion para una aerolinea no existente',async () => {
       await expect(() => service.findOne("0")).rejects.toHaveProperty("message", "La Aerolinea con id no ha sido encontrada") 
    });

    it('Create lanzar excepcion para una fecha igual a la actual', async () =>{
        const persistAerolinea: AerolineaEntity =aerolineaList[0];
        persistAerolinea.fechaFundacion = new Date();
        await expect(() => service.create(persistAerolinea)).rejects.toHaveProperty("message", "La fecha de fundacion debe ser menor a la fecha actual")
    });

    it('Create crear una aerolinea ', async () => {
        aeropuertosList = [];
        const aeropuerto = new AeropuertoEntity()
        aeropuerto.nombre = faker.commerce.productName();
        aeropuerto.ciudad = faker.address.cityName();
        aeropuerto.codigo = "A001";
        aeropuerto.pais = faker.address.country();
        aeropuerto.aerolineas= [];
        const yearOld = new Date();
        yearOld.setFullYear(yearOld.getFullYear() - 1);
        aeropuertosList.push(aeropuerto);
        const aerolineaSave: AerolineaEntity = {
            id: "",
            nombre: faker.company.name(),
            descripcion: faker.commerce.productDescription(),
            fechaFundacion: yearOld,
            paginaWeb: faker.internet.url(),
            aeropuertos: aeropuertosList
        }
        
        const newAerolinea: AerolineaEntity = await service.create(aerolineaSave);
        expect(newAerolinea).not.toBeNull();
        const aerolinea: AerolineaEntity = await service.findOne(newAerolinea.id);
        expect(aerolinea.nombre).toEqual(newAerolinea.nombre);
        expect(aerolinea.descripcion).toEqual(newAerolinea.descripcion);
    });

    it('Update Actualizar una aerolinea', async () => {
        const aerolinea: AerolineaEntity = aerolineaList[0];
        aerolinea.nombre = "Nuevo nombre";
        aerolinea.descripcion = "Nueva descripcion";
        const updateAerolinea: AerolineaEntity = await service.update(aerolinea.id, aerolinea);
        expect(updateAerolinea).not.toBeNull();
        const storedAerolinea: AerolineaEntity = await repository.findOne({where: {id: aerolinea.id } });
        expect(storedAerolinea).not.toBeNull();
        expect(storedAerolinea.nombre).toEqual(aerolinea.nombre);
        expect(storedAerolinea.descripcion).toEqual(aerolinea.descripcion);
    });

    it('Update Actualizar invalida dada un aerolinea no existente', async () => {
        let aerolinea: AerolineaEntity = aerolineaList[0];
        aerolinea = {
            ... aerolinea, nombre: "New nombre", descripcion:"New descripcion"
        }
        await expect(() => service.update("0", aerolinea)).rejects.toHaveProperty("message", "La aerolinea con el id no ha sido encontrada");
    });
   
    it('delete Eliminar aerolinea', async () => {
        const aerolinea: AerolineaEntity = aerolineaList[0];
        await service.delete(aerolinea.id);
        const deleteAerolinea: AerolineaEntity = await repository.findOne({where: {id: aerolinea.id } })
        expect(deleteAerolinea).toBeNull();
    });

    it('delete Eliminar aerolinea no existente', async () => {
        const aerolinea: AerolineaEntity = aerolineaList[0];
        await service.delete(aerolinea.id);
        await expect(() => service.delete("0")).rejects.toHaveProperty("message", "La aerolinea con el id no ha sido encontrada");
    });
    
});