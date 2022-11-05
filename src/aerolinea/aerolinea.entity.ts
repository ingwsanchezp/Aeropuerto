/* eslint-disable prettier/prettier */
import { AeropuertoEntity } from '../aeropuerto/aeropuerto.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from 'typeorm';

@Entity()
export class AerolineaEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nombre: string;

  @Column()
  descripcion: string;

  @Column()
  fechaFundacion: Date;

  @Column()
  paginaWeb: string;

  @ManyToMany(() => AeropuertoEntity, (aeropuerto) => aeropuerto.aerolineas, { cascade: true, })
  @JoinTable()
  aeropuertos: AeropuertoEntity[];
}
