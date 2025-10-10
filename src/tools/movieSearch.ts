import type {ToolFn} from '../../types';
import {z} from 'zod';
import {queryMovies} from '../rag/query';

export const movieSearchToolDefinition = {
    name: 'movie_search',
    description: 'use this tool to Search for movies based on a query and optional metadata filters like score, rating, actor, director, year, genre, etc.',
    parameters: z.object({
        query: z.string().describe('The search query string. Used for vector search'),
    })
}

type Args = z.infer<typeof movieSearchToolDefinition.parameters>;

export const movieSearch: ToolFn<Args, string> = async ({userMessage, toolArgs}) => {
    let results;

    try {
        results = await queryMovies({query: toolArgs.query});
    } catch (error) {
        console.error(error);
        return `Error querying movies: ${error}`;
    }

    const formattedResults = results.map((result) => {
        const {metadata, data} = result;
        return {...metadata, description: data};
    })
    return JSON.stringify(formattedResults, null, 2);
}