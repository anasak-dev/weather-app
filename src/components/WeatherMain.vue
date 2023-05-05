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
      v-if="nightOrDay.dayTime == 'day'"
      :key="animationCloudsInSky"
      width="100%"
      class="absolute z-10 top-[-30%] pointer-events-none"
    />
    <Vue3Lottie
      :animationData="animationStarsInSky"
      :key="animationStarsInSky"
      v-if="nightOrDay.dayTime == 'night'"
      :width="200"
      class="absolute z-10 top-[-30%]"
    />
  </TransitionGroup>
  <div class="relative overflow-hidden">
    <div
      class="w-full h-full absolute z-20 bg-white flex items-center justify-center"
      v-show="!appVisible.visible"
    >
      <div class="text-center flex flex-col items-center justify-center gap-4">
        <img :src="loader" class="w-[45px]" />
        Loading current city weather
      </div>
    </div>
    <transition @before-enter="onMoonBeforeEnter" @enter="onMoonEnter">
      <img
        :src="weatherProperties.separateIcon"
        :key="weatherProperties.separateIcon"
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
        :src="weatherProperties.bgWeather"
        alt=""
        :key="weatherProperties.bgWeather"
        class="h-full object-cover w-full absolute z-1"
        srcset=""
        rel="preload"
      />
    </transition>

    <div
      class="temperature relative items-center w-full flex h-[100vh] flex-col justify-between"
    >
      <div
        class="h-full w-full flex flex-col items-center gap-20 px-5 justify-center"
      >
        <div class="flex gap-4 flex-col items-center justify-center w-full">
          <transition
            @before-enter="onBeforeTempEnter"
            @enter="onTempEnter"
            @leave="onTempLeave"
            mode="out-in"
          >
            <div
              class="overflow-hidden shadow-2xl bg-white w-full max-w-[280px] rounded-md flex items-center flex-col pt-4"
              :key="currentTemperature.temperature"
            >
              <div
                class="overflow-hidden flex w-full items-center justify-center gap-3 pb-4"
              >
                <div
                  v-html="weatherIcon"
                  class="h-[60px] z-[15] object-cover weatherIcon"
                ></div>

                <div class="overflow-hidden">
                  <div class="flex gap-2 current-weather text-black">
                    <h2 class="text-6xl font-bold">
                      {{ currentTemperature.temperature }}
                    </h2>
                    <span
                      class="text-6xl font-bold before:content-[''] before:rounded-full relative block before:absolute before:w-[10px] before:h-[10px] before:border before:border-black"
                      >C</span
                    >
                  </div>
                </div>
              </div>
              <div
                class="weather-properties flex flex-col gap-2 w-full bg-[#F8FFE8] border border-t/10 py-2"
              >
                <div
                  class="precipitation flex justify-between border-b border-black/10 px-4 pb-2"
                >
                  <h4 class="font-bold">Precipitation</h4>
                  <h4>{{ weatherProperties.precip }}</h4>
                </div>

                <div
                  class="humidity flex justify-between border-b border-black/10 px-4 pb-2"
                >
                  <h4 class="font-bold">Humidity</h4>
                  <h4>{{ weatherProperties.humidity }}</h4>
                </div>

                <div class="cloudy flex justify-between px-4">
                  <h4 class="font-bold">Clouds</h4>
                  <h4>{{ weatherProperties.cloud }}</h4>
                </div>
              </div>
            </div>
          </transition>

          <!-- <div
            class="weatherStatus bg-blue-600 px-10 py-4 rounded-full text-white text-center"
          >
            its {{ tempFeeling }} in {{ currentCity }}
          </div> -->
        </div>
      </div>
      <div
        :class="{ 'h-full': cityModal.open, 'h-[80px]': !cityModal.open }"
        class="citySelection fixed z-[15] bottom-0 bg-white w-full transition-all text-center pt-6 rounded-tr-[2rem] rounded-tl-[2rem] shadow-xl"
      >
        <div
          class="text-2xl tracking-wide cursor-pointer"
          @click="openCityModal(cityModal)"
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
            v-if="cityModal.open"
            v-for="(item, index) in cityList"
            :key="item.cityName"
            class="border-b hover:bg-black/10 cursor-pointer"
            :data-index="index"
          >
            <span
              @click="
                setCurrentCity(
                  item.cityName,
                  appVisible,
                  cityModal,
                  weatherProperties,
                  currentTemperature,
                  nightOrDay
                )
              "
              class="w-full py-2 block h-full"
              >{{ item.cityName }}
            </span>
          </li>
        </TransitionGroup>
      </div>
    </div>
  </div>
</template>
<script setup>
import { onBeforeMount, reactive, computed } from "vue";
import { Vue3Lottie } from "vue3-lottie";
import "vue3-lottie/dist/style.css";
import animationStarsInSky from "../assets/Render.json";
import animationCloudsInSky from "../assets/animation-cloud-moving.json";
// import animations
import {
  onBeforeTempEnter,
  onTempEnter,
  onTempLeave,
  onMoonEnter,
  onBGEnter,
  onBGLeave,
  onBeforeBGEnter,
  onBeforeEnter,
  onMoonBeforeEnter,
  onEnter,
} from "./utils/animations";
// import city list
import { cityList } from "./data/cityList";
// import functions (Openmodal,getCurrentWeather)
import { openCityModal, getCurrentWeather } from "./utils/functions";
import { setCurrentCity } from "./utils/searchSelectedCity";

import loader from "../assets/loading-state.gif";
const props = defineProps({
  defaultCity: {
    default: "Karachi",
  },
});
const icons = import.meta.glob("../assets/weatherIcons/**/*.svg", {
  as: "raw",
  eager: true,
});
const currentTemperature = reactive({
  temperature: "",
});
const weatherIcon = computed(() => {
  return (
    icons["../assets/weatherIcons/" + weatherProperties.weatherType + ".svg"] ??
    icons["../../assets/icons/icon-logo-cone.svg"]
  );
});
const weatherProperties = reactive({
  precip: "",
  cloud: "",
  humidity: "",
  bgWeather: "",
  weatherType: "",
  separateIcon: "",
  animatingElements: "",
});
const cityModal = reactive({ open: false });
const nightOrDay = reactive({ dayTime: "" });
const appVisible = reactive({ visible: false });

onBeforeMount(() => {
  setCurrentCity(
    props.defaultCity,
    appVisible,
    cityModal,
    weatherProperties,
    currentTemperature,
    nightOrDay
  );
});
</script>
<style>
.weatherIcon svg {
  object-fit: cover;
  width: 100%;
  height: 100%;
}
</style>
