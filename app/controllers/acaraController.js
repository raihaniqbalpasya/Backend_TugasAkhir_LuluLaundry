const acaraService = require("../services/acaraService");
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
      const data = await acaraService.getAll(perPage, start); // Data yang sudah dipaginasi
      const allData = await acaraService.getAllData(); // Seluruh data tanpa paginasi
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
      if (data.length >= 1) {
        // Update otomatis status acara
        await acaraService.updateUpcomingStatus();
        await acaraService.updateActiveStatus();
        await acaraService.updateDoneStatus();
        // Respon yang akan ditampilkan jika datanya ada
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
        status: true,
        message: err.message,
      });
    }
  },

  async getById(req, res) {
    try {
      const dateNow = new Date();
      const data = await acaraService.getById(req.params.id);
      if (data.tglMulai > dateNow) {
        await acaraService.update(data.id, {
          status: "Akan Datang",
        });
      } else if (data.tglMulai < dateNow && data.tglSelesai > dateNow) {
        await acaraService.update(data.id, {
          status: "Aktif",
        });
      } else if (data.tglSelesai < dateNow) {
        await acaraService.update(data.id, {
          status: "Selesai",
        });
      }
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

  async searchActiveEvent(req, res) {
    try {
      const data = await acaraService.searchActiveEvent();
      if (data.length >= 1) {
        // Update otomatis status acara
        await acaraService.updateUpcomingStatus();
        await acaraService.updateActiveStatus();
        await acaraService.updateDoneStatus();

        res.status(200).json({
          status: true,
          message: "Successfully get active event data",
          data,
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

  async searchUpcomingEvent(req, res) {
    try {
      const data = await acaraService.searchUpcomingEvent();
      if (data.length >= 1) {
        // Update otomatis status acara
        await acaraService.updateUpcomingStatus();
        await acaraService.updateActiveStatus();
        await acaraService.updateDoneStatus();

        res.status(200).json({
          status: true,
          message: "Successfully get upcoming event data",
          data,
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

  async searchDoneAndDisabledEvent(req, res) {
    try {
      const data = await acaraService.searchDoneAndDisabledEvent();
      if (data.length >= 1) {
        // Update otomatis status acara
        await acaraService.updateUpcomingStatus();
        await acaraService.updateActiveStatus();
        await acaraService.updateDoneStatus();

        res.status(200).json({
          status: true,
          message: "Successfully get done and disabled event data",
          data,
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

  async create(req, res) {
    try {
      const requestFile = req.file; // ambil file dari request
      const dateNow = new Date(); // ambil tanggal sekarang
      let kriteria = req.body.kriteria; // ambil kriteria dari request
      let reward = req.body.reward; // ambil reward dari request
      if (
        req.body.status ||
        req.body.status === null ||
        req.body.status === ""
      ) {
        return res.status(422).json({
          status: false,
          message: "You can't change event status",
        });
      } else {
        if (requestFile === null || requestFile === undefined) {
          const data = await acaraService.create({
            ...req.body,
            gambar: null,
            adminId: req.admin.id,
            kriteria: kriteria,
            reward: reward,
          });
          // jika kriteria undefined, maka data kriteria djiadikan null
          if (kriteria === undefined || kriteria === null) {
            await acaraService.update(data.id, {
              kriteria: null,
            });
          } else {
            // cek array kriteria apakah ada value kosong atau tidak
            const cekKriteria = kriteria.filter(function (e) {
              return e !== "";
            });
            kriteria = cekKriteria;
            // jika kriteria kosong, maka data kriteria djiadikan null
            if (cekKriteria.length === 0) {
              await acaraService.update(data.id, {
                kriteria: null,
              });
            } else {
              // jika kriteria tidak kosong, maka data kriteria diupdate
              await acaraService.update(data.id, {
                kriteria: kriteria,
              });
            }
          }
          // jika reward undefined, maka data reward djiadikan null
          if (reward === undefined || reward === null) {
            await acaraService.update(data.id, {
              reward: null,
            });
          } else {
            // cek array reward apakah ada value kosong atau tidak
            const cekReward = reward.filter(function (e) {
              return e !== "";
            });
            reward = cekReward;
            // jika reward kosong, maka data reward djiadikan null
            if (cekReward.length === 0) {
              await acaraService.update(data.id, {
                reward: null,
              });
            } else {
              // jika reward tidak kosong, maka data reward diupdate
              await acaraService.update(data.id, {
                reward: reward,
              });
            }
          }
          // cek tanggal mulai dan tanggal selesai untuk mengubah status acara
          if (data.tglMulai > dateNow) {
            await acaraService.update(data.id, {
              status: "Akan Datang",
            });
          } else if (data.tglMulai < dateNow && data.tglSelesai > dateNow) {
            await acaraService.update(data.id, {
              status: "Aktif",
            });
          } else if (data.tglSelesai < dateNow) {
            await acaraService.update(data.id, {
              status: "Selesai",
            });
          }
          const print = await acaraService.getById(data.id);
          res.status(201).json({
            status: true,
            message: "Successfully create data",
            data: print,
          });
        } else {
          // upload gambar ke cloudinary
          const fileBase64 = requestFile.buffer.toString("base64");
          const file = `data:${requestFile.mimetype};base64,${fileBase64}`;
          const result = await cloudinaryUpload(file, {
            folder: "acara",
            resource_type: "image",
            allowed_formats: ["jpg", "png", "jpeg", "gif", "svg", "webp"],
          });
          const url = result.secure_url;
          const data = await acaraService.create({
            ...req.body,
            gambar: url,
            adminId: req.admin.id,
            kriteria: kriteria,
            reward: reward,
          });
          // jika kriteria undefined, maka data kriteria djiadikan null
          if (kriteria === undefined || kriteria === null) {
            await acaraService.update(data.id, {
              kriteria: null,
            });
          } else {
            // cek array kriteria apakah ada value kosong atau tidak
            const cekKriteria = kriteria.filter(function (e) {
              return e !== "";
            });
            kriteria = cekKriteria;
            // jika kriteria kosong, maka data kriteria djiadikan null
            if (cekKriteria.length === 0) {
              await acaraService.update(data.id, {
                kriteria: null,
              });
            } else {
              // jika kriteria tidak kosong, maka data kriteria diupdate
              await acaraService.update(data.id, {
                kriteria: kriteria,
              });
            }
          }
          // jika reward undefined, maka data reward djiadikan null
          if (reward === undefined || reward === null) {
            await acaraService.update(data.id, {
              reward: null,
            });
          } else {
            // cek array reward apakah ada value kosong atau tidak
            const cekReward = reward.filter(function (e) {
              return e !== "";
            });
            reward = cekReward;
            // jika reward kosong, maka data reward djiadikan null
            if (cekReward.length === 0) {
              await acaraService.update(data.id, {
                reward: null,
              });
            } else {
              // jika reward tidak kosong, maka data reward diupdate
              await acaraService.update(data.id, {
                reward: reward,
              });
            }
          }
          // cek tanggal mulai dan tanggal selesai untuk mengubah status acara
          if (data.tglMulai > dateNow) {
            await acaraService.update(data.id, {
              status: "Akan Datang",
            });
          } else if (data.tglMulai < dateNow && data.tglSelesai > dateNow) {
            await acaraService.update(data.id, {
              status: "Aktif",
            });
          } else if (data.tglSelesai < dateNow) {
            await acaraService.update(data.id, {
              status: "Selesai",
            });
          }
          const print = await acaraService.getById(data.id);
          res.status(201).json({
            status: true,
            message: "Successfully create data",
            data: print,
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

  async update(req, res) {
    try {
      const data = await acaraService.getById(req.params.id);
      const requestFile = req.file; // ambil file dari request
      const dateNow = new Date(); // ambil tanggal sekarang
      let kriteria = req.body.kriteria; // ambil kriteria dari request
      let reward = req.body.reward; // ambil reward dari request
      // cek apakah data ada atau tidak
      if (data === null) {
        res.status(404).json({
          status: false,
          message: "Data not found",
        });
      } else {
        const urlImage = data.gambar;
        if (
          req.body.status ||
          req.body.status === null ||
          req.body.status === ""
        ) {
          return res.status(422).json({
            status: false,
            message: "You can't change event status",
          });
        } else {
          // jika kriteria undefined, maka data kriteria djiadikan null
          if (kriteria === undefined || kriteria === null) {
            await acaraService.update(req.params.id, {
              kriteria: null,
            });
          } else {
            // cek array kriteria apakah ada value kosong atau tidak
            const cekKriteria = kriteria.filter(function (e) {
              return e !== "";
            });
            kriteria = cekKriteria;
            // jika kriteria kosong, maka data kriteria djiadikan null
            if (cekKriteria.length === 0) {
              await acaraService.update(req.params.id, {
                kriteria: null,
              });
            } else {
              // jika kriteria tidak kosong, maka data kriteria diupdate
              await acaraService.update(req.params.id, {
                kriteria: kriteria,
              });
            }
          }
          // jika reward undefined, maka data reward djiadikan null
          if (reward === undefined || reward === null) {
            await acaraService.update(req.params.id, {
              reward: null,
            });
          } else {
            // cek array reward apakah ada value kosong atau tidak
            const cekReward = reward.filter(function (e) {
              return e !== "";
            });
            reward = cekReward;
            // jika reward kosong, maka data reward djiadikan null
            if (cekReward.length === 0) {
              await acaraService.update(req.params.id, {
                reward: null,
              });
            } else {
              // jika reward tidak kosong, maka data reward diupdate
              await acaraService.update(req.params.id, {
                reward: reward,
              });
            }
          }
          if (urlImage === null || urlImage === "") {
            if (requestFile === null || requestFile === undefined) {
              await acaraService.update(req.params.id, {
                ...req.body,
                gambar: null,
                adminId: req.admin.id,
                kriteria: kriteria,
                reward: reward,
              });
              // cek tanggal mulai dan tanggal selesai untuk mengubah status acara
              const getData = await acaraService.getById(req.params.id);
              if (getData.tglMulai > dateNow) {
                await acaraService.update(req.params.id, {
                  status: "Akan Datang",
                });
              } else if (
                getData.tglMulai < dateNow &&
                getData.tglSelesai > dateNow
              ) {
                await acaraService.update(req.params.id, {
                  status: "Aktif",
                });
              } else if (getData.tglSelesai < dateNow) {
                await acaraService.update(req.params.id, {
                  status: "Selesai",
                });
              }
              const data = await acaraService.getById(req.params.id);
              res.status(200).json({
                status: true,
                message: "Successfully update data",
                data: data,
              });
            } else {
              const fileBase64 = requestFile.buffer.toString("base64");
              const file = `data:${requestFile.mimetype};base64,${fileBase64}`;
              const result = await cloudinaryUpload(file, {
                folder: "acara",
                resource_type: "image",
                allowed_formats: ["jpg", "png", "jpeg", "gif", "svg", "webp"],
              });
              const url = result.secure_url;
              await acaraService.update(req.params.id, {
                ...req.body,
                gambar: url,
                adminId: req.admin.id,
                kriteria: kriteria,
                reward: reward,
              });
              // cek tanggal mulai dan tanggal selesai untuk mengubah status acara
              const getData = await acaraService.getById(req.params.id);
              if (getData.tglMulai > dateNow) {
                await acaraService.update(req.params.id, {
                  status: "Akan Datang",
                });
              } else if (
                getData.tglMulai < dateNow &&
                getData.tglSelesai > dateNow
              ) {
                await acaraService.update(req.params.id, {
                  status: "Aktif",
                });
              } else if (getData.tglSelesai < dateNow) {
                await acaraService.update(req.params.id, {
                  status: "Selesai",
                });
              }
              const data = await acaraService.getById(req.params.id);
              res.status(200).json({
                status: true,
                message: "Successfully update data",
                data: data,
              });
            }
          } else {
            if (requestFile === null || requestFile === undefined) {
              await acaraService.update(req.params.id, {
                ...req.body,
                gambar: urlImage,
                adminId: req.admin.id,
                kriteria: kriteria,
                reward: reward,
              });
              // cek tanggal mulai dan tanggal selesai untuk mengubah status acara
              const getData = await acaraService.getById(req.params.id);
              if (getData.tglMulai > dateNow) {
                await acaraService.update(req.params.id, {
                  status: "Akan Datang",
                });
              } else if (
                getData.tglMulai < dateNow &&
                getData.tglSelesai > dateNow
              ) {
                await acaraService.update(req.params.id, {
                  status: "Aktif",
                });
              } else if (getData.tglSelesai < dateNow) {
                await acaraService.update(req.params.id, {
                  status: "Selesai",
                });
              }
              const data = await acaraService.getById(req.params.id);
              res.status(200).json({
                status: true,
                message: "Successfully update data",
                data: data,
              });
            } else {
              // mengambil url gambar dari cloudinary dan menghapusnya
              const getPublicId =
                "acara/" + urlImage.split("/").pop().split(".")[0] + "";
              await cloudinaryDelete(getPublicId);
              // upload gambar ke cloudinary
              const fileBase64 = requestFile.buffer.toString("base64");
              const file = `data:${requestFile.mimetype};base64,${fileBase64}`;
              const result = await cloudinaryUpload(file, {
                folder: "acara",
                resource_type: "image",
                allowed_formats: ["jpg", "png", "jpeg", "gif", "svg", "webp"],
              });
              const url = result.secure_url;
              await acaraService.update(req.params.id, {
                ...req.body,
                gambar: url,
                adminId: req.admin.id,
                kriteria: kriteria,
                reward: reward,
              });
              // cek tanggal mulai dan tanggal selesai untuk mengubah status acara
              const getData = await acaraService.getById(req.params.id);
              if (getData.tglMulai > dateNow) {
                await acaraService.update(req.params.id, {
                  status: "Akan Datang",
                });
              } else if (
                getData.tglMulai < dateNow &&
                getData.tglSelesai > dateNow
              ) {
                await acaraService.update(req.params.id, {
                  status: "Aktif",
                });
              } else if (getData.tglSelesai < dateNow) {
                await acaraService.update(req.params.id, {
                  status: "Selesai",
                });
              }
              const data = await acaraService.getById(req.params.id);
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

  async updateStatusEvent(req, res) {
    try {
      const data = await acaraService.getById(req.params.id);
      const dateNow = new Date();
      if (data.status === "Nonaktif") {
        if (data.tglMulai > dateNow) {
          await acaraService.update(req.params.id, {
            status: "Akan Datang",
          });
        } else if (data.tglMulai < dateNow && data.tglSelesai > dateNow) {
          await acaraService.update(req.params.id, {
            status: "Aktif",
          });
        } else if (data.tglSelesai < dateNow) {
          await acaraService.update(req.params.id, {
            status: "Selesai",
          });
        }
        res.status(200).json({
          status: true,
          message: "Successfully update data",
        });
      } else {
        await acaraService.update(req.params.id, {
          status: "Nonaktif",
        });
        res.status(200).json({
          status: true,
          message: "Successfully update data",
        });
      }
    } catch (error) {
      res.status(422).json({
        status: false,
        message: err.message,
      });
    }
  },

  async deleteById(req, res) {
    try {
      const data = await acaraService.getById(req.params.id);
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
            "acara/" + urlImage.split("/").pop().split(".")[0] + "";
          await cloudinaryDelete(getPublicId);

          await acaraService.delete(req.params.id);
          res.status(200).json({
            status: true,
            message: "Successfully delete data",
          });
        } else if (urlImage === null) {
          await acaraService.delete(req.params.id);
          res.status(200).json({
            status: true,
            message: "Successfully delete data",
          });
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
