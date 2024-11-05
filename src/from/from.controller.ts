import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { FromService } from './from.service';
import { CreateFromDto } from './dto/create-from.dto';
import { UpdateFromDto } from './dto/update-from.dto';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { Response } from 'express';
import path, { extname } from 'path';
import * as fs from 'fs';


@ApiTags('from')
@ApiBearerAuth()
@Controller('from')
export class FromController {
  constructor(private readonly fromService: FromService) {}

  // Endpoint para manejar los datos de texto del formulario

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads', // Carpeta para guardar archivos
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const fileExtName = extname(file.originalname);
          callback(null, `${uniqueSuffix}${fileExtName}`);
        },
      }),
    })
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Datos a cargar y archivo',
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
        nombre_pc: { type: 'string', description: 'Nombre del PC' },
        marca_pc: { type: 'string', description: 'Marca del PC' },
        modelo: { type: 'string', description: 'Modelo del PC' },
        serial: { type: 'string', description: 'Serial del PC' },
        codigo_pc: { type: 'string', description: 'Código del PC' },
        tipo_almacenamiento: { type: 'string', description: 'Tipo de almacenamiento' },
        almacenamiento: { type: 'string', description: 'Almacenamiento' },
        memoria_ram: { type: 'string', description: 'Memoria ram' },
        procesador: { type: 'string', description: 'Procesador' },
        codigo_monitor: { type: 'string', description: 'Código del monitor' },
        serial_monitor: { type: 'string', description: 'Serial del monitor' },
        marca_monitor: { type: 'string', description: 'Marca del monitor' },
        marca_mouse: { type: 'string', description: 'Marca del mouse' },
        codigo_mouse: { type: 'string', description: 'Código del mouse' },
        marca_tecleado: { type: 'string', description: 'Marca del teclado' },
        codigo_tecleado: { type: 'string', description: 'Código del teclado' },
        area_ubicacion: { type: 'string', description: 'Área de ubicación' },
        encargado: { type: 'string', description: 'Encargado' },
        sede: { type: 'string', description: 'Sede' },
        observaciones: { type: 'string', description: 'Observaciones' },
        tipo_pc: { type: 'string', description: 'Tipo de PC' },
        ip: { type: 'string', description: 'Dirección IP' },
      },
    },
  })
  async create(
    @Body() createFromDto: CreateFromDto
  ) {
    try {
      // Verifica que se reciban los datos del formulario
      if (!createFromDto) {
        throw new BadRequestException('Datos del formulario no encontrados');
      }
  
      // Crea el nuevo formulario en la base de datos
      const newFrom = await this.fromService.create(createFromDto);
  
      return {
        message: 'Formulario guardado exitosamente',
        data: newFrom,
      };
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Error al guardar los datos');
    }
  }
  

  // Endpoint separado para la carga del archivo
  @Get()
  findAll() {
    return this.fromService.findAll();
  }

  @Get(':id')
  async getById(@Param('id') id: number) {
    const formDetails = await this.fromService.findById(id);
    if (!formDetails) {
      throw new NotFoundException('Formulario no encontrado');
    }
    return formDetails;
  }
  
  @Patch(':id/uploads')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const fileExtName = extname(file.originalname);
          callback(null, `${uniqueSuffix}${fileExtName}`);
        },
      }),
    }),
  )
  async uploadFile(
    @Param('id') id: number,
    @UploadedFile() file: Express.Multer.File,
) {
    const record = await this.fromService.findOne(id);
    if (!record) {
        throw new NotFoundException('Registro no encontrado');
    }

    // Imprime el contenido de record.file para depuración
    console.log('Contenido de record.file:', record.file);

    // Función auxiliar para analizar JSON de manera segura
    const safeJsonParse = (value: string | undefined | null, defaultValue: any) => {
        if (typeof value !== 'string') return defaultValue;
        try {
            return JSON.parse(value);
        } catch (error) {
            console.error('Error parsing JSON:', error);
            return defaultValue; // Devuelve un valor predeterminado en caso de error
        }
    };

    // Parsear el campo `file` y agregar el nuevo archivo
    const currentFiles = safeJsonParse(record.file, []);
    const fileData = { path: file.filename, name: file.originalname };
    currentFiles.push(fileData);

    // Actualizar el registro con la lista de archivos actualizada
    await this.fromService.update(id, { file: JSON.stringify(currentFiles) });

    return {
        message: 'Archivo subido exitosamente',
        file: fileData,
    };
}

@Patch(':id')
update(@Param('id') id: number, @Body() updateFromDto: UpdateFromDto) {
  return this.fromService.updates(+id, updateFromDto);
}

@Delete(':id')
  async deleteForm(@Param('id') id: number): Promise<void> {
    // Encuentra el formulario primero
    const form = await this.fromService.findById(id);
    if (!form) throw new NotFoundException('Formulario no encontrado');

    // Lógica para eliminar los archivos relacionados
    const files = JSON.parse(form.file || '[]');
    for (const file of files) {
      const filePath = `uploads/${file.path}`;
      try {
        // Verifica si el archivo existe antes de intentar eliminarlo
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath); // Elimina el archivo del sistema de archivos
        } else {
          console.warn(`Advertencia: El archivo ${filePath} no existe`);
        }
      } catch (error) {
        console.error('Error al eliminar el archivo:', error);
        throw new InternalServerErrorException('Error al eliminar archivo');
      }
    }

    // Elimina el formulario de la base de datos
    await this.fromService.remove(id);
  }
  // @Delete('delete-file/:id/:filename')
  // async deleteFile(@Param('id') id: number, @Param('filename') filename: string) {
  //     try {
  //         const message = await this.fromService.deleteFile(id, filename);
  //         return { message }; // Devuelve el mensaje de éxito
  //     } catch (error) {
  //         console.error(error);
  //         throw new InternalServerErrorException('Error al eliminar el archivo');
  //     }
  // }
  
  
}
