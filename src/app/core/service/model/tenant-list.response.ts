import {TenantModel} from './tenant.model';

export class TenantListResponse {
  totalCount: number;
  items: TenantModel[];
}
