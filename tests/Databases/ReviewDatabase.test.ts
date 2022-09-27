import { expect } from "chai";
import { ReviewDatabase } from "../../databases/ReviewDatabase";

const hasConnectionString = process.env.DATABASE_CONNECTION_STRING !== undefined;

if(!hasConnectionString) console.log("Skipping ReviewDatabase tests, no connection string found!");

const It = hasConnectionString ? it : it.skip;

describe("save and retrieve", () => {
    It("Can add a review and retrieve it by albumId", async () => {
        const reviewToAdd = { reviewId: "Review 1", albumId: "Album 4", rating: 5 };
        const reviewDatabase = new ReviewDatabase();
        
        await reviewDatabase.add(reviewToAdd);

        const reviews = await reviewDatabase.get("Album 4");

        expect(reviews.find(x=> x.rating == 5 && x.reviewId == "Review 1")).to.not.be.undefined; 

        await tryCleanupReview("Review 1");
    });

    It("Updates a review if the review id already exists", async () => {
        const review = { reviewId: "Review 2", albumId: "Album 5", rating: 5 };
        const updatedReview = { reviewId: "Review 2", albumId: "Album 5", rating: 4 };
        const reviewDatabase = new ReviewDatabase();
        
        await reviewDatabase.add(review);
        await reviewDatabase.add(updatedReview);

        const reviews = await reviewDatabase.get("Album 5");

        expect(reviews.find(x=> x.reviewId == "Review 2" && x.rating == 4)).not.to.be.undefined;
        
        await tryCleanupReview("Review 2");
    });
});

describe("deleting", () => {
    It("Deletes by review id", async () => {
        const review = { reviewId: "Review 3", albumId: "Album 6", rating: 5 };
        const reviewDatabase = new ReviewDatabase();
        
        await reviewDatabase.add(review);
        await reviewDatabase.delete("Review 3");

        const reviews = reviewDatabase.get("Album 6");

        expect(reviews).to.be.empty;
    });

    It("Deletes all by album id", async () => {
        const review1 = { reviewId: "Review 4", albumId: "Album 7", rating: 5 };
        const review2 = { reviewId: "Review 5", albumId: "Album 7", rating: 5 };
        const reviewDatabase = new ReviewDatabase();
        
        await reviewDatabase.add(review1);
        await reviewDatabase.add(review2);
        await reviewDatabase.deleteByAlbum("Album 7");

        const reviews = await reviewDatabase.get("Album 7");

        expect(reviews).to.be.empty;
    });
});


async function tryCleanupReview(albumId: string) {
    try {
        let reviewDatabase = new ReviewDatabase();
        await reviewDatabase.delete(albumId);
    } catch {}
}

function sleep(ms: number)
{
    return new Promise(resolve => setTimeout(resolve, ms));
}