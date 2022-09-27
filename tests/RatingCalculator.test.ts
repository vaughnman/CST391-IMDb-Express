import { Review } from "../models/review";
import { expect } from "chai";
import { RatingCalculator } from "../RatingCalculator";

it("Returns the average of all ratings in database", async () => {
    const reviews = [{ rating: 1, albumId: "1"}, { rating: 3, albumId: "1"}, {rating: 5, albumId: "1"}] as Review[];
    const reviewDatabase = { get: async (albumId: string) => reviews };

    const ratingCalculator = new RatingCalculator(reviewDatabase as any);

    var result = await ratingCalculator.get("1");

    expect(result).to.eql(3);
});
it("Returns 0 if album has no reviews", async () => {
    const reviewDatabase = { get: async (albumId: string) => [] };

    const ratingCalculator = new RatingCalculator(reviewDatabase as any);

    var result = await ratingCalculator.get("1");

    expect(result).to.eql(0);
});