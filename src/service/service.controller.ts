import {
  Logger,
  UseGuards,
  Controller,
  ParseIntPipe,
  InternalServerErrorException,
  HttpException,
  Query,
  Param,
  Body,
  Get,
  Put,
  Post,
  Delete,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { ServiceService } from './service.service';
import {
  CreateServiceDto,
  UpdateServiceDto,
} from './dto';
import {
  GetServicesData,
  sortDirection,
  sortQuery,
  ServiceWithAssociations,
  CreateServiceData,
  UpdateServiceData,
  DeleteServiceData,
} from './interface';

@UseGuards(JwtAuthGuard)
@Controller('services')
export class ServiceController {
  constructor(private readonly service: ServiceService) { }

  name: string = 'ServiceController';
  private readonly logger = new Logger()

  @Get()
  public async getServices(@Query() q): Promise<GetServicesData | Partial<GetServicesData>> {
    this.logger.log(this.name, 'getServices.')
    const {
      query = "",
      sort = "created_at,DESC",
      limit = 12,
      offset = 1,
    } = q;


    if (limit < 1) {
      throw new HttpException('Limit cannot be zero!', 400);
    }

    if (sort == "") {
      throw new HttpException('Sort cannot be zero!', 400);
    }

    const keywords: string[] = query.split(',').map((q) => `%${q}%`);
    const sortQuery: sortQuery = sort.split(',').map((s) => s);
    const sortField: string = sortQuery[0];
    const sortDirection: sortDirection = sortQuery[1].toUpperCase();

    return this.service.readMany({
      keywords,
      sortField,
      sortDirection,
      limit,
      offset: offset <= 1 ? 0 : Number(offset) * Number(limit) - Number(limit),
    });
  }

  @Get(':id')
  public async getService(@Param('id', ParseIntPipe) id: number): Promise<ServiceWithAssociations> {
    this.logger.log(this.name, 'getService.')
    return this.service.readOne(id);
  }

  @Post()
  public async createService(@Body() body: CreateServiceDto): Promise<CreateServiceData> {
    this.logger.log(this.name, 'createService.')
    const result = await this.service.create(body);

    if (!result.service || !result.version) {
      throw new InternalServerErrorException('NotCreatedData');
    }
    return {
      serviceId: result.service.id,
      versionId: result.version.id,
    };
  }

  @Put(':id')
  public async updateService(@Param('id', ParseIntPipe) id: number, @Body() body: UpdateServiceDto): Promise<UpdateServiceData> {
    this.logger.log(this.name, 'updateService.')
    const result = await this.service.update(id, body);
    return { success: !!result.affected };
  }

  @Delete(':id')
  public async deleteService(@Param('id', ParseIntPipe) id: number): Promise<DeleteServiceData> {
    this.logger.log(this.name, 'deleteService.')
    const result = await this.service.delete(id);
    return { success: !!result.affected };
  }
}
