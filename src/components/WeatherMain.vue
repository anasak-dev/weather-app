<template>
  <TransitionGroup
    :css="false"
    tag="ul"
    @before-enter="onBeforeEnter"
    @enter="onEnter"
    mode="out-in"
  >
    <Vue3Lottie
      :animationData="animationCloudsInSky"
      v-if="nightOrDay == 'day'"
      :key="animationCloudsInSky"
      width="100%"
      class="absolute z-10 top-[-30%]"
    />
    <Vue3Lottie
      :animationData="animationStarsInSky"
      :key="animationStarsInSky"
      v-if="nightOrDay == 'night'"
      :width="200"
      class="absolute z-10 top-[-30%]"
    />
  </TransitionGroup>
  <div class="relative overflow-hidden">
    <div
      class="w-full h-full absolute z-20 bg-white flex items-center justify-center"
      v-show="!appVisible"
    >
      <div class="text-center flex flex-col items-center justify-center gap-4">
        <img :src="loader" class="w-[45px]" />
        Loading current city weather
      </div>
    </div>
    <transition @before-enter="onMoonBeforeEnter" @enter="onMoonEnter">
      <img
        :src="separateIcon"
        :key="separateIcon"
        alt=""
        class="absolute z-[15] right-0 w-[10rem]"
      />
    </transition>

    <transition
      @before-enter="onBeforeBGEnter"
      @enter="onBGEnter"
      @leave="onBGLeave"
    >
      <img
        :src="bgWeather"
        alt=""
        :key="bgWeather"
        class="h-full object-cover w-full absolute z-1"
        srcset=""
        rel="preload"
      />
    </transition>

    <div
      class="temperature relative items-center w-full flex h-[100vh] flex-col justify-between"
    >
      <div class="h-full flex flex-col items-center gap-20 px-5">
        <transition @before-enter="onBeforeIconEnter" @enter="onIconEnter">
          <img
            :key="weatherIcon"
            :src="weatherIcon"
            alt=""
            class="w-[200px] z-[15] object-cover"
          />
        </transition>

        <div class="flex gap-4 flex-col items-center justify-center">
          <transition
            @before-enter="onBeforeTempEnter"
            @enter="onTempEnter"
            @leave="onTempLeave"
            mode="out-in"
          >
            <div class="overflow-hidden" :key="currentTemperature">
              <div
                class="flex gap-2 current-weather text-black"
                :class="{ 'text-white': nightOrDay == 'night' }"
              >
                <h2 class="text-8xl font-bold">
                  {{ currentTemperature }}
                </h2>
                <span
                  class="text-8xl font-bold before:content-[''] before:rounded-full relative block before:absolute before:w-[10px] before:h-[10px] before:border before:border-black"
                  :class="{ 'before:border-white': nightOrDay == 'night' }"
                  >C</span
                >
              </div>
            </div>
          </transition>

          <div
            class="weatherStatus bg-blue-600 px-10 py-4 rounded-full text-white text-center"
          >
            its {{ tempFeeling }} in {{ currentCity }}
          </div>
        </div>
      </div>
      <div
        :class="{ 'h-full': cityModal, 'h-[80px]': !cityModal }"
        class="citySelection fixed z-[15] bottom-0 bg-white w-full transition-all text-center pt-6 rounded-tr-[2rem] rounded-tl-[2rem] shadow-xl"
      >
        <div
          class="text-2xl tracking-wide cursor-pointer"
          @click="openCityModal"
        >
          Select city
        </div>
        <TransitionGroup
          :css="false"
          tag="ul"
          @before-enter="onBeforeEnter"
          @enter="onEnter"
          mode="out-in"
        >
          <li
            v-if="cityModal"
            v-for="(item, index) in list"
            :key="item.msg"
            class="border-b hover:bg-black/10 cursor-pointer"
            :data-index="index"
          >
            <span
              @click="setCurrentCity(item.msg)"
              class="w-full py-2 block h-full"
              >{{ item.msg }}
            </span>
          </li>
        </TransitionGroup>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, onBeforeMount, defineProps } from "vue";
import { Vue3Lottie } from "vue3-lottie";
import "vue3-lottie/dist/style.css";
import animationStarsInSky from "../assets/Render.json";
import animationCloudsInSky from "../assets/animation-cloud-moving.json";

