import { Review } from "../models/review";

/** Review Database interface */
export interface IReviewDatabase 
{
    /** Deletes all reviews for an album */
    deleteByAlbum(albumId: string): Promise<void>;
    /** Delete review by reviewId */
    delete(reviewId: string): Promise<void>;
    
    /** Get all reviews for an album */
    get(albumId: string): Promise<Review[]>;
    
    /** Add a review to the database */
    add(review: Review): Promise<void>;
}