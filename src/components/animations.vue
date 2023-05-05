<script>
import { gsap } from "gsap";
export const onEnter = (el, done) => {
  gsap.to(el, {
    opacity: 1,
    y: 0,
    delay: el.dataset.index * 0.05,
    onComplete: done,
  });
};

export const onTempLeave = (el, done) => {
  const currentWeather = el.querySelector(".current-weather");
  gsap.to(currentWeather, {
    opacity: 1,
    y: -100,
    onComplete: done,
  });
  el.querySelector(".weatherIcon").style.transform =
    "translateX(-20px) scale(0)";
  el.querySelector(".weatherIcon").style.opacity = 0;
  el.querySelectorAll(".weather-properties div").forEach((property) => {
    property.style.transform = "translateY(20px)";
    property.style.opacity = 0;
  });
};

export const onTempEnter = (el, done) => {
  const showWeatherProperties = () => {
    const weatherPropertiesWrapper = el.querySelector(".weather-properties");
    weatherPropertiesWrapper
      .querySelectorAll("div")
      .forEach((singleProperty, index) => {
        index++;
        console.log(index);
        gsap.to(singleProperty, {
          opacity: 1,
          y: 0,
          delay: index * 0.05,
          duration: 0.45,
          onComplete: done,
        });
      });

    const weatherIcon = el.querySelector(".weatherIcon");
    gsap.to(weatherIcon, {
      opacity: 1,
      x: 0,
      scale: 1,
      duration: 0.4,
      onComplete: done,
    });
  };

  const currentWeather = el.querySelector(".current-weather");
  gsap.to(currentWeather, {
    opacity: 1,
    y: 0,
    onComplete: showWeatherProperties,
  });
};

export const onBeforeTempEnter = (el) => {
  el.querySelector(".current-weather").style.transform = "translateY(50px)";
  el.querySelector(".weatherIcon").style.transform =
    "translateX(-20px) scale(0)";
  el.querySelector(".weatherIcon").style.opacity = 0;
  el.querySelectorAll(".weather-properties div").forEach((property) => {
    property.style.transform = "translateY(20px)";
    property.style.opacity = 0;
  });
};

export const onIconEnter = (el, done) => {
  gsap.to(el, {
    opacity: 1,
    y: 0,
    onComplete: done,
  });
};

export const onBGLeave = (el, done) => {
  gsap.to(el, {
    opacity: 0,
    onComplete: done,
  });
};
export const onBGEnter = (el, done) => {
  gsap.to(el, {
    duration: 3,
    scale: 1,
    onComplete: done,
  });
};
export const onBeforeBGEnter = (el) => {
  el.style.transform = "scale(1.5)";
};
export const onMoonEnter = (el, done) => {
  gsap.to(el, {
    x: 0,
    delay: 1,
    duration: 2,
    onComplete: done,
  });

  gsap.to(el, {
    rotation: 360,
    ease: "none",
    delay: 1,
    transformOrigin: "50% 50%",
    repeat: -1,
    duration: 40,
  });
};
export const onMoonBeforeEnter = (el) => {
  console.log("yooo", el);
  el.style.transform = "translateX(150px)";
};

export const onBeforeEnter = (el) => {
  el.style.opacity = 0;
  el.style.transform = "translateY(20px)";
};
// Transition animations
</script>
