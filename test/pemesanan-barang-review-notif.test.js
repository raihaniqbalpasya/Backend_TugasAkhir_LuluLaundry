const request = require("supertest");
const app = require("../server");
const reviewService = require("../app/services/reviewService");
const barangService = require("../app/services/barangService");
const notifService = require("../app/services/notifService");
const pemesananService = require("../app/services/pemesananService");
const idR = 1;
const idBA = 1;
const idBU = 2;
const idN = 1;
const idN2 = 2;
const idP1 = 1;
const idP2 = 2;

beforeAll(async () => {
  const token = await request(app).post("/api/v1/admin/login").send({
    nama: "Nama Masteradmin",
    password: "admin123",
  });
  bearerToken = token.body.accessToken;

  return bearerToken;
});

beforeAll(async () => {
  const token = await request(app).post("/api/v1/user/login").send({
    noTelp: "6281234567890",
    password: "coba123",
  });
  userBearerToken = token.body.accessToken;

  return userBearerToken;
});

describe("GET /api/v1/pemesanan", () => {
  it("should return 404 status code and data empty message", async () => {
    const response = await request(app).get("/api/v1/pemesanan");

    expect(response.status).toBe(404);
    expect(response.body.status).toBe(false);
    expect(response.body.message).toBe("Data empty, Please input some data!");
  });

  it("should return the expected response when there is an error", async () => {
    const errorMock = new Error("Test error");
    jest.spyOn(pemesananService, "getAllData").mockRejectedValueOnce(errorMock);

    const res = await request(app).get("/api/v1/pemesanan").expect(422);

    expect(res.body.status).toBe(false);
    expect(res.body.message).toBe(errorMock.message);
  });
});

describe("GET /api/v1/pemesanan/where/status?query=value", () => {
  it("should return 404 status code and data empty message", async () => {
    const response = await request(app)
      .get("/api/v1/pemesanan/where/status?status=Perlu Disetujui")
      .set("Content-Type", "multipart/form-data")
      .set("Authorization", `Bearer ${bearerToken}`);

    expect(response.status).toBe(404);
    expect(response.body.status).toBe(false);
    expect(response.body.message).toBe("Data empty, Please input some data!");
  });

  it("should return the expected response when there is an error", async () => {
    const errorMock = new Error("Test error");
    jest
      .spyOn(pemesananService, "getAllDataByStatus")
      .mockRejectedValueOnce(errorMock);

    const res = await request(app)
      .get("/api/v1/pemesanan/where/status?status=Perlu Disetujui")
      .set("Content-Type", "multipart/form-data")
      .set("Authorization", `Bearer ${bearerToken}`)
      .expect(422);

    expect(res.body.status).toBe(false);
    expect(res.body.message).toBe(errorMock.message);
  });
});

describe("GET /api/v1/pemesanan/user/all", () => {
  it("should return 404 status code and data empty message", async () => {
    const response = await request(app)
      .get("/api/v1/pemesanan/user/all")
      .set("Content-Type", "multipart/form-data")
      .set("Authorization", `Bearer ${userBearerToken}`);

    expect(response.status).toBe(404);
    expect(response.body.status).toBe(false);
    expect(response.body.message).toBe("Data empty, Please input some data!");
  });

  it("should return the expected response when there is an error", async () => {
    const errorMock = new Error("Test error");
    jest
      .spyOn(pemesananService, "getAllByUserIdAndStatusNoPag")
      .mockRejectedValueOnce(errorMock);

    const res = await request(app)
      .get("/api/v1/pemesanan/user/all")
      .set("Content-Type", "multipart/form-data")
      .set("Authorization", `Bearer ${userBearerToken}`)
      .expect(422);

    expect(res.body.status).toBe(false);
    expect(res.body.message).toBe(errorMock.message);
  });
});

// ----------------------- testing get notifikasi before create -----------------------
describe("GET /api/v1/notifikasi", () => {
  it("should return 404 status code and data empty message", async () => {
    const response = await request(app).get("/api/v1/notifikasi");

    expect(response.status).toBe(404);
    expect(response.body.status).toBe(false);
    expect(response.body.message).toBe("Data empty, Please input some data!");
  });

  it("should return the expected response when there is an error", async () => {
    const errorMock = new Error("Test error");
    jest.spyOn(notifService, "getAllData").mockRejectedValueOnce(errorMock);

    const res = await request(app).get("/api/v1/notifikasi").expect(422);

    expect(res.body.status).toBe(false);
    expect(res.body.message).toBe(errorMock.message);
  });
});

describe("GET /api/v1/notifikasi/all/user", () => {
  it("should return 404 status code and data empty message", async () => {
    const response = await request(app)
      .get("/api/v1/notifikasi/all/user")
      .set("Authorization", `Bearer ${userBearerToken}`);

    expect(response.status).toBe(404);
    expect(response.body.status).toBe(false);
    expect(response.body.message).toBe("Data empty, Please input some data!");
  });

  it("should return the expected response when there is an error", async () => {
    const errorMock = new Error("Test error");
    jest
      .spyOn(notifService, "getAllByUserIdNoPag")
      .mockRejectedValueOnce(errorMock);

    const res = await request(app)
      .get("/api/v1/notifikasi/all/user")
      .set("Authorization", `Bearer ${userBearerToken}`)
      .expect(422);

    expect(res.body.status).toBe(false);
    expect(res.body.message).toBe(errorMock.message);
  });
});

describe("GET /api/v1/notifikasi/all/admin", () => {
  it("should return 404 status code and data empty message", async () => {
    const response = await request(app)
      .get("/api/v1/notifikasi/all/admin")
      .set("Authorization", `Bearer ${bearerToken}`);

    expect(response.status).toBe(404);
    expect(response.body.status).toBe(false);
    expect(response.body.message).toBe("Data empty, Please input some data!");
  });

  it("should return the expected response when there is an error", async () => {
    const errorMock = new Error("Test error");
    jest
      .spyOn(notifService, "getAllByAdminNoPag")
      .mockRejectedValueOnce(errorMock);

    const res = await request(app)
      .get("/api/v1/notifikasi/all/admin")
      .set("Authorization", `Bearer ${bearerToken}`)
      .expect(422);

    expect(res.body.status).toBe(false);
    expect(res.body.message).toBe(errorMock.message);
  });
});

describe("UPDATE /api/v1/notifikasi/all/admin", () => {
  it("should return 404 status code and data not found", async () => {
    const res = await request(app)
      .put("/api/v1/notifikasi/all/admin")
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${bearerToken}`);
    expect(res.statusCode).toBe(404);
    expect(res.body.status).toBe(false);
    expect(res.body.message).toBe("Data empty, Please input some data!");
  });
});

describe("UPDATE /api/v1/notifikasi/all/user", () => {
  it("should return 404 status code and data not found", async () => {
    const res = await request(app)
      .put("/api/v1/notifikasi/all/user")
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${userBearerToken}`);
    expect(res.statusCode).toBe(404);
    expect(res.body.status).toBe(false);
    expect(res.body.message).toBe("Data empty, Please input some data!");
  });
});
// -------------------------------------------------------------------------------------

