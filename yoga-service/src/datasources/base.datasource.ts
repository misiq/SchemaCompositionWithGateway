import {env} from '../config/env';
import { logger } from '../utils/logger';
import { APIError } from '../utils/errors';

export class BaseDataSource {
    protected baseUrl: string;
    protected authToken?: string;

    constructor(baseUrl: string = env.REST_API_URL, authToken?: string) {
        this.baseUrl = baseUrl;
        this.authToken = authToken;
    }

    protected async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
        const normalizedBase = this.baseUrl.endsWith('/') ? this.baseUrl : `${this.baseUrl}/`;
        const normalizedEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
        const url = new URL(normalizedEndpoint, normalizedBase);

        const method = options.method || 'GET';

        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
            ...options.headers as Record<string, string>,
          };

        if (this.authToken) {
            headers['Authorization'] = this.authToken;
        }

        logger.debug({ method, url, hasAuth: !!this.authToken }, 'Outgoing REST Request');
        try {
            const response = await fetch(url, {
                ...options,
                headers,
            })



            if (!response.ok) {
                const errorBody = await response.text();
                logger.error(
                  { status: response.status, url, method, errorBody }, 
                  'REST API Error Response'
                );
                
                throw new APIError(
                  `API request failed: ${response.statusText}`,
                  response.status,
                  errorBody
                );
              }


            return response.json() as Promise<T>;
        } catch (error) {
            if (error instanceof TypeError && error.message === 'Network request failed') {
                logger.error({ url, method, error }, 'Upstream API Unreachable');
            }
            throw error;
        }


    }

    protected async get<T>(path: string){
        return this.request<T>(path, { method: 'GET' });
    }
}