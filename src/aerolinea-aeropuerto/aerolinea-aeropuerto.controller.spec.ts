/* eslint-disable prettier/prettier */
import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../app.module';

describe('AerolineaAeropuertoController', () =>{
    let app: INestApplication;
    

    beforeEach(async () => { 
        const moduleFixture: TestingModule = await Test.createTestingModule({
          imports: [AppModule],
        }).compile();
    
        app = moduleFixture.createNestApplication();
        await app.init();
    });

    it(':airlineId/airports (GET)', () => { 
        return request(app.getHttpServer()).get('/1/airports'); 
    });

    it(':airlineId/airports/:airportId (GET)', () => { 
        return request(app.getHttpServer()).get('/1/airports/10'); 
    });
});
