import axios from 'axios';

const call = axios.create({
    baseURL: 'https://iot.gjar-po.sk/'
})

export default call;