import { connectDBForTesting, disconnectDBForTesting } from "../connectDBForTesting";
import Author from "../../src/models/Author";
import { faker } from "@faker-js/faker";

describe("Unit Test of the Author Model", () => {
	beforeAll(async () => await connectDBForTesting());

	afterAll(async () => {
		await Author.collection.drop();
		await disconnectDBForTesting();
	});

	test("Create an Author", async () => {
		const authorInput = {
			name: faker.name.firstName()
		};

		const author = new Author(authorInput);
		const resultAuthor = await author.save();

		expect(resultAuthor).toBeDefined();
	});
});
