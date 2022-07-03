import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsPositive,
  IsNumber,
} from 'class-validator';
import { isFloat32Array } from 'util/types';

export class CreateServiceDto {
  @IsString()
  @IsNotEmpty()
  public serviceName: string;

  @IsString()
  @IsOptional()
  public serviceDescription: string;

  @IsString()
  @IsNotEmpty()
  public versionName: string;

  @IsString()
  @IsOptional()
  public versionDescription: string;

  @IsPositive()
  @IsNumber()
  @IsNotEmpty()
  public versionNumber: number;
}