const path = require("path");

const geocode = require("./utils/geocode");
const forecast = require("./utils/forecast");
const express = require("express");
const hbs = require("hbs");

const app = express();
const port = process.env.PORT || 3000;

//Define paths for Express config
const publicDirPath = path.join(__dirname, "../public");
const viewsPath = path.join(__dirname, "../templates/views");
const partialsPath = path.join(__dirname, "../templates/partials");

// setup handlebars engine and views location
app.set("view engine", "hbs");
app.set("views", viewsPath);
hbs.registerPartials(partialsPath);

//setup static directory to serve public assets
app.use(express.static(publicDirPath));

app.get("", (req, res) => {
  res.render("index", {
    title: "MyWeatherApp",
    name: "Kris Brough"
  });
});

app.get("/about", (req, res) => {
  res.render("about", {
    title: "About The Application",
    info:
      "This application is a demonstration of the use of NodeJS using the express and request modules. Additionally, API calls have been made to mapbox and weatherstack to provide realtime data. Whilst the primary focus of this application has been backend development, the client-side has made us of templating through use of hbs to enable dynamic and reusable frontend pages. Finally, production/deployment has been met through Heroku",
    name: "Kris Brough"
  });
});

app.get("/help", (req, res) => {
  res.render("help", {
    title: "Help Page",
    message:
      "Enter your city on the main page to get the weather where you are.",
    name: "Kris Brough"
  });
});

app.get("/weather", (req, res) => {
  if (!req.query.address) {
    res.send({
      error: "please provide an address"
    });
  } else {
    geocode(
      req.query.address,
      (error, { latitude, longitude, location } = {}) => {
        if (error) {
          res.send({
            error: "there has been an error"
          });
        }
        forecast(latitude, longitude, (error, forecastData) => {
          if (error) {
            res.send({
              error: "there has been an error"
            });
          }
          res.send({
            location: location,
            forecast: forecastData,
            address: req.query.address
          });
        });
      }
    );
  }
});

app.get("/help/*", (req, res) => {
  res.render("404error", {
    title: "404",
    error: "This help article cannot be found",
    name: "Kris Brough"
  });
});

app.get("*", (req, res) => {
  res.render("404error", {
    title: "404",
    error: "Page cannot be found",
    name: "Kris Brough"
  });
});

app.listen(port, () => {
  console.log(`Server is up on port ${port}!`);
});
