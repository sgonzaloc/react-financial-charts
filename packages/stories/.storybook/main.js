/** @type {import('@storybook/react-webpack5').StorybookConfig} */
module.exports = {
    addons: ["@storybook/addon-webpack5-compiler-babel"],
    stories: ["../src/**/*.stories.@(ts|tsx|mdx)"],
    framework: {
        name: "@storybook/react-webpack5",
        options: {
            strictMode: false,
        },
    },
    typescript: {
        check: false,
        reactDocgen: false,
    },
    babel: async (options) => {
        return {
            ...options,
            presets: [
                "@babel/preset-typescript",
                ["@babel/preset-react", { runtime: "automatic" }],
                ["@babel/preset-env", { targets: { node: "current" } }],
            ],
        };
    },
};
