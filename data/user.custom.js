const axios = require('axios');
const { DataSource } = require('apollo-datasource');

class CustomUserAPI extends DataSource {
  constructor() {
    super();
  }

  initialize(config) {
    this.context = config.context;
  }

  async getUserByUsername({ username }) {
    const { data: user } = await axios.get(`https://api.github.com/users/${username}`);
    return this.reduceUser(user);
  }

  reduceUser(user) {
    return {
      userId: user.id,
      username: user.login,
      name: user.name,
      company: user.company,
      avatarUrl: user.avatar_url,
      profileUrl: user.html_url,
      publicRepos: user.public_repos,
      followers: user.followers,
      following: user.following
    }
  }
}

module.exports = CustomUserAPI;