describe("CREATE /api/v1/pemesanan/user", () => {
  it("should return 201 status code and create data pemesanan by user", async () => {
    const res = await request(app)
      .post("/api/v1/pemesanan/user")
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${userBearerToken}`)
      .send({
        jenisLayanan: [1, 0, 0],
        mPembayaran: "ini metode pembayaran",
        tglMulai: "2023-06-23T06:00:00.000Z",
      });
    expect(res.statusCode).toBe(201);
    expect(res.body.status).toBe(true);
    expect(res.body.message).toBe("Successfully create data");
    expect(res.body.data).toBeDefined();
  });

  it("should return the expected response when there is an error", async () => {
    const errorMock = new Error("Test error");
    jest
      .spyOn(pemesananService, "createByUser")
      .mockRejectedValueOnce(errorMock);

    const res = await request(app)
      .post("/api/v1/pemesanan/user")
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${userBearerToken}`)
      .send({
        jenisLayanan: [1, 0, 0],
        mPembayaran: "ini metode pembayaran",
        tglMulai: "2023-06-23T06:00:00.000Z",
      })
      .expect(422);

    expect(res.body.status).toBe(false);
    expect(res.body.message).toBe(errorMock.message);
  });
});

// ----------------------------- testing bagian notif by admin -----------------------------------
describe("GET /api/v1/notifikasi", () => {
  it("should return 200 status code and get all data notifikasi", async () => {
    const res = await request(app).get("/api/v1/notifikasi");

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe(true);
    expect(res.body.message).toBe("Successfully get all data");
    expect(res.body.data).toBeDefined();
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.pagination).toBeDefined();
    expect(res.body.metadata).toBeDefined();
  });
});

