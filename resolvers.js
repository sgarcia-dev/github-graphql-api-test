const axios = require('axios');

module.exports = {
  Query: {
    user: async (parent, args, context, info) => {
      const { username } = args;
      const { dataSources } = context;
      return await dataSources.userAPI.getUserByUsername({ username });
    },
    users: async (parent, args, context, info) => {
      const { usernames } = args;
      const { dataSources } = context;
      return await dataSources.userAPI.getUsersByUsername({ usernames });
    },
    userRepos: async (parent, args, context, info) => {
      // Supports caching out of the box
      const { username } = args;
      const { dataSources } = context;
      // Why is this not working? Redis values stored don't have the correct TTL (Time to Live) set
      /* const { cacheControl } = info;
      cacheControl.setCacheHint({ maxAge: 30 }); */
      return await dataSources.repoAPI.getUserRepositories({ username });

      //  Does not support caching
      /* const { username } = args;
      const { data: repos } = await axios.get(`https://api.github.com/users/${username}/repos`);
      return repos.map(repo => ({
        name: repo.name,
        private: repo.private
      })); */
    }
  }
}