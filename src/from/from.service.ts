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

  async create(createFromDto: CreateFromDto & { file: string }) {
    const newFrom = this.fromRepository.create(createFromDto);
    await this.fromRepository.save(newFrom);
    return newFrom;
  }

  findAll() {
    return this.fromRepository.find();
  }

  findOne(id_formulario: number) {
    return this.fromRepository.findOneBy({ id_formulario });
  }

  async findById(id_formulario: number): Promise<From> {
    return await this.fromRepository.findOne({ where: { id_formulario: id_formulario } });
  }

  async updates(id_formulario: number, updateFromDto: UpdateFromDto,){
    return this.fromRepository.update({id_formulario}, updateFromDto)
  }

  async update(id_formulario: number, updateFromDto: UpdateFromDto, file?: string) {
    // Crear un objeto temporal con los datos de `updateFromDto` y agregar `file` si existe
    const updateData = {
      ...updateFromDto,
      ...(file && { file }), // Agregar `file` solo si existe
    };
  
    // Actualiza el registro en la base de datos
    await this.fromRepository.update({ id_formulario }, updateData);
  
    // Retorna el registro actualizado
    return this.findOne(id_formulario);
  }
  
  async remove(id_formulario: number) {
    // Intenta eliminar el registro y verifica si existe
    const result = await this.fromRepository.delete({ id_formulario });
    if (result.affected === 0) {
      throw new NotFoundException('Formulario no encontrado');
    }
  }
  // async deleteFile(id_formulario: number, filename: string) {
  //   const form = await this.fromRepository.findOne({ where: { id_formulario: id_formulario } });
  //   if (!form) throw new Error('Formulario no encontrado');

  //   // Primero eliminamos el archivo del sistema de archivos
  //   const filePath = path.join(__dirname, '..', '..', 'uploads', filename); // Asegúrate de que la ruta sea correcta
  //   fs.unlink(filePath);

  //   // Luego eliminamos la referencia al archivo en la base de datos
  //   form.file = form.file.filter(file => file.filename !== filename);
  //   return this.fromRepository.save(form);
  // }
}