const MurderModel = require("../models/murderModel");
const murderModel = new MurderModel();

module.exports = {
  // Tüm cinayet verilerini getir
  getAllMurders: async (req, res) => {
    try {
      const murders = await murderModel.getAllMurders();
      res.json(murders);
    } catch (error) {
      console.error("Error fetching all murders:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  // Belirli ID'ye göre cinayet verisini getir
  getMurderById: async (req, res) => {
    try {
      const { id } = req.params;
      const murder = await murderModel.getMurderById(id);
      if (!murder || Object.keys(murder).length === 0) {
        return res.status(404).json({ error: "Not Found" });
      }
      res.json(murder);
    } catch (error) {
      console.error("Error fetching murder by ID:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  // DBpedia'dan cinayet davalarını getir
  getMurderCases: async (req, res) => {
    console.log("found");
    try {
      const cases = await murderModel.getMurderCases();
      res.json(cases);
    } catch (error) {
      console.error("Error fetching murder cases:", error);
      res.status(500).json({ error: "Failed to fetch murder cases" });
    }
  },
};
