const { Admin } = require("../app/models");
const {
  getAll,
  getAllData,
  searchAdmin,
  getById,
  getByIdAll,
  getByName,
  getByPhone,
  create,
  update,
  updateProfilePic,
} = require("../app/services/adminService");

describe("getAll services", () => {
  it("should throw an error when an error occurs", () => {
    // Mock implementation of About.findAll() that throws an error
    Admin.findAll = jest.fn().mockImplementation(() => {
      throw new Error("Test error");
    });
    // Expect the function to throw an error
    expect(getAll).toThrow("Test error");
  });
});

describe("getAllData services", () => {
  it("should throw an error when an error occurs", () => {
    // Mock implementation of About.findAll() that throws an error
    Admin.findAll = jest.fn().mockImplementation(() => {
      throw new Error("Test error");
    });
    // Expect the function to throw an error
    expect(getAllData).toThrow("Test error");
  });
});

describe("searchAdmin services", () => {
  it("should throw an error when an error occurs", () => {
    // Mock implementation of About.findAll() that throws an error
    Admin.findAll = jest.fn().mockImplementation(() => {
      throw new Error("Test error");
    });
    // Expect the function to throw an error
    expect(searchAdmin).toThrow("Test error");
  });
});

describe("getById services", () => {
  it("should throw an error when an error occurs", () => {
    // Mock implementation of About.findOne() that throws an error
    Admin.findOne = jest.fn().mockImplementation(() => {
      throw new Error("Test error");
    });
    // Expect the function to throw an error
    expect(getById).toThrow("Test error");
  });
});

describe("getByIdAll services", () => {
  it("should throw an error when an error occurs", () => {
    // Mock implementation of About.findOne() that throws an error
    Admin.findOne = jest.fn().mockImplementation(() => {
      throw new Error("Test error");
    });
    // Expect the function to throw an error
    expect(getByIdAll).toThrow("Test error");
  });
});

describe("getByName services", () => {
  it("should throw an error when an error occurs", () => {
    // Mock implementation of About.findOne() that throws an error
    Admin.findOne = jest.fn().mockImplementation(() => {
      throw new Error("Test error");
    });
    // Expect the function to throw an error
    expect(getByName).toThrow("Test error");
  });
});

describe("getByPhone services", () => {
  it("should throw an error when an error occurs", () => {
    // Mock implementation of About.findOne() that throws an error
    Admin.findOne = jest.fn().mockImplementation(() => {
      throw new Error("Test error");
    });
    // Expect the function to throw an error
    expect(getByPhone).toThrow("Test error");
  });
});

describe("create services", () => {
  it("should throw an error when an error occurs", () => {
    // Mock implementation of About.create() that throws an error
    Admin.create = jest.fn().mockImplementation(() => {
      throw new Error("Test error");
    });
    // Expect the function to throw an error
    expect(create).toThrow("Test error");
  });
});

describe("update services", () => {
  it("should throw an error when an error occurs", () => {
    // Mock implementation of About.update() that throws an error
    Admin.update = jest.fn().mockImplementation(() => {
      throw new Error("Test error");
    });
    // Expect the function to throw an error
    expect(update).toThrow("Test error");
  });
});

describe("updateProfilePic services", () => {
  it("should throw an error when an error occurs", () => {
    // Mock implementation of About.update() that throws an error
    Admin.update = jest.fn().mockImplementation(() => {
      throw new Error("Test error");
    });
    // Expect the function to throw an error
    expect(updateProfilePic).toThrow("Test error");
  });
});
