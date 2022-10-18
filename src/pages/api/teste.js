import axios from "axios";

export default async function handler(req, res) {
  const config = {
    method: "get",
    url: "https://sandbox.api.pagseguro.com/orders/ORDE_362307FD-EEB5-4AC9-9145-C89221D6B16B",
    headers: {
      Authorization: "DF966C10124A43B5B96204C08675D04D",
    },
  };

  axios(config)
    .then(function (response) {
      //   console.log(JSON.stringify(response.data));
      res.status(200).json(response.data);
    })
    .catch(function (error) {
      res.status(400).json();
    });
}
