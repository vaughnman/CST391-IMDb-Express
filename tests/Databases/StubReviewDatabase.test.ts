import { expect } from "chai";
import { StubReviewDatabase } from "../../databases/StubReviewDatabase";

describe("save and retrieve", () => {
    it("Can add a review and retrieve it by albumId", async () => {
        const reviewToAdd = { reviewId: "Review 1", albumId: "Album 1", rating: 5 };
        const reviewDatabase = new StubReviewDatabase();
        
        await reviewDatabase.add(reviewToAdd);

        const reviews = await reviewDatabase.get("Album 1");

        expect(reviews).to.contain(reviewToAdd);    
    });

    it("Updates a review if the review id already exists", async () => {
        const review = { reviewId: "Review 1", albumId: "Album 1", rating: 5 };
        const updatedReview = { reviewId: "Review 1", albumId: "Album 1", rating: 4 };
        const reviewDatabase = new StubReviewDatabase();
        
        await reviewDatabase.add(review);
        await reviewDatabase.add(updatedReview);

        const reviews = await reviewDatabase.get("Album 1");

        expect(reviews).to.contain(updatedReview);    
    });
});

describe("deleting", () => {
    it("Deletes by review id", async () => {
        const review = { reviewId: "Review 1", albumId: "Album 1", rating: 5 };
        const reviewDatabase = new StubReviewDatabase();
        
        await reviewDatabase.add(review);
        await reviewDatabase.delete("Review 1");

        const reviews = await reviewDatabase.get("Album 1");

        expect(reviews).to.be.empty;
    });

    it("Deletes all by album id", async () => {
        const review1 = { reviewId: "Review 1", albumId: "Album 1", rating: 5 };
        const review2 = { reviewId: "Review 2", albumId: "Album 1", rating: 5 };
        const reviewDatabase = new StubReviewDatabase();
        
        await reviewDatabase.add(review1);
        await reviewDatabase.add(review2);
        await reviewDatabase.deleteByAlbum("Album 1");

        const reviews = await reviewDatabase.get("Album 1");

        expect(reviews).to.be.empty;
    });
});