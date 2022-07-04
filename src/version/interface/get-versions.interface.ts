type Version = {
  id: number
  serviceId: number,
  name: string,
  description?: string,
  number: number
}
export interface getVersionsData {
  versions: Version[] | []
};