import { Version } from '../../version/entity/version.entity';
import { Service } from '../entity/service.entity';

export interface CreateServiceData {
  serviceId: number
  versionId: number
};

export interface CreateServiceVersionData {
  service: Service,
  version: Version,
};