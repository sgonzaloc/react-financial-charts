import { dirname, join } from "path";

/** @type {import('@storybook/react-webpack5').StorybookConfig} */
module.exports = {
    addons: [getAbsolutePath("@storybook/addon-essentials"), getAbsolutePath("@storybook/addon-docs")],

    stories: ["../src/**/*.stories.@(ts|tsx|mdx)"],

    webpackFinal: async (config) => {
        config.module.rules.push({
            test: /\.(js|map)$/,
            use: "source-map-loader",
            enforce: "pre",
        });

        // 👇 AGREGÁ ESTO (es lo que falta)
        config.module.rules.push({
            test: /\.(jsx|tsx|ts|js)$/,
            exclude: /node_modules/,
            use: {
                loader: "babel-loader",
                options: {
                    presets: ["@babel/preset-react", "@babel/preset-typescript"],
                },
            },
        });

        const isProd = process.env.NODE_ENV === "production";
        if (!isProd) {
            const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");
            config.plugins.push(
                new ReactRefreshWebpackPlugin({
                    overlay: {
                        sockIntegration: "whm",
                    },
                }),
            );
        }

        return config;
    },

    framework: {
        name: getAbsolutePath("@storybook/react-webpack5"),
        options: {
            strictMode: true,
        },
    },

    docs: {
        autodocs: true,
    },

    typescript: {
        reactDocgen: "react-docgen",
    },
};

function getAbsolutePath(value) {
    return dirname(require.resolve(join(value, "package.json")));
}
