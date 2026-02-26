/**
 * Registry of connector integration type names. The [`types generate`](/developers/references/cli/commands/types-generate) command fills this registry, then [`ConnectorIntegrationType`](#connectorintegrationtype) resolves to a union of the keys.
 */
export interface ConnectorIntegrationTypeRegistry {}

/**
 * Union of all connector integration type names from the [`ConnectorIntegrationTypeRegistry`](#connectorintegrationtyperegistry). Defaults to `string` when no types have been generated.
 *
 * @example
 * ```typescript
 * // Using generated connector type names
 * // With generated types, you get autocomplete on integration types
 * const token = await base44.asServiceRole.connectors.getAccessToken('googlecalendar');
 * ```
 */
export type ConnectorIntegrationType = keyof ConnectorIntegrationTypeRegistry extends never
  ? string
  : keyof ConnectorIntegrationTypeRegistry;

/**
 * Response from the connectors access token endpoint.
 */
export interface ConnectorAccessTokenResponse {
  access_token: string;
}

/**
 * Response from the connectors initiate endpoint.
 */
export interface ConnectorInitiateResponse {
  redirect_url: string;
}

/**
 * Connectors module for managing app-scoped OAuth tokens for external services.
 *
 * This module allows you to retrieve OAuth access tokens for external services that the app has connected to. Connectors are app-scoped. When an app builder connects an integration like Google Calendar or Slack, all users of the app share that same connection.
 *
 * Unlike the integrations module that provides pre-built functions, connectors give you
 * raw OAuth tokens so you can call external service APIs directly with full control over
 * the API calls you make. This is useful when you need custom API interactions that aren't
 * covered by Base44's pre-built integrations.
 *
 * This module is only available via `base44.asServiceRole.connectors`.
 *
 * ## Dynamic Types
 *
 * If you're working in a TypeScript project, you can generate types from your app's connector configurations to get autocomplete on integration type names when calling `getAccessToken()`. See the [Dynamic Types](/developers/references/sdk/getting-started/dynamic-types) guide to get started.
 */
export interface ConnectorsModule {
  /**
   * Retrieves an OAuth access token for a specific external integration type.
   *
   * Returns the OAuth token string for an external service that an app builder
   * has connected to. This token represents the connected app builder's account
   * and can be used to make authenticated API calls to that external service on behalf of the app.
   *
   * @param integrationType - The type of integration, such as `'googlecalendar'`, `'slack'`, or `'github'`.
   * @returns Promise resolving to the access token string.
   *
   * @example
   * ```typescript
   * // Google Calendar connection
   * // Get Google Calendar OAuth token and fetch upcoming events
   * const googleToken = await base44.asServiceRole.connectors.getAccessToken('googlecalendar');
   *
   * // Fetch upcoming 10 events
   * const timeMin = new Date().toISOString();
   * const url = `https://www.googleapis.com/calendar/v3/calendars/primary/events?maxResults=10&orderBy=startTime&singleEvents=true&timeMin=${timeMin}`;
   *
   * const calendarResponse = await fetch(url, {
   *   headers: { 'Authorization': `Bearer ${googleToken}` }
   * });
   *
   * const events = await calendarResponse.json();
   * ```
   *
   * @example
   * ```typescript
   * // Slack connection
   * // Get Slack OAuth token and list channels
   * const slackToken = await base44.asServiceRole.connectors.getAccessToken('slack');
   *
   * // List all public and private channels
   * const url = 'https://slack.com/api/conversations.list?types=public_channel,private_channel&limit=100';
   *
   * const slackResponse = await fetch(url, {
   *   headers: { 'Authorization': `Bearer ${slackToken}` }
   * });
   *
   * const data = await slackResponse.json();
   * ```
   */
  getAccessToken(integrationType: ConnectorIntegrationType): Promise<string>;
}

/**
 * User-scoped connectors module for managing end-user OAuth connections.
 *
 * This module provides methods for end-user OAuth flows: initiating an OAuth connection,
 * retrieving the end user's access token, and disconnecting the end user's connection.
 *
 * Unlike {@link ConnectorsModule | ConnectorsModule} which manages app-scoped tokens,
 * this module manages tokens scoped to individual end users.
 *
 * Available via `base44.connectors`.
 *
 * ## Dynamic Types
 *
 * If you're working in a TypeScript project, you can generate types from your app's connector configurations to get autocomplete on integration type names. See the [Dynamic Types](/developers/references/sdk/getting-started/dynamic-types) guide to get started.
 */
export interface UserConnectorsModule {
  /**
   * Retrieves an OAuth access token for an end user's connection to a specific external integration.
   *
   * Returns the OAuth token string that belongs to the currently authenticated end user
   * for the specified external service.
   *
   * @param integrationType - The type of integration, such as `'googlecalendar'`, `'slack'`, or `'github'`.
   * @returns Promise resolving to the access token string.
   *
   * @example
   * ```typescript
   * // Get the end user's Google Calendar token
   * const token = await base44.connectors.getEndUserAccessToken('googlecalendar');
   *
   * const response = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
   *   headers: { 'Authorization': `Bearer ${token}` }
   * });
   * ```
   */
  getEndUserAccessToken(integrationType: ConnectorIntegrationType): Promise<string>;

  /**
   * Initiates the end-user OAuth flow for a specific external integration type.
   *
   * Returns a redirect URL that the end user should be navigated to in order to
   * authenticate with the external service.
   *
   * @param integrationType - The type of integration, such as `'googlecalendar'`, `'slack'`, or `'github'`.
   * @returns Promise resolving to the redirect URL string.
   *
   * @example
   * ```typescript
   * // Start Google Calendar OAuth for the end user
   * const redirectUrl = await base44.connectors.connectEndUser('googlecalendar');
   *
   * // Redirect the user to the OAuth provider
   * window.location.href = redirectUrl;
   * ```
   */
  connectEndUser(integrationType: ConnectorIntegrationType): Promise<string>;

  /**
   * Disconnects an end user's OAuth connection for a specific external integration type.
   *
   * Removes the stored OAuth credentials for the currently authenticated end user's
   * connection to the specified external service.
   *
   * @param integrationType - The type of integration to disconnect, such as `'googlecalendar'`, `'slack'`, or `'github'`.
   * @returns Promise resolving when the connection has been removed.
   *
   * @example
   * ```typescript
   * // Disconnect the end user's Google Calendar connection
   * await base44.connectors.disconnectEndUser('googlecalendar');
   * ```
   */
  disconnectEndUser(integrationType: ConnectorIntegrationType): Promise<void>;
}
