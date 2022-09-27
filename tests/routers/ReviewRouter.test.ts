import { IReviewDatabase } from "../../databases/IReviewDatabase";
import { Review } from "../../models/review";
import { ReviewRouter } from "../../routers/ReviewRouter";
import { createMock }from "ts-auto-mock";
import { expect } from "chai";
import sinon from "sinon";

describe("getInternal", () => {
    it("Returns all reviews for an album from db", async () => {
        const expectedReviews = [
            { albumId: "Album 1", reviewId: "Review 1" },
            { albumId: "Alubm 1", reviewId: "Review 2" }
        ] as Review[];
        
        const reviewDatabase = createMock<IReviewDatabase>({
            get: async (albumId: string) => expectedReviews   
        });

        const reviewRouter = new ReviewRouter(reviewDatabase);
        
        const reviews = await reviewRouter.getInternal("Album 1");

        expect(expectedReviews).to.eql(reviews);
    });
});

describe("addInternal", () => {
    it("Adds review to the database", async () => {
        const reviewToSave = { albumId: "Some Album" } as Review;
        const reviewDatabase = { add: sinon.spy() } as any;
        const reviewRouter = new ReviewRouter(reviewDatabase);

        await reviewRouter.addInternal(reviewToSave);

        expect(reviewDatabase.add.calledWith(reviewToSave)).to.eql(true);
    });
    it("ReviewId in the request body is overwritten", async () => {
        const reviewToSave = {  albumId: "Some Album", reviewId: "Original Id" };
        const reviewDatabase = { add: sinon.spy() };

        const reviewRouter = new ReviewRouter(reviewDatabase as  any);
        
        await reviewRouter.addInternal(reviewToSave);
        
        const savedReview = reviewDatabase.add.firstCall.firstArg;
        expect(savedReview.reviewId.length > 1).to.eql(true);
        expect(savedReview.reviewId).to.not.eql("Original Id");
    });
    it("TimestampAddedMs is set before saving", async () => {
        const reviewToSave = { albumId: "Some Album" };
        const reviewDatabase = { add: sinon.spy() };

        const reviewRouter = new ReviewRouter(reviewDatabase as  any);
        
        await reviewRouter.addInternal(reviewToSave);
        
        const savedReview = reviewDatabase.add.firstCall.firstArg;
        expect(Date.now() - savedReview.timestampAddedMs < 1000).to.eql(true);
    })
    it("Fails if album id is not present", async () => {
        const reviewToSave = { title: "Some Title" };
        const reviewDatabase = { add: sinon.spy() };

        const reviewRouter = new ReviewRouter(reviewDatabase as  any);
        
        await expectThrowsAsync(
            async () => await reviewRouter.addInternal(reviewToSave)
        );
    });
    it("Fails if rating is out of bounds", async () => {
        const reviewDatabase = { add: sinon.spy() };

        const reviewRouter = new ReviewRouter(reviewDatabase as  any);
        
        await expectThrowsAsync(
            async () => await reviewRouter.addInternal({ rating: 9, albumId: "Some Album"})
        );
        await expectThrowsAsync(
            async () => await reviewRouter.addInternal({ rating: -1, albumId: "Some Album"})
        );
    })
});

describe("deleteInternal", () => {
    it("Deletes review from database",async () => {
        const reviewDatabase = { delete: sinon.spy() };
        const reviewRouter = new ReviewRouter(reviewDatabase as any);
        
        await reviewRouter.deleteInternal("Some Review Id");

        expect(reviewDatabase.delete.calledWith("Some Review Id")).to.eql(true);        
    });
});

const expectThrowsAsync = async (method: any, errorMessage?: string) => {
    let error = null;

    try { await method() } 
    catch (err: any) { error = err }

    expect(error).to.be.an('Error')

    if (errorMessage) expect(error.message).to.equal(errorMessage)
}