describe("GET /api/v1/notifikasi/all/admin", () => {
  it("should return 200 status code and get all data notifikasi", async () => {
    const res = await request(app)
      .get("/api/v1/notifikasi/all/admin")
      .set("Authorization", `Bearer ${bearerToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe(true);
    expect(res.body.message).toBe("Successfully get all data");
    expect(res.body.data).toBeDefined();
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.pagination).toBeDefined();
    expect(res.body.metadata).toBeDefined();
    expect(res.body.otherData).toBeDefined();
  });
});

describe("GET /api/v1/notifikasi/:id", () => {
  it("should return 200 status code and get data notifikasi by id", async () => {
    const res = await request(app).get(`/api/v1/notifikasi/${idN}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe(true);
    expect(res.body.message).toBe("Successfully get data by id");
    expect(res.body.data).toBeDefined();
  });

  it("should return 404 status code and data not found", async () => {
    const res = await request(app).get("/api/v1/notifikasi/9999");
    expect(res.statusCode).toBe(404);
    expect(res.body.status).toBe(false);
    expect(res.body.message).toBe("Data not found");
  });

  it("should return the expected response when there is an error", async () => {
    const errorMock = new Error("Test error");
    jest.spyOn(notifService, "getById").mockRejectedValueOnce(errorMock);

    const res = await request(app).get(`/api/v1/notifikasi/${idN}`).expect(422);

    expect(res.body.status).toBe(false);
    expect(res.body.message).toBe(errorMock.message);
  });
});

describe("UPDATE /api/v1/notifikasi/admin/:id", () => {
  it("should return 200 status code and update data notifikasi", async () => {
    const res = await request(app)
      .put(`/api/v1/notifikasi/admin/${idN}`)
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${bearerToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe(true);
    expect(res.body.message).toBe("Successfully update data");
    expect(res.body.data).toBeDefined();
  });

  it("should return 200 status code and update data notifikasi again", async () => {
    const res = await request(app)
      .put(`/api/v1/notifikasi/admin/${idN}`)
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${bearerToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe(true);
    expect(res.body.message).toBe("Notification has been read!");
    expect(res.body.data).toBeDefined();
  });

  it("should return 404 status code and data not found", async () => {
    const res = await request(app)
      .put("/api/v1/notifikasi/admin/9999")
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${bearerToken}`);
    expect(res.statusCode).toBe(404);
    expect(res.body.status).toBe(false);
    expect(res.body.message).toBe("Data not found");
  });

  it("should return the expected response when there is an error", async () => {
    const errorMock = new Error("Test error");
    jest.spyOn(notifService, "update").mockRejectedValueOnce(errorMock);

    const res = await request(app)
      .put(`/api/v1/notifikasi/admin/${idN}`)
      .set("Content-Type", "multipart/form-data")
      .set("Authorization", `Bearer ${bearerToken}`)
      .expect(422);

    expect(res.body.status).toBe(false);
    expect(res.body.message).toBe(errorMock.message);
  });
});

describe("UPDATE /api/v1/notifikasi/all/admin", () => {
  it("should return 200 status code and update data notifikasi", async () => {
    const res = await request(app)
      .put(`/api/v1/notifikasi/all/admin`)
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${bearerToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe(true);
    expect(res.body.message).toBe("Successfully update all data");
    expect(res.body.data).toBeDefined();
  });

  it("should return the expected response when there is an error", async () => {
    const errorMock = new Error("Test error");
    jest.spyOn(notifService, "readAllByAdmin").mockRejectedValueOnce(errorMock);

    const res = await request(app)
      .put(`/api/v1/notifikasi/all/admin`)
      .set("Content-Type", "multipart/form-data")
      .set("Authorization", `Bearer ${bearerToken}`)
      .expect(422);

    expect(res.body.status).toBe(false);
    expect(res.body.message).toBe(errorMock.message);
  });
});

describe("DELETE /api/v1/notifikasi/:id", () => {
  it("should return the expected response when there is an error", async () => {
    const errorMock = new Error("Test error");
    jest.spyOn(notifService, "delete").mockRejectedValueOnce(errorMock);

    const res = await request(app)
      .delete(`/api/v1/notifikasi/${idN}`)
      .expect(422);

    expect(res.body.status).toBe(false);
    expect(res.body.message).toBe(errorMock.message);
  });

  it("should return 200 status code and delete data notifikasi", async () => {
    const res = await request(app).delete(`/api/v1/notifikasi/${idN}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe(true);
    expect(res.body.message).toBe("Successfully delete data");
  });

  it("should return 404 status code and data not found", async () => {
    const res = await request(app).delete("/api/v1/notifikasi/999");
    expect(res.statusCode).toBe(404);
    expect(res.body.status).toBe(false);
    expect(res.body.message).toBe("Data not found");
  });
});
// -------------------------------------------------------------------------------------------------

// ------------------------------------- testing bagian review -------------------------------------
describe("GET /api/v1/review", () => {
  it("should return 404 status code and data empty message", async () => {
    const response = await request(app).get("/api/v1/review");

    expect(response.status).toBe(404);
    expect(response.body.status).toBe(false);
    expect(response.body.message).toBe("Data empty, Please input some data!");
  });

  it("should return the expected response when there is an error", async () => {
    const errorMock = new Error("Test error");
    jest.spyOn(reviewService, "getAllData").mockRejectedValueOnce(errorMock);

    const res = await request(app).get("/api/v1/review").expect(422);

    expect(res.body.status).toBe(false);
    expect(res.body.message).toBe(errorMock.message);
  });
});

describe("CREATE /api/v1/review", () => {
  it("should return 201 status code and create data review", async () => {
    const res = await request(app)
      .post("/api/v1/review")
      .set("Content-Type", "multipart/form-data")
      .set("Authorization", `Bearer ${userBearerToken}`)
      .field({
        rating: 3.5,
        review: "ini review",
        gambar: "ini gambar review",
        pemesananId: `${idP1}`,
      });
    expect(res.statusCode).toBe(201);
    expect(res.body.status).toBe(true);
    expect(res.body.message).toBe("Successfully create data");
    expect(res.body.data).toBeDefined();
  });

  it("should return 422 status code and got error message", async () => {
    const res = await request(app)
      .post("/api/v1/review")
      .set("Content-Type", "multipart/form-data")
      .set("Authorization", `Bearer ${userBearerToken}`)
      .field({
        rating: 5.3,
        review: "ini review",
        gambar: "ini gambar review",
        pemesananId: `${idP1}`,
      });
    expect(res.statusCode).toBe(422);
    expect(res.body.status).toBe(false);
    expect(res.body.message).toBe("Rating must be between 0 and 5");
  });

  it("should return the expected response when there is an error", async () => {
    const errorMock = new Error("Test error");
    jest.spyOn(reviewService, "create").mockRejectedValueOnce(errorMock);

    const res = await request(app)
      .post("/api/v1/review")
      .set("Content-Type", "multipart/form-data")
      .set("Authorization", `Bearer ${userBearerToken}`)
      .field({
        rating: 3.5,
        review: "ini review",
        gambar: "ini gambar review",
        pemesananId: `${idP1}`,
      })
      .expect(422);

    expect(res.body.status).toBe(false);
    expect(res.body.message).toBe(errorMock.message);
  });
});

describe("GET /api/v1/review", () => {
  it("should return 200 status code and get all data review", async () => {
    const res = await request(app).get("/api/v1/review");

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe(true);
    expect(res.body.message).toBe("Successfully get all data");
    expect(res.body.data).toBeDefined();
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.pagination).toBeDefined();
    expect(res.body.metadata).toBeDefined();
  });
});

describe("GET /api/v1/review/:id", () => {
  it("should return 200 status code and get data review by id", async () => {
    const res = await request(app).get(`/api/v1/review/${idR}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe(true);
    expect(res.body.message).toBe("Successfully get data by id");
    expect(res.body.data).toBeDefined();
  });

  it("should return 404 status code and data not found", async () => {
    const res = await request(app).get("/api/v1/review/9999");
    expect(res.statusCode).toBe(404);
    expect(res.body.status).toBe(false);
    expect(res.body.message).toBe("Data not found");
  });

  it("should return the expected response when there is an error", async () => {
    const errorMock = new Error("Test error");
    jest.spyOn(reviewService, "getById").mockRejectedValueOnce(errorMock);

    const res = await request(app).get(`/api/v1/review/${idR}`).expect(422);

    expect(res.body.status).toBe(false);
    expect(res.body.message).toBe(errorMock.message);
  });
});

describe("GET /api/v1/review/pemesanan/:pemesananId", () => {
  it("should return 200 status code and get data review by pemesananId", async () => {
    const res = await request(app).get(`/api/v1/review/pemesanan/${idP1}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe(true);
    expect(res.body.message).toBe("Successfully get data by pemesananId");
    expect(res.body.data).toBeDefined();
  });

  it("should return 404 status code and data not found", async () => {
    const res = await request(app).get("/api/v1/review/pemesanan/9999");
    expect(res.statusCode).toBe(404);
    expect(res.body.status).toBe(false);
    expect(res.body.message).toBe("Data not found");
  });

  it("should return the expected response when there is an error", async () => {
    const errorMock = new Error("Test error");
    jest
      .spyOn(reviewService, "getByPemesananId")
      .mockRejectedValueOnce(errorMock);

    const res = await request(app)
      .get(`/api/v1/review/pemesanan/${idP1}`)
      .expect(422);

    expect(res.body.status).toBe(false);
    expect(res.body.message).toBe(errorMock.message);
  });
});

describe("UPDATE /api/v1/review/:id", () => {
  it("should return 200 status code and update data review", async () => {
    const res = await request(app)
      .put(`/api/v1/review/${idR}`)
      .set("Content-Type", "multipart/form-data")
      .set("Authorization", `Bearer ${userBearerToken}`)
      .field({
        rating: 3.7,
        review: "ini review (sudah update)",
        gambar: "ini gambar review (sudah update)",
        pemesananId: `${idP1}`,
      });
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe(true);
    expect(res.body.message).toBe("Successfully update data");
    expect(res.body.data).toBeDefined();
  });

  it("should return 422 status code and got error message", async () => {
    const res = await request(app)
      .put(`/api/v1/review/${idR}`)
      .set("Content-Type", "multipart/form-data")
      .set("Authorization", `Bearer ${userBearerToken}`)
      .field({
        rating: 7.3,
        review: "ini review (sudah update)",
        gambar: "ini gambar review (sudah update)",
        pemesananId: `${idP1}`,
      });
    expect(res.statusCode).toBe(422);
    expect(res.body.status).toBe(false);
    expect(res.body.message).toBe("Rating must be between 0 and 5");
  });

  it("should return 404 status code and data not found", async () => {
    const res = await request(app)
      .put("/api/v1/review/9999")
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${userBearerToken}`);
    expect(res.statusCode).toBe(404);
    expect(res.body.status).toBe(false);
    expect(res.body.message).toBe("Data not found");
  });

  it("should return the expected response when there is an error", async () => {
    const errorMock = new Error("Test error");
    jest.spyOn(reviewService, "update").mockRejectedValueOnce(errorMock);

    const res = await request(app)
      .put(`/api/v1/review/${idR}`)
      .set("Content-Type", "multipart/form-data")
      .set("Authorization", `Bearer ${userBearerToken}`)
      .field({
        rating: 3.7,
        review: "ini review (sudah update)",
        gambar: "ini gambar review (sudah update)",
        pemesananId: `${idP1}`,
      })
      .expect(422);

    expect(res.body.status).toBe(false);
    expect(res.body.message).toBe(errorMock.message);
  });
});

describe("DELETE /api/v1/review/:id", () => {
  it("should return the expected response when there is an error", async () => {
    const errorMock = new Error("Test error");
    jest.spyOn(reviewService, "delete").mockRejectedValueOnce(errorMock);

    const res = await request(app)
      .delete(`/api/v1/review/${idR}`)
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${userBearerToken}`)
      .expect(422);

    expect(res.body.status).toBe(false);
    expect(res.body.message).toBe(errorMock.message);
  });

  it("should return 200 status code and delete data review", async () => {
    const res = await request(app)
      .delete(`/api/v1/review/${idR}`)
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${userBearerToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe(true);
    expect(res.body.message).toBe("Successfully delete data");
  });

  it("should return 404 status code and data not found", async () => {
    const res = await request(app)
      .delete("/api/v1/review/999")
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${userBearerToken}`);
    expect(res.statusCode).toBe(404);
    expect(res.body.status).toBe(false);
    expect(res.body.message).toBe("Data not found");
  });
});
// --------------------------------------------------------------------------------------------

// -------------------------- testing bagian barang by admin ----------------------------------
describe("GET /api/v1/barang", () => {
  it("should return 404 status code and data empty message", async () => {
    const response = await request(app).get("/api/v1/barang");

    expect(response.status).toBe(404);
    expect(response.body.status).toBe(false);
    expect(response.body.message).toBe("Data empty, Please input some data!");
  });

  it("should return the expected response when there is an error", async () => {
    const errorMock = new Error("Test error");
    jest.spyOn(barangService, "getAllData").mockRejectedValueOnce(errorMock);

    const res = await request(app).get("/api/v1/barang").expect(422);

    expect(res.body.status).toBe(false);
    expect(res.body.message).toBe(errorMock.message);
  });
});

describe("CREATE /api/v1/barang", () => {
  it("should return 201 status code and create data barang", async () => {
    const res = await request(app)
      .post("/api/v1/barang")
      .set("Content-Type", "multipart/form-data")
      .set("Authorization", `Bearer ${bearerToken}`)
      .field({
        harga: 10000,
        kuantitas: 10,
        gambar: "ini gambar barang",
        pemesananId: `${idP1}`,
      });
    expect(res.statusCode).toBe(201);
    expect(res.body.status).toBe(true);
    expect(res.body.message).toBe("Successfully create data");
    expect(res.body.data).toBeDefined();
  });

  it("should return 422 status code and got error message", async () => {
    const res = await request(app)
      .post("/api/v1/barang")
      .set("Content-Type", "multipart/form-data")
      .set("Authorization", `Bearer ${bearerToken}`)
      .field({
        harga: -1,
        gambar: "ini gambar barang",
        pemesananId: `${idP1}`,
      });
    expect(res.statusCode).toBe(422);
    expect(res.body.status).toBe(false);
    expect(res.body.message).toBe(
      "Harga atau kuantitas tidak boleh kurang dari 0"
    );
  });

  it("should return the expected response when there is an error", async () => {
    const errorMock = new Error("Test error");
    jest.spyOn(barangService, "create").mockRejectedValueOnce(errorMock);

    const res = await request(app)
      .post("/api/v1/barang")
      .set("Content-Type", "multipart/form-data")
      .set("Authorization", `Bearer ${bearerToken}`)
      .field({
        gambar: "ini gambar barang",
        pemesananId: `${idP1}`,
      })
      .expect(422);

    expect(res.body.status).toBe(false);
    expect(res.body.message).toBe(errorMock.message);
  });
});

describe("GET /api/v1/barang", () => {
  it("should return 200 status code and get all data barang", async () => {
    const res = await request(app).get("/api/v1/barang");

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe(true);
    expect(res.body.message).toBe("Successfully get all data");
    expect(res.body.data).toBeDefined();
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.pagination).toBeDefined();
    expect(res.body.metadata).toBeDefined();
  });
});

describe("GET /api/v1/barang/:id", () => {
  it("should return 200 status code and get data barang by id", async () => {
    const res = await request(app).get(`/api/v1/barang/${idBA}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe(true);
    expect(res.body.message).toBe("Successfully get data by id");
    expect(res.body.data).toBeDefined();
  });

  it("should return 404 status code and data not found", async () => {
    const res = await request(app).get("/api/v1/barang/9999");
    expect(res.statusCode).toBe(404);
    expect(res.body.status).toBe(false);
    expect(res.body.message).toBe("Data not found");
  });

  it("should return the expected response when there is an error", async () => {
    const errorMock = new Error("Test error");
    jest.spyOn(barangService, "getById").mockRejectedValueOnce(errorMock);

    const res = await request(app).get(`/api/v1/barang/${idBA}`).expect(422);

    expect(res.body.status).toBe(false);
    expect(res.body.message).toBe(errorMock.message);
  });
});

describe("GET /api/v1/barang/pemesananId/:pemesananId", () => {
  it("should return 200 status code and get data barang by pemesananId", async () => {
    const res = await request(app)
      .get(`/api/v1/barang/pemesananId/${idP1}`)
      .set("Authorization", `Bearer ${bearerToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe(true);
    expect(res.body.message).toBe("Successfully get data by id");
    expect(res.body.data).toBeDefined();
  });

  it("should return 404 status code and data not found", async () => {
    const res = await request(app)
      .get("/api/v1/barang/pemesananId/9999")
      .set("Authorization", `Bearer ${bearerToken}`);
    expect(res.statusCode).toBe(404);
    expect(res.body.status).toBe(false);
    expect(res.body.message).toBe("Data not found");
  });

  it("should return the expected response when there is an error", async () => {
    const errorMock = new Error("Test error");
    jest
      .spyOn(barangService, "getAllByPemesananId")
      .mockRejectedValueOnce(errorMock);

    const res = await request(app)
      .get(`/api/v1/barang/pemesananId/${idP1}`)
      .set("Authorization", `Bearer ${bearerToken}`)
      .expect(422);

    expect(res.body.status).toBe(false);
    expect(res.body.message).toBe(errorMock.message);
  });
});

describe("UPDATE /api/v1/barang/:id", () => {
  it("should return 200 status code and update data barang", async () => {
    const res = await request(app)
      .put(`/api/v1/barang/${idBA}`)
      .set("Content-Type", "multipart/form-data")
      .set("Authorization", `Bearer ${bearerToken}`)
      .field({
        harga: 20000,
        kuantitas: 5,
        gambar: "ini gambar barang (sudah update)",
        pemesananId: `${idP1}`,
      });
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe(true);
    expect(res.body.message).toBe("Successfully update data");
    expect(res.body.data).toBeDefined();
  });

  it("should return 422 status code and got error message", async () => {
    const res = await request(app)
      .put(`/api/v1/barang/${idBA}`)
      .set("Content-Type", "multipart/form-data")
      .set("Authorization", `Bearer ${bearerToken}`)
      .field({
        harga: -1,
        gambar: "ini gambar barang (sudah update)",
        pemesananId: `${idP1}`,
      });
    expect(res.statusCode).toBe(422);
    expect(res.body.status).toBe(false);
    expect(res.body.message).toBe(
      "Harga atau kuantitas tidak boleh kurang dari 0"
    );
  });

  it("should return 404 status code and data not found", async () => {
    const res = await request(app)
      .put("/api/v1/barang/9999")
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${bearerToken}`);
    expect(res.statusCode).toBe(404);
    expect(res.body.status).toBe(false);
    expect(res.body.message).toBe("Data not found");
  });

  it("should return the expected response when there is an error", async () => {
    const errorMock = new Error("Test error");
    jest.spyOn(barangService, "update").mockRejectedValueOnce(errorMock);

    const res = await request(app)
      .put(`/api/v1/barang/${idBA}`)
      .set("Content-Type", "multipart/form-data")
      .set("Authorization", `Bearer ${bearerToken}`)
      .field({
        gambar: "ini gambar barang (sudah update)",
        pemesananId: `${idP1}`,
      })
      .expect(422);

    expect(res.body.status).toBe(false);
    expect(res.body.message).toBe(errorMock.message);
  });
});

describe("DELETE /api/v1/barang/:id", () => {
  it("should return the expected response when there is an error", async () => {
    const errorMock = new Error("Test error");
    jest.spyOn(barangService, "delete").mockRejectedValueOnce(errorMock);

    const res = await request(app)
      .delete(`/api/v1/barang/${idBA}`)
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${bearerToken}`)
      .expect(422);

    expect(res.body.status).toBe(false);
    expect(res.body.message).toBe(errorMock.message);
  });

  it("should return 200 status code and delete data barang", async () => {
    const res = await request(app)
      .delete(`/api/v1/barang/${idBA}`)
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${bearerToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe(true);
    expect(res.body.message).toBe("Successfully delete data");
  });

  it("should return 404 status code and data not found", async () => {
    const res = await request(app)
      .delete("/api/v1/barang/999")
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${bearerToken}`);
    expect(res.statusCode).toBe(404);
    expect(res.body.status).toBe(false);
    expect(res.body.message).toBe("Data not found");
  });
});
// --------------------------------------------------------------------------------------------

// --------------------------- testing bagian barang by user ----------------------------------
describe("CREATE /api/v1/barang/user", () => {
  it("should return 201 status code and create data barang", async () => {
    const res = await request(app)
      .post("/api/v1/barang/user")
      .set("Content-Type", "multipart/form-data")
      .set("Authorization", `Bearer ${userBearerToken}`)
      .field({
        harga: 10000,
        kuantitas: 10,
        gambar: "ini gambar barang",
        pemesananId: `${idP1}`,
      });
    expect(res.statusCode).toBe(201);
    expect(res.body.status).toBe(true);
    expect(res.body.message).toBe("Successfully create data");
    expect(res.body.data).toBeDefined();
  });

  it("should return 422 status code and got error message", async () => {
    const res = await request(app)
      .post("/api/v1/barang/user")
      .set("Content-Type", "multipart/form-data")
      .set("Authorization", `Bearer ${userBearerToken}`)
      .field({
        harga: -1,
        gambar: "ini gambar barang",
        pemesananId: `${idP1}`,
      });
    expect(res.statusCode).toBe(422);
    expect(res.body.status).toBe(false);
    expect(res.body.message).toBe(
      "Harga atau kuantitas tidak boleh kurang dari 0"
    );
  });

  it("should return the expected response when there is an error", async () => {
    const errorMock = new Error("Test error");
    jest.spyOn(barangService, "createByUser").mockRejectedValueOnce(errorMock);

    const res = await request(app)
      .post("/api/v1/barang/user")
      .set("Content-Type", "multipart/form-data")
      .set("Authorization", `Bearer ${userBearerToken}`)
      .field({
        gambar: "ini gambar barang",
        pemesananId: `${idP1}`,
      })
      .expect(422);

    expect(res.body.status).toBe(false);
    expect(res.body.message).toBe(errorMock.message);
  });
});

describe("GET /api/v1/barang/user/:pemesananId", () => {
  it("should return 200 status code and get data barang by pemesananId", async () => {
    const res = await request(app)
      .get(`/api/v1/barang/user/${idP1}`)
      .set("Authorization", `Bearer ${userBearerToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe(true);
    expect(res.body.message).toBe("Successfully get data by id");
    expect(res.body.data).toBeDefined();
  });

  it("should return 404 status code and data not found", async () => {
    const res = await request(app)
      .get("/api/v1/barang/user/9999")
      .set("Authorization", `Bearer ${userBearerToken}`);
    expect(res.statusCode).toBe(404);
    expect(res.body.status).toBe(false);
    expect(res.body.message).toBe("Data not found");
  });

  it("should return the expected response when there is an error", async () => {
    const errorMock = new Error("Test error");
    jest
      .spyOn(barangService, "getAllByPemesananId")
      .mockRejectedValueOnce(errorMock);

    const res = await request(app)
      .get(`/api/v1/barang/user/${idP1}`)
      .set("Authorization", `Bearer ${userBearerToken}`)
      .expect(422);

    expect(res.body.status).toBe(false);
    expect(res.body.message).toBe(errorMock.message);
  });
});

describe("UPDATE /api/v1/barang/user/:id", () => {
  it("should return 200 status code and update data barang", async () => {
    const res = await request(app)
      .put(`/api/v1/barang/user/${idBU}`)
      .set("Content-Type", "multipart/form-data")
      .set("Authorization", `Bearer ${userBearerToken}`)
      .field({
        harga: 20000,
        kuantitas: 5,
        gambar: "ini gambar barang (sudah update)",
        pemesananId: `${idP1}`,
      });
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe(true);
    expect(res.body.message).toBe("Successfully update data");
    expect(res.body.data).toBeDefined();
  });

  it("should return 422 status code and got error message", async () => {
    const res = await request(app)
      .put(`/api/v1/barang/user/${idBU}`)
      .set("Content-Type", "multipart/form-data")
      .set("Authorization", `Bearer ${userBearerToken}`)
      .field({
        harga: -1,
        gambar: "ini gambar barang (sudah update)",
        pemesananId: `${idP1}`,
      });
    expect(res.statusCode).toBe(422);
    expect(res.body.status).toBe(false);
    expect(res.body.message).toBe(
      "Harga atau kuantitas tidak boleh kurang dari 0"
    );
  });

  it("should return 404 status code and data not found", async () => {
    const res = await request(app)
      .put("/api/v1/barang/user/9999")
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${userBearerToken}`);
    expect(res.statusCode).toBe(404);
    expect(res.body.status).toBe(false);
    expect(res.body.message).toBe("Data not found");
  });

  it("should return the expected response when there is an error", async () => {
    const errorMock = new Error("Test error");
    jest.spyOn(barangService, "updateByUser").mockRejectedValueOnce(errorMock);

    const res = await request(app)
      .put(`/api/v1/barang/user/${idBU}`)
      .set("Content-Type", "multipart/form-data")
      .set("Authorization", `Bearer ${userBearerToken}`)
      .field({
        gambar: "ini gambar barang (sudah update)",
        pemesananId: `${idP1}`,
      })
      .expect(422);

    expect(res.body.status).toBe(false);
    expect(res.body.message).toBe(errorMock.message);
  });
});

describe("DELETE /api/v1/barang/user/:id", () => {
  it("should return the expected response when there is an error", async () => {
    const errorMock = new Error("Test error");
    jest.spyOn(barangService, "deleteByUser").mockRejectedValueOnce(errorMock);

    const res = await request(app)
      .delete(`/api/v1/barang/user/${idBU}`)
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${userBearerToken}`)
      .expect(422);

    expect(res.body.status).toBe(false);
    expect(res.body.message).toBe(errorMock.message);
  });

  it("should return 200 status code and delete data barang", async () => {
    const res = await request(app)
      .delete(`/api/v1/barang/user/${idBU}`)
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${userBearerToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe(true);
    expect(res.body.message).toBe("Successfully delete data");
  });

  it("should return 404 status code and data not found", async () => {
    const res = await request(app)
      .delete("/api/v1/barang/user/999")
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${userBearerToken}`);
    expect(res.statusCode).toBe(404);
    expect(res.body.status).toBe(false);
    expect(res.body.message).toBe("Data not found");
  });
});
// --------------------------------------------------------------------------------------------

// ----------------------------------- lanjutan testing pemesanan -----------------------------
describe("GET /api/v1/pemesanan", () => {
  it("should return 200 status code and get all data pemesanan", async () => {
    const res = await request(app).get("/api/v1/pemesanan");

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe(true);
    expect(res.body.message).toBe("Successfully get all data");
    expect(res.body.data).toBeDefined();
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.pagination).toBeDefined();
    expect(res.body.metadata).toBeDefined();
  });
});

