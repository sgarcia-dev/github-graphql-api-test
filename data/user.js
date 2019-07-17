const { RESTDataSource } = require('apollo-datasource-rest');

class UserAPI extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = 'https://api.github.com/'
  }

  async getUserByUsername({ username }) {
    const user = await this.get(`users/${username}`);
    return this.reduceUser(user);
  }

  async getUsersByUsername({ usernames }) {
    return await Promise.all(
      usernames.map(username => this.getUserByUsername({ username} ))
    );
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

module.exports = UserAPI;