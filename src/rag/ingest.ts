import 'dotenv/config';
import {Index as UpstashIndex} from '@upstash/vector';
import {parse} from 'csv-parse/sync';
import fs from 'fs';
import path from 'path';
import ora from 'ora';


const index = new UpstashIndex({
    url: process.env.UPSTASH_VECTOR_REST_URL as string,
    token: process.env.UPSTASH_VECTOR_REST_TOKEN as string,
})

export async function indexMovieData() {
    const spinner = ora('Reading movie data...').start();

    const csvPath = path.join(process.cwd(), 'src/rag/imdb_movie_dataset.csv');
    const csvData = fs.readFileSync(csvPath, 'utf-8');
    const records = parse(csvData, {
        columns: true,
        skip_empty_lines: true,
    });

    spinner.text = 'Indexing movie data...';

    for(const movie of records){
        spinner.text = `Indexing movie: ${movie.Title}...`;
        const text = `${movie.Title}.${movie.Description}.${movie.Genre}.${movie.Year}.${movie.Director}.`;
        try{
            await index.upsert({
                id: movie.Title,
                data: text,
                metadata: {
                    title: movie.Title,
                    year: Number(movie.Year),
                    genre: movie.Genre,
                    director: movie.Director,
                    actors: movie.Actors,
                    rating: Number(movie.Rating),
                    votes: Number(movie.Votes),
                    revenue: Number(movie.Revenue),
                    metascore: Number(movie.Metascore),
                }
            })

        }
        catch (error) {
            spinner.fail(`Failed to index movie: ${movie.Title}`);
            console.error(error);
        }
    }

    spinner.succeed('Movie data indexed successfully!');
};

indexMovieData();