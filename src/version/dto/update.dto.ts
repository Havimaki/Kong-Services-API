import {
  IsString,
  IsOptional,
} from 'class-validator';

export class UpdateVersionDto {
  @IsString()
  @IsOptional()
  public name: string;

  @IsString()
  @IsOptional()
  public description: string;
}