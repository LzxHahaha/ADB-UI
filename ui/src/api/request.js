import fetch from 'node-fetch';
import { ipcRenderer } from 'electron';
import { message } from 'antd';

const baseURL = 'http://127.0.0.1';
let port = 9512;
ipcRenderer.on('api-port', data => port = +data);

function encode(val) {
  return encodeURIComponent(val)
    .replace(/%40/gi, '@')
    .replace(/%3A/gi, ':')
    .replace(/%24/g, '$')
    .replace(/%2C/gi, ',')
    .replace(/%20/g, '+')
    .replace(/%5B/gi, '[')
    .replace(/%5D/gi, ']');
}

function emptyFilter(params) {
  if (!params) {
    return null;
  }

  const res = {};
  for (let p in params) {
    if (params.hasOwnProperty(p)) {
      const value = params[p];
      if (value || value === 0 || value === false || value === '') {
        res[p] = value;
      }
    }
  }
  if (Object.keys(res).length) {
    return res;
  }
  return null;
}

function buildURL(url, params) {
  if (url[0] !== '/') {
    url = '/' + url;
  }
  if (emptyFilter(params)) {
    if (url[url.length - 1] !== '?') {
      url += '?';
    }
    const parts = [];
    for (let p in params) {
      if (params.hasOwnProperty(p)) {
        parts.push(`${encode(p)}=${params[encode(p)]}`);
      }
    }
    url += parts.join('&');
  }
  return `${baseURL}:${port}${url}`;
}

async function request(url, data, options) {
  const { params, ...other } = data;
  url = buildURL(url, params);

  if (options.method === 'POST') {
    let body = JSON.stringify(emptyFilter(other));
    if (body) {
      options.body = body;
    }
  }

  const result = await fetch(url, options);
  const json = await result.json();
  if (json.code === 200) {
    return json.data;
  }
  message.error(json.message);
  throw json;
}

export const get = (url, params) => {
  return request(url, { params }, { method: 'GET' });
};

export const post = (url, data) => {
  return request(url, data, { method: 'POST' });
};
