const request = require("supertest");
const app = require("../server");
const faqService = require("../app/services/faqService");
const id = 1;

beforeAll(async () => {
  const token = await request(app).post("/api/v1/admin/login").send({
    nama: "Nama Masteradmin",
    password: "admin123",
  });
  bearerToken = token.body.accessToken;

  return bearerToken;
});

describe("GET /api/v1/faq", () => {
  it("should return 404 status code and data empty message", async () => {
    const response = await request(app).get("/api/v1/faq");

    expect(response.status).toBe(404);
    expect(response.body.status).toBe(false);
    expect(response.body.message).toBe("Data empty, Please input some data!");
  });

  it("should return the expected response when there is an error", async () => {
    const errorMock = new Error("Test error");
    jest.spyOn(faqService, "getAllData").mockRejectedValueOnce(errorMock);

    const res = await request(app).get("/api/v1/faq").expect(422);

    expect(res.body.status).toBe(false);
    expect(res.body.message).toBe(errorMock.message);
  });
});

describe("CREATE /api/v1/faq", () => {
  it("should return 201 status code and create data faq", async () => {
    const res = await request(app)
      .post("/api/v1/faq")
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${bearerToken}`)
      .send({
        pertanyaan: "ini contoh pertanyaan",
        jawaban: "ini contoh jawaban",
      });
    expect(res.statusCode).toBe(201);
    expect(res.body.status).toBe(true);
    expect(res.body.message).toBe("Successfully create data");
    expect(res.body.data).toBeDefined();
  });

  it("should return the expected response when there is an error", async () => {
    const errorMock = new Error("Test error");
    jest.spyOn(faqService, "create").mockRejectedValueOnce(errorMock);

    const res = await request(app)
      .post("/api/v1/faq")
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${bearerToken}`)
      .expect(422);

    expect(res.body.status).toBe(false);
    expect(res.body.message).toBe(errorMock.message);
  });
});

describe("GET /api/v1/faq", () => {
  it("should return 200 status code and get all data faq", async () => {
    const res = await request(app).get("/api/v1/faq");

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe(true);
    expect(res.body.message).toBe("Successfully get all data");
    expect(res.body.data).toBeDefined();
    expect(Array.isArray(res.body.data)).toBe(true);
  });
});

describe("GET /api/v1/faq/:id", () => {
  it("should return 200 status code and get data faq by id", async () => {
    const res = await request(app).get(`/api/v1/faq/${id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe(true);
    expect(res.body.message).toBe("Successfully get data by id");
    expect(res.body.data).toBeDefined();
  });

  it("should return 404 status code and data not found", async () => {
    const res = await request(app).get("/api/v1/faq/9999");
    expect(res.statusCode).toBe(404);
    expect(res.body.status).toBe(false);
    expect(res.body.message).toBe("Data not found");
  });

  it("should return the expected response when there is an error", async () => {
    const errorMock = new Error("Test error");
    jest.spyOn(faqService, "getById").mockRejectedValueOnce(errorMock);

    const res = await request(app).get(`/api/v1/faq/${id}`).expect(422);

    expect(res.body.status).toBe(false);
    expect(res.body.message).toBe(errorMock.message);
  });
});

describe("UPDATE /api/v1/faq/:id", () => {
  it("should return 200 status code and update data faq", async () => {
    const res = await request(app)
      .put(`/api/v1/faq/${id}`)
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${bearerToken}`)
      .send({
        deskripsi: "Ini deskripsi faq (sudah update)",
      });
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe(true);
    expect(res.body.message).toBe("Successfully update data");
    expect(res.body.data).toBeDefined();
  });

  it("should return 404 status code and data not found", async () => {
    const res = await request(app)
      .put("/api/v1/faq/9999")
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${bearerToken}`);
    expect(res.statusCode).toBe(404);
    expect(res.body.status).toBe(false);
    expect(res.body.message).toBe("Data not found");
  });

  it("should return the expected response when there is an error", async () => {
    const errorMock = new Error("Test error");
    jest.spyOn(faqService, "update").mockRejectedValueOnce(errorMock);

    const res = await request(app)
      .put(`/api/v1/faq/${id}`)
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${bearerToken}`)
      .expect(422);

    expect(res.body.status).toBe(false);
    expect(res.body.message).toBe(errorMock.message);
  });
});

describe("DELETE /api/v1/faq/:id", () => {
  it("should return 200 status code and delete data faq", async () => {
    const res = await request(app)
      .delete(`/api/v1/faq/${id}`)
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${bearerToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe(true);
    expect(res.body.message).toBe("Successfully delete data");
  });

  it("should return 404 status code and data not found", async () => {
    const res = await request(app)
      .delete("/api/v1/faq/999")
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${bearerToken}`);
    expect(res.statusCode).toBe(404);
    expect(res.body.status).toBe(false);
    expect(res.body.message).toBe("Data not found");
  });

  it("should return the expected response when there is an error", async () => {
    const errorMock = new Error("Test error");
    jest.spyOn(faqService, "delete").mockRejectedValueOnce(errorMock);

    const res = await request(app)
      .delete(`/api/v1/faq/${id}`)
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${bearerToken}`)
      .expect(422);

    expect(res.body.status).toBe(false);
    expect(res.body.message).toBe(errorMock.message);
  });
});

const { FAQ } = require("../app/models");
const {
  getAllData,
  getById,
  create,
  update,
} = require("../app/services/faqService");

describe("getAllData services", () => {
  it("should throw an error when an error occurs", () => {
    // Mock implementation of About.findAll() that throws an error
    FAQ.findAll = jest.fn().mockImplementation(() => {
      throw new Error("Test error");
    });
    // Expect the function to throw an error
    expect(getAllData).toThrow("Test error");
  });
});

describe("getById services", () => {
  it("should throw an error when an error occurs", () => {
    // Mock implementation of About.findOne() that throws an error
    FAQ.findOne = jest.fn().mockImplementation(() => {
      throw new Error("Test error");
    });
    // Expect the function to throw an error
    expect(getById).toThrow("Test error");
  });
});

describe("create services", () => {
  it("should throw an error when an error occurs", () => {
    // Mock implementation of About.create() that throws an error
    FAQ.create = jest.fn().mockImplementation(() => {
      throw new Error("Test error");
    });
    // Expect the function to throw an error
    expect(create).toThrow("Test error");
  });
});

describe("update services", () => {
  it("should throw an error when an error occurs", () => {
    // Mock implementation of About.update() that throws an error
    FAQ.update = jest.fn().mockImplementation(() => {
      throw new Error("Test error");
    });
    // Expect the function to throw an error
    expect(update).toThrow("Test error");
  });
});

// describe("delete services", () => {
//   it("should throw an error when an error occurs", () => {
//     // Mock implementation of About.delete() that throws an error
//     FAQ.delete = jest.fn().mockImplementation(() => {
//       throw new Error("Test error");
//     });
//     // Expect the function to throw an error
//     expect(deleteById).toThrow("Test error");
//   });
// });
