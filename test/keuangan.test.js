const request = require("supertest");
const app = require("../server");
const keuanganService = require("../app/services/keuanganService");
const id = 1;

beforeAll(async () => {
  const token = await request(app).post("/api/v1/admin/login").send({
    nama: "Nama Masteradmin",
    password: "admin123",
  });
  bearerToken = token.body.accessToken;

  return bearerToken;
});

describe("GET /api/v1/keuangan", () => {
  it("should return 404 status code and data empty message", async () => {
    const response = await request(app).get("/api/v1/keuangan");

    expect(response.status).toBe(404);
    expect(response.body.status).toBe(false);
    expect(response.body.message).toBe("Data empty, Please input some data!");
  });

  it("should return the expected response when there is an error", async () => {
    const errorMock = new Error("Test error");
    jest.spyOn(keuanganService, "getAllData").mockRejectedValueOnce(errorMock);

    const res = await request(app).get("/api/v1/keuangan").expect(422);

    expect(res.body.status).toBe(false);
    expect(res.body.message).toBe(errorMock.message);
  });
});

describe("CREATE /api/v1/keuangan", () => {
  it("should return 201 status code and create data keuangan", async () => {
    const res = await request(app)
      .post("/api/v1/keuangan")
      .set("Content-Type", "multipart/form-data")
      .set("Authorization", `Bearer ${bearerToken}`)
      .field({
        tipe: "Pemasukan",
        judul: "ini judul keuangan",
        catatan: "ini catatan keuangan",
        gambar: "ini gambar keuangan",
        nominal: 60000,
        tanggal: "2023-07-05",
      });
    expect(res.statusCode).toBe(201);
    expect(res.body.status).toBe(true);
    expect(res.body.message).toBe("Successfully create data");
    expect(res.body.data).toBeDefined();
  });

  it("should return 400 status code and got error message", async () => {
    const res = await request(app)
      .post("/api/v1/keuangan")
      .set("Content-Type", "multipart/form-data")
      .set("Authorization", `Bearer ${bearerToken}`)
      .field({
        tipe: "",
        judul: "ini judul keuangan",
        catatan: "ini catatan keuangan",
        gambar: "ini gambar keuangan",
        nominal: 60000,
        tanggal: "2023-07-05",
      });
    expect(res.statusCode).toBe(400);
    expect(res.body.status).toBe(false);
    expect(res.body.message).toBe("Please input the role correctly!");
  });

  it("should return the expected response when there is an error", async () => {
    const errorMock = new Error("Test error");
    jest.spyOn(keuanganService, "create").mockRejectedValueOnce(errorMock);

    const res = await request(app)
      .post("/api/v1/keuangan")
      .set("Content-Type", "multipart/form-data")
      .set("Authorization", `Bearer ${bearerToken}`)
      .field({
        tipe: "Pemasukan",
        judul: "ini judul keuangan",
        catatan: "ini catatan keuangan",
        gambar: "ini gambar keuangan",
        nominal: 60000,
        tanggal: "2023-07-05",
      })
      .expect(422);

    expect(res.body.status).toBe(false);
    expect(res.body.message).toBe(errorMock.message);
  });
});

describe("GET /api/v1/keuangan/search/where?query=value", () => {
  it("should return 200 status code and search data keuangan by judul", async () => {
    const res = await request(app)
      .get("/api/v1/keuangan/search/where?judul=ini")
      .set("Authorization", `Bearer ${bearerToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe(true);
    expect(res.body.message).toBe("Successfully get data by judul");
    expect(res.body.data).toBeDefined();
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it("should return 404 status code and search data not found", async () => {
    const res = await request(app)
      .get("/api/v1/keuangan/search/where?judul=apa")
      .set("Authorization", `Bearer ${bearerToken}`);
    expect(res.statusCode).toBe(404);
    expect(res.body.status).toBe(false);
    expect(res.body.message).toBe("Data not found");
  });

  it("should return the expected response when there is an error", async () => {
    const errorMock = new Error("Test error");
    jest
      .spyOn(keuanganService, "searchFinance")
      .mockRejectedValueOnce(errorMock);

    const res = await request(app)
      .get("/api/v1/keuangan/search/where?judul=ini")
      .set("Authorization", `Bearer ${bearerToken}`)
      .expect(422);

    expect(res.body.status).toBe(false);
    expect(res.body.message).toBe(errorMock.message);
  });
});

describe("CREATE /api/v1/keuangan/week/report", () => {
  it("should return 200 status code and get finance report data for the week", async () => {
    const res = await request(app)
      .post("/api/v1/keuangan/week/report")
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${bearerToken}`)
      .send({
        tanggal: "2023-07-05T00:00:00.000Z",
      });
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe(true);
    expect(res.body.message).toBe("Successfully get all data");
    expect(res.body.data).toBeDefined();
  });

  it("should return the expected response when there is an error", async () => {
    const errorMock = new Error("Test error");
    jest
      .spyOn(keuanganService, "getAllDataReport")
      .mockRejectedValueOnce(errorMock);

    const res = await request(app)
      .post("/api/v1/keuangan/week/report")
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${bearerToken}`)
      .send({
        tanggal: "2023-07-05T00:00:00.000Z",
      })
      .expect(422);

    expect(res.body.status).toBe(false);
    expect(res.body.message).toBe(errorMock.message);
  });
});

describe("CREATE /api/v1/keuangan/month/report", () => {
  it("should return 200 status code and get finance report data for a month", async () => {
    const res = await request(app)
      .post("/api/v1/keuangan/month/report")
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${bearerToken}`)
      .send({
        tanggal: "2023-07-05T00:00:00.000Z",
      });
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe(true);
    expect(res.body.message).toBe("Successfully get all data");
    expect(res.body.data).toBeDefined();
  });

  it("should return the expected response when there is an error", async () => {
    const errorMock = new Error("Test error");
    jest
      .spyOn(keuanganService, "getAllDataReport")
      .mockRejectedValueOnce(errorMock);

    const res = await request(app)
      .post("/api/v1/keuangan/month/report")
      .set("Content-Type", "multipart/form-data")
      .set("Authorization", `Bearer ${bearerToken}`)
      .field({
        tanggal: "2023-07-05T00:00:00.000Z",
      })
      .expect(422);

    expect(res.body.status).toBe(false);
    expect(res.body.message).toBe(errorMock.message);
  });
});

