const request = require("supertest");
const app = require("../server");
const id = 1;

const adminExpiredToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwibmFtYSI6Ik5hbWEgTWFzdGVyYWRtaW4iLCJyb2xlIjoiQmFzaWMiLCJub1RlbHAiOiIwODEyMzQ1Njc4OTAiLCJpYXQiOjE2ODc1MTU1NjMsImV4cCI6MTY4NzYwMTk2M30.BceidCLMc1PMINcAveIeBb5iUrZ8BUeqm-wKqeFGfDw";
const userExpiredToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwibmFtZSI6InJhaWhhbiIsIm5vVGVscCI6IjYyODEzNzAxNTQ2OTQiLCJpYXQiOjE2ODcyNzQwMTMsImV4cCI6MTY4NzUzMzIxM30.r0hE_bM-CGf0RlQzioI6lIn3Ao6JmwRSKGYRw_3pSfg";

describe("Admin Token Expired", () => {
  it("should return 401 status code token expired", async () => {
    const res = await request(app)
      .post("/api/v1/about")
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${adminExpiredToken}`)
      .send({
        deskripsi: "Ini deskripsi about",
      });
    expect(res.statusCode).toBe(401);
    expect(res.body.message).toBe("Token Expired");
  });
});

describe("User Token Expired", () => {
  it("should return 401 status code token expired", async () => {
    const res = await request(app)
      .post("/api/v1/about")
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${userExpiredToken}`)
      .send({
        deskripsi: "Ini deskripsi about",
      });
    expect(res.statusCode).toBe(401);
    expect(res.body.message).toBe("Token Expired");
  });
});

describe("Master Admin Unauthorized", () => {
  beforeEach(async () => {
    const token = await request(app).post("/api/v1/admin/login").send({
      nama: "Nama Masteradmin",
      password: "admin123",
    });
    bearerToken = token.body.accessToken;

    return bearerToken;
  });

  it("should return 401 status code unauthorized", async () => {
    const res = await request(app)
      .delete(`/api/v1/review/${id}`)
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${bearerToken}`);

    expect(res.statusCode).toBe(401);
    expect(res.body.status).toBe(false);
    expect(res.body.message).toBe("Anda tidak punya akses (Unauthorized)");
  });
});

describe("Basic Admin Unauthorized", () => {
  beforeEach(async () => {
    const token = await request(app).post("/api/v1/admin/login").send({
      nama: "Admin Basic",
      password: "basic123",
    });
    bearerToken = token.body.accessToken;

    return bearerToken;
  });

  it("should return 401 status code unauthorized", async () => {
    const res = await request(app)
      .get("/api/v1/admin")
      .set("Authorization", `Bearer ${bearerToken}`);

    expect(res.statusCode).toBe(401);
    expect(res.body.status).toBe(false);
    expect(res.body.message).toBe("Anda tidak punya akses (Unauthorized)");
  });
});

describe("User Unauthorized", () => {
  beforeEach(async () => {
    const token = await request(app).post("/api/v1/user/login").send({
      noTelp: "6281234567890",
      password: "coba123",
    });
    userBearerToken = token.body.accessToken;

    return userBearerToken;
  });

  it("should return 401 status code unauthorized", async () => {
    const res = await request(app)
      .get("/api/v1/admin")
      .set("Authorization", `Bearer ${userBearerToken}`);

    expect(res.statusCode).toBe(401);
    expect(res.body.message).toBe("Anda tidak punya akses (Unauthorized)");
  });
});

const { Verify } = require("../app/models");
const { getByOTP, create } = require("../app/services/verifyService");

describe("getByOTP services", () => {
  it("should throw an error when an error occurs", () => {
    // Mock implementation of About.findOne() that throws an error
    Verify.findOne = jest.fn().mockImplementation(() => {
      throw new Error("Test error");
    });
    // Expect the function to throw an error
    expect(getByOTP).toThrow("Test error");
  });
});

describe("create services", () => {
  it("should throw an error when an error occurs", () => {
    // Mock implementation of About.create() that throws an error
    Verify.create = jest.fn().mockImplementation(() => {
      throw new Error("Test error");
    });
    // Expect the function to throw an error
    expect(create).toThrow("Test error");
  });
});