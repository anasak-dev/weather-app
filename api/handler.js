// using ES6 modules
import fetch from "isomorphic-unfetch";
// https://github.com/node-formidable/formidable
import formidable from "formidable";

export default async function (req, res) {
  const form = new formidable.IncomingForm();
  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error");
      return;
    }
    const currentTemp = await fetch(
      `https://api.weatherapi.com/v1/current.json?key=${process.env.key}&q=${fields.city}}`
    );
    const jsonData = await currentTemp.json();
    return res.status(200).send(jsonData);
  });
}
