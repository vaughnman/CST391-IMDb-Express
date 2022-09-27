import mysql from "mysql2";
import { Review } from "../models/review";
import { IReviewDatabase } from "./IReviewDatabase";

/** Database for reviews */
export class ReviewDatabase implements IReviewDatabase 
{
    connection: mysql.Pool;
    
    /** Constructor */
    constructor()
    {
        let connectionString = process.env.DATABASE_CONNECTION_STRING;
        if(!connectionString) throw new Error("DATABASE_CONNECTION_STRING is missing from environment variables!");
        
        var parts = connectionString.split(";");
        var keyValues = parts.map(x => ({key: x.split("=")[0], value: x.split("=")[1]}));

        var config: any = {
            host: keyValues.find(x => x.key == "server")?.value,
            user: keyValues.find(x => x.key == "uid" || x.key == "")?.value,
            password: keyValues.find(x => x.key == "password")?.value,
            database: keyValues.find(x => x.key == "database")?.value,
        };

        this.connection = mysql.createPool(config);
    }

    /** Delete review by album id */
    async deleteByAlbum(albumId: string): Promise<void> {
        await this.connection.promise()
            .execute("DELETE FROM reviews WHERE AlbumId = ?", [albumId]);
    }

    /** Delete review by id */
    async delete(reviewId: string): Promise<void> {
        await this.connection.promise()
            .execute("DELETE FROM reviews WHERE ReviewId = ?", [reviewId]);
    }

    /** Get review by album id */
    async get(albumId: string): Promise<Review[]> {
        const [rows, fields] = await this.connection.promise()
            .execute("SELECT * FROM reviews WHERE AlbumId = ?", [albumId]);

        if(!rows) return [];

        let reviews: Review[] = (rows as any).map((x: any) => this.toCamelCase(x));

        return reviews;
    }

    /** Add review */
    async add(review: Review): Promise<void> {
        await this.connection.promise()
            .query(
                "REPLACE reviews (`ReviewId`,`AlbumId`,`Username`,`Title`,`Body`,`Rating`,`TimestampAddedMs`)" +
                "VALUES (?, ?, ?, ?, ?, ?, ?)",
                [review.reviewId, review.albumId, review.username, review.title, review.body, review.rating, review.timestampAddedMs]
            );
    }
    
    /** Convert pascal case database row to camel case */
    toCamelCase(object: any) {
        var newObject: any = {};

        for(var key in object) {
            var newKey = key.charAt(0).toLocaleLowerCase() + key.slice(1);
            if(object[key])
                newObject[newKey] = object[key];
        }

        return newObject;
    }
}