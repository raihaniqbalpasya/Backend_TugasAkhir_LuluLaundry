const request = require("supertest");
const app = require("../server");
const userService = require("../app/services/userService");
const adminService = require("../app/services/adminService");
const alamatService = require("../app/services/alamatService");
const idAD = 3;
const idUS = 2;
const idAl = 1;
const idAl2 = 2;
const idAl3 = 3;
const idAl4 = 4;

beforeAll(async () => {
  const token = await request(app).post("/api/v1/user/login").send({
    noTelp: "6281234567890",
    password: "coba123",
  });
  userBearerToken = token.body.accessToken;

  return userBearerToken;
});

beforeAll(async () => {
  const token = await request(app).post("/api/v1/admin/login").send({
    nama: "Nama Masteradmin",
    password: "admin123",
  });
  bearerToken = token.body.accessToken;

  return bearerToken;
});

describe("CREATE /api/v1/user/login", () => {
  it("should return 201 status code and get access token for login", async () => {
    const res = await request(app).post("/api/v1/user/login").send({
      noTelp: "6281234567890",
      password: "coba123",
    });
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe(true);
    expect(res.body.message).toBe("Login Successfull!");
    expect(res.body.accessToken).toBeDefined();
  });

  it("should return 404 status code cause phone number not found", async () => {
    const res = await request(app).post("/api/v1/user/login").send({
      noTelp: "6281234567891",
      password: "coba123",
    });
    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe("Phone number not found!");
  });

  it("should return 400 status code cause wrong password", async () => {
    const res = await request(app).post("/api/v1/user/login").send({
      noTelp: "6281234567890",
      password: "coba1234",
    });
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("Wrong Password");
  });

  it("should return the expected response when there is an error", async () => {
    const errorMock = new Error("Test error");
    jest.spyOn(userService, "getByPhone").mockRejectedValueOnce(errorMock);

    const res = await request(app)
      .post("/api/v1/user/login")
      .send({
        noTelp: "6281234567890",
        password: "coba123",
      })
      .expect(422);

    expect(res.body.status).toBe(false);
    expect(res.body.message).toBe(errorMock.message);
  });
});

describe("GET /api/v1/user", () => {
  it("should return 200 status code and get data user", async () => {
    const res = await request(app)
      .get("/api/v1/user")
      .set("Authorization", `Bearer ${userBearerToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe(true);
    expect(res.body.message).toBe("Successfully get user profile");
    expect(res.body.data).toBeDefined();
  });

  it("should return the expected response when there is an error", async () => {
    const errorMock = new Error("Test error");
    jest.spyOn(userService, "getById").mockRejectedValueOnce(errorMock);

    const res = await request(app)
      .get("/api/v1/user")
      .set("Authorization", `Bearer ${userBearerToken}`)
      .expect(422);

    expect(res.body.status).toBe(false);
    expect(res.body.message).toBe(errorMock.message);
  });
});

describe("GET /api/v1/user/search?query=value", () => {
  it("should return 200 status code and get all data user", async () => {
    const res = await request(app).get("/api/v1/user/search?nama=co&noTelp=62");

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe(true);
    expect(res.body.message).toBe(
      "Successfully get data by name or phone number"
    );
    expect(res.body.data).toBeDefined();
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it("should return 404 status code and data not found", async () => {
    const response = await request(app).get(
      "/api/v1/user/search?nama=hi&noTelp=746"
    );

    expect(response.status).toBe(404);
    expect(response.body.status).toBe(false);
    expect(response.body.message).toBe("Data not found");
  });

  it("should return the expected response when there is an error", async () => {
    const errorMock = new Error("Test error");
    jest.spyOn(userService, "searchUser").mockRejectedValueOnce(errorMock);

    const res = await request(app)
      .get("/api/v1/user/search?nama=co&noTelp=62")
      .expect(422);

    expect(res.body.status).toBe(false);
    expect(res.body.message).toBe(errorMock.message);
  });
});

describe("UPDATE /api/v1/user", () => {
  it("should return 200 status code and update data user", async () => {
    const res = await request(app)
      .put(`/api/v1/user`)
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${userBearerToken}`)
      .send({
        nama: "coba",
        noTelp: "6281234567890",
        tglLahir: "2002-05-13",
        profilePic: "ini gambar profile",
      });
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe(true);
    expect(res.body.message).toBe("Successfully update data");
    expect(res.body.data).toBeDefined();
  });

  it("should return 403 status code and get error message", async () => {
    const res = await request(app)
      .put("/api/v1/user")
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${userBearerToken}`)
      .send({
        nama: "coba",
        noTelp: "6281234567890",
        tglLahir: "2002-05-13",
        profilePic: "ini gambar profile",
        password: "",
        otp: "",
      });
    expect(res.statusCode).toBe(403);
    expect(res.body.status).toBe(false);
    expect(res.body.message).toBe("You cannot change your password here");
  });

  it("should return the expected response when there is an error", async () => {
    const errorMock = new Error("Test error");
    jest.spyOn(userService, "update").mockRejectedValueOnce(errorMock);

    const res = await request(app)
      .put(`/api/v1/user`)
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${userBearerToken}`)
      .send({
        nama: "coba",
        noTelp: "6281234567890",
        tglLahir: "2002-05-13",
        profilePic: "ini gambar profile",
      })
      .expect(422);

    expect(res.body.status).toBe(false);
    expect(res.body.message).toBe(errorMock.message);
  });
});

describe("DELETE /api/v1/user/profilePic", () => {
  it("should return 404 status code and data empty message", async () => {
    const response = await request(app)
      .delete("/api/v1/user/profilePic")
      .set("Authorization", `Bearer ${userBearerToken}`);

    expect(response.status).toBe(404);
    expect(response.body.status).toBe(false);
    expect(response.body.message).toBe(
      "Data not found or picture has been deleted"
    );
  });
});

// -------------------------------- testing bagian alamat ---------------------------------------
describe("GET /api/v1/alamat", () => {
  it("should return 404 status code and data empty message", async () => {
    const response = await request(app).get("/api/v1/alamat");

    expect(response.status).toBe(404);
    expect(response.body.status).toBe(false);
    expect(response.body.message).toBe("Data empty, Please input some data!");
  });

  it("should return the expected response when there is an error", async () => {
    const errorMock = new Error("Test error");
    jest.spyOn(alamatService, "getAllData").mockRejectedValueOnce(errorMock);

    const res = await request(app).get("/api/v1/alamat").expect(422);

    expect(res.body.status).toBe(false);
    expect(res.body.message).toBe(errorMock.message);
  });
});

