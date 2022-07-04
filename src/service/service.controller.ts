import {
  UseGuards,
  Controller,
  ParseIntPipe,
  InternalServerErrorException,
  Query,
  Param,
  Body,
  Get,
  Put,
  Post,
  Delete,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
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

  @Get()
  public async getServices(@Query() q): Promise<GetServicesData | Partial<GetServicesData>> {

    const {
      query = "",
      sort = "createdAt,DESC",
      limit = 12,
      offset = 1,
    } = q;

    const keywords: string[] = query.split(',').map((q) => `%${q}%`);
    const sortQuery: sortQuery = sort.split(',').map((s) => s);
    const sortField: string = sortQuery[0];
    const sortDirection: sortDirection = sortQuery[1].toUpperCase();

    return this.service.readMany({
      keywords,
      sortField,
      sortDirection,
      limit,
      offset: offset - 1,
    });
  }

  @Get(':id')
  public async getService(@Param('id', ParseIntPipe) id: number): Promise<ServiceWithAssociations> {
    return this.service.readOne(id);
  }

  @Post()
  public async createService(@Body() body: CreateServiceDto): Promise<CreateServiceData> {
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
    const result = await this.service.update(id, body);
    return { success: !!result.affected };
  }

  @Delete(':id')
  public async deleteService(@Param('id', ParseIntPipe) id: number): Promise<DeleteServiceData> {
    const result = await this.service.delete(id);
    return { success: !!result.affected };
  }
}
