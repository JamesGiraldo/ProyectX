const webpack = require('webpack');

module.exports = {
    plugins: [
        new webpack.DefinePlugin({
            $ENV: {
                API_HOST: JSON.stringify(process.env.API_HOST),
            },
        }),
    ],
};
