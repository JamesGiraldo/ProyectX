const { writeFile, existsSync, mkdir } = require('fs');
const { argv } = require('yargs');
const path = require('path');
// read environment variables from .env file
require('dotenv').config();
// read the command line arguments passed with yargs
const environment = argv.environment;
const isProduction = environment === 'prod';
const prodPath = `./src/environments/environment.prod.ts`;
const envPath = `./src/environments/environment.ts`;
// we have access to our environment variables
// in the process.env object thanks to dotenv

const prodFileContent = `
export const environment = {
    production: ${isProduction},
    apiVersion: '/api/v1/',
    apiHost: '${process.env.API_HOST}',
    apiKeyMapbox: 'pk.eyJ1IjoibmV1dHJvIiwiYSI6ImNrYzEwZ24wNDBkNTYyeG56ejR4b2wxdDIifQ.ALrBoHZlfadG_Nf5NBdfrA',
};
`;

const environmentFileContent = `
export const environment = {
    production: ${isProduction},
    apiVersion: '/api/v1/',
    apiHost: '${process.env.API_HOST}',
    apiKeyMapbox: 'pk.eyJ1IjoibmV1dHJvIiwiYSI6ImNrYzEwZ24wNDBkNTYyeG56ejR4b2wxdDIifQ.ALrBoHZlfadG_Nf5NBdfrA',
};
`;

const dir = path.join(__dirname, '../src/environments');
const exists = existsSync(dir);

if (!exists) {
    mkdir(dir, (err) => {
        if (err) {
            return console.error(err);
        }

        // write the content to the respective file
        writeFile(prodPath, prodFileContent, function (err) {
            if (err) {
                console.error(err);
            }
        });
        writeFile(envPath, environmentFileContent, function (err) {
            if (err) {
                console.error(err);
            }
        });
    });
} else {
    // write the content to the respective file
    writeFile(prodPath, prodFileContent, function (err) {
        if (err) {
            console.error(err);
        }
    });
    writeFile(envPath, environmentFileContent, function (err) {
        if (err) {
            console.error(err);
        }
    });
}
