/* eslint-disable prettier/prettier */
import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../../src/app.module';

describe('AerolineaController', () =>{
    let app: INestApplication;
    

    beforeEach(async () => { 
        const moduleFixture: TestingModule = await Test.createTestingModule({
          imports: [AppModule],
        }).compile();
    
        app = moduleFixture.createNestApplication();
        await app.init();
    });

    it('/ (GET)', () => { 
        return request(app.getHttpServer()).get('/').expect(200); 
    });

    it('/ (GET)', () => { 
        return request(app.getHttpServer()).get('/4').expect(404); 
    });

    it('/ (DELETE)', () => { 
        return request(app.getHttpServer()).delete('/A203').expect(404); 
    });
});
