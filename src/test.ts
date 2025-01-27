import axios from "axios";
const API = axios.create({
  baseURL: "http://172.20.107.18:3000",
});
async function invoke() {
  const result = await API.post("/process" + (Math.random() > 0.5 ? "1" : "2"));
  console.log(result.data);
}
async function main() {
  await Promise.all(Array.from({ length: 30 }, () => invoke()));
}
main();
