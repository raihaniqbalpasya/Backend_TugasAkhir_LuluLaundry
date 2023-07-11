const request = require("supertest");
const app = require("../server");
const galeriService = require("../app/services/galeriService");
const id = 1;

// banyak error karena gambarnya not null
beforeAll(async () => {
  const token = await request(app).post("/api/v1/admin/login").send({
    nama: "Nama Masteradmin",
    password: "admin123",
  });
  bearerToken = token.body.accessToken;

  return bearerToken;
});

describe("GET /api/v1/galeri", () => {
  it("should return 404 status code and data empty message", async () => {
    const response = await request(app).get("/api/v1/galeri");

    expect(response.status).toBe(404);
    expect(response.body.status).toBe(false);
    expect(response.body.message).toBe("Data empty, Please input some data!");
  });

  it("should return the expected response when there is an error", async () => {
    const errorMock = new Error("Test error");
    jest.spyOn(galeriService, "getAllData").mockRejectedValueOnce(errorMock);

    const res = await request(app).get("/api/v1/galeri").expect(422);

    expect(res.body.status).toBe(false);
    expect(res.body.message).toBe(errorMock.message);
  });
});

describe("CREATE /api/v1/galeri", () => {
  it("should return the expected response when there is an error", async () => {
    const errorMock = new Error("Value cannot be null");
    jest.spyOn(galeriService, "create").mockRejectedValueOnce(errorMock);

    const res = await request(app)
      .post("/api/v1/galeri")
      .set("Content-Type", "multipart/form-data")
      .set("Authorization", `Bearer ${bearerToken}`)
      .field({
        judul: "ini judul galeri",
        deskripsi: "ini deskripsi galeri",
        media: "ini media galeri",
      })
      .expect(422);

    expect(res.body.status).toBe(false);
    expect(res.body.message).toBe(errorMock.message);
  });
});

describe("GET /api/v1/galeri/:id", () => {
  it("should return 404 status code and data not found", async () => {
    const res = await request(app).get("/api/v1/galeri/9999");
    expect(res.statusCode).toBe(404);
    expect(res.body.status).toBe(false);
    expect(res.body.message).toBe("Data not found");
  });

  it("should return the expected response when there is an error", async () => {
    const errorMock = new Error("Test error");
    jest.spyOn(galeriService, "getById").mockRejectedValueOnce(errorMock);

    const res = await request(app).get(`/api/v1/galeri/${id}`).expect(422);

    expect(res.body.status).toBe(false);
    expect(res.body.message).toBe(errorMock.message);
  });
});

describe("UPDATE /api/v1/galeri/:id", () => {
  it("should return 404 status code and data not found", async () => {
    const res = await request(app)
      .put("/api/v1/galeri/9999")
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${bearerToken}`);
    expect(res.statusCode).toBe(404);
    expect(res.body.status).toBe(false);
    expect(res.body.message).toBe("Data not found");
  });
});

describe("DELETE /api/v1/galeri/:id", () => {
  it("should return 404 status code and data not found", async () => {
    const res = await request(app)
      .delete("/api/v1/galeri/999")
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${bearerToken}`);
    expect(res.statusCode).toBe(404);
    expect(res.body.status).toBe(false);
    expect(res.body.message).toBe("Data not found");
  });
});

const { Galeri } = require("../app/models");
const {
  getAll,
  getAllData,
  getById,
  create,
  update,
} = require("../app/services/galeriService");

describe("getAll services", () => {
  it("should throw an error when an error occurs", () => {
    // Mock implementation of About.findAll() that throws an error
    Galeri.findAll = jest.fn().mockImplementation(() => {
      throw new Error("Test error");
    });
    // Expect the function to throw an error
    expect(getAll).toThrow("Test error");
  });
});

describe("getAllData services", () => {
  it("should throw an error when an error occurs", () => {
    // Mock implementation of About.findAll() that throws an error
    Galeri.findAll = jest.fn().mockImplementation(() => {
      throw new Error("Test error");
    });
    // Expect the function to throw an error
    expect(getAllData).toThrow("Test error");
  });
});

describe("getById services", () => {
  it("should throw an error when an error occurs", () => {
    // Mock implementation of About.findOne() that throws an error
    Galeri.findOne = jest.fn().mockImplementation(() => {
      throw new Error("Test error");
    });
    // Expect the function to throw an error
    expect(getById).toThrow("Test error");
  });
});

describe("create services", () => {
  it("should throw an error when an error occurs", () => {
    // Mock implementation of About.create() that throws an error
    Galeri.create = jest.fn().mockImplementation(() => {
      throw new Error("Test error");
    });
    // Expect the function to throw an error
    expect(create).toThrow("Test error");
  });
});

describe("update services", () => {
  it("should throw an error when an error occurs", () => {
    // Mock implementation of About.update() that throws an error
    Galeri.update = jest.fn().mockImplementation(() => {
      throw new Error("Test error");
    });
    // Expect the function to throw an error
    expect(update).toThrow("Test error");
  });
});