describe("GET /api/v1/user/address", () => {
  it("should return 404 status code and data empty message", async () => {
    const response = await request(app)
      .get("/api/v1/user/address")
      .set("Authorization", `Bearer ${userBearerToken}`);

    expect(response.status).toBe(404);
    expect(response.body.status).toBe(false);
    expect(response.body.message).toBe("Data empty, Please input some data!");
  });

  it("should return the expected response when there is an error", async () => {
    const errorMock = new Error("Test error");
    jest.spyOn(alamatService, "getAllAddress").mockRejectedValueOnce(errorMock);

    const res = await request(app)
      .get("/api/v1/user/address")
      .set("Authorization", `Bearer ${userBearerToken}`)
      .expect(422);

    expect(res.body.status).toBe(false);
    expect(res.body.message).toBe(errorMock.message);
  });
});

describe("CREATE /api/v1/user/address", () => {
  it("should return 201 status code and create data alamat", async () => {
    const res = await request(app)
      .post("/api/v1/user/address")
      .set("Content-Type", "multipart/form-data")
      .set("Authorization", `Bearer ${userBearerToken}`)
      .field({
        kategori: "rumah",
        detail: "ini detail alamat",
        kecamatan: "ini kecamatan",
        kelurahan: "ini kelurahan",
        gambar: "ini gambar alamat",
        status: "Standard",
      });
    expect(res.statusCode).toBe(201);
    expect(res.body.status).toBe(true);
    expect(res.body.message).toBe("Successfully create data");
    expect(res.body.data).toBeDefined();
  });

  it("should return 400 status code and got error message", async () => {
    const res = await request(app)
      .post("/api/v1/user/address")
      .set("Content-Type", "multipart/form-data")
      .set("Authorization", `Bearer ${userBearerToken}`)
      .field({
        kategori: "rumah",
        detail: "ini detail alamat",
        kecamatan: "ini kecamatan",
        kelurahan: "ini kelurahan",
        gambar: "ini gambar alamat",
        status: "coba",
      });
    expect(res.statusCode).toBe(400);
    expect(res.body.status).toBe(false);
    expect(res.body.message).toBe("Please input the status correctly!");
  });

  it("should return the expected response when there is an error", async () => {
    const errorMock = new Error("Test error");
    jest.spyOn(alamatService, "createAddress").mockRejectedValueOnce(errorMock);

    const res = await request(app)
      .post("/api/v1/user/address")
      .set("Content-Type", "multipart/form-data")
      .set("Authorization", `Bearer ${userBearerToken}`)
      .field({
        kategori: "rumah",
        detail: "ini detail alamat",
        kecamatan: "ini kecamatan",
        kelurahan: "ini kelurahan",
        gambar: "ini gambar alamat",
        status: "Standard",
      })
      .expect(422);

    expect(res.body.status).toBe(false);
    expect(res.body.message).toBe(errorMock.message);
  });
});

describe("GET /api/v1/alamat", () => {
  it("should return 200 status code and get all data about", async () => {
    const res = await request(app).get("/api/v1/alamat");

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe(true);
    expect(res.body.message).toBe("Successfully get all data");
    expect(res.body.data).toBeDefined();
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.pagination).toBeDefined();
    expect(res.body.metadata).toBeDefined();
  });
});

