import { Version } from '../../version/entity/version.entity';

export interface ServiceWithAssociations {
  id: number,
  name: string,
  description?: string | null,
  versions: Partial<Version[]>,
  versionCount?: number,
};

export interface GetServicesData {
  services: ServiceWithAssociations[] | [],
  serviceCount: number,
  offset: number,
  limit: number,
};

export interface GetServiceData {
  services: ServiceWithAssociations,
};

export type sortDirection = "DESC" | "ASC";;
export interface serviceQuery {
  keywords: string[]
  sortField: string;
  sortDirection: sortDirection;
  limit: number;
  offset: number;
}
export interface sortQuery {
  sortDirection: sortDirection,
  string: string,
}

