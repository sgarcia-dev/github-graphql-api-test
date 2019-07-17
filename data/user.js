const { RESTDataSource } = require('apollo-datasource-rest');
const { reduceUser } = require('../reducers');

class UserAPI extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = 'https://api.github.com/'
  }

  async getByUsername({ username }) {
    const user = await this.get(`users/${username}`);
    return reduceUser(user);
  }
}

module.exports = UserAPI;