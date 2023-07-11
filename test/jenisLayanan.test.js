const request = require("supertest");
const app = require("../server");
const jenisLayananService = require("../app/services/jenisLayananService");
const id = 1;

beforeAll(async () => {
  const token = await request(app).post("/api/v1/admin/login").send({
    nama: "Nama Masteradmin",
    password: "admin123",
  });
  bearerToken = token.body.accessToken;

  return bearerToken;
});

describe("GET /api/v1/jenislayanan", () => {
  it("should return 404 status code and data empty message", async () => {
    const response = await request(app).get("/api/v1/jenislayanan");

    expect(response.status).toBe(404);
    expect(response.body.status).toBe(false);
    expect(response.body.message).toBe("Data empty, Please input some data!");
  });

  it("should return the expected response when there is an error", async () => {
    const errorMock = new Error("Test error");
    jest
      .spyOn(jenisLayananService, "getAllData")
      .mockRejectedValueOnce(errorMock);

    const res = await request(app).get("/api/v1/jenislayanan").expect(422);

    expect(res.body.status).toBe(false);
    expect(res.body.message).toBe(errorMock.message);
  });
});

describe("CREATE /api/v1/jenislayanan", () => {
  it("should return 201 status code and create data jenis layanan", async () => {
    const res = await request(app)
      .post("/api/v1/jenislayanan")
      .set("Content-Type", "multipart/form-data")
      .set("Authorization", `Bearer ${bearerToken}`)
      .field({
        layanan: "ini layanan jenis layanan",
        deskripsi: "ini deskripsi jenis layanan",
        gambar: "ini gambar jenis layanan",
        hari: 1,
      });
    expect(res.statusCode).toBe(201);
    expect(res.body.status).toBe(true);
    expect(res.body.message).toBe("Successfully create data");
    expect(res.body.data).toBeDefined();
  });

  it("should return 400 status code and got error message", async () => {
    const res = await request(app)
      .post("/api/v1/jenislayanan")
      .set("Content-Type", "multipart/form-data")
      .set("Authorization", `Bearer ${bearerToken}`)
      .field({
        layanan: "ini layanan jenis layanan",
        deskripsi: "ini deskripsi jenis layanan",
        gambar: "ini gambar jenis layanan",
        hari: "",
        jam: "",
        menit: "",
      });
    expect(res.statusCode).toBe(400);
    expect(res.body.status).toBe(false);
    expect(res.body.message).toBe("Please input data hari or jam!");
  });

  it("should return the expected response when there is an error", async () => {
    const errorMock = new Error("Test error");
    jest.spyOn(jenisLayananService, "create").mockRejectedValueOnce(errorMock);

    const res = await request(app)
      .post("/api/v1/jenislayanan")
      .set("Content-Type", "multipart/form-data")
      .set("Authorization", `Bearer ${bearerToken}`)
      .field({
        layanan: "ini layanan jenis layanan",
        deskripsi: "ini deskripsi jenis layanan",
        gambar: "ini gambar jenis layanan",
        hari: 1,
      })
      .expect(422);

    expect(res.body.status).toBe(false);
    expect(res.body.message).toBe(errorMock.message);
  });
});

describe("GET /api/v1/jenislayanan", () => {
  it("should return 200 status code and get all data jenis layanan", async () => {
    const res = await request(app).get("/api/v1/jenislayanan");

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe(true);
    expect(res.body.message).toBe("Successfully get all data");
    expect(res.body.data).toBeDefined();
    expect(Array.isArray(res.body.data)).toBe(true);
  });
});

