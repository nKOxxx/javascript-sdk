import { AxiosInstance } from "axios";
import {
  ConnectorIntegrationType,
  ConnectorAccessTokenResponse,
  ConnectorInitiateResponse,
  ConnectorsModule,
} from "./connectors.types.js";

/**
 * Creates the Connectors module for the Base44 SDK.
 *
 * @param axios - Axios instance (should be service role client)
 * @param appId - Application ID
 * @returns Connectors module with methods to retrieve OAuth tokens
 * @internal
 */
export function createConnectorsModule(
  axios: AxiosInstance,
  appId: string
): ConnectorsModule {
  return {
    // Retrieve an OAuth access token for a specific external integration type
    // @ts-expect-error Return type mismatch with interface - implementation returns object, interface expects string
    async getAccessToken(
      integrationType: ConnectorIntegrationType
    ): Promise<ConnectorAccessTokenResponse> {
      if (!integrationType || typeof integrationType !== "string") {
        throw new Error("Integration type is required and must be a string");
      }

      const response = await axios.get<ConnectorAccessTokenResponse>(
        `/apps/${appId}/external-auth/tokens/${integrationType}`
      );

      // @ts-expect-error
      return response.access_token;
    },

    async initiate(
      integrationType: ConnectorIntegrationType
    ): Promise<string> {
      if (!integrationType || typeof integrationType !== "string") {
        throw new Error("Integration type is required and must be a string");
      }

      const response = await axios.post<ConnectorInitiateResponse>(
        `/apps/${appId}/end-user-auth/initiate`,
        { integration_type: integrationType }
      );

      // @ts-expect-error
      return response.redirect_url;
    },

    async disconnect(
      integrationType: ConnectorIntegrationType
    ): Promise<void> {
      if (!integrationType || typeof integrationType !== "string") {
        throw new Error("Integration type is required and must be a string");
      }

      await axios.delete(
        `/apps/${appId}/end-user-auth/${integrationType}`
      );
    },
  };
}
