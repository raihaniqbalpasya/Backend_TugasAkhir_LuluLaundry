const pemesananService = require("../services/pemesananService");
const barangService = require("../services/barangService");
const notifService = require("../services/notifService");
const reviewService = require("../services/reviewService");
const keuanganService = require("../services/keuanganService");
const userService = require("../services/userService");

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
      const data = await pemesananService.getAll(perPage, start); // Data yang sudah dipaginasi
      const allData = await pemesananService.getAllData(); // Seluruh data tanpa paginasi
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

  async getAllByStatus(req, res) {
    try {
      const page = parseInt(req.query.page) || 1; // Halaman saat ini
      const perPage = parseInt(req.query.perPage) || 10; // Jumlah item per halaman
      const { status } = req.query; // Status pemesanan yang akan ditampilkan
      const allowedPerPage = [10, 20, 50, 100]; // Pastikan jumlah data per halaman yang didukung
      if (!allowedPerPage.includes(perPage)) {
        perPage = 10; // Jika tidak valid, gunakan 10 data per halaman sebagai default
      }
      const start = 0 + (page - 1) * perPage; // Offset data yang akan diambil
      const end = page * perPage; // Batas data yang akan diambil
      const data = await pemesananService.getAllByStatus(
        perPage,
        start,
        status
      ); // Data yang sudah dipaginasi
      const allData = await pemesananService.getAllDataByStatus(status); // Seluruh data tanpa paginasi
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

  async getAllByUserId(req, res) {
    try {
      const page = parseInt(req.query.page) || 1; // Halaman saat ini
      const perPage = parseInt(req.query.perPage) || 10; // Jumlah item per halaman
      const { status } = req.query; // Status pemesanan yang akan ditampilkan
      const allowedPerPage = [10, 20, 50, 100]; // Pastikan jumlah data per halaman yang didukung
      if (!allowedPerPage.includes(perPage)) {
        perPage = 10; // Jika tidak valid, gunakan 10 data per halaman sebagai default
      }
      const start = 0 + (page - 1) * perPage; // Offset data yang akan diambil
      const end = page * perPage; // Batas data yang akan diambil
      const data = await pemesananService.getAllByUserIdAndStatus(
        perPage,
        start,
        req.user.id,
        status
      ); // Data yang sudah dipaginasi
      const allData = await pemesananService.getAllByUserIdAndStatusNoPag(
        req.user.id,
        status
      ); // Seluruh data tanpa paginasi
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

  async getStatisticData(req, res) {
    try {
      const allData = await pemesananService.getAllData(); // Seluruh data tanpa paginasi
      // Jumlah data berdasarkan status
      const pDisetujui = allData.filter(
        (item) => item.status === "Perlu Disetujui"
      ).length;
      const pDijemput = allData.filter(
        (item) => item.status === "Perlu Dijemput"
      ).length;
      const pDikerjakan = allData.filter(
        (item) => item.status === "Perlu Dikerjakan"
      ).length;
      const pDiantar = allData.filter(
        (item) => item.status === "Perlu Diantar"
      ).length;
      const selesai = allData.filter(
        (item) => item.status === "Selesai"
      ).length;
      const dibatalkan = allData.filter(
        (item) => item.status === "Dibatalkan"
      ).length;
      const ditolak = allData.filter(
        (item) => item.status === "Ditolak"
      ).length;
      // Menghitung jumlah rata-rata rating
      const rating = await reviewService.getAllData();
      const totalRating = rating.reduce((acc, curr) => acc + curr.rating, 0);
      const averageRating = totalRating / rating.length;
      const finalRating = parseFloat(averageRating.toFixed(2));
      // Respon yang akan ditampilkan jika datanya ada
      res.status(200).json({
        status: true,
        message: "Successfully get all data",
        data: {
          perluDisetujui: pDisetujui,
          perluDijemput: pDijemput,
          perluDikerjakan: pDikerjakan,
          perluDiantar: pDiantar,
          completed: selesai,
          cancelled: dibatalkan,
          declined: ditolak,
          averageRating: finalRating || 0,
          totalReview: rating.length,
        },
      });
    } catch (err) {
      res.status(422).json({
        status: false,
        message: err.message,
      });
    }
  },

  async getStatisticDataByUser(req, res) {
    try {
      const allData = await pemesananService.getAllByUserId(req.user.id); // Seluruh data tanpa paginasi
      // Jumlah data berdasarkan status
      const pDisetujui = allData.filter(
        (item) => item.status === "Perlu Disetujui"
      ).length;
      const pDijemput = allData.filter(
        (item) => item.status === "Perlu Dijemput"
      ).length;
      const pDikerjakan = allData.filter(
        (item) => item.status === "Perlu Dikerjakan"
      ).length;
      const pDiantar = allData.filter(
        (item) => item.status === "Perlu Diantar"
      ).length;
      const selesai = allData.filter(
        (item) => item.status === "Selesai"
      ).length;
      const dibatalkan = allData.filter(
        (item) => item.status === "Dibatalkan"
      ).length;
      const ditolak = allData.filter(
        (item) => item.status === "Ditolak"
      ).length;
      // Menghitung jumlah rata-rata rating
      const rating = await reviewService.getAllData();
      const totalRating = rating.reduce((acc, curr) => acc + curr.rating, 0);
      const averageRating = totalRating / rating.length;
      const finalRating = parseFloat(averageRating.toFixed(2));
      // Respon yang akan ditampilkan jika datanya ada
      res.status(200).json({
        status: true,
        message: "Successfully get all data",
        data: {
          perluDisetujui: pDisetujui,
          perluDijemput: pDijemput,
          perluDikerjakan: pDikerjakan,
          perluDiantar: pDiantar,
          completed: selesai,
          cancelled: dibatalkan,
          declined: ditolak,
          averageRating: finalRating || 0,
          totalReview: rating.length,
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
      const data = await pemesananService.getById(req.params.id);
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

  async getByNomorPesanan(req, res) {
    try {
      const data = await pemesananService.getByNomorPesanan(
        req.params.nomorPesanan
      );
      if (data !== null) {
        res.status(200).json({
          status: true,
          message: "Successfully get data by nomor pesanan",
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

  async getByNomorPesananFromUser(req, res) {
    try {
      const data = await pemesananService.getByNomorPesananFromUser(
        req.user.id,
        req.params.nomorPesanan
      );
      if (data !== null) {
        res.status(200).json({
          status: true,
          message: "Successfully get data by nomor pesanan",
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

  async searchOrder(req, res) {
    try {
      const data = await pemesananService.searchOrder(req.query.nomorPesanan);
      if (data.length >= 1) {
        res.status(200).json({
          status: true,
          message: "Successfully get data by nomorPesanan",
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

  // pemesanan as user
  async createByUser(req, res) {
    try {
      // Membuat nomor pesanan secara random berdasarkan tanggal dan waktu
      const currentDate = new Date();
      currentDate.setHours(currentDate.getHours() + 7);
      const currentYear = currentDate.getFullYear().toString().slice(-2);
      const currentMonth = (currentDate.getMonth() + 1)
        .toString()
        .padStart(2, "0");
      const currentDay = currentDate.getDate().toString().padStart(2, "0");
      const currentMinute = currentDate
        .getMinutes()
        .toString()
        .padStart(2, "0");
      const randomDigits = Math.floor(Math.random() * 1000000)
        .toString()
        .padStart(6, "0");
      const randomNumber =
        currentDay + currentMonth + currentYear + currentMinute + randomDigits;
      // Fungsi untuk menghitung deadline
      const tglMulai = req.body.tglMulai;
      const date = new Date(tglMulai);
      function deadline(date) {
        date.setDate(date.getDate() + req.body.jenisLayanan[0]);
        date.setHours(date.getHours() + req.body.jenisLayanan[1]);
        date.setMinutes(date.getMinutes() + req.body.jenisLayanan[2]);
        return date;
      }
      const data = await pemesananService.createByUser(
        req.user.id,
        req.user.nama,
        {
          ...req.body,
          nomorPesanan: randomNumber,
          tenggatWaktu: deadline(date),
          adminId: null,
          statusPembayaran: "Belum Bayar",
          status: "Perlu Disetujui",
          statusUpdatedAt: new Date(),
          totalHarga: 0,
        }
      );
      await notifService.create({
        ...req.body,
        pemesananId: data.id,
        createdBy: "user",
        pesan: `{ "header": "Pesanan #${data.nomorPesanan} menunggu persetujuan", "deskripsi": "${data.createdBy} melakukan pemesanan dengan nomor pesanan #${data.nomorPesanan}." }`,
      });
      res.status(201).json({
        status: true,
        message: "Successfully create data",
        data,
      });
    } catch (err) {
      res.status(422).json({
        status: false,
        message: err.message,
      });
    }
  },

  async updateByUser(req, res) {
    try {
      // Fungsi untuk menghitung total harga
      const idPesanan = await pemesananService.getById(req.params.id);
      const barang = await barangService.getAllData();
      const compare = barang.filter(
        (value) => value.pemesananId === idPesanan.id
      );
      const total = compare.reduce((acc, curr) => {
        return acc + curr.jumlah;
      }, 0);

      const data = await pemesananService.getById(req.params.id);
      if (data === null) {
        res.status(404).json({
          status: false,
          message: "Data not found",
        });
      } else {
        // Fungsi untuk menghitung deadline
        const tglMulai = req.body.tglMulai;
        const date = new Date(tglMulai);
        function deadline(date) {
          date.setDate(date.getDate() + req.body.jenisLayanan[0]);
          date.setHours(date.getHours() + req.body.jenisLayanan[1]);
          date.setMinutes(date.getMinutes() + req.body.jenisLayanan[2]);
          return date;
        }
        if (
          req.body.status === "Perlu Disetujui" ||
          req.body.status === "Diterima" ||
          req.body.status === "Ditolak" ||
          req.body.status === "Perlu Dijemput" ||
          req.body.status === "Perlu Dikerjakan" ||
          req.body.status === "Perlu Diantar" ||
          req.body.status === "Selesai" ||
          req.body.status === "Dibatalkan"
        ) {
          if (req.body.adminId) {
            return res.status(422).json({
              status: false,
              message: "You can't change admin id",
            });
          } else if (
            req.body.status === "Diterima" ||
            req.body.status === "Ditolak" ||
            req.body.status === "Perlu Dijemput" ||
            req.body.status === "Perlu Dikerjakan" ||
            req.body.status === "Perlu Diantar" ||
            req.body.status === "Selesai"
          ) {
            return res.status(422).json({
              status: false,
              message:
                "You can't change status exept Perlu Disetujui or Dibatalkan",
            });
          } else if (
            data.status === "Diterima" ||
            data.status === "Ditolak" ||
            data.status === "Perlu Dijemput" ||
            data.status === "Perlu Dikerjakan" ||
            data.status === "Perlu Diantar" ||
            data.status === "Selesai" ||
            data.status === "Dibatalkan"
          ) {
            return res.status(422).json({
              status: false,
              message: `You can't update pemesanan when the status is ${data.status}`,
            });
          } else {
            const data = await pemesananService.getById(req.params.id);
            await pemesananService.updateByUser(
              req.params.id,
              req.user.id,
              req.user.nama,
              {
                ...req.body,
                nomorPesanan: data.nomorPesanan,
                createdBy: data.createdBy,
                statusPembayaran: data.statusPembayaran,
                tenggatWaktu: deadline(date),
                totalHarga: total - req.body.diskon,
              }
            );
            if (req.body.status !== data.status) {
              await pemesananService.updateByUser(
                req.params.id,
                req.user.id,
                req.user.nama,
                {
                  statusUpdatedAt: new Date(),
                }
              );
            }
            const print = await pemesananService.getById(req.params.id);
            if (print.status === "Dibatalkan") {
              await notifService.create({
                ...req.body,
                pemesananId: print.id,
                createdBy: "user",
                pesan: `{ "header": "Pesanan #${print.nomorPesanan} telah dibatalkan", "deskripsi": "${print.updatedBy} membatalkan pemesanan dengan nomor pesanan #${print.nomorPesanan}." }`,
              });
            } else if (
              print.status === "Dibatalkan" &&
              req.body.status === "Perlu Disetujui"
            ) {
              return res.status(422).json({
                status: false,
                message: `You can't update pemesanan when the status is ${data.status}`,
              });
            }
            res.status(200).json({
              status: true,
              message: "Successfully update data",
              data: print,
            });
          }
        } else {
          res.status(400).json({
            status: false,
            message: "Please input the status correctly!",
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

  // pemesanan as admin
  async createByAdmin(req, res) {
    try {
      // Membuat nomor pesanan secara random berdasarkan tanggal dan waktu
      const currentDate = new Date();
      currentDate.setHours(currentDate.getHours() + 7);
      const currentYear = currentDate.getFullYear().toString().slice(-2);
      const currentMonth = (currentDate.getMonth() + 1)
        .toString()
        .padStart(2, "0");
      const currentDay = currentDate.getDate().toString().padStart(2, "0");
      const currentMinute = currentDate
        .getMinutes()
        .toString()
        .padStart(2, "0");
      const randomDigits = Math.floor(Math.random() * 1000000)
        .toString()
        .padStart(6, "0");
      const randomNumber =
        currentDay + currentMonth + currentYear + currentMinute + randomDigits;
      // Fungsi untuk menghitung deadline
      const tglMulai = req.body.tglMulai;
      const date = new Date(tglMulai);
      function deadline(date) {
        date.setDate(date.getDate() + req.body.jenisLayanan[0]);
        date.setHours(date.getHours() + req.body.jenisLayanan[1]);
        date.setMinutes(date.getMinutes() + req.body.jenisLayanan[2]);
        return date;
      }
      if (
        (req.body.status === "Perlu Disetujui" ||
          req.body.status === "Diterima" ||
          req.body.status === "Ditolak" ||
          req.body.status === "Perlu Dijemput" ||
          req.body.status === "Perlu Dikerjakan" ||
          req.body.status === "Perlu Diantar" ||
          req.body.status === "Selesai" ||
          req.body.status === "Dibatalkan") &&
        (req.body.statusPembayaran === "Belum Bayar" ||
          req.body.statusPembayaran === "Sudah Bayar")
      ) {
        if (
          (req.body.status === "Selesai" &&
            req.body.statusPembayaran === "Belum Bayar") ||
          (req.body.status === "Ditolak" &&
            req.body.statusPembayaran === "Sudah Bayar") ||
          (req.body.status === "Dibatalkan" &&
            req.body.statusPembayaran === "Sudah Bayar")
        ) {
          return res.status(422).json({
            status: false,
            message: "Please check status pembayaran correctly!",
          });
        } else {
          const data = await pemesananService.createByAdmin(
            req.admin.id,
            req.admin.nama,
            {
              ...req.body,
              nomorPesanan: randomNumber,
              tenggatWaktu: deadline(date),
              statusUpdatedAt: new Date(),
              totalHarga: 0,
            }
          );
          if (data.status === "Diterima") {
            await notifService.create({
              ...req.body,
              pemesananId: data.id,
              createdBy: "admin",
              pesan: `{ "header": "Pesanan #${data.nomorPesanan} telah disetujui", "deskripsi": "Admin ${data.createdBy} menyetujui pesanan kamu dengan nomor pesanan #${data.nomorPesanan}." }`,
            });
          } else if (data.status === "Ditolak") {
            await notifService.create({
              ...req.body,
              pemesananId: data.id,
              createdBy: "admin",
              pesan: `{ "header": "Pesanan #${data.nomorPesanan} telah ditolak", "deskripsi": "Admin ${data.createdBy} menolak pesanan kamu dengan nomor pesanan #${data.nomorPesanan}." }`,
            });
          } else if (data.status === "Perlu Dijemput") {
            await notifService.create({
              ...req.body,
              pemesananId: data.id,
              createdBy: "admin",
              pesan: `{ "header": "Pesanan #${data.nomorPesanan} sedang dijemput", "deskripsi": "Admin ${data.createdBy} sedang menuju ke titik lokasi penjemputan barang untuk mengambil laundry kamu! Harap bersedia di titik lokasi penjemputan barang." }`,
            });
          } else if (data.status === "Perlu Dikerjakan") {
            await notifService.create({
              ...req.body,
              pemesananId: data.id,
              createdBy: "admin",
              pesan: `{ "header": "Pesanan #${data.nomorPesanan} sedang dikerjakan", "deskripsi": "Admin ${data.createdBy} sedang mengerjakan pesanan milikmu!" }`,
            });
          } else if (data.status === "Perlu Diantar") {
            await notifService.create({
              ...req.body,
              pemesananId: data.id,
              createdBy: "admin",
              pesan: `{ "header": "Pesanan #${data.nomorPesanan} sedang diantar", "deskripsi": "Admin ${data.createdBy} sedang menuju ke titik lokasi pengantaran barang untuk menyerahkan laundry kamu! Harap bersedia di titik lokasi pengantaran barang." }`,
            });
          } else if (data.status === "Selesai") {
            await notifService.create({
              ...req.body,
              pemesananId: data.id,
              createdBy: "admin",
              pesan: `{ "header": "Pesanan #${data.nomorPesanan} telah selesai", "deskripsi": "Yay! Transaksi laundry kamu telah selesai. Terima kasih telah mempercayai kami! Berikan Rating dan Review kamu untuk memberikan masukan terhadap bisnis laundry ini kedepannya." }`,
            });
            // Fungsi untuk menambahkan data pesanan yang selesai ke pemasukan keuangan
            await keuanganService.create(req.admin.id, req.admin.nama, {
              tipe: "Transaksi Pemesanan",
              judul: `Pemasukan dari nomor pemesanan ${data.nomorPesanan}`,
              catatan: `Penghasilan dari transaksi pemesanan dengan nomor pesanan ${data.nomorPesanan}`,
              gambar: null,
              tanggal: data.updatedAt,
              nominal: data.totalHarga,
              updatedBy: data.createdBy,
            });
            // Fungsi untuk menghitung & update jumlah order user
            const pesanan = await pemesananService.getAllByUserId(data.userId);
            const order = pesanan.length;
            console.log(order);
            await userService.update(data.userId, {
              totalOrder: order,
            });
          } else if (data.status === "Dibatalkan") {
            await notifService.create({
              ...req.body,
              pemesananId: data.id,
              createdBy: "admin",
              pesan: `{ "header": "Pesanan #${data.nomorPesanan} telah dibatalkan", "deskripsi": "Admin ${data.createdBy} membatalkan pemesanan kamu dengan nomor pesanan #${data.nomorPesanan}." }`,
            });
          }
          res.status(201).json({
            status: true,
            message: "Successfully create data",
            data,
          });
        }
      } else {
        res.status(400).json({
          status: false,
          message: "Please input the status and statusPembayaran correctly!",
        });
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
      // Fungsi untuk menghitung total harga
      const idPesanan = await pemesananService.getById(req.params.id);
      const barang = await barangService.getAllData();
      const compare = barang.filter(
        (value) => value.pemesananId === idPesanan.id
      );
      const total = compare.reduce((acc, curr) => {
        return acc + curr.jumlah;
      }, 0);

      const data = await pemesananService.getById(req.params.id);
      if (data === null) {
        res.status(404).json({
          status: false,
          message: "Data not found",
        });
      } else {
        // Fungsi untuk menghitung deadline
        const tglMulai = req.body.tglMulai;
        const date = new Date(tglMulai);
        function deadline(date) {
          date.setDate(date.getDate() + req.body.jenisLayanan[0]);
          date.setHours(date.getHours() + req.body.jenisLayanan[1]);
          date.setMinutes(date.getMinutes() + req.body.jenisLayanan[2]);
          return date;
        }
        if (
          (req.body.status === "Perlu Disetujui" ||
            req.body.status === "Diterima" ||
            req.body.status === "Ditolak" ||
            req.body.status === "Perlu Dijemput" ||
            req.body.status === "Perlu Dikerjakan" ||
            req.body.status === "Perlu Diantar" ||
            req.body.status === "Selesai" ||
            req.body.status === "Dibatalkan") &&
          (req.body.statusPembayaran === "Belum Bayar" ||
            req.body.statusPembayaran === "Sudah Bayar")
        ) {
          if (req.body.nomorPesanan) {
            res.status(422).json({
              status: false,
              message: "You can't change the order number",
            });
          } else if (
            (req.body.status === "Selesai" &&
              req.body.statusPembayaran === "Belum Bayar") ||
            (req.body.status === "Ditolak" &&
              req.body.statusPembayaran === "Sudah Bayar") ||
            (req.body.status === "Dibatalkan" &&
              req.body.statusPembayaran === "Sudah Bayar")
          ) {
            return res.status(422).json({
              status: false,
              message: "Please check status pembayaran correctly!",
            });
          } else {
            const data = await pemesananService.getById(req.params.id);
            await pemesananService.updateByAdmin(
              req.params.id,
              req.admin.id,
              req.admin.nama,
              {
                ...req.body,
                nomorPesanan: data.nomorPesanan,
                createdBy: data.createdBy,
                tenggatWaktu: deadline(date),
                totalHarga: total - req.body.diskon,
              }
            );
            const dataUpdated = await pemesananService.getById(req.params.id);
            console.log(dataUpdated.status);
            if (req.body.status !== data.status) {
              await pemesananService.updateByAdmin(
                req.params.id,
                req.admin.id,
                req.admin.nama,
                {
                  statusUpdatedAt: new Date(),
                }
              );
            }
            if (dataUpdated.status === "Diterima") {
              await notifService.create({
                ...req.body,
                pemesananId: data.id,
                createdBy: "admin",
                pesan: `{ "header": "Pesanan #${data.nomorPesanan} telah disetujui", "deskripsi": "Admin ${dataUpdated.updatedBy} menyetujui pesanan kamu dengan nomor pesanan #${data.nomorPesanan}." }`,
              });
            } else if (dataUpdated.status === "Ditolak") {
              await notifService.create({
                ...req.body,
                pemesananId: data.id,
                createdBy: "admin",
                pesan: `{ "header": "Pesanan #${data.nomorPesanan} telah ditolak", "deskripsi": "Admin ${dataUpdated.updatedBy} menolak pesanan kamu dengan nomor pesanan #${data.nomorPesanan}." }`,
              });
            } else if (dataUpdated.status === "Perlu Dijemput") {
              await notifService.create({
                ...req.body,
                pemesananId: data.id,
                createdBy: "admin",
                pesan: `{ "header": "Pesanan #${data.nomorPesanan} sedang dijemput", "deskripsi": "Admin ${dataUpdated.updatedBy} sedang menuju ke titik lokasi penjemputan barang untuk mengambil laundry kamu! Harap bersedia di titik lokasi penjemputan barang." }`,
              });
            } else if (dataUpdated.status === "Perlu Dikerjakan") {
              await notifService.create({
                ...req.body,
                pemesananId: data.id,
                createdBy: "admin",
                pesan: `{ "header": "Pesanan #${data.nomorPesanan} sedang dikerjakan", "deskripsi": "Admin ${dataUpdated.updatedBy} sedang mengerjakan pesanan milikmu!" }`,
              });
            } else if (dataUpdated.status === "Perlu Diantar") {
              await notifService.create({
                ...req.body,
                pemesananId: data.id,
                createdBy: "admin",
                pesan: `{ "header": "Pesanan #${data.nomorPesanan} sedang diantar", "deskripsi": "Admin ${dataUpdated.updatedBy} sedang menuju ke titik lokasi pengantaran barang untuk menyerahkan laundry kamu! Harap bersedia di titik lokasi pengantaran barang." }`,
              });
            } else if (dataUpdated.status === "Selesai") {
              await notifService.create({
                ...req.body,
                pemesananId: data.id,
                createdBy: "admin",
                pesan: `{ "header": "Pesanan #${data.nomorPesanan} telah selesai", "deskripsi": "Yay! Transaksi laundry kamu telah selesai. Terima kasih telah mempercayai kami! Berikan Rating dan Review kamu untuk memberikan masukan terhadap bisnis laundry ini kedepannya." }`,
              });
              // Fungsi untuk menambahkan data pesanan yang selesai ke pemasukan keuangan
              await keuanganService.create(req.admin.id, req.admin.nama, {
                tipe: "Transaksi Pemesanan",
                judul: `Pemasukan dari nomor pemesanan ${data.nomorPesanan}`,
                catatan: `Penghasilan dari transaksi pemesanan dengan nomor pesanan ${data.nomorPesanan}`,
                gambar: null,
                tanggal: dataUpdated.updatedAt,
                nominal: dataUpdated.totalHarga,
                updatedBy: dataUpdated.updatedBy,
              });
              // Fungsi untuk menghitung & update jumlah order user
              const pesanan = await pemesananService.getAllByUserId(
                dataUpdated.userId
              );
              const order = pesanan.length;
              await userService.update(dataUpdated.userId, {
                totalOrder: order,
              });
            } else if (dataUpdated.status === "Dibatalkan") {
              await notifService.create({
                ...req.body,
                pemesananId: data.id,
                createdBy: "admin",
                pesan: `{ "header": "Pesanan #${data.nomorPesanan} telah dibatalkan", "deskripsi": "Admin ${dataUpdated.updatedBy} membatalkan pemesanan kamu dengan nomor pesanan #${data.nomorPesanan}." }`,
              });
            }
            const print = await pemesananService.getById(req.params.id);

            res.status(200).json({
              status: true,
              message: "Successfully update data",
              data: print,
            });
          }
        } else {
          res.status(400).json({
            status: false,
            message: "Please input the status correctly!",
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

  async updateOrderStatus(req, res) {
    try {
      const data = await pemesananService.getById(req.params.id);
      if (data === null) {
        res.status(404).json({
          status: false,
          message: "Data not found",
        });
      } else if (
        (req.body.status === "Selesai" &&
          data.statusPembayaran === "Belum Bayar") ||
        (req.body.status === "Ditolak" &&
          data.statusPembayaran === "Sudah Bayar") ||
        (req.body.status === "Dibatalkan" &&
          data.statusPembayaran === "Sudah Bayar")
      ) {
        return res.status(422).json({
          status: false,
          message: "Please check status pembayaran correctly!",
        });
      } else {
        if (
          req.body.status === "Perlu Disetujui" ||
          req.body.status === "Diterima" ||
          req.body.status === "Ditolak" ||
          req.body.status === "Perlu Dijemput" ||
          req.body.status === "Perlu Dikerjakan" ||
          req.body.status === "Perlu Diantar" ||
          req.body.status === "Selesai" ||
          req.body.status === "Dibatalkan"
        ) {
          await pemesananService.updateByAdmin(
            req.params.id,
            req.admin.id,
            req.admin.nama,
            {
              status: req.body.status,
              statusUpdatedAt: new Date(),
            }
          );
          const data = await pemesananService.getById(req.params.id);
          if (data.status === "Diterima") {
            await notifService.create({
              ...req.body,
              pemesananId: data.id,
              createdBy: "admin",
              pesan: `{ "header": "Pesanan #${data.nomorPesanan} telah disetujui", "deskripsi": "Admin ${data.updatedBy} menyetujui pesanan kamu dengan nomor pesanan #${data.nomorPesanan}." }`,
            });
          } else if (data.status === "Ditolak") {
            await notifService.create({
              ...req.body,
              pemesananId: data.id,
              createdBy: "admin",
              pesan: `{ "header": "Pesanan #${data.nomorPesanan} telah ditolak", "deskripsi": "Admin ${data.updatedBy} menolak pesanan kamu dengan nomor pesanan #${data.nomorPesanan}." }`,
            });
          } else if (data.status === "Perlu Dijemput") {
            await notifService.create({
              ...req.body,
              pemesananId: data.id,
              createdBy: "admin",
              pesan: `{ "header": "Pesanan #${data.nomorPesanan} sedang dijemput", "deskripsi": "Pesanan #${data.nomorPesanan} sedang dijemput Admin ${data.updatedBy} sedang menuju ke titik lokasi penjemputan barang untuk mengambil laundry kamu! Harap bersedia di titik lokasi penjemputan barang." }`,
            });
          } else if (data.status === "Perlu Dikerjakan") {
            await notifService.create({
              ...req.body,
              pemesananId: data.id,
              createdBy: "admin",
              pesan: `{ "header": "Pesanan #${data.nomorPesanan} sedang dikerjakan", "deskripsi": "Admin ${data.updatedBy} sedang mengerjakan pesanan milikmu!" }`,
            });
          } else if (data.status === "Perlu Diantar") {
            await notifService.create({
              ...req.body,
              pemesananId: data.id,
              createdBy: "admin",
              pesan: `{ "header": "Pesanan #${data.nomorPesanan} sedang diantar", "deskripsi": "Admin ${data.updatedBy} sedang menuju ke titik lokasi pengantaran barang untuk menyerahkan laundry kamu! Harap bersedia di titik lokasi pengantaran barang." }`,
            });
          } else if (data.status === "Selesai") {
            await notifService.create({
              ...req.body,
              pemesananId: data.id,
              createdBy: "admin",
              pesan: `{ "header": "Pesanan #${data.nomorPesanan} telah selesai", "deskripsi": "Yay! Transaksi laundry kamu telah selesai. Terima kasih telah mempercayai kami! Berikan Rating dan Review kamu untuk memberikan masukan terhadap bisnis laundry ini kedepannya." }`,
            });
            // Fungsi untuk menambahkan data pesanan yang selesai ke pemasukan keuangan
            await keuanganService.create(req.admin.id, req.admin.nama, {
              tipe: "Transaksi Pemesanan",
              judul: `Pemasukan dari nomor pemesanan ${data.nomorPesanan}`,
              catatan: `Penghasilan dari transaksi pemesanan dengan nomor pesanan ${data.nomorPesanan}`,
              gambar: null,
              tanggal: data.updatedAt,
              nominal: data.totalHarga,
              updatedBy: data.updatedBy,
            });
            // Fungsi untuk menghitung & update jumlah order user
            const pesanan = await pemesananService.getAllByUserId(data.userId);
            const order = pesanan.length;
            await userService.update(data.userId, {
              totalOrder: order,
            });
          } else if (data.status === "Dibatalkan") {
            await notifService.create({
              ...req.body,
              pemesananId: data.id,
              createdBy: "admin",
              pesan: `{ "header": "Pesanan #${data.nomorPesanan} telah dibatalkan", "deskripsi": "Admin ${data.updatedBy} membatalkan pemesanan kamu dengan nomor pesanan #${data.nomorPesanan}." }`,
            });
          }
          const print = await pemesananService.getById(req.params.id);
          res.status(200).json({
            status: true,
            message: "Successfully update data",
            data: print,
          });
        } else {
          res.status(400).json({
            status: false,
            message: "Please input the status correctly!",
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

  async updatePaymentStatus(req, res) {
    try {
      const data = await pemesananService.getById(req.params.id);
      if (data === null) {
        res.status(404).json({
          status: false,
          message: "Data not found",
        });
      } else if (
        (data.status === "Selesai" &&
          req.body.statusPembayaran === "Belum Bayar") ||
        (data.status === "Ditolak" &&
          req.body.statusPembayaran === "Sudah Bayar") ||
        (data.status === "Dibatalkan" &&
          req.body.statusPembayaran === "Sudah Bayar")
      ) {
        return res.status(422).json({
          status: false,
          message: "Please check the status correctly!",
        });
      } else {
        if (
          req.body.statusPembayaran === "Belum Bayar" ||
          req.body.statusPembayaran === "Sudah Bayar"
        ) {
          await pemesananService.updateByAdmin(
            req.params.id,
            req.admin.id,
            req.admin.nama,
            {
              statusPembayaran: req.body.statusPembayaran,
            }
          );
          const data = await pemesananService.getById(req.params.id);
          res.status(200).json({
            status: true,
            message: "Successfully update data",
            data,
          });
        } else {
          res.status(400).json({
            status: false,
            message: "Please input the statusPembayaran correctly!",
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
      const data = await pemesananService.delete(req.params.id);
      if (data === 1) {
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
    } catch (err) {
      res.status(422).json({
        status: false,
        message: err.message,
      });
    }
  },
};
