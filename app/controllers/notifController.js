const notifService = require("../services/notifService");

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
      const data = await notifService.getAll(perPage, start); // Data yang sudah dipaginasi
      const allData = await notifService.getAllData(); // Seluruh data tanpa paginasi
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

  async getById(req, res) {
    try {
      const data = await notifService.getById(req.params.id);
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

  async getAllByUser(req, res) {
    try {
      const userId = await notifService.getUserId(req.params.userId);
      const compare = userId.filter(
        (value) => value.Pemesanan.userId === req.user.id
      );
      if (compare.length >= 1) {
        res.status(200).json({
          status: true,
          message: "Successfully get all data",
          data: compare,
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

  async updateStatusByUser(req, res) {
    try {
      const dataBf = await notifService.getById(req.params.id);
      await notifService.update(req.params.id, {
        dibacaUser: true,
      });
      const dataAf = await notifService.getById(req.params.id);
      if (dataBf.dibacaUser === true) {
        res.status(200).json({
          status: true,
          message: "Notification has been read!",
          data: dataBf,
        });
      } else if (dataAf !== null) {
        res.status(200).json({
          status: true,
          message: "Successfully update data",
          data: dataAf,
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

  async updateStatusByAdmin(req, res) {
    try {
      const dataBf = await notifService.getById(req.params.id);
      await notifService.update(req.params.id, {
        dibacaAdmin: true,
      });
      const dataAf = await notifService.getById(req.params.id);
      if (dataBf.dibacaAdmin === true) {
        res.status(200).json({
          status: true,
          message: "Notification has been read!",
          data: dataBf,
        });
      } else if (dataAf !== null) {
        res.status(200).json({
          status: true,
          message: "Successfully update data",
          data: dataAf,
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

  async readAllByUser(req, res) {
    try {
      const userId = await notifService.getUserId(req.params.userId);
      const compare = userId.filter(
        (value) => value.Pemesanan.userId === req.user.id
      );
      console.log(compare);
      if (compare.length >= 1) {
        await notifService.readAllByUser(req.params.userId);
        const data = await notifService.getUserId(req.params.userId);
        if (data.length >= 1) {
          res.status(200).json({
            status: true,
            message: "Successfully update all data",
            data: data,
          });
        } else {
          res.status(404).json({
            status: false,
            message: "Data empty, Please input some data!",
          });
        }
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

  async readAllByAdmin(req, res) {
    try {
      await notifService.readAllByAdmin();
      const data = await notifService.getAll(perPage, start);
      if (data.length >= 1) {
        res.status(200).json({
          status: true,
          message: "Successfully update all data",
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
        status: true,
        message: err.message,
      });
    }
  },

  async deleteById(req, res) {
    try {
      const data = await notifService.delete(req.params.id);
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
