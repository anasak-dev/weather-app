import { getCurrentWeather } from "./functions";
import { weatherBackgrounds } from "./bgImgs";

export const setCurrentCity = (
  city,
  appVisible,
  cityModal,
  weatherProperties,
  currentTemperature,
  nightOrDay
) => {
  appVisible.visible = false;
  getCurrentWeather(city).then((data) => {
    appVisible.visible = true;
    [
      weatherProperties.humidity,
      weatherProperties.cloud,
      weatherProperties.precip,
    ] = [
      data.current.humidity,
      data.current.cloud > 80
        ? "Cloudy"
        : data.current.cloud < 20
        ? "Clear"
        : "Partly cloudy",

      data.current.precip_mm,
    ];

    currentTemperature.temperature = data.current.temp_c;
    const dayTime = data.current.condition.icon;
    nightOrDay.dayTime = dayTime.search("night") > 0 ? "night" : "day";
    // set background image based on weather type
    if (
      weatherProperties.cloud == "Clear" &&
      dayTime.search("night") == "-1" &&
      weatherProperties.precip == 0
    ) {
      weatherProperties.bgWeather = weatherBackgrounds.bgDayClear;
    } else if (
      weatherProperties.cloud == "Cloudy" &&
      dayTime.search("night") == "-1" &&
      weatherProperties.precip == 0
    ) {
      weatherProperties.bgWeather = weatherBackgrounds.bgDayCloudy;
    } else if (
      weatherProperties.precip > 0 &&
      dayTime.search("night") == "-1"
    ) {
      weatherProperties.bgWeather = weatherBackgrounds.bgDayRaining;
    } else if (
      weatherProperties.precip > 0.5 &&
      dayTime.search("night") == "-1"
    ) {
      weatherProperties.bgWeather = weatherBackgrounds.bgDayHeavyRaining;
    } else if (
      weatherProperties.precip <= 0.5 &&
      weatherProperties.precip > 0 &&
      dayTime.search("night") > 0
    ) {
      weatherProperties.bgWeather = weatherBackgrounds.bgNightRaining;
    } else if (
      weatherProperties.precip >= 0.6 &&
      weatherProperties.precip > 0 &&
      dayTime.search("night") > 0
    ) {
      weatherProperties.bgWeather = weatherBackgrounds.bgNightHeavyRaining;
    } else if (
      weatherProperties.cloud == "Partly cloudy" &&
      weatherProperties.precip == 0 &&
      dayTime.search("night") == "-1"
    ) {
      weatherProperties.bgWeather = weatherBackgrounds.bgDayPartial;
    } else if (
      weatherProperties.cloud == "Clear" &&
      weatherProperties.precip == 0 &&
      dayTime.search("night") > 0
    ) {
      weatherProperties.bgWeather = weatherBackgrounds.bgNightClear;
    } else if (
      weatherProperties.cloud == "Cloudy" &&
      weatherProperties.precip == 0 &&
      dayTime.search("night") > 0
    ) {
      weatherProperties.bgWeather = weatherBackgrounds.bgNightCloudy;
    } else if (
      weatherProperties.cloud == "Partly cloudy" &&
      weatherProperties.precip == 0 &&
      dayTime.search("night") > 0
    ) {
      weatherProperties.bgWeather = weatherBackgrounds.bgNightPartial;
    }
    // set background image based on weather type

    // set weather icon based on time of day & weather type
    if (
      weatherProperties.cloud == "Clear" &&
      dayTime.search("night") == "-1" &&
      weatherProperties.precip == 0
    ) {
      weatherProperties.weatherType = "dayClear";
    } else if (
      weatherProperties.cloud == "Cloudy" &&
      dayTime.search("night") == "-1" &&
      weatherProperties.precip == 0
    ) {
      weatherProperties.weatherType = "dayCloudy";
    } else if (
      weatherProperties.cloud == "Partly cloudy" &&
      dayTime.search("night") == "-1" &&
      weatherProperties.precip == 0
    ) {
      weatherProperties.weatherType = "dayPartial";
    } else if (
      dayTime.search("night") == "-1" &&
      weatherProperties.precip <= 0.5 &&
      weatherProperties.precip > 0
    ) {
      weatherProperties.weatherType = "dayRaining";
    } else if (
      dayTime.search("night") == "-1" &&
      weatherProperties.precip > 0.5
    ) {
      weatherProperties.weatherType = "dayHeavyRaining";
    } else if (
      weatherProperties.cloud == "Clear" &&
      dayTime.search("night") > 0 &&
      weatherProperties.precip == 0
    ) {
      weatherProperties.weatherType = "nightClear";
    } else if (
      weatherProperties.cloud == "Cloudy" &&
      dayTime.search("night") > 0 &&
      weatherProperties.precip == 0
    ) {
      weatherProperties.weatherType = "nightCloudy";
    } else if (
      weatherProperties.cloud == "Partly cloudy" &&
      dayTime.search("night") > 0 &&
      weatherProperties.precip == 0
    ) {
      weatherProperties.weatherType = "nightPartial";
    } else if (
      dayTime.search("night") > 0 &&
      weatherProperties.precip <= 0.5 &&
      weatherProperties.precip > 0
    ) {
      weatherProperties.weatherType = "nightRaining";
    } else if (dayTime.search("night") > 0 && weatherProperties.precip > 0.5) {
      weatherProperties.weatherType = "nightHeavyRaining";
    }
    // set weather icon based on time of day & weather type

    if (
      currentTemperature.temperature <= 15 &&
      dayTime.search("night") == "-1"
    ) {
      weatherProperties.separateIcon = weatherBackgrounds.sunSeparate;
    } else if (
      currentTemperature.temperature > "22" &&
      dayTime.search("night") == "-1"
    ) {
      weatherProperties.separateIcon = weatherBackgrounds.sunSeparate;
    } else if (
      currentTemperature.temperature > "15" &&
      dayTime.search("night") > "0"
    ) {
      weatherProperties.separateIcon = weatherBackgrounds.moonSeparate;
    } else if (
      currentTemperature.temperature <= "15" &&
      dayTime.search("night") == "-1"
    ) {
      weatherProperties.separateIcon = weatherBackgrounds.sunSeparate;
    } else if (
      currentTemperature.temperature <= "15" &&
      dayTime.search("night") > 0
    ) {
      weatherProperties.separateIcon = weatherBackgrounds.moonSeparate;
    } else if (
      currentTemperature.temperature >= "16" &&
      dayTime.search("night") == "-1"
    ) {
      weatherProperties.separateIcon = weatherBackgrounds.sunSeparate;
    } else if (
      currentTemperature.temperature >= "22" &&
      dayTime.search("night") > "0"
    ) {
      weatherProperties.separateIcon = weatherBackgrounds.moonSeparate;
    }
  });
  cityModal.open = false;
};
