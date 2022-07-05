import {
  Logger,
  UseGuards,
  Controller,
  Injectable,
  Inject,
  ParseIntPipe,
  InternalServerErrorException,
  Param,
  Body,
  Get,
  Post,
  Put,
  Delete,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { VersionService } from './version.service';
import {
  CreateVersionDto,
  UpdateVersionDto,
} from './dto';
import {
  getVersionsData,
  createVersionData,
  updateVersionData,
  deleteVersionData,
} from './interface';

@UseGuards(JwtAuthGuard)
@Injectable()
@Controller('versions')
export class VersionController {
  name: string = 'VersionController';
  private readonly logger = new Logger()

  @Inject(VersionService)
  readonly version: VersionService;

  @Get()
  public async getVersions(): Promise<getVersionsData | []> {
    this.logger.log(this.name, 'getVersions.')
    return this.version.read()
  }

  @Get(':serviceId')
  public async getVersion(@Param('serviceId', ParseIntPipe) serviceId: number): Promise<getVersionsData | []> {
    this.logger.log(this.name, 'getVersion.')
    return this.version.read(serviceId);
  }

  @Post()
  public async createVersion(@Body() body: CreateVersionDto): Promise<createVersionData> {
    this.logger.log(this.name, 'createVersion.')
    const result = await this.version.create(body);
    if (!result.id) {
      throw new InternalServerErrorException('NotCreatedData');
    }
    return { id: result.id };
  }

  @Put(':id')
  public async updateVersion(@Param('id', ParseIntPipe) id: number, @Body() body: UpdateVersionDto): Promise<updateVersionData> {
    this.logger.log(this.name, 'updateVersion.')
    const result = await this.version.update(id, body);
    return { success: !!result.affected };
  }

  @Delete(':id')
  public async deleteService(@Param('id', ParseIntPipe) id: number): Promise<deleteVersionData> {
    this.logger.log(this.name, 'deleteService.')
    const result = await this.version.deleteById(id);
    return { success: !!result.affected };
  }
}