describe("GET /api/v1/pemesanan/where/status?query=value", () => {
  it("should return 200 status code and get all data pemesanan by status", async () => {
    const res = await request(app)
      .get("/api/v1/pemesanan/where/status?status=Perlu Disetujui")
      .set("Content-Type", "multipart/form-data")
      .set("Authorization", `Bearer ${bearerToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe(true);
    expect(res.body.message).toBe("Successfully get all data");
    expect(res.body.data).toBeDefined();
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.pagination).toBeDefined();
    expect(res.body.metadata).toBeDefined();
  });
});

describe("GET /api/v1/pemesanan/user/all?status=Perlu Disetujui", () => {
  it("should return 200 status code and get all data pemesanan by userId", async () => {
    const res = await request(app)
      .get("/api/v1/pemesanan/user/all?status=Perlu Disetujui")
      .set("Content-Type", "multipart/form-data")
      .set("Authorization", `Bearer ${userBearerToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe(true);
    expect(res.body.message).toBe("Successfully get all data");
    expect(res.body.data).toBeDefined();
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.pagination).toBeDefined();
    expect(res.body.metadata).toBeDefined();
  });
});

describe("GET /api/v1/pemesanan/admin/statistic-data", () => {
  it("should return 200 status code and get all statistic data pemesanan", async () => {
    const res = await request(app)
      .get("/api/v1/pemesanan/admin/statistic-data")
      .set("Authorization", `Bearer ${bearerToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe(true);
    expect(res.body.message).toBe("Successfully get all data");
    expect(res.body.data).toBeDefined();
  });

  it("should return the expected response when there is an error", async () => {
    const errorMock = new Error("Test error");
    jest.spyOn(pemesananService, "getAllData").mockRejectedValueOnce(errorMock);

    const res = await request(app)
      .get("/api/v1/pemesanan/admin/statistic-data")
      .set("Authorization", `Bearer ${bearerToken}`)
      .expect(422);

    expect(res.body.status).toBe(false);
    expect(res.body.message).toBe(errorMock.message);
  });
});

describe("GET /api/v1/pemesanan/user/statistic-data", () => {
  it("should return 200 status code and get all statistic data pemesanan", async () => {
    const res = await request(app)
      .get("/api/v1/pemesanan/user/statistic-data")
      .set("Authorization", `Bearer ${userBearerToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe(true);
    expect(res.body.message).toBe("Successfully get all data");
    expect(res.body.data).toBeDefined();
  });

  it("should return the expected response when there is an error", async () => {
    const errorMock = new Error("Test error");
    jest
      .spyOn(pemesananService, "getAllByUserId")
      .mockRejectedValueOnce(errorMock);

    const res = await request(app)
      .get("/api/v1/pemesanan/user/statistic-data")
      .set("Authorization", `Bearer ${userBearerToken}`)
      .expect(422);

    expect(res.body.status).toBe(false);
    expect(res.body.message).toBe(errorMock.message);
  });
});

describe("UPDATE /api/v1/pemesanan/user/:id", () => {
  it("should return 200 status code and update data pemesanan by user", async () => {
    const res = await request(app)
      .put(`/api/v1/pemesanan/user/${idP1}`)
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${userBearerToken}`)
      .send({
        jenisLayanan: [1, 0, 0],
        mPembayaran: "ini metode pembayaran (update)",
        tglMulai: "2023-06-23T06:00:00.000Z",
        status: "Perlu Disetujui",
      });
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe(true);
    expect(res.body.message).toBe("Successfully update data");
    expect(res.body.data).toBeDefined();
  });

  it("should return 400 status code and got error message", async () => {
    const res = await request(app)
      .put(`/api/v1/pemesanan/user/${idP1}`)
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${userBearerToken}`)
      .send({
        jenisLayanan: [1, 0, 0],
        mPembayaran: "ini metode pembayaran (update)",
        tglMulai: "2023-06-23T06:00:00.000Z",
      });
    expect(res.statusCode).toBe(400);
    expect(res.body.status).toBe(false);
    expect(res.body.message).toBe("Please input the status correctly!");
  });

  it("should return the expected response when there is an error", async () => {
    const errorMock = new Error("Test error");
    jest
      .spyOn(pemesananService, "updateByUser")
      .mockRejectedValueOnce(errorMock);

    const res = await request(app)
      .put(`/api/v1/pemesanan/user/${idP1}`)
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${userBearerToken}`)
      .send({
        jenisLayanan: [1, 0, 0],
        mPembayaran: "ini metode pembayaran (update)",
        tglMulai: "2023-06-23T06:00:00.000Z",
        status: "Perlu Disetujui",
      })
      .expect(422);

    expect(res.body.status).toBe(false);
    expect(res.body.message).toBe(errorMock.message);
  });

  afterAll(async () => {
    await request(app)
      .delete(`/api/v1/pemesanan/${idP1}`)
      .set("Authorization", `Bearer ${bearerToken}`);
  });
});

// ---------------------------- sisa testing pemesanan by admin -------------------------------
describe("CREATE /api/v1/pemesanan/admin", () => {
  it("should return 201 status code and create data pemesanan by admin", async () => {
    const res = await request(app)
      .post("/api/v1/pemesanan/admin")
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${bearerToken}`)
      .send({
        userId: 1,
        jenisLayanan: [1, 0, 0],
        mPembayaran: "ini metode pembayaran",
        tglMulai: "2023-06-23T06:00:00.000Z",
        status: "Perlu Disetujui",
        statusPembayaran: "Belum Bayar",
      });
    expect(res.statusCode).toBe(201);
    expect(res.body.status).toBe(true);
    expect(res.body.message).toBe("Successfully create data");
    expect(res.body.data).toBeDefined();
  });

  it("should return 400 status code and got error message", async () => {
    const res = await request(app)
      .post("/api/v1/pemesanan/admin")
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${bearerToken}`)
      .send({
        userId: 1,
        jenisLayanan: [1, 0, 0],
        mPembayaran: "ini metode pembayaran",
        tglMulai: "2023-06-23T06:00:00.000Z",
      });
    expect(res.statusCode).toBe(400);
    expect(res.body.status).toBe(false);
    expect(res.body.message).toBe(
      "Please input the status and statusPembayaran correctly!"
    );
  });

  it("should return 422 status code and got error message", async () => {
    const res = await request(app)
      .post("/api/v1/pemesanan/admin")
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${bearerToken}`)
      .send({
        userId: 1,
        jenisLayanan: [1, 0, 0],
        mPembayaran: "ini metode pembayaran",
        tglMulai: "2023-06-23T06:00:00.000Z",
        status: "Selesai",
        statusPembayaran: "Belum Bayar",
      });
    expect(res.statusCode).toBe(422);
    expect(res.body.status).toBe(false);
    expect(res.body.message).toBe("Please check status pembayaran correctly!");
  });

  it("should return the expected response when there is an error", async () => {
    const errorMock = new Error("Test error");
    jest
      .spyOn(pemesananService, "createByAdmin")
      .mockRejectedValueOnce(errorMock);

    const res = await request(app)
      .post("/api/v1/pemesanan/admin")
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${bearerToken}`)
      .send({
        userId: 1,
        jenisLayanan: [1, 0, 0],
        mPembayaran: "ini metode pembayaran",
        tglMulai: "2023-06-23T06:00:00.000Z",
        status: "Perlu Disetujui",
        statusPembayaran: "Belum Bayar",
      })
      .expect(422);

    expect(res.body.status).toBe(false);
    expect(res.body.message).toBe(errorMock.message);
  });
});

describe("GET /api/v1/pemesanan/:id", () => {
  it("should return 200 status code and get data pemesanan by id", async () => {
    const res = await request(app).get(`/api/v1/pemesanan/${idP2}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe(true);
    expect(res.body.message).toBe("Successfully get data by id");
    expect(res.body.data).toBeDefined();
  });

  it("should return 404 status code and data not found", async () => {
    const res = await request(app).get("/api/v1/pemesanan/9999");
    expect(res.statusCode).toBe(404);
    expect(res.body.status).toBe(false);
    expect(res.body.message).toBe("Data not found");
  });

  it("should return the expected response when there is an error", async () => {
    const errorMock = new Error("Test error");
    jest.spyOn(pemesananService, "getById").mockRejectedValueOnce(errorMock);

    const res = await request(app).get(`/api/v1/pemesanan/${idP2}`).expect(422);

    expect(res.body.status).toBe(false);
    expect(res.body.message).toBe(errorMock.message);
  });
});

