import { applyMiddleware, createStore } from "redux"

import { logger } from "redux-logger"
import thunk from "redux-thunk"
import promise from "redux-promise-middleware"

import reducer from "./reducers"

const middleware = applyMiddleware(promise(), thunk, logger)

import { LoadStoreFile } from './StoreFile'
import { NativeModules } from 'react-native'

var blankStore = createStore(reducer, middleware)

var storeFile = 'TaaSettings.json'
exports.getSavedStore = async () => {
    if (await NativeModules.NativeLocalFile.FileExistAsync(storeFile)) {
        var savedStore = await LoadStoreFile()
        return createStore(reducer, savedStore, middleware)
    }
    return blankStore
}

exports.blankStore = blankStore