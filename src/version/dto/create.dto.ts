import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsPositive,
  IsInt,
  IsNumber,
} from 'class-validator';

export class CreateVersionDto {
  @IsString()
  @IsNotEmpty()
  public name: string;

  @IsString()
  @IsOptional()
  public description: string;

  @IsPositive()
  @IsInt()
  @IsNotEmpty()
  public serviceId: number;

  @IsPositive()
  @IsNumber()
  @IsNotEmpty()
  public number: number;
}