describe("UPDATE /api/v1/pemesanan/admin/:id", () => {
  it("should return 200 status code and update data pemesanan", async () => {
    const res = await request(app)
      .put(`/api/v1/pemesanan/admin/${idP2}`)
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${bearerToken}`)
      .send({
        userId: 1,
        jenisLayanan: [1, 0, 0],
        mPembayaran: "ini metode pembayaran (update)",
        tglMulai: "2023-06-23T06:00:00.000Z",
        status: "Perlu Disetujui",
        statusPembayaran: "Belum Bayar",
      });
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe(true);
    expect(res.body.message).toBe("Successfully update data");
    expect(res.body.data).toBeDefined();
  });

  it("should return 400 status code and got error message", async () => {
    const res = await request(app)
      .post("/api/v1/pemesanan/admin")
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${bearerToken}`)
      .send({
        userId: 1,
        jenisLayanan: [1, 0, 0],
        mPembayaran: "ini metode pembayaran",
        tglMulai: "2023-06-23T06:00:00.000Z",
      });
    expect(res.statusCode).toBe(400);
    expect(res.body.status).toBe(false);
    expect(res.body.message).toBe(
      "Please input the status and statusPembayaran correctly!"
    );
  });

  it("should return 422 status code and got error message", async () => {
    const res = await request(app)
      .post("/api/v1/pemesanan/admin")
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${bearerToken}`)
      .send({
        userId: 1,
        jenisLayanan: [1, 0, 0],
        mPembayaran: "ini metode pembayaran",
        tglMulai: "2023-06-23T06:00:00.000Z",
        status: "Selesai",
        statusPembayaran: "Belum Bayar",
      });
    expect(res.statusCode).toBe(422);
    expect(res.body.status).toBe(false);
    expect(res.body.message).toBe("Please check status pembayaran correctly!");
  });

  it("should return 404 status code and data not found", async () => {
    const res = await request(app)
      .put("/api/v1/pemesanan/admin/9999")
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${bearerToken}`);
    expect(res.statusCode).toBe(404);
    expect(res.body.status).toBe(false);
    expect(res.body.message).toBe("Data not found");
  });

  it("should return the expected response when there is an error", async () => {
    const errorMock = new Error("Test error");
    jest
      .spyOn(pemesananService, "updateByAdmin")
      .mockRejectedValueOnce(errorMock);

    const res = await request(app)
      .put(`/api/v1/pemesanan/admin/${idP2}`)
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${bearerToken}`)
      .send({
        userId: 1,
        jenisLayanan: [1, 0, 0],
        mPembayaran: "ini metode pembayaran (update)",
        tglMulai: "2023-06-23T06:00:00.000Z",
        status: "Perlu Disetujui",
        statusPembayaran: "Belum Bayar",
      })
      .expect(422);

    expect(res.body.status).toBe(false);
    expect(res.body.message).toBe(errorMock.message);
  });
});

describe("UPDATE /api/v1/pemesanan/admin/status/:id", () => {
  it("should return 200 status code and update data pemesanan", async () => {
    const res = await request(app)
      .put(`/api/v1/pemesanan/admin/status/${idP2}`)
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${bearerToken}`)
      .send({
        status: "Ditolak",
      });
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe(true);
    expect(res.body.message).toBe("Successfully update data");
    expect(res.body.data).toBeDefined();
  });

  it("should return 422 status code and got error message", async () => {
    const res = await request(app)
      .put(`/api/v1/pemesanan/admin/status/${idP2}`)
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${bearerToken}`)
      .send({
        status: "Selesai",
      });
    expect(res.statusCode).toBe(422);
    expect(res.body.status).toBe(false);
    expect(res.body.message).toBe("Please check status pembayaran correctly!");
  });

  it("should return 400 status code and got error message", async () => {
    const res = await request(app)
      .put(`/api/v1/pemesanan/admin/status/${idP2}`)
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${bearerToken}`)
      .send({
        status: "coba",
      });
    expect(res.statusCode).toBe(400);
    expect(res.body.status).toBe(false);
    expect(res.body.message).toBe("Please input the status correctly!");
  });

  it("should return 404 status code and data not found", async () => {
    const res = await request(app)
      .put("/api/v1/pemesanan/admin/status/9999")
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${bearerToken}`);
    expect(res.statusCode).toBe(404);
    expect(res.body.status).toBe(false);
    expect(res.body.message).toBe("Data not found");
  });

  it("should return the expected response when there is an error", async () => {
    const errorMock = new Error("Test error");
    jest
      .spyOn(pemesananService, "updateByAdmin")
      .mockRejectedValueOnce(errorMock);

    const res = await request(app)
      .put(`/api/v1/pemesanan/admin/status/${idP2}`)
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${bearerToken}`)
      .send({
        status: "Ditolak",
      })
      .expect(422);

    expect(res.body.status).toBe(false);
    expect(res.body.message).toBe(errorMock.message);
  });
});

