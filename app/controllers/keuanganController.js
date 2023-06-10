const keuanganService = require("../services/keuanganService");
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
      const data = await keuanganService.getAll(perPage, start); // Data yang sudah dipaginasi
      const allData = await keuanganService.getAllData(); // Seluruh data tanpa paginasi
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
        status: true,
        message: err.message,
      });
    }
  },

  async financeReportWeek(req, res) {
    try {
      const startDate = req.body.tanggal; // inisiasi tanggal awal sebagai parameter acuan
      // inisiasi tanggal akhir sebagai parameter acuan
      const date = new Date(startDate);
      date.setDate(date.getDate() + 6);
      const endDate = date.toISOString();
      // mengambil data kuangan dari tanggal awal sampai tanggal akhir
      const data = await keuanganService.getAllDataReport(startDate, endDate);
      /* fungsi untuk mengelompokkan data jumlah pengeluaran dan pemasukan selama seminggu
      berdasarkan tanggal awal dan akhir, dengan acuan tanggal yg diinput sebagai tanggal awal*/
      const initDate = new Date(startDate);
      const filterData = Array.from(Array(7)).map((i, index) => {
        if (index === 0) {
          initDate.setDate(initDate.getDate() + 0);
        } else {
          initDate.setDate(initDate.getDate() + 1);
        }
        return {
          Tanggal:
            "0" +
            (initDate.getMonth() + 1) +
            "/" +
            (initDate.getDate() < 10
              ? "0" + initDate.getDate()
              : initDate.getDate()),
          // mengumpulkan data pemasukan dan menjumlahkan nominalnya
          Pemasukan: data
            .filter((item) => {
              return (
                item.tanggal.getDate() === initDate.getDate() &&
                (item.tipe === "Pemasukan" ||
                  item.tipe === "Transaksi Pemesanan")
              );
            })
            .reduce((acc, curr) => {
              return acc + curr.nominal;
            }, 0),
          // mengumpulkan data pengeluaran dan menjumlahkan nominalnya
          Pengeluaran: data
            .filter((item) => {
              return (
                item.tanggal.getDate() === initDate.getDate() &&
                item.tipe === "Pengeluaran"
              );
            })
            .reduce((acc, curr) => {
              return acc + curr.nominal;
            }, 0),
        };
      });
      // menghitung jumlah data dari transaksi pemesanan, pemasukan dan pengeluaran
      const detailTransaksi = {
        totalTransaksiPemesanan: data.filter((item) => {
          return item.tipe === "Transaksi Pemesanan";
        }).length,
        totalPemasukanTambahan: data.filter((item) => {
          return item.tipe === "Pemasukan";
        }).length,
        totalPengeluaranTambahan: data.filter((item) => {
          return item.tipe === "Pengeluaran";
        }).length,
      };
      // respon yang akan ditampilkan
      res.status(200).json({
        status: true,
        message: "Successfully get all data",
        data: {
          laporanMingguan: filterData,
          detailTransaksi: detailTransaksi,
        },
      });
    } catch (err) {
      res.status(422).json({
        status: false,
        message: err.message,
      });
    }
  },

  async financeReportMonth(req, res) {
    try {
      // inisiasi tanggal awal sebagai parameter acuan
      const startDate = req.body.tanggal;
      /* fungsi untuk mengambil tanggal terakhir dari bulan 
      pada tanggal awal yg diinput sebagai parameter acuan */
      function getLastDayOfMonth(date) {
        const currentMonth = date.getMonth();
        const nextMonth = currentMonth + 1;
        date.setMonth(nextMonth, 0);
        const lastDayOfMonth = date.getDate();
        return lastDayOfMonth;
      }
      /* inisiasi tanggal terakhir sesuai bulan pada 
      tanggal awal yg diinput sebagai parameter acuan */
      const endDate = new Date(startDate);
      const lastDay = getLastDayOfMonth(endDate);
      endDate.setDate(lastDay);
      // mengambil data kuangan dari tanggal awal sampai tanggal akhir
      const data = await keuanganService.getAllDataReport(startDate, endDate);
      /* fungsi untuk mengelompokkan data jumlah pengeluaran 
      selama sebulan berdasarkan minggu */
      let pengeluaranBulanan = {};
      data
        .filter((item) => {
          return item.tipe === "Pengeluaran";
        })
        .forEach((item) => {
          const tanggal = new Date(item.tanggal);
          const minggu =
            tanggal.getDate() % 7
              ? parseInt(tanggal.getDate() / 7 + 1)
              : parseInt(tanggal.getDate() / 7);
          if (pengeluaranBulanan[minggu]) {
            pengeluaranBulanan[minggu] += item.nominal;
          } else {
            pengeluaranBulanan[minggu] = item.nominal;
          }
        });
      /* fungsi untuk mengelompokkan data jumlah pemasukan dan 
      transaksi pemesanan selama sebulan berdasarkan minggu */
      let pemasukanBulanan = {};
      data
        .filter((item) => {
          return (
            item.tipe === "Pemasukan" || item.tipe === "Transaksi Pemesanan"
          );
        })
        .forEach((item) => {
          const tanggal = new Date(item.tanggal);
          const minggu =
            tanggal.getDate() % 7
              ? parseInt(tanggal.getDate() / 7 + 1)
              : parseInt(tanggal.getDate() / 7);
          if (pemasukanBulanan[minggu]) {
            pemasukanBulanan[minggu] += item.nominal;
          } else {
            pemasukanBulanan[minggu] = item.nominal;
          }
        });

      // function switchCase(i) {
      //   switch (i) {
      //     case 1:
      //       "Tanggal 01 - 07";
      //       break;
      //     case 2:
      //       "Tanggal 08 - 14";
      //       break;
      //     case 3:
      //       "Tanggal 15 - 21";
      //       break;
      //     case 4:
      //       "Tanggal 22 - 28";
      //       break;
      //     case 5:
      //       "Tanggal 29 - 31";
      //       break;
      //     default:
      //       "Tanggal 29 - 31";
      //       break;
      //   }
      // }

      // looping respon data pemasukan dan pengeluaran selama sebulan
      const laporanBulanan = [];
      for (let i = 1; i <= 5; i++) {
        laporanBulanan.push({
          Pemasukan: pemasukanBulanan[i] || 0,
          Pengeluaran: pengeluaranBulanan[i] || 0,
        });
      }
      // menghitung jumlah data dari transaksi pemesanan, pemasukan dan pengeluaran
      const detailTransaksi = {
        totalTransaksiPemesanan: data.filter((item) => {
          return item.tipe === "Transaksi Pemesanan";
        }).length,
        totalPemasukanTambahan: data.filter((item) => {
          return item.tipe === "Pemasukan";
        }).length,
        totalPengeluaranTambahan: data.filter((item) => {
          return item.tipe === "Pengeluaran";
        }).length,
      };
      // respon yang akan ditampilkan
      res.status(200).json({
        status: true,
        message: "Successfully get all data",
        data: {
          laporanBulanan: laporanBulanan,
          detailTransaksi: detailTransaksi,
        },
      });
    } catch (err) {
      res.status(422).json({
        status: false,
        message: err.message,
      });
    }
  },

  async financeReportYear(req, res) {
    try {
      // inisiasi tanggal awal sebagai parameter acuan
      const startDate = req.body.tanggal;
      /* fungsi untuk mengambil tanggal terakhir dari tahun 
      pada tanggal awal yg diinput sebagai parameter acuan */
      function getLastDayOfYear(date) {
        date.setMonth(11);
        const currentMonth = date.getMonth();
        const nextMonth = currentMonth + 1;
        date.setMonth(nextMonth, 0);
        const lastDayOfMonth = date.getDate();
        return lastDayOfMonth;
      }
      /* inisiasi tanggal terakhir dari tahun pada 
      tanggal awal yg diinput sebagai parameter acuan */
      const endDate = new Date(startDate);
      const lastDay = getLastDayOfYear(endDate);
      endDate.setDate(lastDay);
      // mengambil data kuangan dari tanggal awal sampai tanggal akhir
      const data = await keuanganService.getAllDataReport(startDate, endDate);
      /* fungsi untuk mengelompokkan data jumlah pengeluaran 
      selama setahun berdasarkan bulan */
      let pengeluaranTahunan = {};
      data
        .filter((item) => {
          return item.tipe === "Pengeluaran";
        })
        .forEach((item) => {
          const tanggal = new Date(item.tanggal);
          const bulan = tanggal.getMonth() + 1;
          if (pengeluaranTahunan[bulan]) {
            pengeluaranTahunan[bulan] += item.nominal;
          } else {
            pengeluaranTahunan[bulan] = item.nominal;
          }
        });
      /* fungsi untuk mengelompokkan data jumlah pemasukan 
      dan transaksi pemesanan selama setahun berdasarkan bulan */
      let pemasukanTahunan = {};
      data
        .filter((item) => {
          return (
            item.tipe === "Pemasukan" || item.tipe === "Transaksi Pemesanan"
          );
        })
        .forEach((item) => {
          const tanggal = new Date(item.tanggal);
          const bulan = tanggal.getMonth() + 1;
          if (pemasukanTahunan[bulan]) {
            pemasukanTahunan[bulan] += item.nominal;
          } else {
            pemasukanTahunan[bulan] = item.nominal;
          }
        });
      // looping data pemasukan dan pengeluaran selama setahun
      const laporanTahunan = [];
      for (let i = 1; i <= 12; i++) {
        laporanTahunan.push({
          Pemasukan: pemasukanTahunan[i] || 0,
          Pengeluaran: pengeluaranTahunan[i] || 0,
        });
      }
      // menghitung jumlah data dari transaksi pemesanan, pemasukan dan pengeluaran
      const detailTransaksi = {
        totalTransaksiPemesanan: data.filter((item) => {
          return item.tipe === "Transaksi Pemesanan";
        }).length,
        totalPemasukanTambahan: data.filter((item) => {
          return item.tipe === "Pemasukan";
        }).length,
        totalPengeluaranTambahan: data.filter((item) => {
          return item.tipe === "Pengeluaran";
        }).length,
      };
      // respon yang akan ditampilkan
      res.status(200).json({
        status: true,
        message: "Successfully get all data",
        data: {
          laporanTahunan: laporanTahunan,
          detailTransaksi: detailTransaksi,
        },
      });
    } catch (err) {
      res.status(422).json({
        status: false,
        message: err.message,
      });
    }
  },

  async getById(req, res) {
    try {
      const data = await keuanganService.getById(req.params.id);
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

  async searchFinance(req, res) {
    try {
      const data = await keuanganService.searchFinance(req.query.judul);
      if (data.length >= 1) {
        res.status(200).json({
          status: true,
          message: "Successfully get data by judul",
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

  async create(req, res) {
    try {
      const requestFile = req.file;
      if (
        req.body.tipe === "Pemasukan" ||
        req.body.tipe === "Pengeluaran" ||
        req.body.tipe === "Transaksi Pemesanan"
      ) {
        if (requestFile === null || requestFile === undefined) {
          const data = await keuanganService.create(
            req.admin.id,
            req.admin.nama,
            {
              ...req.body,
              gambar: null,
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
            folder: "keuangan",
            resource_type: "image",
            allowed_formats: ["jpg", "png", "jpeg", "gif", "svg", "webp"],
          });
          const url = result.secure_url;
          const data = await keuanganService.create(
            req.admin.id,
            req.admin.nama,
            {
              ...req.body,
              gambar: url,
            }
          );
          res.status(201).json({
            status: true,
            message: "Successfully create data",
            data,
          });
        }
      } else {
        res.status(400).json({
          status: false,
          message: "Please input the role correctly!",
        });
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
      const data = await keuanganService.getById(req.params.id);
      const requestFile = req.file;
      if (data === null) {
        res.status(404).json({
          status: false,
          message: "Data not found",
        });
      } else {
        const urlImage = data.gambar;
        if (
          req.body.tipe === "Pemasukan" ||
          req.body.tipe === "Pengeluaran" ||
          req.body.tipe === "Transaksi Pemesanan"
        ) {
          if (urlImage === null || urlImage === "") {
            if (requestFile === null || requestFile === undefined) {
              await keuanganService.update(req.params.id, req.admin.nama, {
                ...req.body,
                gambar: null,
                adminId: req.admin.id,
              });
              const data = await keuanganService.getById(req.params.id);
              res.status(200).json({
                status: true,
                message: "Successfully update data",
                data: data,
              });
            } else {
              const fileBase64 = requestFile.buffer.toString("base64");
              const file = `data:${requestFile.mimetype};base64,${fileBase64}`;
              const result = await cloudinaryUpload(file, {
                folder: "keuangan",
                resource_type: "image",
                allowed_formats: ["jpg", "png", "jpeg", "gif", "svg", "webp"],
              });
              const url = result.secure_url;
              await keuanganService.update(req.params.id, req.admin.nama, {
                ...req.body,
                gambar: url,
                adminId: req.admin.id,
              });
              const data = await keuanganService.getById(req.params.id);
              res.status(200).json({
                status: true,
                message: "Successfully update data",
                data: data,
              });
            }
          } else {
            if (requestFile === null || requestFile === undefined) {
              await keuanganService.update(req.params.id, req.admin.nama, {
                ...req.body,
                gambar: urlImage,
                adminId: req.admin.id,
              });
              const data = await keuanganService.getById(req.params.id);
              res.status(200).json({
                status: true,
                message: "Successfully update data",
                data: data,
              });
            } else {
              // mengambil url gambar dari cloudinary dan menghapusnya
              const getPublicId =
                "keuangan/" + urlImage.split("/").pop().split(".")[0] + "";
              await cloudinaryDelete(getPublicId);
              // upload gambar ke cloudinary
              const fileBase64 = requestFile.buffer.toString("base64");
              const file = `data:${requestFile.mimetype};base64,${fileBase64}`;
              const result = await cloudinaryUpload(file, {
                folder: "keuangan",
                resource_type: "image",
                allowed_formats: ["jpg", "png", "jpeg", "gif", "svg", "webp"],
              });
              const url = result.secure_url;
              await keuanganService.update(req.params.id, req.admin.nama, {
                ...req.body,
                gambar: url,
                adminId: req.admin.id,
              });
              const data = await keuanganService.getById(req.params.id);
              res.status(200).json({
                status: true,
                message: "Successfully update data",
                data: data,
              });
            }
          }
        } else {
          res.status(400).json({
            status: false,
            message: "Please input the role correctly!",
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

  async deleteById(req, res) {
    try {
      const data = await keuanganService.getById(req.params.id);
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
            "keuangan/" + urlImage.split("/").pop().split(".")[0] + "";
          await cloudinaryDelete(getPublicId);

          await keuanganService.delete(req.params.id);
          res.status(200).json({
            status: true,
            message: "Successfully delete data",
          });
        } else if (urlImage === null) {
          await keuanganService.delete(req.params.id);
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
