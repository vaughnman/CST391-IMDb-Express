/** Album DTO */
export class Album {
    
    /** The album's unique id */
    albumId?: string;
    
    
    /** The name of the album */
    name?: string;

    /** Band the album was created by */
    band?: string;

    /** A url to an image of the album cover */ 
    imageUrl?: string;
    
    /** Release date as a string. Ex: '9/20/2022' */
    releaseDate?: string;

    
    /** The timestamp the album was added in milliseconds */
    timestampAddedMs?: number;
}