describe("CREATE /api/v1/keuangan/year/report", () => {
  it("should return 200 status code and get finance report data for a year", async () => {
    const res = await request(app)
      .post("/api/v1/keuangan/year/report")
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${bearerToken}`)
      .send({
        tanggal: "2023-07-05T00:00:00.000Z",
      });
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe(true);
    expect(res.body.message).toBe("Successfully get all data");
    expect(res.body.data).toBeDefined();
  });

  it("should return the expected response when there is an error", async () => {
    const errorMock = new Error("Test error");
    jest
      .spyOn(keuanganService, "getAllDataReport")
      .mockRejectedValueOnce(errorMock);

    const res = await request(app)
      .post("/api/v1/keuangan/year/report")
      .set("Content-Type", "multipart/form-data")
      .set("Authorization", `Bearer ${bearerToken}`)
      .field({
        tanggal: "2023-07-05T00:00:00.000Z",
      })
      .expect(422);

    expect(res.body.status).toBe(false);
    expect(res.body.message).toBe(errorMock.message);
  });
});

describe("GET /api/v1/keuangan", () => {
  it("should return 200 status code and get all data keuangan", async () => {
    const res = await request(app).get("/api/v1/keuangan");

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe(true);
    expect(res.body.message).toBe("Successfully get all data");
    expect(res.body.data).toBeDefined();
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.pagination).toBeDefined();
    expect(res.body.metadata).toBeDefined();
  });
});

describe("GET /api/v1/keuangan/:id", () => {
  it("should return 200 status code and get data keuangan by id", async () => {
    const res = await request(app).get(`/api/v1/keuangan/${id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe(true);
    expect(res.body.message).toBe("Successfully get data by id");
    expect(res.body.data).toBeDefined();
  });

  it("should return 404 status code and data not found", async () => {
    const res = await request(app).get("/api/v1/keuangan/9999");
    expect(res.statusCode).toBe(404);
    expect(res.body.status).toBe(false);
    expect(res.body.message).toBe("Data not found");
  });

  it("should return the expected response when there is an error", async () => {
    const errorMock = new Error("Test error");
    jest.spyOn(keuanganService, "getById").mockRejectedValueOnce(errorMock);

    const res = await request(app).get(`/api/v1/keuangan/${id}`).expect(422);

    expect(res.body.status).toBe(false);
    expect(res.body.message).toBe(errorMock.message);
  });
});

describe("UPDATE /api/v1/keuangan/:id", () => {
  it("should return 200 status code and update data keuangan", async () => {
    const res = await request(app)
      .put(`/api/v1/keuangan/${id}`)
      .set("Content-Type", "multipart/form-data")
      .set("Authorization", `Bearer ${bearerToken}`)
      .field({
        tipe: "Pemasukan",
        judul: "ini judul keuangan (sudah update)",
        catatan: "Ini catatan keuangan (sudah update)",
        gambar: "Ini gambar keuangan (sudah update)",
        nominal: 80000,
        tanggal: "2023-07-06",
      });
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe(true);
    expect(res.body.message).toBe("Successfully update data");
    expect(res.body.data).toBeDefined();
  });

  it("should return 400 status code and got error message", async () => {
    const res = await request(app)
      .put(`/api/v1/keuangan/${id}`)
      .set("Content-Type", "multipart/form-data")
      .set("Authorization", `Bearer ${bearerToken}`)
      .field({
        tipe: "",
        judul: "ini judul keuangan (sudah update)",
        catatan: "Ini catatan keuangan (sudah update)",
        gambar: "Ini gambar keuangan (sudah update)",
        nominal: 80000,
        tanggal: "2023-07-06",
      });
    expect(res.statusCode).toBe(400);
    expect(res.body.status).toBe(false);
    expect(res.body.message).toBe("Please input the role correctly!");
  });

  it("should return 404 status code and data not found", async () => {
    const res = await request(app)
      .put("/api/v1/keuangan/9999")
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${bearerToken}`);
    expect(res.statusCode).toBe(404);
    expect(res.body.status).toBe(false);
    expect(res.body.message).toBe("Data not found");
  });

  it("should return the expected response when there is an error", async () => {
    const errorMock = new Error("Test error");
    jest.spyOn(keuanganService, "update").mockRejectedValueOnce(errorMock);

    const res = await request(app)
      .put(`/api/v1/keuangan/${id}`)
      .set("Content-Type", "multipart/form-data")
      .set("Authorization", `Bearer ${bearerToken}`)
      .field({
        tipe: "Pemasukan",
        judul: "ini judul keuangan (sudah update)",
        catatan: "Ini catatan keuangan (sudah update)",
        gambar: "Ini gambar keuangan (sudah update)",
        nominal: 80000,
        tanggal: "2023-07-06",
      })
      .expect(422);

    expect(res.body.status).toBe(false);
    expect(res.body.message).toBe(errorMock.message);
  });
});

describe("DELETE /api/v1/keuangan/:id", () => {
  it("should return the expected response when there is an error", async () => {
    const errorMock = new Error("Test error");
    jest.spyOn(keuanganService, "delete").mockRejectedValueOnce(errorMock);

    const res = await request(app)
      .delete(`/api/v1/keuangan/${id}`)
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${bearerToken}`)
      .expect(422);

    expect(res.body.status).toBe(false);
    expect(res.body.message).toBe(errorMock.message);
  });

  it("should return 200 status code and delete data keuangan", async () => {
    const res = await request(app)
      .delete(`/api/v1/keuangan/${id}`)
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${bearerToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe(true);
    expect(res.body.message).toBe("Successfully delete data");
  });

  it("should return 404 status code and data not found", async () => {
    const res = await request(app)
      .delete("/api/v1/keuangan/999")
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${bearerToken}`);
    expect(res.statusCode).toBe(404);
    expect(res.body.status).toBe(false);
    expect(res.body.message).toBe("Data not found");
  });
});

const { Keuangan } = require("../app/models");
const {
  getAll,
  getAllData,
  getAllDataReport,
  searchFinance,
  getById,
  create,
  update,
} = require("../app/services/keuanganService");

describe("getAll services", () => {
  it("should throw an error when an error occurs", () => {
    // Mock implementation of About.findAll() that throws an error
    Keuangan.findAll = jest.fn().mockImplementation(() => {
      throw new Error("Test error");
    });
    // Expect the function to throw an error
    expect(getAll).toThrow("Test error");
  });
});

describe("getAllData services", () => {
  it("should throw an error when an error occurs", () => {
    // Mock implementation of About.findAll() that throws an error
    Keuangan.findAll = jest.fn().mockImplementation(() => {
      throw new Error("Test error");
    });
    // Expect the function to throw an error
    expect(getAllData).toThrow("Test error");
  });
});

describe("getAllDataReport services", () => {
  it("should throw an error when an error occurs", () => {
    // Mock implementation of About.findAll() that throws an error
    Keuangan.findAll = jest.fn().mockImplementation(() => {
      throw new Error("Test error");
    });
    // Expect the function to throw an error
    expect(getAllDataReport).toThrow("Test error");
  });
});

describe("searchFinance services", () => {
  it("should throw an error when an error occurs", () => {
    // Mock implementation of About.findAll() that throws an error
    Keuangan.findAll = jest.fn().mockImplementation(() => {
      throw new Error("Test error");
    });
    // Expect the function to throw an error
    expect(searchFinance).toThrow("Test error");
  });
});

describe("getById services", () => {
  it("should throw an error when an error occurs", () => {
    // Mock implementation of About.findOne() that throws an error
    Keuangan.findOne = jest.fn().mockImplementation(() => {
      throw new Error("Test error");
    });
    // Expect the function to throw an error
    expect(getById).toThrow("Test error");
  });
});

describe("create services", () => {
  it("should throw an error when an error occurs", () => {
    // Mock implementation of About.create() that throws an error
    Keuangan.create = jest.fn().mockImplementation(() => {
      throw new Error("Test error");
    });
    // Expect the function to throw an error
    expect(create).toThrow("Test error");
  });
});

describe("update services", () => {
  it("should throw an error when an error occurs", () => {
    // Mock implementation of About.update() that throws an error
    Keuangan.update = jest.fn().mockImplementation(() => {
      throw new Error("Test error");
    });
    // Expect the function to throw an error
    expect(update).toThrow("Test error");
  });
});
