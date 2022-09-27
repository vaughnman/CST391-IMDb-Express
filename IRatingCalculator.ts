/** Rating Calculator interface */
export interface IRatingCalculator
{
    /** Calculates rating by album id */
    get(albumId: string): Promise<number>;
}