const pemesananService = require("../services/pemesananService");
const barangService = require("../services/barangService");
const notifService = require("../services/notifService");
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
        //
        pagination.next = {
          page: page + 1,
          perPage: perPage,
        };
      }
      if (start > 0) {
        pagination.previous = {
          page: page - 1,
          perPage: perPage,
        };
      }
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
      // Respon yang akan ditampilkan jika datanya ada
      if (data.length >= 1) {
        res.status(200).json({
          status: true,
          message: "Successfully get all data",
          data,
          otherData: {
            perluDisetujui: pDisetujui,
            perluDijemput: pDijemput,
            perluDikerjakan: pDikerjakan,
            perluDiantar: pDiantar,
            completed: selesai,
            cancelled: dibatalkan,
          },
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

  // pemesanan as user
  async createByUser(req, res) {
    try {
      const randomNumber = Math.floor(10000000 + Math.random() * 90000000); // Membuat nomor pesanan secara random
      const data = await pemesananService.createByUser(req.user.id, {
        ...req.body,
        nomorPesanan: randomNumber,
        adminId: null,
        status: "Perlu Disetujui",
        totalHarga: 0,
        createdBy: "user",
      });
      if (
        data.status === "Perlu Disetujui" ||
        data.status === "Perlu Dijemput" ||
        data.status === "Perlu Dikerjakan" ||
        data.status === "Perlu Diantar" ||
        data.status === "Selesai" ||
        data.status === "Dibatalkan"
      ) {
        await notifService.create({
          pemesananId: data.id,
          dibacaAdmin: false,
          dibacaUser: false,
          pesan: `Ada pesanan baru dibuat oleh ${data.createdBy}, cek sekarang!`,
        });
        res.status(201).json({
          status: true,
          message: "Successfully create data",
          data,
        });
      } else {
        res.status(400).json({
          status: false,
          message: "Please input the status correctly!",
        });
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
      // Fungsi untuk menghitung total harga
      const idPesanan = await pemesananService.getById(req.params.id);
      const barang = await barangService.getAllData();
      const compare = barang.filter(
        (value) => value.pemesananId === idPesanan.id
      );
      const total = compare.reduce((acc, curr) => {
        return acc + curr.jumlah;
      }, 0);

      if (req.body.nomorPesanan || req.body.adminId) {
        return res.status(422).json({
          status: false,
          message: "You can't change order number and admin id",
        });
      } else {
        await pemesananService.updateByUser(req.params.id, req.user.id, {
          ...req.body,
          totalHarga: total - req.body.diskon,
        });
        const data = await pemesananService.getById(req.params.id);
        await notifService.create({
          pemesananId: data.id,
          dibacaAdmin: false,
          dibacaUser: false,
          pesan: `Pesanan diubah oleh user bernama ${data.User.nama}, cek sekarang!`,
        });
        if (data !== null) {
          res.status(200).json({
            status: true,
            message: "Successfully update data",
            data: data,
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

  // pemesanan as admin
  async createByAdmin(req, res) {
    try {
      const randomNumber = Math.floor(10000000 + Math.random() * 90000000); // Membuat nomor pesanan secara random
      if (
        req.body.status === "Perlu Disetujui" ||
        req.body.status === "Perlu Dijemput" ||
        req.body.status === "Perlu Dikerjakan" ||
        req.body.status === "Perlu Diantar" ||
        req.body.status === "Selesai" ||
        req.body.status === "Dibatalkan"
      ) {
        const data = await pemesananService.createByAdmin(req.admin.id, {
          ...req.body,
          nomorPesanan: randomNumber,
          totalHarga: 0,
          createdBy: "admin",
        });
        await notifService.create({
          pemesananId: data.id,
          dibacaAdmin: false,
          dibacaUser: false,
          pesan: `Ada pesanan baru dibuat oleh ${data.createdBy}, cek sekarang!`,
        });
        res.status(201).json({
          status: true,
          message: "Successfully create data",
          data,
        });
      } else {
        res.status(400).json({
          status: false,
          message: "Please input the status correctly!",
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

      if (req.body.nomorPesanan) {
        res.status(422).json({
          status: false,
          message: "You can't change the order number",
        });
      } else {
        await pemesananService.updateByAdmin(req.params.id, req.admin.id, {
          ...req.body,
          totalHarga: total - req.body.diskon,
        });
        const data = await pemesananService.getById(req.params.id);
        await notifService.create({
          pemesananId: data.id,
          dibacaAdmin: false,
          dibacaUser: false,
          pesan: `Pesanan diubah oleh admin bernama ${data.Admin.nama}, cek sekarang!`,
        });
        if (data !== null) {
          res.status(200).json({
            status: true,
            message: "Successfully update data",
            data: data,
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