describe("UPDATE /api/v1/pemesanan/admin/payment-status/:id", () => {
  it("should return 200 status code and update data pemesanan", async () => {
    const res = await request(app)
      .put(`/api/v1/pemesanan/admin/payment-status/${idP2}`)
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${bearerToken}`)
      .send({
        statusPembayaran: "Belum Bayar",
      });
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe(true);
    expect(res.body.message).toBe("Successfully update data");
    expect(res.body.data).toBeDefined();
  });

  it("should return 400 status code and got error message", async () => {
    const res = await request(app)
      .put(`/api/v1/pemesanan/admin/payment-status/${idP2}`)
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${bearerToken}`)
      .send({
        statusPembayaran: "coba",
      });
    expect(res.statusCode).toBe(400);
    expect(res.body.status).toBe(false);
    expect(res.body.message).toBe(
      "Please input the statusPembayaran correctly!"
    );
  });

  it("should return the expected response when there is an error", async () => {
    const errorMock = new Error("Test error");
    jest
      .spyOn(pemesananService, "updateByAdmin")
      .mockRejectedValueOnce(errorMock);

    const res = await request(app)
      .put(`/api/v1/pemesanan/admin/payment-status/${idP2}`)
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${bearerToken}`)
      .send({
        statusPembayaran: "Belum Bayar",
      })
      .expect(422);

    expect(res.body.status).toBe(false);
    expect(res.body.message).toBe(errorMock.message);
  });

  it("should return 404 status code and data not found", async () => {
    const res = await request(app)
      .put("/api/v1/pemesanan/admin/payment-status/9999")
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${bearerToken}`);
    expect(res.statusCode).toBe(404);
    expect(res.body.status).toBe(false);
    expect(res.body.message).toBe("Data not found");
  });

  it("should return 422 status code and got error message", async () => {
    const res = await request(app)
      .put(`/api/v1/pemesanan/admin/payment-status/${idP2}`)
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${bearerToken}`)
      .send({
        statusPembayaran: "Sudah Bayar",
      });
    expect(res.statusCode).toBe(422);
    expect(res.body.status).toBe(false);
    expect(res.body.message).toBe("Please check the status correctly!");
  });
});

// ------------------------------ testing bagian notif by user -------------------------------------
describe("GET /api/v1/notifikasi/all/user", () => {
  it("should return 200 status code and get all data notifikasi", async () => {
    const res = await request(app)
      .get("/api/v1/notifikasi/all/user")
      .set("Authorization", `Bearer ${userBearerToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe(true);
    expect(res.body.message).toBe("Successfully get all data");
    expect(res.body.data).toBeDefined();
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.pagination).toBeDefined();
    expect(res.body.metadata).toBeDefined();
    expect(res.body.otherData).toBeDefined();
  });
});