describe("GET /api/v1/jenislayanan/:id", () => {
  it("should return 200 status code and get data jenis layanan by id", async () => {
    const res = await request(app).get(`/api/v1/jenislayanan/${id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe(true);
    expect(res.body.message).toBe("Successfully get data by id");
    expect(res.body.data).toBeDefined();
  });

  it("should return 404 status code and data not found", async () => {
    const res = await request(app).get("/api/v1/jenislayanan/9999");
    expect(res.statusCode).toBe(404);
    expect(res.body.status).toBe(false);
    expect(res.body.message).toBe("Data not found");
  });

  it("should return the expected response when there is an error", async () => {
    const errorMock = new Error("Test error");
    jest.spyOn(jenisLayananService, "getById").mockRejectedValueOnce(errorMock);

    const res = await request(app)
      .get(`/api/v1/jenislayanan/${id}`)
      .expect(422);

    expect(res.body.status).toBe(false);
    expect(res.body.message).toBe(errorMock.message);
  });
});

describe("UPDATE /api/v1/jenislayanan/:id", () => {
  it("should return 200 status code and update data jenis layanan", async () => {
    const res = await request(app)
      .put(`/api/v1/jenislayanan/${id}`)
      .set("Content-Type", "multipart/form-data")
      .set("Authorization", `Bearer ${bearerToken}`)
      .field({
        deskripsi: "Ini deskripsi jenis layanan (sudah update)",
        gambar: "Ini gambar jenis layanan (sudah update)",
        hari: 1,
      });
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe(true);
    expect(res.body.message).toBe("Successfully update data");
    expect(res.body.data).toBeDefined();
  });

  it("should return 400 status code and got error message", async () => {
    const res = await request(app)
      .put(`/api/v1/jenislayanan/${id}`)
      .set("Content-Type", "multipart/form-data")
      .set("Authorization", `Bearer ${bearerToken}`)
      .field({
        deskripsi: "Ini deskripsi jenis layanan (sudah update)",
        gambar: "Ini gambar jenis layanan (sudah update)",
        hari: "",
        jam: "",
        menit: "",
      });
    expect(res.statusCode).toBe(400);
    expect(res.body.status).toBe(false);
    expect(res.body.message).toBe("Please input data hari or jam!");
  });

  it("should return 404 status code and data not found", async () => {
    const res = await request(app)
      .put("/api/v1/jenislayanan/9999")
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${bearerToken}`);
    expect(res.statusCode).toBe(404);
    expect(res.body.status).toBe(false);
    expect(res.body.message).toBe("Data not found");
  });

  it("should return the expected response when there is an error", async () => {
    const errorMock = new Error("Test error");
    jest.spyOn(jenisLayananService, "update").mockRejectedValueOnce(errorMock);

    const res = await request(app)
      .put(`/api/v1/jenislayanan/${id}`)
      .set("Content-Type", "multipart/form-data")
      .set("Authorization", `Bearer ${bearerToken}`)
      .field({
        deskripsi: "Ini deskripsi jenis layanan (sudah update)",
        gambar: "Ini gambar jenis layanan (sudah update)",
        hari: 1,
      })
      .expect(422);

    expect(res.body.status).toBe(false);
    expect(res.body.message).toBe(errorMock.message);
  });
});

describe("DELETE /api/v1/jenislayanan/:id", () => {
  it("should return the expected response when there is an error", async () => {
    const errorMock = new Error("Test error");
    jest.spyOn(jenisLayananService, "delete").mockRejectedValueOnce(errorMock);

    const res = await request(app)
      .delete(`/api/v1/jenislayanan/${id}`)
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${bearerToken}`)
      .expect(422);

    expect(res.body.status).toBe(false);
    expect(res.body.message).toBe(errorMock.message);
  });

  it("should return 200 status code and delete data jenis layanan", async () => {
    const res = await request(app)
      .delete(`/api/v1/jenislayanan/${id}`)
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${bearerToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe(true);
    expect(res.body.message).toBe("Successfully delete data");
  });

  it("should return 404 status code and data not found", async () => {
    const res = await request(app)
      .delete("/api/v1/jenislayanan/999")
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${bearerToken}`);
    expect(res.statusCode).toBe(404);
    expect(res.body.status).toBe(false);
    expect(res.body.message).toBe("Data not found");
  });
});

const { JenisLayanan } = require("../app/models");
const {
  getAllData,
  getById,
  create,
  update,
} = require("../app/services/jenisLayananService");

describe("getAllData services", () => {
  it("should throw an error when an error occurs", () => {
    // Mock implementation of About.findAll() that throws an error
    JenisLayanan.findAll = jest.fn().mockImplementation(() => {
      throw new Error("Test error");
    });
    // Expect the function to throw an error
    expect(getAllData).toThrow("Test error");
  });
});

describe("getById services", () => {
  it("should throw an error when an error occurs", () => {
    // Mock implementation of About.findOne() that throws an error
    JenisLayanan.findOne = jest.fn().mockImplementation(() => {
      throw new Error("Test error");
    });
    // Expect the function to throw an error
    expect(getById).toThrow("Test error");
  });
});

describe("create services", () => {
  it("should throw an error when an error occurs", () => {
    // Mock implementation of About.create() that throws an error
    JenisLayanan.create = jest.fn().mockImplementation(() => {
      throw new Error("Test error");
    });
    // Expect the function to throw an error
    expect(create).toThrow("Test error");
  });
});

describe("update services", () => {
  it("should throw an error when an error occurs", () => {
    // Mock implementation of About.update() that throws an error
    JenisLayanan.update = jest.fn().mockImplementation(() => {
      throw new Error("Test error");
    });
    // Expect the function to throw an error
    expect(update).toThrow("Test error");
  });
});
