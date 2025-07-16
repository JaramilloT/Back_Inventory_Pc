import {
    Column,
    DeleteDateColumn,
    Entity,
    JoinTable,
    ManyToMany,
    OneToMany,
    PrimaryGeneratedColumn,
  } from 'typeorm';
  
  @Entity('formulario')
export class From {
    @PrimaryGeneratedColumn()
    id_formulario: number;
  
    @Column()
    nombre_pc: string;
  
    @Column()
    marca_pc: string;
  
    @Column()
    modelo: string;
  
    @Column()
    serial: string;

    @Column()
    codigo_pc: string;
    
    @Column()
    tipo_almacenamiento: string;
    
    @Column()
    almacenamiento: string;
    
    @Column()
    memoria_ram: string;
    
    @Column()
    procesador: string;

    @Column()
    codigo_monitor: string;

    @Column()
    serial_monitor: string;

    @Column()
    marca_monitor: string;

    @Column()
    marca_mouse: string;

    @Column()
    codigo_mouse: string;

    @Column()
    marca_tecleado: string;

    @Column()
    codigo_tecleado: string;

    @Column()
    area_ubicacion: string;

    @Column()
    encargado: string;

    @Column()
    sede: string;

    @Column()
    observaciones: string;

    @Column()
    tipo_pc: string;

    @Column()
    ip: string;

    @Column({ default: '' }) // ← Valor por defecto agregado
    tb_gb: string;

    @Column({ nullable: true }) // Define como nullable si el archivo es opcional
    file: string;

    // @DeleteDateColumn()
    // deletedAt?: Date;
}