type Version = {
  id: number,
  name: string,
  description?: string,
  number: number,
}
export interface ServiceWithAssociations {
  id: number,
  name: string,
  description?: string | null,
  versions: Version[],
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