import { gsap, Power4 } from "gsap";
import bgCold from "../assets/cold-weather.webp";
import bgRainy from "../assets/weather-rainy.png";
import bgSun from "../assets/bg-sun.webp";
import bgNight from "../assets/weather-night.webp";
import loader from "../assets/loading-state.gif";
import moonSeparate from "../assets/moon-separate.png";
import sunSeparate from "../assets/sun-separate.png";
import iconCold from "../assets/Cloud-snowing.png";
import iconColdNight from "../assets/Cloud-snowing-night.png";
import iconCloudSun from "../assets/Cloud-with-sun.png";
import iconCloudRain from "../assets/Cloud-raining.png";
const props = defineProps({
  defaultCity: {
    default: "Karachi",
  },
});
const animatingElements = ref("");
const currentTemperature = ref("");
const separateIcon = ref("");
const weatherIcon = ref("");
const bgWeather = ref("");
const list = [
  { msg: "Islamabad" },
  { msg: "Lahore" },
  { msg: "Karachi" },
  { msg: "Quetta" },
  { msg: "Faisalabad" },
  { msg: "New york" },
  { msg: "Berlin" },
  { msg: "Auckland" },
  { msg: "Sydney" },
  { msg: "Ohio" },
  { msg: "Austin" },
  { msg: "Wellington" },
];

const tempFeeling = ref("");
const cityModal = ref(false);
const currentCity = ref(props.defaultCity);
const nightOrDay = ref("");
const appVisible = ref(false);
const openCityModal = () => {
  cityModal.value = !cityModal.value;
};
const serverLessBranch = "This is a vercel branch";
const getCurrentWeather = async (city) => {
  const formData = new FormData();
  formData.append("city", city);
  const currentTemp = await fetch(`/api/handler`, {
    body: formData,
    method: "post",
  });
  const jsonData = await currentTemp.json();
  return jsonData;
};
onBeforeMount(() => {
  getCurrentWeather(props.defaultCity)
    .then((data) => {
      currentTemperature.value = data.current.temp_c;
      const dayTime = data.current.condition.icon;
      nightOrDay.value = dayTime.search("night") > 0 ? "night" : "day";

      if (currentTemperature.value <= 15 && dayTime.search("night") == "-1") {
        weatherIcon.value = iconCloudSun;
        tempFeeling.value = "take your sweater with you weather";
        separateIcon.value = sunSeparate;
        bgWeather.value = bgCold;
      } else if (
        currentTemperature.value > "22" &&
        dayTime.search("night") == "-1"
      ) {
        animatingElements.value = animationCloudsInSky;
        weatherIcon.value = iconCloudSun;
        separateIcon.value = sunSeparate;
        tempFeeling.value = "close to cold weather";
        bgWeather.value = bgSun;
      } else if (
        currentTemperature.value > "15" &&
        dayTime.search("night") > "0"
      ) {
        tempFeeling.value = "close to cold weather";
        separateIcon.value = moonSeparate;

        weatherIcon.value = iconColdNight;
        bgWeather.value = bgNight;
      } else if (
        currentTemperature.value <= "15" &&
        dayTime.search("night") == "-1"
      ) {
        tempFeeling.value = "take your sweater with you weather";
        weatherIcon.value = iconCloudSun;
        separateIcon.value = sunSeparate;
        bgWeather.value = bgCold;
      } else if (
        currentTemperature.value <= "15" &&
        dayTime.search("night") > 0
      ) {
        tempFeeling.value = "take your sweater with you weather";
        weatherIcon.value = iconColdNight;
        bgWeather.value = bgNight;
        separateIcon.value = moonSeparate;
      } else if (
        currentTemperature.value >= "16" &&
        dayTime.search("night") == "-1"
      ) {
        weatherIcon.value = iconCloudSun;
        bgWeather.value = bgSun;
        separateIcon.value = sunSeparate;

        tempFeeling.value = "normal weather";
      } else if (
        currentTemperature.value >= "22" &&
        dayTime.search("night") > "0"
      ) {
        tempFeeling.value = "close to hot weather";
        separateIcon.value = moonSeparate;
        weatherIcon.value = iconColdNight;
        bgWeather.value = bgNight;
      }
    })
    .then(() => {
      setTimeout(() => {
        appVisible.value = true;
      }, 750);
    })
    .catch((error) => {
      console.log(error);
      alert("There are some issues loading weather data");
    });
});

