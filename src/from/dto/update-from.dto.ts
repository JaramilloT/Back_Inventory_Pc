import { PartialType } from '@nestjs/swagger';
import { CreateFromDto } from './create-from.dto';

export class UpdateFromDto extends PartialType(CreateFromDto) {
    file?: string;
}