describe("UPDATE /api/v1/notifikasi/user/:id", () => {
  it("should return 200 status code and update data notifikasi", async () => {
    const res = await request(app)
      .put(`/api/v1/notifikasi/user/${idN2}`)
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${userBearerToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe(true);
    expect(res.body.message).toBe("Successfully update data");
    expect(res.body.data).toBeDefined();
  });

  it("should return 200 status code and update data notifikasi again", async () => {
    const res = await request(app)
      .put(`/api/v1/notifikasi/user/${idN2}`)
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${userBearerToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe(true);
    expect(res.body.message).toBe("Notification has been read!");
    expect(res.body.data).toBeDefined();
  });

  it("should return 404 status code and data not found", async () => {
    const res = await request(app)
      .put("/api/v1/notifikasi/user/9999")
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${userBearerToken}`);
    expect(res.statusCode).toBe(404);
    expect(res.body.status).toBe(false);
    expect(res.body.message).toBe("Data not found");
  });

  it("should return the expected response when there is an error", async () => {
    const errorMock = new Error("Test error");
    jest.spyOn(notifService, "update").mockRejectedValueOnce(errorMock);

    const res = await request(app)
      .put(`/api/v1/notifikasi/user/${idN2}`)
      .set("Content-Type", "multipart/form-data")
      .set("Authorization", `Bearer ${userBearerToken}`)
      .expect(422);

    expect(res.body.status).toBe(false);
    expect(res.body.message).toBe(errorMock.message);
  });
});

describe("UPDATE /api/v1/notifikasi/all/user", () => {
  it("should return 200 status code and update data notifikasi", async () => {
    const res = await request(app)
      .put(`/api/v1/notifikasi/all/user`)
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${userBearerToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe(true);
    expect(res.body.message).toBe("Successfully update all data");
    expect(res.body.data).toBeDefined();
  });

  it("should return the expected response when there is an error", async () => {
    const errorMock = new Error("Test error");
    jest.spyOn(notifService, "readAllByUser").mockRejectedValueOnce(errorMock);

    const res = await request(app)
      .put(`/api/v1/notifikasi/all/user`)
      .set("Content-Type", "multipart/form-data")
      .set("Authorization", `Bearer ${userBearerToken}`)
      .expect(422);

    expect(res.body.status).toBe(false);
    expect(res.body.message).toBe(errorMock.message);
  });
});
// -------------------------------------------------------------------------------------------------

describe("DELETE /api/v1/pemesanan/:id", () => {
  it("should return the expected response when there is an error", async () => {
    const errorMock = new Error("Test error");
    jest.spyOn(pemesananService, "delete").mockRejectedValueOnce(errorMock);

    const res = await request(app)
      .delete(`/api/v1/pemesanan/${idP2}`)
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${bearerToken}`)
      .expect(422);

    expect(res.body.status).toBe(false);
    expect(res.body.message).toBe(errorMock.message);
  });

  it("should return 200 status code and delete data pemesanan", async () => {
    const res = await request(app)
      .delete(`/api/v1/pemesanan/${idP2}`)
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${bearerToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe(true);
    expect(res.body.message).toBe("Successfully delete data");
  });

  it("should return 404 status code and data not found", async () => {
    const res = await request(app)
      .delete("/api/v1/pemesanan/999")
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${bearerToken}`);
    expect(res.statusCode).toBe(404);
    expect(res.body.status).toBe(false);
    expect(res.body.message).toBe("Data not found");
  });
});
// -------------------------------------------------------------------------------------------------

const { Pemesanan } = require("../app/models");
const {
  getAll,
  getAllData,
  getAllDataByStatus,
  getAllByStatus,
  getAllByUserId,
  getAllByUserIdAndStatusNoPag,
  getAllByUserIdAndStatus,
  searchOrder,
  getById,
  getByNomorPesanan,
  getByNomorPesananFromUser,
  createByUser,
  createByAdmin,
  updateByUser,
  updateByAdmin,
} = require("../app/services/pemesananService");

describe("getAll services", () => {
  it("should throw an error when an error occurs", () => {
    // Mock implementation of About.findAll() that throws an error
    Pemesanan.findAll = jest.fn().mockImplementation(() => {
      throw new Error("Test error");
    });
    // Expect the function to throw an error
    expect(getAll).toThrow("Test error");
  });
});

describe("getAllData services", () => {
  it("should throw an error when an error occurs", () => {
    // Mock implementation of About.findAll() that throws an error
    Pemesanan.findAll = jest.fn().mockImplementation(() => {
      throw new Error("Test error");
    });
    // Expect the function to throw an error
    expect(getAllData).toThrow("Test error");
  });
});

describe("getAllDataByStatus services", () => {
  it("should throw an error when an error occurs", () => {
    // Mock implementation of About.findAll() that throws an error
    Pemesanan.findAll = jest.fn().mockImplementation(() => {
      throw new Error("Test error");
    });
    // Expect the function to throw an error
    expect(getAllDataByStatus).toThrow("Test error");
  });
});

describe("getAllByStatus services", () => {
  it("should throw an error when an error occurs", () => {
    // Mock implementation of About.findAll() that throws an error
    Pemesanan.findAll = jest.fn().mockImplementation(() => {
      throw new Error("Test error");
    });
    // Expect the function to throw an error
    expect(getAllByStatus).toThrow("Test error");
  });
});

describe("getAllByUserId services", () => {
  it("should throw an error when an error occurs", () => {
    // Mock implementation of About.findAll() that throws an error
    Pemesanan.findAll = jest.fn().mockImplementation(() => {
      throw new Error("Test error");
    });
    // Expect the function to throw an error
    expect(getAllByUserId).toThrow("Test error");
  });
});

describe("getAllByUserIdAndStatusNoPag services", () => {
  it("should throw an error when an error occurs", () => {
    // Mock implementation of About.findAll() that throws an error
    Pemesanan.findAll = jest.fn().mockImplementation(() => {
      throw new Error("Test error");
    });
    // Expect the function to throw an error
    expect(getAllByUserIdAndStatusNoPag).toThrow("Test error");
  });
});

describe("getAllByUserIdAndStatus services", () => {
  it("should throw an error when an error occurs", () => {
    // Mock implementation of About.findAll() that throws an error
    Pemesanan.findAll = jest.fn().mockImplementation(() => {
      throw new Error("Test error");
    });
    // Expect the function to throw an error
    expect(getAllByUserIdAndStatus).toThrow("Test error");
  });
});

describe("searchOrder services", () => {
  it("should throw an error when an error occurs", () => {
    // Mock implementation of About.findAll() that throws an error
    Pemesanan.findAll = jest.fn().mockImplementation(() => {
      throw new Error("Test error");
    });
    // Expect the function to throw an error
    expect(searchOrder).toThrow("Test error");
  });
});

describe("getById services", () => {
  it("should throw an error when an error occurs", () => {
    // Mock implementation of About.findOne() that throws an error
    Pemesanan.findOne = jest.fn().mockImplementation(() => {
      throw new Error("Test error");
    });
    // Expect the function to throw an error
    expect(getById).toThrow("Test error");
  });
});

describe("getByNomorPesanan services", () => {
  it("should throw an error when an error occurs", () => {
    // Mock implementation of About.findOne() that throws an error
    Pemesanan.findOne = jest.fn().mockImplementation(() => {
      throw new Error("Test error");
    });
    // Expect the function to throw an error
    expect(getByNomorPesanan).toThrow("Test error");
  });
});

describe("getByNomorPesananFromUser services", () => {
  it("should throw an error when an error occurs", () => {
    // Mock implementation of About.findOne() that throws an error
    Pemesanan.findOne = jest.fn().mockImplementation(() => {
      throw new Error("Test error");
    });
    // Expect the function to throw an error
    expect(getByNomorPesananFromUser).toThrow("Test error");
  });
});

describe("createByUser services", () => {
  it("should throw an error when an error occurs", () => {
    // Mock implementation of About.create() that throws an error
    Pemesanan.create = jest.fn().mockImplementation(() => {
      throw new Error("Test error");
    });
    // Expect the function to throw an error
    expect(createByUser).toThrow("Test error");
  });
});

describe("createByAdmin services", () => {
  it("should throw an error when an error occurs", () => {
    // Mock implementation of About.create() that throws an error
    Pemesanan.create = jest.fn().mockImplementation(() => {
      throw new Error("Test error");
    });
    // Expect the function to throw an error
    expect(createByAdmin).toThrow("Test error");
  });
});

describe("updateByUser services", () => {
  it("should throw an error when an error occurs", () => {
    // Mock implementation of About.update() that throws an error
    Pemesanan.update = jest.fn().mockImplementation(() => {
      throw new Error("Test error");
    });
    // Expect the function to throw an error
    expect(updateByUser).toThrow("Test error");
  });
});

describe("updateByAdmin services", () => {
  it("should throw an error when an error occurs", () => {
    // Mock implementation of About.update() that throws an error
    Pemesanan.update = jest.fn().mockImplementation(() => {
      throw new Error("Test error");
    });
    // Expect the function to throw an error
    expect(updateByAdmin).toThrow("Test error");
  });
});