describe("GET /api/v1/user/address", () => {
  it("should return 200 status code and get all data about", async () => {
    const res = await request(app)
      .get("/api/v1/user/address")
      .set("Authorization", `Bearer ${userBearerToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe(true);
    expect(res.body.message).toBe("Successfully get all data");
    expect(res.body.data).toBeDefined();
    expect(Array.isArray(res.body.data)).toBe(true);
  });
});

describe("GET /api/v1/alamat/:id", () => {
  it("should return 200 status code and get data alamat by id", async () => {
    const res = await request(app).get(`/api/v1/alamat/${idAl}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe(true);
    expect(res.body.message).toBe("Successfully get data by id");
    expect(res.body.data).toBeDefined();
  });

  it("should return 404 status code and data not found", async () => {
    const res = await request(app).get("/api/v1/alamat/9999");
    expect(res.statusCode).toBe(404);
    expect(res.body.status).toBe(false);
    expect(res.body.message).toBe("Data not found");
  });

  it("should return the expected response when there is an error", async () => {
    const errorMock = new Error("Test error");
    jest.spyOn(alamatService, "getById").mockRejectedValueOnce(errorMock);

    const res = await request(app).get(`/api/v1/alamat/${idAl}`).expect(422);

    expect(res.body.status).toBe(false);
    expect(res.body.message).toBe(errorMock.message);
  });
});

describe("GET /api/v1/user/address/:id", () => {
  it("should return 200 status code and get data alamat by id", async () => {
    const res = await request(app)
      .get(`/api/v1/user/address/${idAl}`)
      .set("Authorization", `Bearer ${userBearerToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe(true);
    expect(res.body.message).toBe("Successfully get data by id");
    expect(res.body.data).toBeDefined();
  });

  it("should return 404 status code and data not found", async () => {
    const res = await request(app)
      .get("/api/v1/user/address/9999")
      .set("Authorization", `Bearer ${userBearerToken}`);
    expect(res.statusCode).toBe(404);
    expect(res.body.status).toBe(false);
    expect(res.body.message).toBe("Data not found");
  });

  it("should return the expected response when there is an error", async () => {
    const errorMock = new Error("Test error");
    jest
      .spyOn(alamatService, "getAddressById")
      .mockRejectedValueOnce(errorMock);

    const res = await request(app)
      .get(`/api/v1/user/address/${idAl}`)
      .set("Authorization", `Bearer ${userBearerToken}`)
      .expect(422);

    expect(res.body.status).toBe(false);
    expect(res.body.message).toBe(errorMock.message);
  });
});

describe("UPDATE /api/v1/user/address/:id", () => {
  beforeAll(async () => {
    await request(app)
      .post("/api/v1/user/address")
      .set("Content-Type", "multipart/form-data")
      .set("Authorization", `Bearer ${userBearerToken}`)
      .field({
        kategori: "kosan",
        detail: "ini detail alamat 2",
        kecamatan: "ini kecamatan 2",
        kelurahan: "ini kelurahan 2",
        gambar: "ini gambar alamat 2",
        status: "Standard",
      });
  });

  it("should return 200 status code and update data alamat", async () => {
    const res = await request(app)
      .put(`/api/v1/user/address/${idAl}`)
      .set("Content-Type", "multipart/form-data")
      .set("Authorization", `Bearer ${userBearerToken}`)
      .field({
        kategori: "rumah",
        detail: "ini detail alamat (update)",
        kecamatan: "ini kecamatan (update)",
        kelurahan: "ini kelurahan (update)",
        gambar: "ini gambar alamat (update)",
        status: "Priority",
      });
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe(true);
    expect(res.body.message).toBe("Successfully update data");
    expect(res.body.data).toBeDefined();
  });

  it("should return 400 status code and got error message", async () => {
    const res = await request(app)
      .put(`/api/v1/user/address/${idAl}`)
      .set("Content-Type", "multipart/form-data")
      .set("Authorization", `Bearer ${userBearerToken}`)
      .field({
        kategori: "rumah",
        detail: "ini detail alamat (update)",
        kecamatan: "ini kecamatan (update)",
        kelurahan: "ini kelurahan (update)",
        gambar: "ini gambar alamat (update)",
        status: "coba",
      });
    expect(res.statusCode).toBe(400);
    expect(res.body.status).toBe(false);
    expect(res.body.message).toBe("Please input the status correctly!");
  });

  it("should return 404 status code and data not found", async () => {
    const res = await request(app)
      .put("/api/v1/user/address/9999")
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${userBearerToken}`);
    expect(res.statusCode).toBe(404);
    expect(res.body.status).toBe(false);
    expect(res.body.message).toBe("Data not found");
  });

  it("should return the expected response when there is an error", async () => {
    const errorMock = new Error("Test error");
    jest.spyOn(alamatService, "updateAddress").mockRejectedValueOnce(errorMock);

    const res = await request(app)
      .put(`/api/v1/user/address/${idAl}`)
      .set("Content-Type", "multipart/form-data")
      .set("Authorization", `Bearer ${userBearerToken}`)
      .field({
        kategori: "rumah",
        detail: "ini detail alamat (update)",
        kecamatan: "ini kecamatan (update)",
        kelurahan: "ini kelurahan (update)",
        gambar: "ini gambar alamat (update)",
        status: "Priority",
      })
      .expect(422);

    expect(res.body.status).toBe(false);
    expect(res.body.message).toBe(errorMock.message);
  });
});

describe("UPDATE /api/v1/user/address/status/:id", () => {
  it("should return 200 status code and update data alamat", async () => {
    const res = await request(app)
      .put(`/api/v1/user/address/status/${idAl2}`)
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${userBearerToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe(true);
    expect(res.body.message).toBe("Successfully update data");
    expect(res.body.data).toBeDefined();
  });

  it("should return 404 status code and data not found", async () => {
    const res = await request(app)
      .put("/api/v1/user/address/status/9999")
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${userBearerToken}`);
    expect(res.statusCode).toBe(404);
    expect(res.body.status).toBe(false);
    expect(res.body.message).toBe("Data not found");
  });

  it("should return the expected response when there is an error", async () => {
    const errorMock = new Error("Test error");
    jest
      .spyOn(alamatService, "updateAddressPriority")
      .mockRejectedValueOnce(errorMock);

    const res = await request(app)
      .put(`/api/v1/user/address/status/${idAl2}`)
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${userBearerToken}`)
      .expect(422);

    expect(res.body.status).toBe(false);
    expect(res.body.message).toBe(errorMock.message);
  });
});

describe("DELETE /api/v1/user/address/:id", () => {
  beforeAll(async () => {
    await request(app)
      .put(`/api/v1/user/address/${idAl2}`)
      .set("Content-Type", "multipart/form-data")
      .set("Authorization", `Bearer ${userBearerToken}`)
      .field({
        kategori: "rumah",
        detail: "ini detail alamat (update2)",
        kecamatan: "ini kecamatan (update2)",
        kelurahan: "ini kelurahan (update2)",
        gambar: "ini gambar alamat (update2)",
        status: "Priority",
      });
  });

  it("should return the expected response when there is an error", async () => {
    const errorMock = new Error("Test error");
    jest.spyOn(alamatService, "deleteAddress").mockRejectedValueOnce(errorMock);

    const res = await request(app)
      .delete(`/api/v1/user/address/${idAl}`)
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${userBearerToken}`)
      .expect(422);

    expect(res.body.status).toBe(false);
    expect(res.body.message).toBe(errorMock.message);
  });

  it("should return 200 status code and delete data alamat", async () => {
    const res = await request(app)
      .delete(`/api/v1/user/address/${idAl}`)
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${userBearerToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe(true);
    expect(res.body.message).toBe("Successfully delete data");
  });

  it("should return 404 status code and data not found", async () => {
    const res = await request(app)
      .delete("/api/v1/user/address/999")
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${userBearerToken}`);
    expect(res.statusCode).toBe(404);
    expect(res.body.status).toBe(false);
    expect(res.body.message).toBe("Data not found");
  });

  it("should return 422 status code and get error message", async () => {
    const res = await request(app)
      .delete(`/api/v1/user/address/${idAl2}`)
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${userBearerToken}`);
    expect(res.statusCode).toBe(422);
    expect(res.body.status).toBe(false);
    expect(res.body.message).toBe(
      "Cannot delete Priority address! Please change other address to Priority first!"
    );
  });
});
// --------------------------------------------------------------------------------------------------

// ------------------------------------- testing bagian admin ---------------------------------------
describe("CREATE /api/v1/admin/login", () => {
  it("should return 201 status code and get access token for login", async () => {
    const res = await request(app).post("/api/v1/admin/login").send({
      nama: "Nama Masteradmin",
      password: "admin123",
    });
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe(true);
    expect(res.body.message).toBe("Login Successfull!");
    expect(res.body.accessToken).toBeDefined();
  });

  it("should return 404 status code cause admin name not found", async () => {
    const res = await request(app).post("/api/v1/admin/login").send({
      nama: "Nama MasteradminWOW",
      password: "admin123",
    });
    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe("Admin name not found!");
  });

  it("should return 400 status code cause wrong password", async () => {
    const res = await request(app).post("/api/v1/admin/login").send({
      nama: "Nama Masteradmin",
      password: "admin12345",
    });
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("Wrong Password");
  });

  it("should return the expected response when there is an error", async () => {
    const errorMock = new Error("Test error");
    jest.spyOn(adminService, "getByName").mockRejectedValueOnce(errorMock);

    const res = await request(app)
      .post("/api/v1/admin/login")
      .send({
        nama: "Nama Masteradmin",
        password: "admin123",
      })
      .expect(422);

    expect(res.body.status).toBe(false);
    expect(res.body.message).toBe(errorMock.message);
  });
});

describe("GET /api/v1/admin", () => {
  it("should return 200 status code and get all data admin", async () => {
    const res = await request(app)
      .get("/api/v1/admin")
      .set("Authorization", `Bearer ${bearerToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe(true);
    expect(res.body.message).toBe("Successfully get all data");
    expect(res.body.data).toBeDefined();
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.pagination).toBeDefined();
    expect(res.body.metadata).toBeDefined();
  });

  it("should return the expected response when there is an error", async () => {
    const errorMock = new Error("Test error");
    jest.spyOn(adminService, "getAllData").mockRejectedValueOnce(errorMock);

    const res = await request(app)
      .get("/api/v1/admin")
      .set("Authorization", `Bearer ${bearerToken}`)
      .expect(422);

    expect(res.body.status).toBe(false);
    expect(res.body.message).toBe(errorMock.message);
  });
});

