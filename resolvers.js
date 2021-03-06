const axios = require('axios');

module.exports = {
  Query: {
    // RESTDatasource
    user: async (parent, args, context, info) => {
      const { username } = args;
      const { dataSources } = context;
      // Why is this not working? Redis values stored don't have the correct TTL (Time to Live) set
      /* const { cacheControl } = info;
      cacheControl.setCacheHint({ maxAge: 30 }); */
      return await dataSources.userAPI.getByUsername({ username });
    },
    // Custom Datasource
    users: async (parent, args, context, info) => {
      const { usernames } = args;
      const { dataSources } = context;
      const { maxAge } = info.cacheControl.cacheHint;
      return await dataSources.customUserAPI.getManyByUsername({ usernames, maxAge });
    },
    // No Datasource
    userRepos: async (parent, args, context, info) => {
      const { username } = args;
      const { data: repos } = await axios.get(`https://api.github.com/users/${username}/repos`);
      return repos.map(repo => ({
        name: repo.name,
        private: repo.private
      }));
    }
  }
}