import {
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
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
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
  @Inject(VersionService)
  readonly version: VersionService;

  @Get()
  public async getVersions(): Promise<getVersionsData> {
    const versions = await this.version.read()
    return { versions }
  }

  @Get(':serviceId')
  public async getVersion(@Param('serviceId', ParseIntPipe) serviceId: number): Promise<getVersionsData> {
    const versions = await this.version.read(serviceId);
    return { versions }
  }

  @Post()
  public async createVersion(@Body() body: CreateVersionDto): Promise<createVersionData> {
    const result = await this.version.create(body);
    if (!result.id) {
      throw new InternalServerErrorException('NotCreatedData');
    }
    return { id: result.id };
  }

  @Put(':id')
  public async updateVersion(@Param('id', ParseIntPipe) id: number, @Body() body: UpdateVersionDto): Promise<updateVersionData> {
    const result = await this.version.update(id, body);
    return { success: !!result.affected };
  }

  @Delete(':id')
  public async deleteService(@Param('id', ParseIntPipe) id: number): Promise<deleteVersionData> {
    const result = await this.version.deleteById(id);
    return { success: !!result.affected };
  }
}
