const express = require("express");
const cors = require("cors");
const connectFn = require("./config/connect");
require("dotenv").config();
const userRoutes = require("./routes/UserRoutes");
const BikeRoutes = require("./routes/VeloRoutes");
const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/", userRoutes);
app.use("/api/", BikeRoutes);

app.use((req, res) => {
  res.status(404).json({ error: "Route non trouvé" });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Erreur serveur" });
});

connectFn();

app.listen(process.env.PORT, () => console.log("listening in port 3000"));
