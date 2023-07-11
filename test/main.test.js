const request = require("supertest");
const app = require("../server");

// main route testing
describe("GET /", () => {
  it("should return message from main route", async () => {
    const res = await request(app).get("/");
    expect(res.status).toBe(200);
    expect(res.text).toBe("This is the main route!");
  });
});
