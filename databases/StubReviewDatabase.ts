import { Review } from "../models/review";
import { IReviewDatabase } from "./IReviewDatabase";

/** An in-memory database for reviews */
export class StubReviewDatabase implements IReviewDatabase
{
    static reviews: Review[] = [];


    async get(albumId: string): Promise<Review[]> {
        return StubReviewDatabase.reviews.filter(x => x.albumId == albumId);
    }

    async add(review: Review): Promise<void> {
        StubReviewDatabase.reviews = StubReviewDatabase.reviews.filter(x => x.reviewId != review.reviewId);

        StubReviewDatabase.reviews.push(review);
    }

    async deleteByAlbum(albumId: string): Promise<void> {
        StubReviewDatabase.reviews = StubReviewDatabase.reviews.filter(x => x.albumId != albumId);    
    }

    async delete(reviewId: string): Promise<void> {
        StubReviewDatabase.reviews = StubReviewDatabase.reviews.filter(x => x.reviewId != reviewId);
    }
}