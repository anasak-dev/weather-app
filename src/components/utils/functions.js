export const openCityModal = (modal) => {
  modal.open = !modal.open;
};

export const getCurrentWeather = async (city) => {
  const formData = new FormData();
  formData.append("city", city);
  const currentTemp = await fetch(`/api/handler`, {
    body: formData,
    method: "post",
  });
  const jsonData = await currentTemp.json();
  return jsonData;
};
