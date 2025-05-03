# [2.4.0](https://github.com/thiagoadsix/keezmo-server/compare/v2.3.0...v2.4.0) (2025-05-03)


### Bug Fixes

* **docs:** update README formatting and improve clarity in structure ([745bd86](https://github.com/thiagoadsix/keezmo-server/commit/745bd8693a40f9472d569656a47120225b2a650d))


### Features

* **core:** add CreateCardController and CreateCardValidator with corresponding tests ([7ee3669](https://github.com/thiagoadsix/keezmo-server/commit/7ee3669167967ee9c3968bc02145ddf703af5c0b))
* **core:** add DeleteCardController and DeleteCardValidator with unit tests ([54f542b](https://github.com/thiagoadsix/keezmo-server/commit/54f542b6218c9f33c2fcffbca15fe27654fc4295))
* **core:** add UpdateCardsController and UpdateCardsValidator with unit tests ([56cc97b](https://github.com/thiagoadsix/keezmo-server/commit/56cc97b8695c2cb3d39581247d168460797f2a0f))
* **core:** add UpdateDeckController and UpdateDeckValidator with corresponding tests ([591c5f8](https://github.com/thiagoadsix/keezmo-server/commit/591c5f8aaa00581f614d9b5b68513e1a426c2196))
* **core:** implement CreateCardsBatchController and CreateCardsBatchValidator with unit tests ([1022448](https://github.com/thiagoadsix/keezmo-server/commit/10224485a6d9189b08064e482ffaaaccf9b3f9fd))
* **core:** implement EndStudySessionController and EndStudySessionValidator with unit tests ([198b546](https://github.com/thiagoadsix/keezmo-server/commit/198b5461c70db34793f0cdde9026804ebdd99c60))
* **core:** implement FindCardsByDeckIdController and FindCardsByDeckIdValidator with unit tests ([4884e6a](https://github.com/thiagoadsix/keezmo-server/commit/4884e6a4bcc48def03d7cec0571d68a5a20fc442))
* **core:** implement FindDueCardsController and FindDueCardsValidator with unit tests ([1338302](https://github.com/thiagoadsix/keezmo-server/commit/133830272c866622a66f6d08daba58cdc62a16ee))
* **core:** implement FindStudySessionsByUserController and FindStudySessionsByUserValidator with unit tests ([8a4ce3a](https://github.com/thiagoadsix/keezmo-server/commit/8a4ce3aff68710b658882147e5bffcb6a0166e2f))
* **core:** implement ReviewCardController and ReviewCardValidator with unit tests ([70e7986](https://github.com/thiagoadsix/keezmo-server/commit/70e79869553603c661811b8520c6888f7262bcb1))
* **core:** implement StartStudySessionController and StartStudySessionValidator with unit tests ([abefabd](https://github.com/thiagoadsix/keezmo-server/commit/abefabd8f940924848db57ca481a3b3f416595e2))
* **core:** implement UpdateCardController and UpdateCardValidator with unit tests ([05365ae](https://github.com/thiagoadsix/keezmo-server/commit/05365ae708addcfb088ae802a73d74bf205733d9))
* **docs:** add presentaion layer do docs ([12ba446](https://github.com/thiagoadsix/keezmo-server/commit/12ba446418c28274a68922ac875e98336d0f8b40))
* **tests:** add delete deck controller and validator tests ([1776475](https://github.com/thiagoadsix/keezmo-server/commit/17764755f70e99a70c1b4ff67fa090582f210b6b))
* **tests:** add FindDecksByUserController and FindDecksByUserValidator with corresponding tests ([ac1b572](https://github.com/thiagoadsix/keezmo-server/commit/ac1b5723f130359bfbbc86be826753a079c7734b))
* **tests:** implement FindDeckByIdAndUser controller and validator with corresponding tests ([e9feb13](https://github.com/thiagoadsix/keezmo-server/commit/e9feb13709bc5470025db4127657006033b78811))
* **tests:** implement FindDeckStatsController and FindDeckStatsValidator with corresponding tests ([9a96a43](https://github.com/thiagoadsix/keezmo-server/commit/9a96a436f445046a8ea7289050ad950849eb865b))
* **tests:** update path for BaseValidator and CreateDeckController ([8b9e505](https://github.com/thiagoadsix/keezmo-server/commit/8b9e505599f5924d18c3fd597233a4cb4fbaff32))

# [2.3.0](https://github.com/thiagoadsix/keezmo-server/compare/v2.2.0...v2.3.0) (2025-05-01)


### Features

* **core:** add deleteById method to CardDynamoRepository and corresponding unit test ([e640695](https://github.com/thiagoadsix/keezmo-server/commit/e6406952321b8701cd30c58e3d8f75a405b76b94))
* **core:** add DynamoDB client and repository implementation with environment type definitions ([f555507](https://github.com/thiagoadsix/keezmo-server/commit/f555507e795a4efbde2f5c3089d1b5765f732de4))
* **core:** add ProgressDynamoRepository and ProgressRepositorySchema with CRUD method stubs ([8a2844d](https://github.com/thiagoadsix/keezmo-server/commit/8a2844d8d925929d4491a36ad7f2fc900b1f51c3))
* **core:** enhance DynamoDB repository with new methods and schema, update client initialization, and add tests ([c4a541f](https://github.com/thiagoadsix/keezmo-server/commit/c4a541f5d6fbf320df924b21a88478f714004434))
* **core:** implement CardDynamoRepository and CardDynamoSchema with CRUD operations ([8dfc109](https://github.com/thiagoadsix/keezmo-server/commit/8dfc10983cf87882802115f0ee84f9cb3afce697))
* **core:** implement deleteByDeckId method in ProgressDynamoRepository ([b1e57b3](https://github.com/thiagoadsix/keezmo-server/commit/b1e57b3553d1806c2c643d95c609c26c1115648c))
* **core:** implement deleteById method in ProgressDynamoRepository and add unit test for deletion functionality ([3299858](https://github.com/thiagoadsix/keezmo-server/commit/3299858efad2fb43865e78a9adc709bcce5b337d))
* **core:** implement deleteByIds method in CardDynamoRepository and add corresponding unit test ([066db78](https://github.com/thiagoadsix/keezmo-server/commit/066db786fda0b17dd251c767085fbe351bb631ae))
* **core:** implement findByCardAndDeck method in ProgressDynamoRepository with unit tests ([109b377](https://github.com/thiagoadsix/keezmo-server/commit/109b37754499c9584e3ea2204ff18970b7569499))
* **core:** implement findByDeckId method in CardDynamoRepository and add corresponding unit tests ([cedb164](https://github.com/thiagoadsix/keezmo-server/commit/cedb1644705cc11e8486a0ba86ce574e98ac30e1))
* **core:** implement findByUserId method in StudySessionDynamoRepository and add corresponding unit tests ([5e7dd38](https://github.com/thiagoadsix/keezmo-server/commit/5e7dd3821ce2541c123708f6524a73377641cba2))
* **core:** implement findDueCards method in ProgressDynamoRepository with unit test for due progress retrieval ([c717d77](https://github.com/thiagoadsix/keezmo-server/commit/c717d775f5ea8d694f61124bd111eafb89f3a8e7))
* **core:** implement save method in ProgressDynamoRepository and add unit tests for repository functionality ([82224d0](https://github.com/thiagoadsix/keezmo-server/commit/82224d03b13db9af04fdd33efffd33eb9a9970b3))
* **core:** implement save method in StudySessionDynamoRepository and add corresponding unit test ([d6e2caa](https://github.com/thiagoadsix/keezmo-server/commit/d6e2caa891cbc26d14291ec9cf9fb38ebe7aa45b))
* **core:** implement saveBatch method in CardDynamoRepository and add corresponding unit test ([ab6a6f9](https://github.com/thiagoadsix/keezmo-server/commit/ab6a6f99fb10003da97f1b12e2aeba3e050f51f0))
* **core:** implement saveBatch method in ProgressDynamoRepository with unit test for batch saving functionality ([4bceb56](https://github.com/thiagoadsix/keezmo-server/commit/4bceb56def795b71bcd1a00bff4aa5898bc9c101))
* **core:** implement StudySessionDynamoRepository and StudySessionDynamoSchema with CRUD operations ([aab7018](https://github.com/thiagoadsix/keezmo-server/commit/aab7018998365657ddd1a2b3401eac9b741f63fa))
* **core:** implement update method in ProgressDynamoRepository with unit test for progress updates ([e2312c7](https://github.com/thiagoadsix/keezmo-server/commit/e2312c774a03fd70ae6dc40da87264fd3252e2ee))

# [2.2.0](https://github.com/thiagoadsix/keezmo-server/compare/v2.1.0...v2.2.0) (2025-04-27)


### Features

* **config:** remove default code profile configuration file ([fa727ca](https://github.com/thiagoadsix/keezmo-server/commit/fa727ca85988855e4a3ce507b84d82f398a0c107))

# [2.1.0](https://github.com/thiagoadsix/keezmo-server/compare/v2.0.0...v2.1.0) (2025-04-27)


### Features

* **custom:** update semantic release configuration to include npm plugin and improve formatting ([51aef35](https://github.com/thiagoadsix/keezmo-server/commit/51aef359a3a947d97e15c89ca237684786231adf))

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