describe("GET /api/v1/admin/:id", () => {
  it("should return 200 status code and get data admin", async () => {
    const res = await request(app)
      .get("/api/v1/admin/1")
      .set("Authorization", `Bearer ${bearerToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe(true);
    expect(res.body.message).toBe("Successfully get data by id");
    expect(res.body.data).toBeDefined();
  });

  it("should return the expected response when there is an error", async () => {
    const errorMock = new Error("Test error");
    jest.spyOn(adminService, "getById").mockRejectedValueOnce(errorMock);

    const res = await request(app)
      .get("/api/v1/admin/1")
      .set("Authorization", `Bearer ${bearerToken}`)
      .expect(422);

    expect(res.body.status).toBe(false);
    expect(res.body.message).toBe(errorMock.message);
  });
});

describe("GET /api/v1/admin/statistic/data", () => {
  it("should return 200 status code and get statistic data from admin", async () => {
    const res = await request(app)
      .get("/api/v1/admin/statistic/data")
      .set("Authorization", `Bearer ${bearerToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe(true);
    expect(res.body.message).toBe("Successfully get all data");
    expect(res.body.data).toBeDefined();
  });

  it("should return the expected response when there is an error", async () => {
    const errorMock = new Error("Test error");
    jest.spyOn(userService, "getAllData").mockRejectedValueOnce(errorMock);

    const res = await request(app)
      .get("/api/v1/admin/statistic/data")
      .set("Authorization", `Bearer ${bearerToken}`)
      .expect(422);

    expect(res.body.status).toBe(false);
    expect(res.body.message).toBe(errorMock.message);
  });
});

describe("GET /api/v1/admin/my/profile", () => {
  it("should return 200 status code and get admin profile", async () => {
    const res = await request(app)
      .get("/api/v1/admin/my/profile")
      .set("Authorization", `Bearer ${bearerToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe(true);
    expect(res.body.message).toBe("Successfully get admin profile");
    expect(res.body.data).toBeDefined();
  });

  it("should return the expected response when there is an error", async () => {
    const errorMock = new Error("Test error");
    jest.spyOn(adminService, "getById").mockRejectedValueOnce(errorMock);

    const res = await request(app)
      .get("/api/v1/admin/my/profile")
      .set("Authorization", `Bearer ${bearerToken}`)
      .expect(422);

    expect(res.body.status).toBe(false);
    expect(res.body.message).toBe(errorMock.message);
  });
});

describe("GET /api/v1/admin/search/where?query=value", () => {
  it("should return 200 status code and search data admin", async () => {
    const res = await request(app)
      .get("/api/v1/admin/search/where?nama=mas&noTelp=081")
      .set("Authorization", `Bearer ${bearerToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe(true);
    expect(res.body.message).toBe(
      "Successfully get data by name or phone number"
    );
    expect(res.body.data).toBeDefined();
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it("should return 404 status code and data not found", async () => {
    const response = await request(app)
      .get("/api/v1/admin/search/where?nama=vbn&noTelp=935")
      .set("Authorization", `Bearer ${bearerToken}`);

    expect(response.status).toBe(404);
    expect(response.body.status).toBe(false);
    expect(response.body.message).toBe("Data not found");
  });

  it("should return the expected response when there is an error", async () => {
    const errorMock = new Error("Test error");
    jest.spyOn(adminService, "searchAdmin").mockRejectedValueOnce(errorMock);

    const res = await request(app)
      .get("/api/v1/admin/search/where?nama=mas&noTelp=081")
      .set("Authorization", `Bearer ${bearerToken}`)
      .expect(422);

    expect(res.body.status).toBe(false);
    expect(res.body.message).toBe(errorMock.message);
  });
});

describe("UPDATE /api/v1/admin/:id", () => {
  it("should return 422 status code and got error message", async () => {
    const res = await request(app)
      .put(`/api/v1/admin/1`)
      .set("Content-Type", "multipart/form-data")
      .set("Authorization", `Bearer ${bearerToken}`)
      .field({
        role: "Basic",
        nama: "ini basic",
        password: "basic123",
        noTelp: "987654321",
        profilePic: "ini profile admin (update)",
        status: "Aktif",
      });
    expect(res.statusCode).toBe(422);
    expect(res.body.status).toBe(false);
    expect(res.body.message).toBe(
      "Cannot update role to Basic if there's only one Master Admin left!"
    );
  });
});

describe("UPDATE /api/v1/admin", () => {
  it("should return 422 status code and got error message", async () => {
    const res = await request(app)
      .put(`/api/v1/admin`)
      .set("Content-Type", "multipart/form-data")
      .set("Authorization", `Bearer ${bearerToken}`)
      .field({
        role: "Basic",
        nama: "ini basic",
        password: "basic123",
        noTelp: "987654321",
        profilePic: "ini profile admin (update)",
        status: "Aktif",
      });
    expect(res.statusCode).toBe(422);
    expect(res.body.status).toBe(false);
    expect(res.body.message).toBe(
      "Cannot update role to Basic if there's only one Master Admin left!"
    );
  });
});

describe("CREATE /api/v1/admin", () => {
  it("should return 201 status code and create data admin", async () => {
    const res = await request(app)
      .post("/api/v1/admin")
      .set("Content-Type", "multipart/form-data")
      .set("Authorization", `Bearer ${bearerToken}`)
      .field({
        role: "Basic",
        nama: "ini basic",
        password: "basic123",
        noTelp: "987654321",
        profilePic: "ini profile admin",
        status: "Aktif",
      });
    expect(res.statusCode).toBe(201);
    expect(res.body.status).toBe(true);
    expect(res.body.message).toBe("Admin successfully registered");
    expect(res.body.data).toBeDefined();
  });

  it("should return 400 status code and got error message", async () => {
    const res = await request(app)
      .post("/api/v1/admin")
      .set("Content-Type", "multipart/form-data")
      .set("Authorization", `Bearer ${bearerToken}`)
      .field({
        role: "coba",
        nama: "ini basic",
        password: "basic123",
        noTelp: "987654321",
        profilePic: "ini profile admin",
        status: "coba",
      });
    expect(res.statusCode).toBe(400);
    expect(res.body.status).toBe(false);
    expect(res.body.message).toBe("Please input the role or status correctly!");
  });

  it("should return the expected response when there is an error", async () => {
    const errorMock = new Error("Test error");
    jest.spyOn(adminService, "create").mockRejectedValueOnce(errorMock);

    const res = await request(app)
      .post("/api/v1/admin")
      .set("Content-Type", "multipart/form-data")
      .set("Authorization", `Bearer ${bearerToken}`)
      .field({
        role: "Basic",
        nama: "ini basic",
        password: "basic123",
        noTelp: "987654321",
        profilePic: "ini profile admin",
        status: "Aktif",
      })
      .expect(422);

    expect(res.body.status).toBe(false);
    expect(res.body.message).toBe(errorMock.message);
  });
});

describe("DELETE /api/v1/admin/delete/profilePic", () => {
  it("should return 404 status code and data not found", async () => {
    const response = await request(app)
      .delete("/api/v1/admin/delete/profilePic")
      .set("Authorization", `Bearer ${bearerToken}`);

    expect(response.status).toBe(404);
    expect(response.body.status).toBe(false);
    expect(response.body.message).toBe(
      "Data not found or picture has been deleted"
    );
  });
});

describe("UPDATE /api/v1/admin/:id", () => {
  it("should return 200 status code and update data admin", async () => {
    const res = await request(app)
      .put(`/api/v1/admin/${idAD}`)
      .set("Content-Type", "multipart/form-data")
      .set("Authorization", `Bearer ${bearerToken}`)
      .field({
        role: "Basic",
        nama: "ini basic",
        password: "basic123",
        noTelp: "987654321",
        profilePic: "ini profile admin (update)",
        status: "Aktif",
      });
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe(true);
    expect(res.body.message).toBe("Successfully update data");
    expect(res.body.data).toBeDefined();
  });

  it("should return 400 status code and data not found", async () => {
    const res = await request(app)
      .put(`/api/v1/admin/${idAD}`)
      .set("Content-Type", "multipart/form-data")
      .set("Authorization", `Bearer ${bearerToken}`)
      .field({
        role: "coba",
        nama: "ini basic",
        password: "basic123",
        noTelp: "987654321",
        profilePic: "ini profile admin (update)",
        status: "coba",
      });
    expect(res.statusCode).toBe(400);
    expect(res.body.status).toBe(false);
    expect(res.body.message).toBe("Please input the role or status correctly!");
  });

  it("should return the expected response when there is an error", async () => {
    const errorMock = new Error("Test error");
    jest.spyOn(adminService, "update").mockRejectedValueOnce(errorMock);

    const res = await request(app)
      .put(`/api/v1/admin/${idAD}`)
      .set("Content-Type", "multipart/form-data")
      .set("Authorization", `Bearer ${bearerToken}`)
      .field({
        role: "Basic",
        nama: "ini basic",
        password: "basic123",
        noTelp: "987654321",
        profilePic: "ini profile admin (update)",
        status: "Aktif",
      })
      .expect(422);

    expect(res.body.status).toBe(false);
    expect(res.body.message).toBe(errorMock.message);
  });
});

describe("UPDATE /api/v1/admin", () => {
  it("should return 200 status code and update data admin", async () => {
    const res = await request(app)
      .put(`/api/v1/admin`)
      .set("Content-Type", "multipart/form-data")
      .set("Authorization", `Bearer ${bearerToken}`)
      .field({
        role: "Master",
        nama: "Nama Masteradmin",
        noTelp: "081234567890",
        profilePic: "ini profile admin (update)",
        status: "Aktif",
      });
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe(true);
    expect(res.body.message).toBe("Successfully update data");
    expect(res.body.data).toBeDefined();
  });

  it("should return 400 status code and data not found", async () => {
    const res = await request(app)
      .put(`/api/v1/admin`)
      .set("Content-Type", "multipart/form-data")
      .set("Authorization", `Bearer ${bearerToken}`)
      .field({
        role: "coba",
        nama: "ini basic",
        noTelp: "987654321",
        profilePic: "ini profile admin (update 2)",
        status: "coba",
      });
    expect(res.statusCode).toBe(400);
    expect(res.body.status).toBe(false);
    expect(res.body.message).toBe("Please input the role or status correctly!");
  });

  it("should return the expected response when there is an error", async () => {
    const errorMock = new Error("Test error");
    jest.spyOn(adminService, "update").mockRejectedValueOnce(errorMock);

    const res = await request(app)
      .put(`/api/v1/admin`)
      .set("Content-Type", "multipart/form-data")
      .set("Authorization", `Bearer ${bearerToken}`)
      .field({
        role: "Master",
        nama: "Nama Masteradmin",
        noTelp: "081234567890",
        profilePic: "ini profile admin (update)",
        status: "Aktif",
      })
      .expect(422);

    expect(res.body.status).toBe(false);
    expect(res.body.message).toBe(errorMock.message);
  });
});

describe("UPDATE /api/v1/admin/change/password", () => {
  it("should return 404 status code cause password same", async () => {
    const res = await request(app)
      .put(`/api/v1/admin/change/password`)
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${bearerToken}`)
      .send({
        oldPassword: "admin123",
        password: "admin123",
      });
    expect(res.statusCode).toBe(404);
    expect(res.body.status).toBe(false);
    expect(res.body.message).toBe("Please create a different new password!");
  });

  it("should return 404 status code cause old password not match", async () => {
    const res = await request(app)
      .put(`/api/v1/admin/change/password`)
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${bearerToken}`)
      .send({
        oldPassword: "admin1234",
        password: "admin123",
      });
    expect(res.statusCode).toBe(404);
    expect(res.body.status).toBe(false);
    expect(res.body.message).toBe("Password not match with old password");
  });

  it("should return 200 status code and update data admin", async () => {
    const res = await request(app)
      .put(`/api/v1/admin/change/password`)
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${bearerToken}`)
      .send({
        oldPassword: "admin123",
        password: "admin1234",
      });
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe(true);
    expect(res.body.message).toBe("Successfully change password");
  });

  afterAll(async () => {
    await request(app)
      .put(`/api/v1/admin/change/password`)
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${bearerToken}`)
      .send({
        oldPassword: "admin1234",
        password: "admin123",
      });
  });
});

describe("DELETE /api/v1/admin/:id", () => {
  it("should return the expected response when there is an error", async () => {
    const errorMock = new Error("Test error");
    jest.spyOn(adminService, "delete").mockRejectedValueOnce(errorMock);

    const res = await request(app)
      .delete(`/api/v1/admin/${idAD}`)
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${bearerToken}`)
      .expect(422);

    expect(res.body.status).toBe(false);
    expect(res.body.message).toBe(errorMock.message);
  });

  it("should return 422 status code and get error message", async () => {
    const res = await request(app)
      .delete(`/api/v1/admin/1`)
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${bearerToken}`);
    expect(res.statusCode).toBe(422);
    expect(res.body.status).toBe(false);
    expect(res.body.message).toBe("Cannot delete the last Master Admin");
  });

  it("should return 200 status code and delete data admin", async () => {
    const res = await request(app)
      .delete(`/api/v1/admin/${idAD}`)
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${bearerToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe(true);
    expect(res.body.message).toBe("Successfully delete data");
  });

  it("should return 404 status code and data not found", async () => {
    const res = await request(app)
      .delete("/api/v1/admin/999")
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${bearerToken}`);
    expect(res.statusCode).toBe(404);
    expect(res.body.status).toBe(false);
    expect(res.body.message).toBe("Data not found");
  });
});
// --------------------------------------------------------------------------------------------------

// ---------------------------------- testing bagian user by admin ----------------------------------
describe("GET /api/v1/admin/user/all", () => {
  it("should return 200 status code and get all data user", async () => {
    const res = await request(app)
      .get("/api/v1/admin/user/all")
      .set("Authorization", `Bearer ${bearerToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe(true);
    expect(res.body.message).toBe("Successfully get all data");
    expect(res.body.data).toBeDefined();
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.pagination).toBeDefined();
    expect(res.body.metadata).toBeDefined();
  });

  it("should return the expected response when there is an error", async () => {
    const errorMock = new Error("Test error");
    jest.spyOn(userService, "getAllData").mockRejectedValueOnce(errorMock);

    const res = await request(app)
      .get("/api/v1/admin/user/all")
      .set("Authorization", `Bearer ${bearerToken}`)
      .expect(422);

    expect(res.body.status).toBe(false);
    expect(res.body.message).toBe(errorMock.message);
  });
});

describe("GET /api/v1/admin/user/:id", () => {
  it("should return 200 status code and get data user", async () => {
    const res = await request(app)
      .get("/api/v1/admin/user/1")
      .set("Authorization", `Bearer ${bearerToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe(true);
    expect(res.body.message).toBe("Successfully get data by id");
    expect(res.body.data).toBeDefined();
  });

  it("should return the expected response when there is an error", async () => {
    const errorMock = new Error("Test error");
    jest.spyOn(userService, "getById").mockRejectedValueOnce(errorMock);

    const res = await request(app)
      .get("/api/v1/admin/user/1")
      .set("Authorization", `Bearer ${bearerToken}`)
      .expect(422);

    expect(res.body.status).toBe(false);
    expect(res.body.message).toBe(errorMock.message);
  });
});

describe("GET /api/v1/admin/user-address/:userId", () => {
  it("should return 404 status code and data not found", async () => {
    const response = await request(app)
      .get(`/api/v1/admin/user-address/${idUS}`)
      .set("Authorization", `Bearer ${bearerToken}`);

    expect(response.status).toBe(404);
    expect(response.body.status).toBe(false);
    expect(response.body.message).toBe("Data empty, Please input some data!");
  });
});

describe("CREATE /api/v1/admin/user", () => {
  it("should return 201 status code and create data user", async () => {
    const res = await request(app)
      .post("/api/v1/admin/user")
      .set("Content-Type", "multipart/form-data")
      .set("Authorization", `Bearer ${bearerToken}`)
      .field({
        nama: "coba",
        noTelp: "6289876543210",
        tglLahir: "2002-05-13",
        profilePic: "ini gambar profile",
        kategori: "rumah",
        detail: "ini detail alamat",
        kecamatan: "ini kecamatan",
        kelurahan: "ini kelurahan",
        gambar: "ini gambar alamat",
        status: "Standard",
      });
    expect(res.statusCode).toBe(201);
    expect(res.body.status).toBe(true);
    expect(res.body.message).toBe("User successfully registered");
    expect(res.body.data).toBeDefined();
  });

  it("should return the expected response when there is an error", async () => {
    const errorMock = new Error("Test error");
    jest.spyOn(userService, "create").mockRejectedValueOnce(errorMock);

    const res = await request(app)
      .post("/api/v1/admin/user")
      .set("Content-Type", "multipart/form-data")
      .set("Authorization", `Bearer ${bearerToken}`)
      .field({
        nama: "coba",
        noTelp: "6289876543210",
        tglLahir: "2002-05-13",
        profilePic: "ini gambar profile",
        kategori: "rumah",
        detail: "ini detail alamat",
        kecamatan: "ini kecamatan",
        kelurahan: "ini kelurahan",
        gambar: "ini gambar alamat",
        status: "Standard",
      })
      .expect(422);

    expect(res.body.status).toBe(false);
    expect(res.body.message).toBe(errorMock.message);
  });
});

describe("CREATE /api/v1/admin/user-address/:userId", () => {
  it("should return 201 status code and create data user", async () => {
    const res = await request(app)
      .post(`/api/v1/admin/user-address/1`)
      .set("Content-Type", "multipart/form-data")
      .set("Authorization", `Bearer ${bearerToken}`)
      .field({
        kategori: "rumah",
        detail: "ini detail alamat",
        kecamatan: "ini kecamatan",
        kelurahan: "ini kelurahan",
        gambar: "ini gambar alamat",
        status: "Priority",
      });
    expect(res.statusCode).toBe(201);
    expect(res.body.status).toBe(true);
    expect(res.body.message).toBe("Successfully create data");
    expect(res.body.data).toBeDefined();
  });

  it("should return 400 status code and got error message", async () => {
    const res = await request(app)
      .post(`/api/v1/admin/user-address/1`)
      .set("Content-Type", "multipart/form-data")
      .set("Authorization", `Bearer ${bearerToken}`)
      .field({
        kategori: "rumah",
        detail: "ini detail alamat",
        kecamatan: "ini kecamatan",
        kelurahan: "ini kelurahan",
        gambar: "ini gambar alamat",
        status: "coba",
      });
    expect(res.statusCode).toBe(400);
    expect(res.body.status).toBe(false);
    expect(res.body.message).toBe("Please input the status correctly!");
  });

  it("should return the expected response when there is an error", async () => {
    const errorMock = new Error("Test error");
    jest.spyOn(alamatService, "createAddress").mockRejectedValueOnce(errorMock);

    const res = await request(app)
      .post(`/api/v1/admin/user-address/1`)
      .set("Content-Type", "multipart/form-data")
      .set("Authorization", `Bearer ${bearerToken}`)
      .field({
        kategori: "rumah",
        detail: "ini detail alamat",
        kecamatan: "ini kecamatan",
        kelurahan: "ini kelurahan",
        gambar: "ini gambar alamat",
        status: "Priority",
      })
      .expect(422);

    expect(res.body.status).toBe(false);
    expect(res.body.message).toBe(errorMock.message);
  });
});

describe("UPDATE /api/v1/admin/user/:id", () => {
  it("should return 200 status code and update data alamat", async () => {
    const res = await request(app)
      .put(`/api/v1/admin/user/${idUS}`)
      .set("Content-Type", "multipart/form-data")
      .set("Authorization", `Bearer ${bearerToken}`)
      .field({
        nama: "coba",
        noTelp: "62898765432199",
        tglLahir: "2002-05-13",
        profilePic: "ini gambar profile (update)",
      });
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe(true);
    expect(res.body.message).toBe("Successfully update data");
    expect(res.body.data).toBeDefined();
  });

  it("should return 422 status code and got error message", async () => {
    const res = await request(app)
      .put(`/api/v1/admin/user/${idUS}`)
      .set("Content-Type", "multipart/form-data")
      .set("Authorization", `Bearer ${bearerToken}`)
      .field({
        nama: "coba",
        noTelp: "62898765432199",
        tglLahir: "2002-05-13",
        profilePic: "ini gambar profile (update)",
        alamatUser: "",
      });
    expect(res.statusCode).toBe(422);
    expect(res.body.status).toBe(false);
    expect(res.body.message).toBe("Cannot change alamatUser!");
  });

  // it("should return 404 status code and data not found", async () => {
  //   const res = await request(app)
  //     .put("/api/v1/admin/user/9999")
  //     .set("Content-Type", "application/json")
  //     .set("Authorization", `Bearer ${bearerToken}`);
  //   expect(res.statusCode).toBe(404);
  //   expect(res.body.status).toBe(false);
  //   expect(res.body.message).toBe("Data not found");
  // });

  it("should return the expected response when there is an error", async () => {
    const errorMock = new Error("Test error");
    jest.spyOn(userService, "update").mockRejectedValueOnce(errorMock);

    const res = await request(app)
      .put(`/api/v1/admin/user/${idUS}`)
      .set("Content-Type", "multipart/form-data")
      .set("Authorization", `Bearer ${bearerToken}`)
      .field({
        nama: "coba",
        noTelp: "62898765432199",
        tglLahir: "2002-05-13",
        profilePic: "ini gambar profile (update)",
      })
      .expect(422);

    expect(res.body.status).toBe(false);
    expect(res.body.message).toBe(errorMock.message);
  });
});

describe("UPDATE /api/v1/admin/user-address/:userId/:id", () => {
  it("should return 200 status code and create data user", async () => {
    const res = await request(app)
      .put(`/api/v1/admin/user-address/1/${idAl4}`)
      .set("Content-Type", "multipart/form-data")
      .set("Authorization", `Bearer ${bearerToken}`)
      .field({
        kategori: "rumah",
        detail: "ini detail alamat (update 4)",
        kecamatan: "ini kecamatan (update 4)",
        kelurahan: "ini kelurahan (update 4)",
        gambar: "ini gambar alamat (update 4)",
        status: "Priority",
      });
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe(true);
    expect(res.body.message).toBe("Successfully update data");
    expect(res.body.data).toBeDefined();
  });

  it("should return 400 status code and got error message", async () => {
    const res = await request(app)
      .put(`/api/v1/admin/user-address/1/${idAl4}`)
      .set("Content-Type", "multipart/form-data")
      .set("Authorization", `Bearer ${bearerToken}`)
      .field({
        kategori: "rumah",
        detail: "ini detail alamat",
        kecamatan: "ini kecamatan",
        kelurahan: "ini kelurahan",
        gambar: "ini gambar alamat",
        status: "coba",
      });
    expect(res.statusCode).toBe(400);
    expect(res.body.status).toBe(false);
    expect(res.body.message).toBe("Please input the status correctly!");
  });

  it("should return 422 status code and got error message", async () => {
    const res = await request(app)
      .put(`/api/v1/admin/user-address/1/${idAl4}`)
      .set("Content-Type", "multipart/form-data")
      .set("Authorization", `Bearer ${bearerToken}`)
      .field({
        kategori: "rumah",
        detail: "ini detail alamat",
        kecamatan: "ini kecamatan",
        kelurahan: "ini kelurahan",
        gambar: "ini gambar alamat",
        status: "Standard",
      });
    expect(res.statusCode).toBe(422);
    expect(res.body.status).toBe(false);
    expect(res.body.message).toBe(
      "You can't update status from Priority to Standard!"
    );
  });

  it("should return the expected response when there is an error", async () => {
    const errorMock = new Error("Test error");
    jest.spyOn(alamatService, "adminUpdated").mockRejectedValueOnce(errorMock);

    const res = await request(app)
      .put(`/api/v1/admin/user-address/1/${idAl4}`)
      .set("Content-Type", "multipart/form-data")
      .set("Authorization", `Bearer ${bearerToken}`)
      .field({
        kategori: "rumah",
        detail: "ini detail alamat (update 4)",
        kecamatan: "ini kecamatan (update 4)",
        kelurahan: "ini kelurahan (update 4)",
        gambar: "ini gambar alamat (update 4)",
        status: "Priority",
      })
      .expect(422);

    expect(res.body.status).toBe(false);
    expect(res.body.message).toBe(errorMock.message);
  });
});

describe("DELETE /api/v1/admin/user-address/:userId/:id", () => {
  it("should return the expected response when there is an error", async () => {
    const errorMock = new Error("Test error");
    jest.spyOn(alamatService, "deleteAddress").mockRejectedValueOnce(errorMock);

    const res = await request(app)
      .delete(`/api/v1/admin/user-address/1/${idAl2}`)
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${bearerToken}`)
      .expect(422);

    expect(res.body.status).toBe(false);
    expect(res.body.message).toBe(errorMock.message);
  });

  it("should return 200 status code and delete data user", async () => {
    const res = await request(app)
      .delete(`/api/v1/admin/user-address/1/${idAl2}`)
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${bearerToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe(true);
    expect(res.body.message).toBe("Successfully delete data");
  });

  it("should return 404 status code and data not found", async () => {
    const res = await request(app)
      .delete("/api/v1/admin/user-address/1/9999")
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${bearerToken}`);
    expect(res.statusCode).toBe(404);
    expect(res.body.status).toBe(false);
    expect(res.body.message).toBe("Data not found");
  });

  it("should return 422 status code and got error message", async () => {
    const res = await request(app)
      .delete(`/api/v1/admin/user-address/1/${idAl4}`)
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${bearerToken}`);
    expect(res.statusCode).toBe(422);
    expect(res.body.status).toBe(false);
    expect(res.body.message).toBe(
      "Cannot delete Priority address! Please change other address to Priority first!"
    );
  });
});

describe("DELETE /api/v1/admin/user/:id", () => {
  it("should return the expected response when there is an error", async () => {
    const errorMock = new Error("Test error");
    jest.spyOn(userService, "delete").mockRejectedValueOnce(errorMock);

    const res = await request(app)
      .delete(`/api/v1/admin/user/${idUS}`)
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${bearerToken}`)
      .expect(422);

    expect(res.body.status).toBe(false);
    expect(res.body.message).toBe(errorMock.message);
  });

  it("should return 200 status code and delete data user", async () => {
    const res = await request(app)
      .delete(`/api/v1/admin/user/${idUS}`)
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${bearerToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe(true);
    expect(res.body.message).toBe("Successfully delete data");
  });

  it("should return 404 status code and data not found", async () => {
    const res = await request(app)
      .delete("/api/v1/admin/user/9999")
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${bearerToken}`);
    expect(res.statusCode).toBe(404);
    expect(res.body.status).toBe(false);
    expect(res.body.message).toBe("Data not found");
  });
});
// --------------------------------------------------------------------------------------------------

const { Alamat } = require("../app/models");
const {
  getAll,
  getAllData,
  getById,
  adminCreated,
  adminUpdated,
  adminDeleted,
  getAllAddress,
  getAddressById,
  createAddress,
  updateAllAddress,
  updateAddressPriority,
  updateAddress,
  deleteAddress,
} = require("../app/services/alamatService");

describe("getAll services", () => {
  it("should throw an error when an error occurs", () => {
    // Mock implementation of About.findAll() that throws an error
    Alamat.findAll = jest.fn().mockImplementation(() => {
      throw new Error("Test error");
    });
    // Expect the function to throw an error
    expect(getAll).toThrow("Test error");
  });
});

describe("getAllData services", () => {
  it("should throw an error when an error occurs", () => {
    // Mock implementation of About.findAll() that throws an error
    Alamat.findAll = jest.fn().mockImplementation(() => {
      throw new Error("Test error");
    });
    // Expect the function to throw an error
    expect(getAllData).toThrow("Test error");
  });
});

describe("getAllAddress services", () => {
  it("should throw an error when an error occurs", () => {
    // Mock implementation of About.findAll() that throws an error
    Alamat.findAll = jest.fn().mockImplementation(() => {
      throw new Error("Test error");
    });
    // Expect the function to throw an error
    expect(getAllAddress).toThrow("Test error");
  });
});

describe("getById services", () => {
  it("should throw an error when an error occurs", () => {
    // Mock implementation of About.findOne() that throws an error
    Alamat.findOne = jest.fn().mockImplementation(() => {
      throw new Error("Test error");
    });
    // Expect the function to throw an error
    expect(getById).toThrow("Test error");
  });
});

describe("getAddressById services", () => {
  it("should throw an error when an error occurs", () => {
    // Mock implementation of About.findOne() that throws an error
    Alamat.findOne = jest.fn().mockImplementation(() => {
      throw new Error("Test error");
    });
    // Expect the function to throw an error
    expect(getAddressById).toThrow("Test error");
  });
});

describe("adminCreated services", () => {
  it("should throw an error when an error occurs", () => {
    // Mock implementation of About.create() that throws an error
    Alamat.create = jest.fn().mockImplementation(() => {
      throw new Error("Test error");
    });
    // Expect the function to throw an error
    expect(adminCreated).toThrow("Test error");
  });
});

describe("createAddress services", () => {
  it("should throw an error when an error occurs", () => {
    // Mock implementation of About.create() that throws an error
    Alamat.create = jest.fn().mockImplementation(() => {
      throw new Error("Test error");
    });
    // Expect the function to throw an error
    expect(createAddress).toThrow("Test error");
  });
});

describe("adminUpdated services", () => {
  it("should throw an error when an error occurs", () => {
    // Mock implementation of About.update() that throws an error
    Alamat.update = jest.fn().mockImplementation(() => {
      throw new Error("Test error");
    });
    // Expect the function to throw an error
    expect(adminUpdated).toThrow("Test error");
  });
});

describe("updateAllAddress services", () => {
  it("should throw an error when an error occurs", () => {
    // Mock implementation of About.update() that throws an error
    Alamat.update = jest.fn().mockImplementation(() => {
      throw new Error("Test error");
    });
    // Expect the function to throw an error
    expect(updateAllAddress).toThrow("Test error");
  });
});

describe("updateAddressPriority services", () => {
  it("should throw an error when an error occurs", () => {
    // Mock implementation of About.update() that throws an error
    Alamat.update = jest.fn().mockImplementation(() => {
      throw new Error("Test error");
    });
    // Expect the function to throw an error
    expect(updateAddressPriority).toThrow("Test error");
  });
});

describe("updateAddress services", () => {
  it("should throw an error when an error occurs", () => {
    // Mock implementation of About.update() that throws an error
    Alamat.update = jest.fn().mockImplementation(() => {
      throw new Error("Test error");
    });
    // Expect the function to throw an error
    expect(updateAddress).toThrow("Test error");
  });
});

describe("adminDeleted services", () => {
  it("should throw an error when an error occurs", () => {
    // Mock implementation of About.update() that throws an error
    Alamat.destroy = jest.fn().mockImplementation(() => {
      throw new Error("Test error");
    });
    // Expect the function to throw an error
    expect(adminDeleted).toThrow("Test error");
  });
});

describe("deleteAddress services", () => {
  it("should throw an error when an error occurs", () => {
    // Mock implementation of About.update() that throws an error
    Alamat.destroy = jest.fn().mockImplementation(() => {
      throw new Error("Test error");
    });
    // Expect the function to throw an error
    expect(deleteAddress).toThrow("Test error");
  });
});
