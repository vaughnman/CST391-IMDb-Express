/** Review DTO */
export class Review 
{
    /** The review's unique id */
    reviewId?: string;

    /** The id of the album the review is for */
    albumId?: string;

    /** The posting user's name */
    username?: string;

    /** The review's title */
    title?: string;

    /** The review's content */
    body?: string;

    /** The user's album rating from 0-5 */    
    rating?: number;

    /** Time the review was added at */
    timestampAddedMs?: number;
}