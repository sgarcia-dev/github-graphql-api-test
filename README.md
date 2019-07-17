# Github GraphQL API Demo

A small Apollo Server I built to demonstrate the differences between the various ways to load data using resolvers, their benefits and downsides, and how to pick the right one for your needs. I also tried to adhere as much as possible to Apollo best practices outlined by their own [Fullstack Tutorial](https://www.apollographql.com/docs/tutorial/introduction/).

The comparison includes 3 primary approaches:

* Using a REST Datasource
* Using a custom Datasource
* Not using a Datasource

Also, it supports Redis caching out of the box as this makes it easy to troubleshoot and debug the cache via `redis-cli`.

### TODOs

* Figure out why the [Cache Hints](https://www.apollographql.com/docs/apollo-server/features/caching/) aren't working in the Resolvers or Schema to set cache expiry date. ([Possible solution?](https://stackoverflow.com/questions/53358443/apollo-server-confusion-about-cache-datasource-options))
* Add a fourth scenario that shows how to implement manual caching on a custom Datasource.

### Pre-requisites

* Basic GraphQL & Apollo Knowledge
* Redis must be installed ([Windows](https://github.com/microsoftarchive/redis/releases)/[Mac](https://medium.com/@petehouston/install-and-config-redis-on-mac-os-x-via-homebrew-eb8df9a4f298)), and a `redis-server` instance must be running at `localhost:6379` (default configuration).

### Overview

The 3 methods all have various differences which can be summarized as follows:

* REST Datasource:
  * Implemented on: `user` query resolver
  * Benefits: Supports *caching* & *request error handling* [out of the box](https://www.apollographql.com/docs/apollo-server/features/data-sources/), which defaults to the Apollo Server default cache implementation (the `cache` option passed when creating the Apollo Server Instance). Also makes [Dataloader far relevant](https://www.apollographql.com/docs/apollo-server/features/data-sources/#what-about-dataloader).
  * Downsides: Only supports REST endpoints
* Custom Datasource:
  * Implemented on: `users` query resolver
  * Benefits: Allows for more flexibility on where to fetch data, meaning it's possible to build one for a DB like SQL.
  * Downsides: Does not support caching out of the box, meaning one must implement a cache manually.
* Not using a Datasource:
  * Implemented on `userRepos` query resolver
  * Benefits: Good for quick and dirty one-time calls to an issolated service.
  * Downsides: Makes resolvers less lean and harder to maintain.

### Conclusions:

If in need to load data over a REST endpoint, a `RESTDatasource` is indeed the preferable way to load data due to its out of the box support for caching and request error handling. However for consuming non-REST endpoints (SQL Database, MongoDB, etc), a custom Datasource is still preferable (even without out of the box caching support) as it keeps resolvers lean.

Another important consideration when deciding how to load data may be usage of a [Dataloader](https://github.com/graphql/dataloader) to [speed up requests by batching them](https://medium.com/@gajus/using-dataloader-to-batch-requests-c345f4b23433). However, as the official [Apollo Docs](https://www.apollographql.com/docs/apollo-server/features/data-sources/#what-about-dataloader) point out:

> Although DataLoader is great for that use case, it’s less helpful when loading data from REST APIs because its primary feature is batching, not caching. What we’ve found to be far more important when layering GraphQL over REST APIs is having a resource cache that saves data across multiple GraphQL requests, can be shared across multiple GraphQL servers, and has cache management features like expiry and invalidation that leverage standard HTTP cache control headers.

Therefore, caching should be a top priority when deciding how to load data due to the prone to slowdown, nested nature of complex GraphQL queries.