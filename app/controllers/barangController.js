const barangService = require("../services/barangService");
const pemesananService = require("../services/pemesananService");
const { promisify } = require("util");
const cloudinary = require("../../config/cloudinary");
const cloudinaryUpload = promisify(cloudinary.uploader.upload);
const cloudinaryDelete = promisify(cloudinary.uploader.destroy);

module.exports = {
  async getAll(req, res) {
    try {
      const page = parseInt(req.query.page) || 1; // Halaman saat ini
      const perPage = parseInt(req.query.perPage) || 10; // Jumlah item per halaman
      const allowedPerPage = [10, 20, 50, 100]; // Pastikan jumlah data per halaman yang didukung
      if (!allowedPerPage.includes(perPage)) {
        perPage = 10; // Jika tidak valid, gunakan 10 data per halaman sebagai default
      }
      const start = 0 + (page - 1) * perPage; // Offset data yang akan diambil
      const end = page * perPage; // Batas data yang akan diambil
      const data = await barangService.getAll(perPage, start); // Data yang sudah dipaginasi
      const allData = await barangService.getAllData(); // Seluruh data tanpa paginasi
      const totalCount = await allData.length; // Hitung total item
      const totalPage = Math.ceil(totalCount / perPage); // Hitung total halaman
      const pagination = {}; // Inisialisasi pagination buat nampung response
      if (end < totalCount) {
        // Pagination next jika jumlah data melebihi jumlah data per halaman
        pagination.next = {
          page: page + 1,
          perPage: perPage,
        };
      }
      if (start > 0) {
        // Pagination previous jika sedang berada di halaman selain halaman pertama
        pagination.previous = {
          page: page - 1,
          perPage: perPage,
        };
      }
      // Respon yang akan ditampilkan jika datanya ada
      if (data.length >= 1) {
        res.status(200).json({
          status: true,
          message: "Successfully get all data",
          data,
          pagination,
          metadata: {
            page: page,
            perPage: perPage,
            totalPage: totalPage,
            totalCount: totalCount,
          },
        });
      } else {
        res.status(404).json({
          status: false,
          message: "Data empty, Please input some data!",
        });
      }
    } catch (err) {
      res.status(422).json({
        status: false,
        message: err.message,
      });
    }
  },

  async getById(req, res) {
    try {
      const data = await barangService.getById(req.params.id);
      if (data !== null) {
        res.status(200).json({
          status: true,
          message: "Successfully get data by id",
          data,
        });
      } else {
        res.status(404).json({
          status: false,
          message: "Data not found",
        });
      }
    } catch (err) {
      res.status(422).json({
        status: false,
        message: err.message,
      });
    }
  },

  async getAllByPemesananId(req, res) {
    try {
      const data = await barangService.getAllByPemesananId(
        req.params.pemesananId
      );
      if (data.length !== 0) {
        res.status(200).json({
          status: true,
          message: "Successfully get data by id",
          data,
        });
      } else {
        res.status(404).json({
          status: false,
          message: "Data not found",
        });
      }
    } catch (err) {
      res.status(422).json({
        status: false,
        message: err.message,
      });
    }
  },

  async getAllByPemesananIdFromUser(req, res) {
    try {
      const data = await barangService.getAllByPemesananId(
        req.params.pemesananId
      );
      if (data.length !== 0) {
        res.status(200).json({
          status: true,
          message: "Successfully get data by id",
          data,
        });
      } else {
        res.status(404).json({
          status: false,
          message: "Data not found",
        });
      }
    } catch (err) {
      res.status(422).json({
        status: false,
        message: err.message,
      });
    }
  },

  async createByAdmin(req, res) {
    try {
      if (req.body.kuantitas < 0 || req.body.harga < 0) {
        res.status(422).json({
          status: false,
          message: "Harga atau kuantitas tidak boleh kurang dari 0",
        });
      } else {
        const requestFile = req.file;
        if (requestFile === null || requestFile === undefined) {
          const data = await barangService.create({
            ...req.body,
            gambar: null,
            harga: req.body.harga || 0,
            jumlah: req.body.harga * req.body.kuantitas,
          });
          // update total harga pemesanan
          const barang = await barangService.getAllByPemesananId(
            data.pemesananId
          );
          const total = barang.reduce((acc, curr) => {
            return acc + curr.jumlah;
          }, 0);
          const print = await barangService.getById(data.id);
          await pemesananService.updateByAdmin(
            data.pemesananId,
            req.admin.id,
            req.admin.nama,
            {
              totalHarga: total - print.Pemesanan.diskon,
            }
          );
          res.status(201).json({
            status: true,
            message: "Successfully create data",
            data,
          });
        } else {
          // upload gambar ke cloudinary
          const fileBase64 = requestFile.buffer.toString("base64");
          const file = `data:${requestFile.mimetype};base64,${fileBase64}`;
          const result = await cloudinaryUpload(file, {
            folder: "barangPemesanan",
            resource_type: "image",
            allowed_formats: ["jpg", "png", "jpeg", "gif", "svg", "webp"],
          });
          const url = result.secure_url;
          const data = await barangService.create({
            ...req.body,
            gambar: url,
            harga: req.body.harga || 0,
            jumlah: req.body.harga * req.body.kuantitas,
          });
          // update total harga pemesanan
          const barang = await barangService.getAllByPemesananId(
            data.pemesananId
          );
          const total = barang.reduce((acc, curr) => {
            return acc + curr.jumlah;
          }, 0);
          const print = await barangService.getById(data.id);
          await pemesananService.updateByAdmin(
            data.pemesananId,
            req.admin.id,
            req.admin.nama,
            {
              totalHarga: total - print.Pemesanan.diskon,
            }
          );
          res.status(201).json({
            status: true,
            message: "Successfully create data",
            data,
          });
        }
      }
    } catch (err) {
      res.status(422).json({
        status: false,
        message: err.message,
      });
    }
  },

  async createByUser(req, res) {
    try {
      if (req.body.kuantitas < 0 || req.body.harga < 0) {
        res.status(422).json({
          status: false,
          message: "Harga atau kuantitas tidak boleh kurang dari 0",
        });
      } else {
        const requestFile = req.file;
        if (requestFile === null || requestFile === undefined) {
          const data = await barangService.createByUser(req.user.id, {
            ...req.body,
            gambar: null,
            harga: req.body.harga || 0,
            jumlah: req.body.harga * req.body.kuantitas,
          });
          // update total harga pemesanan
          const barang = await barangService.getAllByPemesananId(
            data.pemesananId
          );
          const total = barang.reduce((acc, curr) => {
            return acc + curr.jumlah;
          }, 0);
          const print = await barangService.getById(data.id);
          await pemesananService.updateByUser(
            data.pemesananId,
            req.user.id,
            req.user.nama,
            {
              totalHarga: total - print.Pemesanan.diskon,
            }
          );
          res.status(201).json({
            status: true,
            message: "Successfully create data",
            data,
          });
        } else {
          // upload gambar ke cloudinary
          const fileBase64 = requestFile.buffer.toString("base64");
          const file = `data:${requestFile.mimetype};base64,${fileBase64}`;
          const result = await cloudinaryUpload(file, {
            folder: "barangPemesanan",
            resource_type: "image",
            allowed_formats: ["jpg", "png", "jpeg", "gif", "svg", "webp"],
          });
          const url = result.secure_url;
          const data = await barangService.createByUser(req.user.id, {
            ...req.body,
            gambar: url,
            harga: req.body.harga || 0,
            jumlah: req.body.harga * req.body.kuantitas,
          });
          // update total harga pemesanan
          const barang = await barangService.getAllByPemesananId(
            data.pemesananId
          );
          const total = barang.reduce((acc, curr) => {
            return acc + curr.jumlah;
          }, 0);
          const print = await barangService.getById(data.id);
          await pemesananService.updateByUser(
            data.pemesananId,
            req.user.id,
            req.user.nama,
            {
              totalHarga: total - print.Pemesanan.diskon,
            }
          );
          res.status(201).json({
            status: true,
            message: "Successfully create data",
            data,
          });
        }
      }
    } catch (err) {
      res.status(422).json({
        status: false,
        message: err.message,
      });
    }
  },

  async updateByAdmin(req, res) {
    try {
      const data = await barangService.getById(req.params.id);
      const requestFile = req.file;
      if (data === null) {
        res.status(404).json({
          status: false,
          message: "Data not found",
        });
      } else {
        if (req.body.kuantitas < 0 || req.body.harga < 0) {
          res.status(422).json({
            status: false,
            message: "Harga atau kuantitas tidak boleh kurang dari 0",
          });
        } else {
          const urlImage = data.gambar;
          if (urlImage === null || urlImage === "") {
            if (requestFile === null || requestFile === undefined) {
              await barangService.update(req.params.id, {
                ...req.body,
                gambar: null,
                harga: req.body.harga || 0,
                jumlah: req.body.harga * req.body.kuantitas,
              });
              const data = await barangService.getById(req.params.id);
              // update total harga pemesanan
              const barang = await barangService.getAllByPemesananId(
                data.pemesananId
              );
              const total = barang.reduce((acc, curr) => {
                return acc + curr.jumlah;
              }, 0);
              const print = await barangService.getById(data.id);
              await pemesananService.updateByAdmin(
                data.pemesananId,
                req.admin.id,
                req.admin.nama,
                {
                  totalHarga: total - print.Pemesanan.diskon,
                }
              );
              res.status(200).json({
                status: true,
                message: "Successfully update data",
                data: data,
              });
            } else {
              const fileBase64 = requestFile.buffer.toString("base64");
              const file = `data:${requestFile.mimetype};base64,${fileBase64}`;
              const result = await cloudinaryUpload(file, {
                folder: "barangPemesanan",
                resource_type: "image",
                allowed_formats: ["jpg", "png", "jpeg", "gif", "svg", "webp"],
              });
              const url = result.secure_url;
              await barangService.update(req.params.id, {
                ...req.body,
                gambar: url,
                harga: req.body.harga || 0,
                jumlah: req.body.harga * req.body.kuantitas,
              });
              const data = await barangService.getById(req.params.id);
              // update total harga pemesanan
              const barang = await barangService.getAllByPemesananId(
                data.pemesananId
              );
              const total = barang.reduce((acc, curr) => {
                return acc + curr.jumlah;
              }, 0);
              const print = await barangService.getById(data.id);
              await pemesananService.updateByAdmin(
                data.pemesananId,
                req.admin.id,
                req.admin.nama,
                {
                  totalHarga: total - print.Pemesanan.diskon,
                }
              );
              res.status(200).json({
                status: true,
                message: "Successfully update data",
                data: data,
              });
            }
          } else {
            if (requestFile === null || requestFile === undefined) {
              await barangService.update(req.params.id, {
                ...req.body,
                gambar: urlImage,
                harga: req.body.harga || 0,
                jumlah: req.body.harga * req.body.kuantitas,
              });
              const data = await barangService.getById(req.params.id);
              // update total harga pemesanan
              const barang = await barangService.getAllByPemesananId(
                data.pemesananId
              );
              const total = barang.reduce((acc, curr) => {
                return acc + curr.jumlah;
              }, 0);
              const print = await barangService.getById(data.id);
              await pemesananService.updateByAdmin(
                data.pemesananId,
                req.admin.id,
                req.admin.nama,
                {
                  totalHarga: total - print.Pemesanan.diskon,
                }
              );
              res.status(200).json({
                status: true,
                message: "Successfully update data",
                data: data,
              });
            } else {
              // mengambil url gambar dari cloudinary dan menghapusnya
              const getPublicId =
                "barangPemesanan/" +
                urlImage.split("/").pop().split(".")[0] +
                "";
              await cloudinaryDelete(getPublicId);
              // upload gambar ke cloudinary
              const fileBase64 = requestFile.buffer.toString("base64");
              const file = `data:${requestFile.mimetype};base64,${fileBase64}`;
              const result = await cloudinaryUpload(file, {
                folder: "barangPemesanan",
                resource_type: "image",
                allowed_formats: ["jpg", "png", "jpeg", "gif", "svg", "webp"],
              });
              const url = result.secure_url;
              await barangService.update(req.params.id, {
                ...req.body,
                gambar: url,
                harga: req.body.harga || 0,
                jumlah: req.body.harga * req.body.kuantitas,
              });
              const data = await barangService.getById(req.params.id);
              // update total harga pemesanan
              const barang = await barangService.getAllByPemesananId(
                data.pemesananId
              );
              const total = barang.reduce((acc, curr) => {
                return acc + curr.jumlah;
              }, 0);
              const print = await barangService.getById(data.id);
              await pemesananService.updateByAdmin(
                data.pemesananId,
                req.admin.id,
                req.admin.nama,
                {
                  totalHarga: total - print.Pemesanan.diskon,
                }
              );
              res.status(200).json({
                status: true,
                message: "Successfully update data",
                data: data,
              });
            }
          }
        }
      }
    } catch (err) {
      res.status(422).json({
        status: false,
        message: err.message,
      });
    }
  },

  async updateByUser(req, res) {
    try {
      const data = await barangService.getById(req.params.id);
      const requestFile = req.file;
      if (data === null) {
        res.status(404).json({
          status: false,
          message: "Data not found",
        });
      } else {
        if (req.body.kuantitas < 0 || req.body.harga < 0) {
          res.status(422).json({
            status: false,
            message: "Harga atau kuantitas tidak boleh kurang dari 0",
          });
        } else {
          const urlImage = data.gambar;
          if (urlImage === null || urlImage === "") {
            if (requestFile === null || requestFile === undefined) {
              await barangService.updateByUser(req.params.id, req.user.id, {
                ...req.body,
                gambar: null,
                harga: req.body.harga || 0,
                jumlah: req.body.harga * req.body.kuantitas,
              });
              const data = await barangService.getById(req.params.id);
              // update total harga pemesanan
              const barang = await barangService.getAllByPemesananId(
                data.pemesananId
              );
              const total = barang.reduce((acc, curr) => {
                return acc + curr.jumlah;
              }, 0);
              const print = await barangService.getById(data.id);
              await pemesananService.updateByUser(
                data.pemesananId,
                req.user.id,
                req.user.nama,
                {
                  totalHarga: total - print.Pemesanan.diskon,
                }
              );
              res.status(200).json({
                status: true,
                message: "Successfully update data",
                data: data,
              });
            } else {
              const fileBase64 = requestFile.buffer.toString("base64");
              const file = `data:${requestFile.mimetype};base64,${fileBase64}`;
              const result = await cloudinaryUpload(file, {
                folder: "barangPemesanan",
                resource_type: "image",
                allowed_formats: ["jpg", "png", "jpeg", "gif", "svg", "webp"],
              });
              const url = result.secure_url;
              await barangService.updateByUser(req.params.id, req.user.id, {
                ...req.body,
                gambar: url,
                harga: req.body.harga || 0,
                jumlah: req.body.harga * req.body.kuantitas,
              });
              const data = await barangService.getById(req.params.id);
              // update total harga pemesanan
              const barang = await barangService.getAllByPemesananId(
                data.pemesananId
              );
              const total = barang.reduce((acc, curr) => {
                return acc + curr.jumlah;
              }, 0);
              const print = await barangService.getById(data.id);
              await pemesananService.updateByUser(
                data.pemesananId,
                req.user.id,
                req.user.nama,
                {
                  totalHarga: total - print.Pemesanan.diskon,
                }
              );
              res.status(200).json({
                status: true,
                message: "Successfully update data",
                data: data,
              });
            }
          } else {
            if (requestFile === null || requestFile === undefined) {
              await barangService.updateByUser(req.params.id, req.user.id, {
                ...req.body,
                gambar: urlImage,
                harga: req.body.harga || 0,
                jumlah: req.body.harga * req.body.kuantitas,
              });
              const data = await barangService.getById(req.params.id);
              // update total harga pemesanan
              const barang = await barangService.getAllByPemesananId(
                data.pemesananId
              );
              const total = barang.reduce((acc, curr) => {
                return acc + curr.jumlah;
              }, 0);
              const print = await barangService.getById(data.id);
              await pemesananService.updateByUser(
                data.pemesananId,
                req.user.id,
                req.user.nama,
                {
                  totalHarga: total - print.Pemesanan.diskon,
                }
              );
              res.status(200).json({
                status: true,
                message: "Successfully update data",
                data: data,
              });
            } else {
              // mengambil url gambar dari cloudinary dan menghapusnya
              const getPublicId =
                "barangPemesanan/" +
                urlImage.split("/").pop().split(".")[0] +
                "";
              await cloudinaryDelete(getPublicId);
              // upload gambar ke cloudinary
              const fileBase64 = requestFile.buffer.toString("base64");
              const file = `data:${requestFile.mimetype};base64,${fileBase64}`;
              const result = await cloudinaryUpload(file, {
                folder: "barangPemesanan",
                resource_type: "image",
                allowed_formats: ["jpg", "png", "jpeg", "gif", "svg", "webp"],
              });
              const url = result.secure_url;
              await barangService.updateByUser(req.params.id, req.user.id, {
                ...req.body,
                gambar: url,
                harga: req.body.harga || 0,
                jumlah: req.body.harga * req.body.kuantitas,
              });
              const data = await barangService.getById(req.params.id);
              // update total harga pemesanan
              const barang = await barangService.getAllByPemesananId(
                data.pemesananId
              );
              const total = barang.reduce((acc, curr) => {
                return acc + curr.jumlah;
              }, 0);
              const print = await barangService.getById(data.id);
              await pemesananService.updateByUser(
                data.pemesananId,
                req.user.id,
                req.user.nama,
                {
                  totalHarga: total - print.Pemesanan.diskon,
                }
              );
              res.status(200).json({
                status: true,
                message: "Successfully update data",
                data: data,
              });
            }
          }
        }
      }
    } catch (err) {
      res.status(422).json({
        status: false,
        message: err.message,
      });
    }
  },

  async deleteByAdmin(req, res) {
    try {
      const data = await barangService.getById(req.params.id);
      if (data === null) {
        res.status(404).json({
          status: false,
          message: "Data not found",
        });
      } else {
        const urlImage = data.gambar;
        if (data === 1 || urlImage) {
          // mengambil url gambar dari database dan menghapusnya
          const getPublicId =
            "barangPemesanan/" + urlImage.split("/").pop().split(".")[0] + "";
          await cloudinaryDelete(getPublicId);
          const getData = await barangService.getById(data.id);
          // delete data barang
          await barangService.delete(req.params.id);
          res.status(200).json({
            status: true,
            message: "Successfully delete data",
          });
          // mengambil semua data barang dan menjumlahkan semua total harganya
          const barang = await barangService.getAllByPemesananId(
            getData.pemesananId
          );
          const total = barang.reduce((acc, curr) => {
            return acc + curr.jumlah;
          }, 0);
          // update total harga pemesanan
          await pemesananService.updateByUser(
            getData.pemesananId,
            req.admin.id,
            req.admin.nama,
            {
              totalHarga: total - getData.Pemesanan.diskon,
            }
          );
        } else if (urlImage === null) {
          const getData = await barangService.getById(data.id);
          // delete data barang
          await barangService.delete(req.params.id);
          res.status(200).json({
            status: true,
            message: "Successfully delete data",
          });
          // mengambil semua data barang dan menjumlahkan semua total harganya
          const barang = await barangService.getAllByPemesananId(
            getData.pemesananId
          );
          const total = barang.reduce((acc, curr) => {
            return acc + curr.jumlah;
          }, 0);
          // update total harga pemesanan
          await pemesananService.updateByUser(
            getData.pemesananId,
            req.admin.id,
            req.admin.nama,
            {
              totalHarga: total - getData.Pemesanan.diskon,
            }
          );
        } else {
          res.status(404).json({
            status: false,
            message: "Data not found",
          });
        }
      }
    } catch (err) {
      res.status(422).json({
        status: false,
        message: err.message,
      });
    }
  },

  async deleteByUser(req, res) {
    try {
      const data = await barangService.getById(req.params.id);
      if (data === null) {
        res.status(404).json({
          status: false,
          message: "Data not found",
        });
      } else {
        const urlImage = data.gambar;
        if (data === 1 || urlImage) {
          // mengambil url gambar dari database dan menghapusnya
          const getPublicId =
            "barangPemesanan/" + urlImage.split("/").pop().split(".")[0] + "";
          await cloudinaryDelete(getPublicId);
          const getData = await barangService.getById(data.id);
          // delete data barang
          await barangService.deleteByUser(req.params.id, req.user.id);
          res.status(200).json({
            status: true,
            message: "Successfully delete data",
          });
          // mengambil semua data barang dan menjumlahkan semua total harganya
          const barang = await barangService.getAllByPemesananId(
            getData.pemesananId
          );
          const total = barang.reduce((acc, curr) => {
            return acc + curr.jumlah;
          }, 0);
          // update total harga pemesanan
          await pemesananService.updateByUser(
            getData.pemesananId,
            req.user.id,
            req.user.nama,
            {
              totalHarga: total - getData.Pemesanan.diskon,
            }
          );
        } else if (urlImage === null) {
          const getData = await barangService.getById(data.id);
          // delete data barang
          await barangService.deleteByUser(req.params.id, req.user.id);
          res.status(200).json({
            status: true,
            message: "Successfully delete data",
          });
          // mengambil semua data barang dan menjumlahkan semua total harganya
          const barang = await barangService.getAllByPemesananId(
            getData.pemesananId
          );
          const total = barang.reduce((acc, curr) => {
            return acc + curr.jumlah;
          }, 0);
          // update total harga pemesanan
          await pemesananService.updateByUser(
            getData.pemesananId,
            req.user.id,
            req.user.nama,
            {
              totalHarga: total - getData.Pemesanan.diskon,
            }
          );
        } else {
          res.status(404).json({
            status: false,
            message: "Data not found",
          });
        }
      }
    } catch (err) {
      res.status(422).json({
        status: false,
        message: err.message,
      });
    }
  },
};
