'use strict';
module.exports.execute = execute;
module.exports.isStar = true;

const AxiosService = require('./axios-service');

const chalk = require('chalk');
const red = chalk.hex('#F00');
const green = chalk.hex('#0F0');

function butify(parameters) {
    let res = {};
    parameters.forEach(function(el) {
        if(el.substr(2, 2) === 'fr') {
            res.from =  el.substr(7, el.length-1);
        }
        if(el.substr(2, 2) === 'to') {
            res.to = el.substr(5, el.length-1);
        }
        if(el.substr(2, 2) === 'te') {
            res.text =  el.substr(7, el.length-1);
        }
    })
    return res;
}

function butifyMessage(elem, isLast) {
    let res = '';
    if (elem.from) {
        res += `${red('FROM')}: ${elem.from} \n`;
    }
    if (elem.to) {
        res += `${red('TO')}: ${elem.to} \n`;
    }
    res += `${green('TEXT')}: ${elem.text} ${!isLast ? '\n\n' : '' }`;
    return res;
}

function send(args) {
    args = butify(args);
    const body = args.text;
    delete args.text;
    return AxiosService.post(`http://localhost:8080/messages?${
        Object.keys(args).map(k => `${encodeURIComponent(k)}=${encodeURIComponent(args[k])}`).join('&')}`, 
        { text: body }, (data) => {
            console.log(butifyMessage(data, true));
        }, (err) => {console.log(err)});
}

function list(args) {
    args = butify(args);
    return AxiosService.get(`http://localhost:8080/messages?${
        Object.keys(args).map(k => `${encodeURIComponent(k)}=${encodeURIComponent(args[k])}`).join('&')}`,
    (data) => {
      let res = '';
      if(data.length > 0) {
        data.forEach(function(el, index) {
            const isLast = index === data.length-1;
            res += butifyMessage(el, isLast);
        });
        console.log(res);
      } else {
        console.log('no such messages!');
      }
    }, 
     (err) => { });
}

function execute() {
    const args = process.argv.slice(2);
    return args[0] === 'send' ? send(args.slice(1)) : list(args.slice(1));
}
