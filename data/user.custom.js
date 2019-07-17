const axios = require('axios');
const { DataSource } = require('apollo-datasource');
const { reduceUser } = require('../reducers');

class CustomUserAPI extends DataSource {
  constructor() {
    super();
  }

  initialize(config) {
    this.context = config.context;
  }

  async getByUsername({ username }) {
    const { data: user } = await axios.get(`https://api.github.com/users/${username}`);
    return reduceUser(user);
  }

  async getManyByUsername({ usernames }) {
    return await Promise.all(
      usernames.map(username => this.getByUsername({ username }))
    );
  }
}

module.exports = CustomUserAPI;