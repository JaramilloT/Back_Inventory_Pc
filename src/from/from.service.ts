import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateFromDto } from './dto/create-from.dto';
import { UpdateFromDto } from './dto/update-from.dto';
import { Repository } from 'typeorm';
import { From } from './entities/from.entity';
import { InjectRepository } from '@nestjs/typeorm';
import path, { join } from 'path';
import { unlinkSync, existsSync } from 'fs';
import { promises as fs } from 'fs';

@Injectable()
export class FromService {
  constructor(
    @InjectRepository(From)
    private fromRepository: Repository<From>,
  ) {}

  async create(createFromDto: CreateFromDto & { file?: string }) {
    try {
      console.log('Datos a crear en servicio:', createFromDto);
      
      const newFrom = this.fromRepository.create(createFromDto);
      const savedForm = await this.fromRepository.save(newFrom);
      
      console.log('Formulario guardado:', savedForm);
      return savedForm;
    } catch (error) {
      console.error('Error en service.create:', error);
      throw error;
    }
  }

  async findAll() {
    try {
      return await this.fromRepository.find();
    } catch (error) {
      console.error('Error en service.findAll:', error);
      throw error;
    }
  }

  async findOne(id_formulario: number) {
    try {
      return await this.fromRepository.findOneBy({ id_formulario });
    } catch (error) {
      console.error('Error en service.findOne:', error);
      throw error;
    }
  }

  async findById(id_formulario: number): Promise<From> {
    try {
      return await this.fromRepository.findOne({ 
        where: { id_formulario: id_formulario } 
      });
    } catch (error) {
      console.error('Error en service.findById:', error);
      throw error;
    }
  }

  async updates(id_formulario: number, updateFromDto: UpdateFromDto) {
    try {
      const result = await this.fromRepository.update(
        { id_formulario }, 
        updateFromDto
      );
      
      if (result.affected === 0) {
        throw new NotFoundException('Formulario no encontrado');
      }
      
      return result;
    } catch (error) {
      console.error('Error en service.updates:', error);
      throw error;
    }
  }

  async update(id_formulario: number, updateFromDto: UpdateFromDto & { file?: string }) {
    try {
      // Crear un objeto temporal con los datos de `updateFromDto` y agregar `file` si existe
      const updateData = {
        ...updateFromDto,
        ...(updateFromDto.file && { file: updateFromDto.file }),
      };

      // Actualiza el registro en la base de datos
      const result = await this.fromRepository.update(
        { id_formulario }, 
        updateData
      );

      if (result.affected === 0) {
        throw new NotFoundException('Formulario no encontrado');
      }

      // Retorna el registro actualizado
      return this.findOne(id_formulario);
    } catch (error) {
      console.error('Error en service.update:', error);
      throw error;
    }
  }

  async remove(id_formulario: number) {
    try {
      // Intenta eliminar el registro y verifica si existe
      const result = await this.fromRepository.delete({ id_formulario });
      if (result.affected === 0) {
        throw new NotFoundException('Formulario no encontrado');
      }
      return result;
    } catch (error) {
      console.error('Error en service.remove:', error);
      throw error;
    }
  }
}