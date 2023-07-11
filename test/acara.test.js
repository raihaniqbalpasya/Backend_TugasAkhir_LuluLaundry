const request = require("supertest");
const app = require("../server");
const acaraService = require("../app/services/acaraService");
const id = 1;
const idCS = 2;
const idDN = 3;

beforeAll(async () => {
  const token = await request(app).post("/api/v1/admin/login").send({
    nama: "Nama Masteradmin",
    password: "admin123",
  });
  bearerToken = token.body.accessToken;

  return bearerToken;
});

describe("GET /api/v1/acara", () => {
  it("should return 404 status code and data empty message", async () => {
    const response = await request(app).get("/api/v1/acara");

    expect(response.status).toBe(404);
    expect(response.body.status).toBe(false);
    expect(response.body.message).toBe("Data empty, Please input some data!");
  });

  it("should return the expected response when there is an error", async () => {
    const errorMock = new Error("Test error");
    jest.spyOn(acaraService, "getAllData").mockRejectedValueOnce(errorMock);

    const res = await request(app).get("/api/v1/acara").expect(422);

    expect(res.body.status).toBe(false);
    expect(res.body.message).toBe(errorMock.message);
  });
});

describe("GET /api/v1/acara/search/active", () => {
  it("should return 404 status code and search data empty", async () => {
    const res = await request(app).get("/api/v1/acara/search/active");
    expect(res.statusCode).toBe(404);
    expect(res.body.status).toBe(false);
    expect(res.body.message).toBe("Data empty, Please input some data!");
  });
});

describe("GET /api/v1/acara/search/coming-soon", () => {
  it("should return 404 status code and search data not found", async () => {
    const res = await request(app)
      .get("/api/v1/acara/search/coming-soon")
      .set("Authorization", `Bearer ${bearerToken}`);
    expect(res.statusCode).toBe(404);
    expect(res.body.status).toBe(false);
    expect(res.body.message).toBe("Data empty, Please input some data!");
  });
});

describe("GET /api/v1/acara/search/done", () => {
  it("should return 404 status code and search data not found", async () => {
    const res = await request(app)
      .get("/api/v1/acara/search/done")
      .set("Authorization", `Bearer ${bearerToken}`);
    expect(res.statusCode).toBe(404);
    expect(res.body.status).toBe(false);
    expect(res.body.message).toBe("Data empty, Please input some data!");
  });
});

describe("CREATE /api/v1/acara", () => {
  it("should return 201 status code and create data acara", async () => {
    const res = await request(app)
      .post("/api/v1/acara")
      .set("Content-Type", "multipart/form-data")
      .set("Authorization", `Bearer ${bearerToken}`)
      .field({
        nama: "ini nama acara",
        deskripsi: "ini deskripsi acara",
        gambar: "ini gambar acara",
        kriteria: ["ini kriteria 1", "ini kriteria 2"],
        reward: ["ini reward 1", "ini reward 2"],
        tglMulai: "2023-06-20",
        tglSelesai: "2023-08-05",
      });
    expect(res.statusCode).toBe(201);
    expect(res.body.status).toBe(true);
    expect(res.body.message).toBe("Successfully create data");
    expect(res.body.data).toBeDefined();
  });

  it("should return 422 status code and got error message", async () => {
    const res = await request(app)
      .post("/api/v1/acara")
      .set("Content-Type", "multipart/form-data")
      .set("Authorization", `Bearer ${bearerToken}`)
      .field({
        nama: "ini nama acara",
        deskripsi: "ini deskripsi acara",
        gambar: "ini gambar acara",
        kriteria: ["ini kriteria 1", "ini kriteria 2"],
        reward: ["ini reward 1", "ini reward 2"],
        tglMulai: "2023-06-30",
        tglSelesai: "2023-08-05",
        status: "",
      });
    expect(res.statusCode).toBe(422);
    expect(res.body.status).toBe(false);
    expect(res.body.message).toBe("You can't change event status");
  });

  it("should return the expected response when there is an error", async () => {
    const errorMock = new Error("Test error");
    jest.spyOn(acaraService, "create").mockRejectedValueOnce(errorMock);

    const res = await request(app)
      .post("/api/v1/acara")
      .set("Content-Type", "multipart/form-data")
      .set("Authorization", `Bearer ${bearerToken}`)
      .field({
        nama: "ini nama acara",
        deskripsi: "ini deskripsi acara",
        gambar: "ini gambar acara",
        kriteria: ["ini kriteria 1", "ini kriteria 2"],
        reward: ["ini reward 1", "ini reward 2"],
        tglMulai: "2023-06-30",
        tglSelesai: "2023-08-05",
      })
      .expect(422);

    expect(res.body.status).toBe(false);
    expect(res.body.message).toBe(errorMock.message);
  });
});

