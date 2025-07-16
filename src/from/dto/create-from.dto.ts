import { Transform } from 'class-transformer';
import { IsOptional, IsString, MinLength } from 'class-validator';

export class CreateFromDto {
  @Transform(({ value }) => value?.trim())
  @IsString()
  @MinLength(1)
  nombre_pc: string;

  @Transform(({ value }) => value?.trim())
  @IsString()
  @MinLength(1)
  marca_pc: string;

  @Transform(({ value }) => value?.trim())
  @IsString()
  @MinLength(1)
  modelo: string;

  @Transform(({ value }) => value?.trim())
  @IsString()
  @MinLength(1)
  serial: string;

  @Transform(({ value }) => value?.trim())
  @IsString()
  @MinLength(1)
  codigo_pc: string;

  @Transform(({ value }) => value?.trim())
  @IsString()
  @MinLength(1)
  tipo_almacenamiento: string;

  @Transform(({ value }) => value?.trim())
  @IsString()
  @MinLength(1)
  almacenamiento: string;

  @Transform(({ value }) => value?.trim())
  @IsString()
  @MinLength(1)
  memoria_ram: string;

  @Transform(({ value }) => value?.trim())
  @IsString()
  @MinLength(1)
  procesador: string;

  @Transform(({ value }) => value?.trim())
  @IsString()
  @MinLength(1)
  codigo_monitor: string;

  @Transform(({ value }) => value?.trim())
  @IsString()
  @MinLength(1)
  serial_monitor: string;

  @Transform(({ value }) => value?.trim())
  @IsString()
  @MinLength(1)
  marca_monitor: string;

  @Transform(({ value }) => value?.trim())
  @IsString()
  @MinLength(1)
  marca_mouse: string;

  @Transform(({ value }) => value?.trim())
  @IsString()
  @MinLength(1)
  codigo_mouse: string;

  @Transform(({ value }) => value?.trim())
  @IsString()
  @MinLength(1)
  marca_tecleado: string;

  @Transform(({ value }) => value?.trim())
  @IsString()
  @MinLength(1)
  codigo_tecleado: string;

  @Transform(({ value }) => value?.trim())
  @IsString()
  @MinLength(1)
  area_ubicacion: string;

  @Transform(({ value }) => value?.trim())
  @IsString()
  @MinLength(1)
  encargado: string;

  @Transform(({ value }) => value?.trim())
  @IsString()
  @MinLength(1)
  sede: string;

  @Transform(({ value }) => value?.trim())
  @IsString()
  @MinLength(1)
  observaciones: string;

  @Transform(({ value }) => value?.trim())
  @IsString()
  @MinLength(1)
  tipo_pc: string;

  @Transform(({ value }) => value?.trim())
  @IsString()
  @MinLength(1)
  ip: string;

  @Transform(({ value }) => value?.trim?.() || '')
  @IsString()
  @IsOptional()
  tb_gb?: string;

  @IsOptional()
  file?: string;
}
