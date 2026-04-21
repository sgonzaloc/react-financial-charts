# Contributing

We welcome all contributions!

Before creating a PR, please raise an issue to discuss it.

## Commits

We use [convention commits](https://www.conventionalcommits.org) style of commit messages.

## Style

The codebase is written in typescript, this is set to be strict with all warnings and errors turned on. We also use ts-lint. Both are run as part of the build.

You can run `npm run lint` to show any style issues separate from the build.

### Guidelines

-   Use Promises instead callbacks
-   Files should be 100 lines or less

## Tests

Tests are using storybook, please see existing tests for recommended formatting.

## Local development with yalc

For local testing without publishing to npm:

    SKIP_PUBLISH=1 npm run yalc:publish

To push changes to an existing yalc installation:

    SKIP_PUBLISH=1 npm run yalc:push-workspaces

The `SKIP_PUBLISH=1` prevents running the prepare-publish script and git checkout.

## Versioning

To bump version:

npm version patch # 3.0.0 → 3.0.1 (bug fix)
npm version minor # 3.0.0 → 3.1.0 (new feature)
npm version major # 3.0.0 → 4.0.0 (breaking change)

Then publish: npm run publish
