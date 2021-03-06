// requires
const valid = require('./valid')
const Chalk = require('chalk')
const config = require('../config.json')
const fs = require('fs')

// reads the raw data from a json file can accept a dir and then look for the jsonFile in config
function readModuleJson(file) {
    try {
        let readFile = file
        if (fs.existsSync(file)) {
            if (fs.statSync(file).isDirectory()) {
                // if it a dir then it will look for a json file that matched the name of the config name
                if (fs.existsSync(file+config.jsonFile)) readFile = file+config.jsonFile
                else throw new Error('Dir does not contain a module json file: '+file+config.jsonFile)
            }
            // it will then read the selected file, either the given or the one found
            return JSON.parse(fs.readFileSync(readFile))
        }
        return undefined
    } catch(error) {
        // catch any errors
        console.log(Chalk.red(error))
        return undefined
    }
}

// reads a module and gets one value used for one offs
function readModuleValue(dir,key) {
    const data = readModuleJson(dir)
    return data && data[key] || undefined
}

// reads a module and makes sure it is valid before it is returned
function readModuleValid(dir) {
    const data = readModuleJson(dir)
    if (!data) return undefined
    switch (data.type) {
        case undefined: return undefined
        default: return undefined
        case 'Module': {
            if (valid.module(data)) return data
            else return undefined
        }
        case 'Submodule': {
            if (valid.submodule(data)) return data
            else return undefined
        }
        case 'Scenario': {
            if (valid.secnario(data)) return data
            else return undefined
        }
        case 'Collection': {
            if (valid.collection(data)) return data
            else return undefined
        }
    }
}

module.exports = {
    raw: readModuleJson,
    getValue: readModuleValue,
    json: readModuleValid
}