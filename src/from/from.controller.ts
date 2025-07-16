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
} from '@nestjs/common';
import { FromService } from './from.service';
import { CreateFromDto } from './dto/create-from.dto';
import { UpdateFromDto } from './dto/update-from.dto';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import * as fs from 'fs';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';

@ApiTags('from')
@ApiBearerAuth()
@Controller('from')
export class FromController {
  constructor(private readonly fromService: FromService) {}

  @Post()
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
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Formulario con posible archivo',
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
        nombre_pc: { type: 'string' },
        marca_pc: { type: 'string' },
        modelo: { type: 'string' },
        serial: { type: 'string' },
        codigo_pc: { type: 'string' },
        tipo_almacenamiento: { type: 'string' },
        almacenamiento: { type: 'string' },
        memoria_ram: { type: 'string' },
        procesador: { type: 'string' },
        codigo_monitor: { type: 'string' },
        serial_monitor: { type: 'string' },
        marca_monitor: { type: 'string' },
        marca_mouse: { type: 'string' },
        codigo_mouse: { type: 'string' },
        marca_tecleado: { type: 'string' },
        codigo_tecleado: { type: 'string' },
        area_ubicacion: { type: 'string' },
        encargado: { type: 'string' },
        sede: { type: 'string' },
        observaciones: { type: 'string' },
        tipo_pc: { type: 'string' },
        ip: { type: 'string' },
        tb_gb: { type: 'string' },
      },
    },
  })
  async create(
    @Body() body: any,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    try {
      const transformedDto = plainToInstance(CreateFromDto, {
        ...body,
        tb_gb: body.tb_gb || '', // Asegura que tb_gb esté presente
        file: file
          ? JSON.stringify([
              {
                path: file.filename,
                name: file.originalname,
                size: file.size,
                mimetype: file.mimetype,
              },
            ])
          : JSON.stringify([]),
      });

      // Validación manual
      const errors = await validate(transformedDto);
      if (errors.length > 0) {
        const errorMessages = errors.map(err => Object.values(err.constraints || {})).flat();
        throw new BadRequestException(errorMessages);
      }

      const saved = await this.fromService.create(transformedDto);
      return {
        message: 'Formulario guardado exitosamente',
        data: saved,
      };
    } catch (error) {
      console.error('Error en create:', error);

      if (file && fs.existsSync(file.path)) {
        try {
          fs.unlinkSync(file.path);
        } catch (unlinkErr) {
          console.error('Error eliminando archivo tras fallo:', unlinkErr);
        }
      }

      if (error instanceof BadRequestException) throw error;

      throw new InternalServerErrorException({
        message: 'Error al guardar los datos',
        error: error.message,
      });
    }
  }

  @Get()
  async findAll() {
    return this.fromService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    const record = await this.fromService.findOne(id);
    if (!record) throw new NotFoundException('Formulario no encontrado');
    return record;
  }

  @Patch(':id')
  async update(@Param('id') id: number, @Body() dto: UpdateFromDto) {
    return this.fromService.updates(+id, dto);
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
    if (!record) throw new NotFoundException('Formulario no encontrado');

    const currentFiles = JSON.parse(record.file || '[]');
    const fileData = {
      path: file.filename,
      name: file.originalname,
      size: file.size,
      mimetype: file.mimetype,
    };
    currentFiles.push(fileData);

    await this.fromService.update(id, { file: JSON.stringify(currentFiles) });
    return { message: 'Archivo subido exitosamente', file: fileData };
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    const record = await this.fromService.findOne(id);
    if (!record) throw new NotFoundException('Formulario no encontrado');

    const files = JSON.parse(record.file || '[]');
    for (const file of files) {
      const filePath = `uploads/${file.path}`;
      if (fs.existsSync(filePath)) {
        try {
          fs.unlinkSync(filePath);
        } catch (err) {
          console.error(`Error al eliminar archivo ${filePath}:`, err);
        }
      }
    }

    await this.fromService.remove(id);
    return { message: 'Formulario eliminado correctamente' };
  }
}
