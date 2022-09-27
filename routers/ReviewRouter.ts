import { IReviewDatabase } from "../databases/IReviewDatabase";
import { Review } from "../models/review";
import { v4 as uuid } from "uuid";
import { Request, Response } from "express";

/** Endpoint for all '/Review' routes */
export class ReviewRouter
{
    reviewDatabase: IReviewDatabase;

    /**
     * DI Constructor
     * @param reviewDatabase Review database to be used for Review operations
     */
    constructor(reviewDatabase: IReviewDatabase) 
    {
        this.reviewDatabase = reviewDatabase;

        this.get = this.get.bind(this);
        this.getInternal = this.getInternal.bind(this);

        this.add = this.add.bind(this);
        this.addInternal = this.addInternal.bind(this);

        this.delete = this.delete.bind(this);
        this.deleteInternal = this.deleteInternal.bind(this);
    }

    /** Gets reviews by 'albumId' http query parameter */
    async get(req: Request, res: Response) 
    {
        var albumId = req.query.albumId;
        
        if(!albumId) {
            res.status(400).send("albumId is required");
            return;
        }

        var reviews = await this.getInternal(albumId as any);

        res.status(200).send(reviews);
    }

    async getInternal(albumId: string) 
    {
        return await this.reviewDatabase.get(albumId);
    }

    /** Adds a review */
    async add(req: Request, res: Response) 
    {
        var album = req.body;
        
        var savedReview = await this.addInternal(album);

        res.status(201).send(savedReview.reviewId);
    }

    async addInternal(review: Review)
    {
        review.reviewId = uuid();
        review.timestampAddedMs = Date.now();
        
        if(!review.albumId)
            throw new Error("Review's album id is missing. Which album is the review for?");

        if(!review.rating) review.rating = 0;
        if(review.rating > 5 || review.rating < 0)
            throw new Error("Rating must be between 0-5!");

        await this.reviewDatabase.add(review);
        
        return review;
    }

    /** Deletes a review */
    async delete(req: Request, res: Response)
    {
        var reviewId = req.query.reviewId;

        if(!reviewId) {
            res.status(400).send("reviewId is required");
            return;
        }

        await this.deleteInternal(reviewId as any);

        res.status(202).send("Review deleted");
    }

    async deleteInternal(reviewId: string) 
    {
        return await this.reviewDatabase.delete(reviewId);
    }
}