const setCurrentCity = (city) => {
  getCurrentWeather(city).then((data) => {
    currentTemperature.value = data.current.temp_c;
    const dayTime = data.current.condition.icon;
    nightOrDay.value = dayTime.search("night") > 0 ? "night" : "day";
    if (dayTime.search("night") > 0) {
      animatingElements.value = animationStarsInSky;
    }
    if (currentTemperature.value <= 15 && dayTime.search("night") == "-1") {
      weatherIcon.value = iconCloudSun;
      tempFeeling.value = "take your sweater with you weather";
      separateIcon.value = sunSeparate;
      bgWeather.value = bgCold;
    } else if (
      currentTemperature.value > "22" &&
      dayTime.search("night") == "-1"
    ) {
      weatherIcon.value = iconCloudSun;
      separateIcon.value = sunSeparate;

      tempFeeling.value = "close to cold weather";
      bgWeather.value = bgSun;
    } else if (
      currentTemperature.value > "15" &&
      dayTime.search("night") > "0"
    ) {
      tempFeeling.value = "close to cold weather";
      separateIcon.value = moonSeparate;

      weatherIcon.value = iconColdNight;
      bgWeather.value = bgNight;
    } else if (
      currentTemperature.value <= "15" &&
      dayTime.search("night") == "-1"
    ) {
      tempFeeling.value = "take your sweater with you weather";
      weatherIcon.value = iconCloudSun;
      separateIcon.value = sunSeparate;
      bgWeather.value = bgCold;
    } else if (
      currentTemperature.value <= "15" &&
      dayTime.search("night") > 0
    ) {
      tempFeeling.value = "take your sweater with you weather";
      weatherIcon.value = iconColdNight;
      bgWeather.value = bgNight;
      separateIcon.value = moonSeparate;
    } else if (
      currentTemperature.value >= "16" &&
      dayTime.search("night") == "-1"
    ) {
      weatherIcon.value = iconCloudSun;
      bgWeather.value = bgSun;
      separateIcon.value = sunSeparate;

      tempFeeling.value = "normal weather";
    } else if (
      currentTemperature.value >= "22" &&
      dayTime.search("night") > "0"
    ) {
      tempFeeling.value = "close to hot weather";
      separateIcon.value = moonSeparate;
      weatherIcon.value = iconColdNight;
      bgWeather.value = bgNight;
    }
  });
  currentCity.value = city;
  cityModal.value = false;
};

// Transition animations
const onEnter = (el, done) => {
  gsap.to(el, {
    opacity: 1,
    y: 0,
    delay: el.dataset.index * 0.05,
    onComplete: done,
  });
};

const onTempLeave = (el, done) => {
  const currentWeather = el.querySelector(".current-weather");
  gsap.to(currentWeather, {
    opacity: 1,
    y: -100,
    onComplete: done,
  });
};

const onTempEnter = (el, done) => {
  const currentWeather = el.querySelector(".current-weather");
  gsap.to(currentWeather, {
    opacity: 1,
    y: 0,
    onComplete: done,
  });
};

const onBeforeTempEnter = (el) => {
  el.querySelector(".current-weather").style.transform = "translateY(50px)";
};
const onIconEnter = (el, done) => {
  gsap.to(el, {
    opacity: 1,
    y: 0,
    onComplete: done,
  });
};

const onBGLeave = (el, done) => {
  gsap.to(el, {
    opacity: 0,
    onComplete: done,
  });
};
const onBGEnter = (el, done) => {
  gsap.to(el, {
    duration: 3,
    scale: 1,
    onComplete: done,
  });
};
const onBeforeBGEnter = (el) => {
  el.style.transform = "scale(1.5)";
};
const onMoonEnter = (el, done) => {
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
const onMoonBeforeEnter = (el) => {
  console.log("yooo", el);
  el.style.transform = "translateX(150px)";
};
const onBeforeIconEnter = (el) => {
  el.style.opacity = 0;
  el.style.transform = "translateY(50px)";
};
const onBeforeEnter = (el) => {
  el.style.opacity = 0;
  el.style.transform = "translateY(20px)";
};
// Transition animations
</script>
