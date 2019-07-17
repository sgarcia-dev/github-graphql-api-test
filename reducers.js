module.exports = {
  reduceUser,
  reduceRepository
}

function reduceUser(user) {
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
  };
}

function reduceRepository(repo) {
  return {
    name: repo.name,
    private: repo.private
  };
}