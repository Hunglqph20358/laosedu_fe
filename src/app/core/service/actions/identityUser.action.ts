export class GetAllIdentityUserByTenantId{
  static readonly type = '[IdentityUser] Get';
  constructor(public tenantId: string) {
  }
}
