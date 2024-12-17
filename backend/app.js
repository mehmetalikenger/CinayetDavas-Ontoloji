const express = require("express");
const app = express();
const cors = require("cors");
const murderRoutes = require("./routes/murderRoutes");

app.use(cors());
app.disable("etag"); // ETag'i devre dışı bırak
app.use(express.json());

// API rotalarını kullan
app.use("/api", murderRoutes);
app.use((req, res, next) => {
  res.setHeader(
    "Cache-Control",
    "no-store, no-cache, must-revalidate, private"
  );
  next();
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
