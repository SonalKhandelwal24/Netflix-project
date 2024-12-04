import React from "react";
import { isEmpty } from 'lodash';
import MovieCard from './MovieCard';

interface MovieListProps {
    data: {
        map(arg0: (series: any, index: any) => React.JSX.Element): React.ReactNode;
        id: number;
        thumbnailUrl: string;
        videoUrl: string;
        title: string;
        description: string;
        duration?: string;
        genre?: string;
        movieid: string;
        seriesid: string;
      };
    title: string;
}

const MovieList : React.FC<MovieListProps> = ({data, title}) => {

    if(isEmpty(data)) {
        return null;
    }
    
    return (
        <div className="px-4 md:px-12 mt-4 space-y-8">
            <div>
                <p className="text-white text-md md:text-xl lg:text-2xl font-semibold mb-4 ">
                    {title}
                </p>
                <div className="grid grid-cols-4 gap-x-3 gap-y-16 mb-20">
                   {data.map((series, index) => (
                    <MovieCard key={index} data={series} isFavorite={false} />
                   ))} 
                </div>
            </div>
        </div>
    )
    
}

export default MovieList;
