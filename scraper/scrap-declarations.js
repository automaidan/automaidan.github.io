"use strict";
let Promise = require('bluebird');
let _ = require("lodash");
let writeFile = Promise.promisify(require('fs').writeFile);
var providers = {
    nazk: require('./providers/public-api.nazk.gov.ua/crawler'),
    declarations: require('./providers/declarations.com.ua/crawler')
};

/**
 * Get full list of judges
 * @param {Array} judges
 * @returns {JQueryPromise<U>|PromiseLike<TResult>|IPromise<TResult>|JQueryPromise<any>|Promise.<TResult>|JQueryPromise<void>|any}
 */
module.exports = function scrapDeclarations(judges) {
    let i = 0;
    const judgesAmount = judges.length;
    console.log('Release The Crawlers');
    return Promise.map(judges, function (judge) {
        i++;
        if (i % 100 === 0) {
            console.log(`Scraped ${parseInt(i/judgesAmount, 10)}% of judges.`)
        }
        return Promise.all([
            providers.declarations(judge),
            providers.nazk(judge)
        ])
            .spread(function (declarationsData, nazkData) {
                judge.declarations = _.concat(declarationsData, nazkData);
                judge.declarationsLength = judge.declarations && judge.declarations.length;
                return writeFile(`../judges/${judge.key}.json`, JSON.stringify(judge))
            })
            .then(() => judge)
    }, {concurrency: 18});
};