describe("GET /api/v1/acara/search/active", () => {
  it("should return 200 status code and search active acara", async () => {
    const res = await request(app).get("/api/v1/acara/search/active");

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe(true);
    expect(res.body.message).toBe("Successfully get active event data");
    expect(res.body.data).toBeDefined();
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it("should return the expected response when there is an error", async () => {
    const errorMock = new Error("Test error");
    jest
      .spyOn(acaraService, "searchActiveEvent")
      .mockRejectedValueOnce(errorMock);

    const res = await request(app)
      .get("/api/v1/acara/search/active")
      .expect(422);

    expect(res.body.status).toBe(false);
    expect(res.body.message).toBe(errorMock.message);
  });
});

describe("GET /api/v1/acara/search/coming-soon", () => {
  beforeAll(async () => {
    await request(app)
      .post("/api/v1/acara")
      .set("Content-Type", "multipart/form-data")
      .set("Authorization", `Bearer ${bearerToken}`)
      .field({
        nama: "ini nama acara",
        deskripsi: "ini deskripsi acara",
        gambar: "ini gambar acara",
        tglMulai: "2023-08-05",
        tglSelesai: "2023-09-05",
      });
  });

  it("should return 200 status code and search upcoming acara", async () => {
    const res = await request(app)
      .get("/api/v1/acara/search/coming-soon")
      .set("Authorization", `Bearer ${bearerToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe(true);
    expect(res.body.message).toBe("Successfully get upcoming event data");
    expect(res.body.data).toBeDefined();
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it("should return the expected response when there is an error", async () => {
    const errorMock = new Error("Test error");
    jest
      .spyOn(acaraService, "searchUpcomingEvent")
      .mockRejectedValueOnce(errorMock);

    const res = await request(app)
      .get("/api/v1/acara/search/coming-soon")
      .set("Authorization", `Bearer ${bearerToken}`)
      .expect(422);

    expect(res.body.status).toBe(false);
    expect(res.body.message).toBe(errorMock.message);
  });

  afterAll(async () => {
    await request(app)
      .delete(`/api/v1/acara/${idCS}`)
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${bearerToken}`);
  });
});

describe("GET /api/v1/acara/search/done", () => {
  beforeAll(async () => {
    await request(app)
      .post("/api/v1/acara")
      .set("Content-Type", "multipart/form-data")
      .set("Authorization", `Bearer ${bearerToken}`)
      .field({
        nama: "ini nama acara",
        deskripsi: "ini deskripsi acara",
        gambar: "ini gambar acara",
        tglMulai: "2023-05-05",
        tglSelesai: "2023-06-05",
      });
  });

  it("should return 200 status code and search upcoming acara", async () => {
    const res = await request(app)
      .get("/api/v1/acara/search/done")
      .set("Authorization", `Bearer ${bearerToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe(true);
    expect(res.body.message).toBe(
      "Successfully get done and disabled event data"
    );
    expect(res.body.data).toBeDefined();
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it("should return the expected response when there is an error", async () => {
    const errorMock = new Error("Test error");
    jest
      .spyOn(acaraService, "searchDoneAndDisabledEvent")
      .mockRejectedValueOnce(errorMock);

    const res = await request(app)
      .get("/api/v1/acara/search/done")
      .set("Authorization", `Bearer ${bearerToken}`)
      .expect(422);

    expect(res.body.status).toBe(false);
    expect(res.body.message).toBe(errorMock.message);
  });

  afterAll(async () => {
    await request(app)
      .delete(`/api/v1/acara/${idDN}`)
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${bearerToken}`);
  });
});

describe("GET /api/v1/acara", () => {
  it("should return 200 status code and get all data acara", async () => {
    const res = await request(app).get("/api/v1/acara");

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe(true);
    expect(res.body.message).toBe("Successfully get all data");
    expect(res.body.data).toBeDefined();
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.pagination).toBeDefined();
    expect(res.body.metadata).toBeDefined();
  });
});

describe("GET /api/v1/acara/:id", () => {
  it("should return 200 status code and get data acara by id", async () => {
    const res = await request(app).get(`/api/v1/acara/${id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe(true);
    expect(res.body.message).toBe("Successfully get data by id");
    expect(res.body.data).toBeDefined();
  });

  it("should return 404 status code and data not found", async () => {
    const res = await request(app).get("/api/v1/acara/9999");
    expect(res.statusCode).toBe(404);
    expect(res.body.status).toBe(false);
    expect(res.body.message).toBe("Data not found");
  });

  it("should return the expected response when there is an error", async () => {
    const errorMock = new Error("Test error");
    jest.spyOn(acaraService, "getById").mockRejectedValueOnce(errorMock);

    const res = await request(app).get(`/api/v1/acara/${id}`).expect(422);

    expect(res.body.status).toBe(false);
    expect(res.body.message).toBe(errorMock.message);
  });
});

describe("UPDATE /api/v1/acara/update-status/:id", () => {
  it("should return 200 status code and update status acara to Nonaktif", async () => {
    const res = await request(app)
      .put(`/api/v1/acara/update-status/${id}`)
      .set("Content-Type", "multipart/form-data")
      .set("Authorization", `Bearer ${bearerToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe(true);
    expect(res.body.message).toBe("Successfully update data");
  });

  it("should return 200 status code and return status acara", async () => {
    const res = await request(app)
      .put(`/api/v1/acara/update-status/${id}`)
      .set("Content-Type", "multipart/form-data")
      .set("Authorization", `Bearer ${bearerToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe(true);
    expect(res.body.message).toBe("Successfully update data");
  });

  it("should return the expected response when there is an error", async () => {
    const errorMock = new Error("Test error");
    jest.spyOn(acaraService, "update").mockRejectedValueOnce(errorMock);

    const res = await request(app)
      .put(`/api/v1/acara/update-status/${id}`)
      .set("Content-Type", "multipart/form-data")
      .set("Authorization", `Bearer ${bearerToken}`)
      .expect(422);

    expect(res.body.status).toBe(false);
    expect(res.body.message).toBe(errorMock.message);
  });
});

describe("UPDATE /api/v1/acara/:id", () => {
  it("should return 200 status code and update data acara", async () => {
    const res = await request(app)
      .put(`/api/v1/acara/${id}`)
      .set("Content-Type", "multipart/form-data")
      .set("Authorization", `Bearer ${bearerToken}`)
      .field({
        nama: "ini nama acara (sudah update)",
        deskripsi: "Ini deskripsi acara (sudah update)",
        gambar: "Ini gambar acara (sudah update)",
        kriteria: [
          "ini kriteria (sudah update)",
          "ini kriteria 2 (sudah update)",
        ],
        reward: ["ini reward 1 (sudah update)", "ini reward 2 (sudah update)"],
        tglMulai: "2023-06-29",
        tglSelesai: "2023-08-06",
      });
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe(true);
    expect(res.body.message).toBe("Successfully update data");
    expect(res.body.data).toBeDefined();
  });

  it("should return 422 status code and got error message", async () => {
    const res = await request(app)
      .put(`/api/v1/acara/${id}`)
      .set("Content-Type", "multipart/form-data")
      .set("Authorization", `Bearer ${bearerToken}`)
      .field({
        nama: "ini nama acara (sudah update)",
        deskripsi: "Ini deskripsi acara (sudah update)",
        gambar: "Ini gambar acara (sudah update)",
        kriteria: [
          "ini kriteria (sudah update)",
          "ini kriteria 2 (sudah update)",
        ],
        reward: ["ini reward 1 (sudah update)", "ini reward 2 (sudah update)"],
        tglMulai: "2023-06-29",
        tglSelesai: "2023-08-06",
        status: "",
      });
    expect(res.statusCode).toBe(422);
    expect(res.body.status).toBe(false);
    expect(res.body.message).toBe("You can't change event status");
  });

  it("should return 404 status code and data not found", async () => {
    const res = await request(app)
      .put("/api/v1/acara/9999")
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${bearerToken}`);
    expect(res.statusCode).toBe(404);
    expect(res.body.status).toBe(false);
    expect(res.body.message).toBe("Data not found");
  });

  it("should return the expected response when there is an error", async () => {
    const errorMock = new Error("Test error");
    jest.spyOn(acaraService, "update").mockRejectedValueOnce(errorMock);

    const res = await request(app)
      .put(`/api/v1/acara/${id}`)
      .set("Content-Type", "multipart/form-data")
      .set("Authorization", `Bearer ${bearerToken}`)
      .field({
        nama: "ini nama acara (sudah update)",
        deskripsi: "Ini deskripsi acara (sudah update)",
        gambar: "Ini gambar acara (sudah update)",
        kriteria: [
          "ini kriteria (sudah update)",
          "ini kriteria 2 (sudah update)",
        ],
        reward: ["ini reward 1 (sudah update)", "ini reward 2 (sudah update)"],
        tglMulai: "2023-06-29",
        tglSelesai: "2023-08-06",
      })
      .expect(422);

    expect(res.body.status).toBe(false);
    expect(res.body.message).toBe(errorMock.message);
  });
});

describe("DELETE /api/v1/acara/:id", () => {
  it("should return the expected response when there is an error", async () => {
    const errorMock = new Error("Test error");
    jest.spyOn(acaraService, "delete").mockRejectedValueOnce(errorMock);

    const res = await request(app)
      .delete(`/api/v1/acara/${id}`)
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${bearerToken}`)
      .expect(422);

    expect(res.body.status).toBe(false);
    expect(res.body.message).toBe(errorMock.message);
  });

  it("should return 200 status code and delete data acara", async () => {
    const res = await request(app)
      .delete(`/api/v1/acara/${id}`)
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${bearerToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe(true);
    expect(res.body.message).toBe("Successfully delete data");
  });

  it("should return 404 status code and data not found", async () => {
    const res = await request(app)
      .delete("/api/v1/acara/999")
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${bearerToken}`);
    expect(res.statusCode).toBe(404);
    expect(res.body.status).toBe(false);
    expect(res.body.message).toBe("Data not found");
  });
});

const { Acara } = require("../app/models");
const {
  getAll,
  getAllData,
  getById,
  create,
  update,
  searchActiveEvent,
  searchUpcomingEvent,
  searchDoneAndDisabledEvent,
  updateUpcomingStatus,
  updateActiveStatus,
  updateDoneStatus,
} = require("../app/services/acaraService");

describe("getAll services", () => {
  it("should throw an error when an error occurs", () => {
    // Mock implementation of About.findAll() that throws an error
    Acara.findAll = jest.fn().mockImplementation(() => {
      throw new Error("Test error");
    });
    // Expect the function to throw an error
    expect(getAll).toThrow("Test error");
  });
});

describe("getAllData services", () => {
  it("should throw an error when an error occurs", () => {
    // Mock implementation of About.findAll() that throws an error
    Acara.findAll = jest.fn().mockImplementation(() => {
      throw new Error("Test error");
    });
    // Expect the function to throw an error
    expect(getAllData).toThrow("Test error");
  });
});

describe("searchActiveEvent services", () => {
  it("should throw an error when an error occurs", () => {
    // Mock implementation of About.findAll() that throws an error
    Acara.findAll = jest.fn().mockImplementation(() => {
      throw new Error("Test error");
    });
    // Expect the function to throw an error
    expect(searchActiveEvent).toThrow("Test error");
  });
});

describe("searchUpcomingEvent services", () => {
  it("should throw an error when an error occurs", () => {
    // Mock implementation of About.findAll() that throws an error
    Acara.findAll = jest.fn().mockImplementation(() => {
      throw new Error("Test error");
    });
    // Expect the function to throw an error
    expect(searchUpcomingEvent).toThrow("Test error");
  });
});

describe("searchDoneAndDisabledEvent services", () => {
  it("should throw an error when an error occurs", () => {
    // Mock implementation of About.findAll() that throws an error
    Acara.findAll = jest.fn().mockImplementation(() => {
      throw new Error("Test error");
    });
    // Expect the function to throw an error
    expect(searchDoneAndDisabledEvent).toThrow("Test error");
  });
});

describe("getById services", () => {
  it("should throw an error when an error occurs", () => {
    // Mock implementation of About.findOne() that throws an error
    Acara.findOne = jest.fn().mockImplementation(() => {
      throw new Error("Test error");
    });
    // Expect the function to throw an error
    expect(getById).toThrow("Test error");
  });
});

describe("create services", () => {
  it("should throw an error when an error occurs", () => {
    // Mock implementation of About.create() that throws an error
    Acara.create = jest.fn().mockImplementation(() => {
      throw new Error("Test error");
    });
    // Expect the function to throw an error
    expect(create).toThrow("Test error");
  });
});

describe("update services", () => {
  it("should throw an error when an error occurs", () => {
    // Mock implementation of About.update() that throws an error
    Acara.update = jest.fn().mockImplementation(() => {
      throw new Error("Test error");
    });
    // Expect the function to throw an error
    expect(update).toThrow("Test error");
  });
});

describe("updateUpcomingStatus services", () => {
  it("should throw an error when an error occurs", () => {
    // Mock implementation of About.update() that throws an error
    Acara.update = jest.fn().mockImplementation(() => {
      throw new Error("Test error");
    });
    // Expect the function to throw an error
    expect(updateUpcomingStatus).toThrow("Test error");
  });
});

describe("updateActiveStatus services", () => {
  it("should throw an error when an error occurs", () => {
    // Mock implementation of About.update() that throws an error
    Acara.update = jest.fn().mockImplementation(() => {
      throw new Error("Test error");
    });
    // Expect the function to throw an error
    expect(updateActiveStatus).toThrow("Test error");
  });
});

describe("updateDoneStatus services", () => {
  it("should throw an error when an error occurs", () => {
    // Mock implementation of About.update() that throws an error
    Acara.update = jest.fn().mockImplementation(() => {
      throw new Error("Test error");
    });
    // Expect the function to throw an error
    expect(updateDoneStatus).toThrow("Test error");
  });
});
