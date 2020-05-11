const request = require("request");

const forecast = (latitude, longitude, callback) => {
  const url = `http://api.weatherstack.com/current?access_key=b12cc8868be498b682daf4e96819b36e&query=${latitude},${longitude}`;
  request({ url, json: true }, (error, { body }) => {
    if (error) {
      callback("Unable to connect to Weather service", undefined);
    } else if (body.error) {
      callback("Unable to find location", undefined);
    } else {
      callback(
        undefined,
        `${body.current.weather_descriptions[0]}: It is currently ${body.current.temperature} degrees however it feels like  ${body.current.feelslike} degrees. There is currently a ${body.current.percip} chance of rain`
      );
    }
  });
};

module.exports = forecast;
