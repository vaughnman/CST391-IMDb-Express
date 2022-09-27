import { IRatingCalculator } from "../IRatingCalculator";
import { Request, Response } from "express";

/** Endpoint for all '/Rating' routes */
export class RatingRouter 
{
    ratingCalculator: IRatingCalculator;

    /**
     * DI Constructor
     * @param ratingCalculator Rating calculator to use for calculating ratings
     */
    constructor(ratingCalculator: IRatingCalculator)
    {
        this.ratingCalculator = ratingCalculator;

        this.getInternal = this.getInternal.bind(this);
        this.get = this.get.bind(this);
    }

    /** Calculates rating by 'albumId' http query parameter */
    async get(req: Request, res: Response) {
        var albumId = req.query.albumId;

        if(!albumId) {
            res.status(400).send("albumId is required");
            return;
        }
        
        var rating = await this.getInternal(albumId as any);

        res.status(200).send(rating.toString());
    } 


    getInternal(albumId: string)
    {
        return this.ratingCalculator.get(albumId);
    }
}