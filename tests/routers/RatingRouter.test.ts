import { createMock } from "ts-auto-mock";
import { IRatingCalculator } from "../../IRatingCalculator";
import { RatingRouter } from "../../routers/RatingRouter";
import { expect } from "chai";

it("Returns rating from rating calculator", async () => {
    const ratingCalculator = createMock<IRatingCalculator>({
        get: async (albumId: string) => 3
    });
    const ratingRouter = new RatingRouter(ratingCalculator);

    const result = await ratingRouter.getInternal("Some Album Id");

    expect(result).to.eql(3);
});