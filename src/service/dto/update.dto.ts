import {
  IsString,
  IsOptional,
} from 'class-validator';

export class UpdateServiceDto {
  @IsString()
  @IsOptional()
  public name: string;

  @IsString()
  @IsOptional()
  public description: string;
}