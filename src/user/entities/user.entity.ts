import {
    Column,
    DeleteDateColumn,
    Entity,
    JoinTable,
    ManyToMany,
    OneToMany,
    PrimaryGeneratedColumn,
  } from 'typeorm';
  
  @Entity('usuario')
  export class User {
    @PrimaryGeneratedColumn()
    id_usuario: number;
  
    @Column()
    nombre: string;
  
    @Column()
    apellido: string;
  
    @Column({ unique: true, nullable: false })
    correo: string;
  
    @Column({ nullable: false })
    contraseña: string;

    @Column({ nullable: false })
    codigo: string;
 
  }
  