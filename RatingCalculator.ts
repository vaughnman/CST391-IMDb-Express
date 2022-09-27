import { IReviewDatabase } from "./databases/IReviewDatabase";
import { IRatingCalculator } from "./IRatingCalculator";

/** Calculator that calculates ratings for album */
export class RatingCalculator implements IRatingCalculator
{
    reviewDatabase: IReviewDatabase;

    /** DI Constructor */
    constructor(reviewDatabase: IReviewDatabase)
    {
        this.reviewDatabase = reviewDatabase;
    }

    /** Calculates rating by album id */
    async get(albumId: string) 
    {
        let reviews = await this.reviewDatabase.get(albumId);
        
        if(!reviews || reviews.length == 0) return 0;

        let ratings = reviews.map(x => x.rating ?? 0);        
        let sum = ratings.reduce((a, b) => a + b, 0);
        
        let average = sum / reviews.length;
        
        return average;
    }
}