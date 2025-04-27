# [2.0.0](https://github.com/thiagoadsix/keezmo-server/compare/v1.0.0...v2.0.0) (2025-04-27)


### Bug Fixes

* **tests:** update fixture paths and add new fixtures for cards, decks, and study sessions ([caad27f](https://github.com/thiagoadsix/keezmo-server/commit/caad27fbe87bad1dfafcb8cc0ed8743a75f6151b))


### Features

* **config:** add new error types for deck deletion and not found scenarios ([d451ce8](https://github.com/thiagoadsix/keezmo-server/commit/d451ce8ef507b4c2585d72ae302bc0b54dc3bf73))
* **config:** add test scope script and update package dependencies ([7de4e6d](https://github.com/thiagoadsix/keezmo-server/commit/7de4e6d54db6054415778d4fb97fa38723739d66))
* **core:** add card entity, update deck entity, add new errors based on entity ([c87b4c7](https://github.com/thiagoadsix/keezmo-server/commit/c87b4c705d771d79a602f7fa9331bc9c3274757a))
* **core:** add CreateCard and CreateCardsBatch use cases with corresponding unit tests and error handling ([f76984a](https://github.com/thiagoadsix/keezmo-server/commit/f76984a038ae20f0afb75268e928bc1ca8c98be3))
* **core:** add Progress entity and SM2 scheduler service tests ([38e760e](https://github.com/thiagoadsix/keezmo-server/commit/38e760e55196e2c168ed4d64352a8702113c530d))
* **core:** add UpdateCard use case with comprehensive unit tests and error handling ([5a95180](https://github.com/thiagoadsix/keezmo-server/commit/5a9518042004c622031c768865105f6d8a407c6b))
* **core:** add userId to Deck entity and update related tests ([2257278](https://github.com/thiagoadsix/keezmo-server/commit/225727855b28a1243f87ac2046ce3618a21266c3))
* **core:** enhance DeleteDeck use case to remove associated progress records ([f1fe448](https://github.com/thiagoadsix/keezmo-server/commit/f1fe448c916a4cf31b7163ab1737057600be5b9f))
* **core:** implement CreateStudySession use case with unit tests and validation error handling ([756dcf7](https://github.com/thiagoadsix/keezmo-server/commit/756dcf72c0b3a17bfab8074d04750bb17aaeac85))
* **core:** implement DeleteCard use case with unit tests for card deletion and error handling ([9583295](https://github.com/thiagoadsix/keezmo-server/commit/9583295d646fc635c4bde62bf903f47bc80ffa8f))
* **core:** implement DeleteDeck use case with error handling and mock repositories for testing ([c5ffb1a](https://github.com/thiagoadsix/keezmo-server/commit/c5ffb1a0a43565a2b1d1174acccca11cd917825e))
* **core:** implement FindCardsByDeckId use case with unit tests and update card repository interface ([82eb9bd](https://github.com/thiagoadsix/keezmo-server/commit/82eb9bd639b6ed6cb47e948a537ba6aaeac5919f))
* **core:** implement FindDeckByIdAndUser use case and related error handling ([94d1199](https://github.com/thiagoadsix/keezmo-server/commit/94d1199b2fd497a9cffbb29fb19e162e5ac07d4f))
* **core:** implement FindDeckStats use case for deck statistics retrieval and performance metrics ([0eb6577](https://github.com/thiagoadsix/keezmo-server/commit/0eb65774fb1f9f25c3a49df442da251efc628c9b))
* **core:** implement FindDueCards use case with unit tests for due card retrieval and filtering ([84dd88d](https://github.com/thiagoadsix/keezmo-server/commit/84dd88ddc78901f1a791160e8e8642a839e77d4a))
* **core:** implement FindStudySessionsByUser use case with unit tests and mock repository ([23240f6](https://github.com/thiagoadsix/keezmo-server/commit/23240f690bf7ea7f6f7dd54a218dbc11dc85acee))
* **core:** implement ReviewCard use case with unit tests for card review and progress updates ([c5d707c](https://github.com/thiagoadsix/keezmo-server/commit/c5d707ca6aef246b3d66120d73e938205a65f835))
* **core:** implement Start and End StudySession use cases with unit tests and error handling ([adab224](https://github.com/thiagoadsix/keezmo-server/commit/adab224624d8508ab8fe4dc9b12aa1463361d6c5))
* **core:** implement UpdateCards use case with error handling and unit tests ([7e99c05](https://github.com/thiagoadsix/keezmo-server/commit/7e99c055e8708067e3dfd42d4971e284bcb60bd1))
* **core:** implement UpdateDeck use case with error handling and comprehensive unit tests ([ad46f08](https://github.com/thiagoadsix/keezmo-server/commit/ad46f0857ae951733cda884b9f7260360a728469))
* **core:** merge branch main into current branch ([e82b135](https://github.com/thiagoadsix/keezmo-server/commit/e82b13564adde7ab34792cf9a219a49671a67236))
* **core:** set up ESLint and Prettier configurations, add Deck entity ([53eb41b](https://github.com/thiagoadsix/keezmo-server/commit/53eb41b7a299e80ea68ed681f529d62e1b422ac3))
* **core:** update project structure and add study session functionality ([fbe5317](https://github.com/thiagoadsix/keezmo-server/commit/fbe5317f864fc7d6f5835e1fd40c78fc2a6862f2))
* **custom:** reorganize import statements for clarity and consistency ([5048038](https://github.com/thiagoadsix/keezmo-server/commit/504803863462a96ed691b2a8f6b2024fb07a6b32))
* **tests:** add unit tests for error handling in card and deck operations ([248687b](https://github.com/thiagoadsix/keezmo-server/commit/248687b595b4a76082dadbe615a2eb407b4ba63e))


### BREAKING CHANGES

* **core:** - Added new StudySession entity with validation and methods for managing study sessions.
* **core:** I hope not

# 1.0.0 (2025-04-27)


### Bug Fixes

* **core:** add pnpm action setup to GitHub Actions workflow ([2122980](https://github.com/thiagoadsix/keezmo-server/commit/21229807ca30da1873d7787062642ca5dbab4256))
* **core:** update pnpm action setup version to 10 in GitHub Actions workflow ([96810af](https://github.com/thiagoadsix/keezmo-server/commit/96810af63c25a4d035b8c5ceb00d4f921ab95845))


### Features

* **config:** add aws deps ([5d65c4e](https://github.com/thiagoadsix/keezmo-server/commit/5d65c4ed21e502e3a362b32433d5fbaf00064b79))
