// @ts-ignore
import { AuthConfig } from 'angular-oauth2-oidc';

export function authPasswordFlowConfig(identityUrl: string): AuthConfig {

    return {
        // Url of the Identity Provider
        issuer: identityUrl,

        // URL of the SPA to redirect the user to after login
        redirectUri: window.location.origin,

        // URL of the SPA to redirect the user after silent refresh
        silentRefreshRedirectUri: window.location.origin,

        clientId: 'backend-admin-app-client',

        dummyClientSecret: '1q2w3e*',

        // scope: 'openid profile offline_access BackendAdminAppGateway',
        scope: 'openid profile offline_access BackendAdminAppGateway IdentityService CategoryProvinceService TenantManagementService SystemManagementService',

        showDebugInformation: true,

        oidc: false,

        requireHttps: false,
        // use dev
        skipIssuerCheck: true,
        // strictDiscoveryDocumentValidation: false
    }
}
