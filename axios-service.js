'use strict';
const axios = require('axios');

const AxiosService = {
    get,
    post
};

function get(url, successCallBack, errorCallBack) {
    return axios.get(url)
        .then((response) =>
            new Promise((resolve) => resolve(successCallBack(response.data)))
        )
        .catch((err) => {
            return new Promise((resolve) => resolve(errorCallBack(err)));
        });
}

function post(url, obj, successCallBack, errorCallBack) {
    return axios.post(url, obj)
        .then((response) =>
            new Promise((resolve) => resolve(successCallBack(response.data)))
        )
        .catch((err) => {
            return new Promise((resolve) => resolve(errorCallBack(err)));
        });
}

module.exports = AxiosService;

