import { GraphQLError } from 'graphql';

export class APIError extends Error {
    constructor(message: string, public statusCode: number = 500, public details?: string) {
        super(message);
        this.name = 'APIError';
    }
}

export const formatError = (error: unknown) => {
    if (error instanceof APIError) {
        return new GraphQLError(error.message, {
            extensions: {
                code: error.statusCode >= 500 ? 'INTERNAL_SERVER_ERROR' : 'BAD_REQUEST',
                statusCode: error.statusCode,
                details: error.details,
            }
        });
    }

    return new GraphQLError('An unexpected error occurred', {
        extensions: {
            code: 'INTERNAL_SERVER_ERROR',
        }
    });
}