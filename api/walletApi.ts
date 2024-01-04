import axios from "axios";

const walletApi = axios.create({
    baseURL: `${process.env.URL_BASE_API}/api`,
})

export default walletApi;