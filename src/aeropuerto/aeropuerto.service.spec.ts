/* eslint-disable prettier/prettier */
import { faker } from "@faker-js/faker";
import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { AerolineaEntity } from "../aerolinea/aerolinea.entity";
import { TypeOrmTestingConfig } from "../shared/testing-utils/typeorm-testing-config";
import { Repository } from "typeorm";
import { AeropuertoEntity } from "./aeropuerto.entity";
import { AeropuertoService } from "./aeropuerto.service";

describe('aeropuerto', () =>{
    let service: AeropuertoService;
    let repository: Repository<AeropuertoEntity>;
    let aeropuertoList: AeropuertoEntity[];

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [...TypeOrmTestingConfig()],
            providers: [AeropuertoService],
        }).compile();
        service = module.get<AeropuertoService>(AeropuertoService);
        repository = module.get<Repository<AeropuertoEntity>>(getRepositoryToken(AeropuertoEntity));
        await seeDatabase();
    });

    const seeDatabase = async () =>{
        repository.clear();
        aeropuertoList = [];
        for(let i=0; i < 5; i++){
            const aeropuerto: AeropuertoEntity = await repository.save({
                nombre: faker.commerce.productName(),
                ciudad: faker.address.cityName(),
                codigo: "A0"+ i,
                pais: faker.address.country(),
                aerolineas: [],
            })
            aeropuertoList.push(aeropuerto);
        }
    }

    it('debe ser definido', () =>{
        expect(service).toBeDefined();
    });

    it('findAll debe retornal el listado de aeropuertos', async () =>{
        const aeropuerto: AeropuertoEntity[] = await service.findAll();
        expect(aeropuerto).not.toBeNull();
        expect(aeropuerto).toHaveLength(aeropuerto.length);
    });

    it('findOne debe retornar un aeropuerto por id', async () =>{
        const persistAeroPuerto: AeropuertoEntity = aeropuertoList[0];
        const aeropuerto: AeropuertoEntity = await service.findOne(persistAeroPuerto.id);
        expect(aeropuerto).not.toBeNull();
        expect(aeropuerto.nombre).toEqual(persistAeroPuerto.nombre);
        expect(aeropuerto.pais).toEqual(persistAeroPuerto.pais);
    });

    it('findOne lanzar excepcion para un aeropuerto no existente', async () =>{
        await expect(() => service.findOne("0")).rejects.toHaveProperty("message", "El aeropuerto con id no ha sido encontrado");
    });

    it('create lanzar excepcin para un codigo de aeropuerto con mas de 3 caracteres', async () =>{
        const persistAeropuerto: AeropuertoEntity = aeropuertoList[0];
        persistAeropuerto.codigo = "A0000";
        await expect(() => service.create(persistAeropuerto)).rejects.toHaveProperty("message", "El codigo del aeropuerto es mayor a 3 digitos")
    });

    it('Create crear una aerolinea',async () => {
        const aerolineaList = [];
        const yearOld = new Date();
        yearOld.setFullYear(yearOld.getFullYear() - 1);
        const aerolinea = new AerolineaEntity()
        aerolinea.nombre = faker.company.name(),
        aerolinea.descripcion = faker.commerce.productDescription(),
        aerolinea.fechaFundacion = yearOld,
        aerolinea.paginaWeb = faker.internet.url(),
        aerolineaList.push(aerolinea);

        const aerpuerto: AeropuertoEntity = {
            id: "",
            nombre: faker.commerce.productName(),
            ciudad: faker.address.cityName(),
            codigo: "A01",
            pais: faker.address.country(),
            aerolineas: aerolineaList,
        }

        const newAeropuerto: AeropuertoEntity = await service.create(aerpuerto);
        expect(newAeropuerto).not.toBeNull();
        const aeropuerto: AeropuertoEntity = await service.findOne(newAeropuerto.id);
        expect(aeropuerto.nombre).toEqual(newAeropuerto.nombre);
        expect(aeropuerto.pais).toEqual(newAeropuerto.pais);
    });

    it('Update Actualizar un aeropuerto', async () =>{
        const aeropuerto: AeropuertoEntity = aeropuertoList[0];
        aeropuerto.nombre = "Nuevo nombre";
        aeropuerto.pais = "Nuevo Pais";
        const updateAeropuerto: AeropuertoEntity = await service.update(aeropuerto.id, aeropuerto);
        expect(updateAeropuerto).not.toBeNull();
        expect(updateAeropuerto.nombre).toEqual(aeropuerto.nombre);
        expect(updateAeropuerto.pais).toEqual(aeropuerto.pais);
    });

    it('Update Actualizar invalida dado un aeropuerto no existente', async () => {
        let aeropuerto: AeropuertoEntity = aeropuertoList[0];
        aeropuerto = {
            ... aeropuerto, nombre: "New nombre", pais:"New Pais"
        }
        await expect(() => service.update("0", aeropuerto)).rejects.toHaveProperty("message", "El aeropuerto con id no ha sido encontrado");
    });

    it('delete Eliminar aeropuerto', async () => {
        const aeropuerto: AeropuertoEntity = aeropuertoList[0];
        await service.delete(aeropuerto.id);
        const deleteAeropuerto: AeropuertoEntity = await repository.findOne({where: {id: aeropuerto.id } });
        expect(deleteAeropuerto).toBeNull();
    });

    it('delete Eliminar aerolinea no existente', async () => {
        const aeropuerto: AeropuertoEntity = aeropuertoList[0];
        await service.delete(aeropuerto.id);
        await expect(() => service.delete("0")).rejects.toHaveProperty("message", "El aeropuerto con id no ha sido encontrado");
    });
});
