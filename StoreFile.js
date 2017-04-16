import { NativeModules } from 'react-native';

var storeFile = 'TaaSettings.json'
exports.SaveStoreFile = async function (store) {
    await NativeModules.NativeLocalFile.SaveStrAsync(storeFile, JSON.stringify(store))
}

exports.LoadStoreFile = async function () {
    var storeStr = await NativeModules.NativeLocalFile.LoadStrAsync(storeFile)
    return JSON.parse(storeStr)
}
