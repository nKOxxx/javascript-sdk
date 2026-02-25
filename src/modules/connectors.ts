import { AxiosInstance } from "axios";
import {
  ConnectorIntegrationType,
  ConnectorAccessTokenResponse,
  ConnectorConnectionResponse,
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

    async getConnection(
      integrationType: ConnectorIntegrationType
    ): Promise<ConnectorConnectionResponse> {
      if (!integrationType || typeof integrationType !== "string") {
        throw new Error("Integration type is required and must be a string");
      }

      const response = await axios.get<ConnectorAccessTokenResponse>(
        `/apps/${appId}/external-auth/tokens/${integrationType}`
      );

      const data = response as unknown as ConnectorAccessTokenResponse;
      return {
        accessToken: data.access_token,
        connectionConfig: data.connection_config ?? null,
      };
    },
  };
}
