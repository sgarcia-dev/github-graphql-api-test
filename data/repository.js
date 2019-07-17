const { RESTDataSource } = require('apollo-datasource-rest');

class RepositoryAPI extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = 'https://api.github.com/'
  }

  async getUserRepositories({ username }) {
    const repos = await this.get(`users/${username}/repos`);
    return repos.map(this.reduceRepo);
  }

  reduceRepo(repo) {
    return {
      name: repo.name,
      private: repo.private
    }
  }
}

module.exports = RepositoryAPI;