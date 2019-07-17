const axios = require('axios');
const { DataSource } = require('apollo-datasource');
const { store } = require('../cache');
const { reduceUser } = require('../reducers');

class CustomUserAPI extends DataSource {
  constructor() {
    super();
    this.baseUrl = 'https://api.github.com';
  }

  initialize(config) {
    this.context = config.context;
  }

  async cachedRequest(method, resourceUrl, maxAge) {
    method = method.toLowerCase();
    const requestUrl = `${this.baseUrl}/${resourceUrl}`;
    const cacheId = `axioshttpcache:${method}:${requestUrl}`
    const cachedResponse = await store.get(cacheId);

    if (cachedResponse) {
      return JSON.parse(cachedResponse);
    } else {
      const res = await axios[method](requestUrl);
      if (maxAge > 0) {
        store.set(cacheId, JSON.stringify({ data: res.data }), 'EX', maxAge);
      }
      return res;
    }
  }

  async getByUsername({ username, maxAge }) {
    const { data: user } = await this.cachedRequest('get', `users/${username}`, maxAge);
    return reduceUser(user);
  }

  async getManyByUsername({ usernames, maxAge }) {
    return await Promise.all(
      usernames.map(username => this.getByUsername({ username, maxAge }))
    );
  }
}

module.exports = CustomUserAPI;