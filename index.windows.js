/**
 * The examples provided by Facebook are for non-commercial testing and
 * evaluation purposes only.
 *
 * Facebook reserves all rights not expressly granted.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
 * OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NON INFRINGEMENT. IN NO EVENT SHALL
 * FACEBOOK BE LIABLE FOR ANY CLAIM, DAMAGES OR ,OTHER LIABILITY, WHETHER IN
 * AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 *
 * @providesModule MoviesApp
 * @flow
 */
'use strict';

var React = require('react');
var ReactNative = require('react-native');
var {
  AppRegistry,
  BackAndroid,
  Navigator,
  StyleSheet,
  View,
  Alert,
} = ReactNative;
import codePush from "react-native-code-push";

var MovieScreen = require('./MovieScreen');
var SearchScreen = require('./SearchScreen');
var TitleBarWindows = require('./TitleBarWindows');
var About = require('./About');

import { Provider } from "react-redux"
import { getSavedStore, blankStore } from "./store"

var _navigator;
BackAndroid.addEventListener('hardwareBackPress', () => {
  if (_navigator && _navigator.getCurrentRoutes().length > 1) {
    _navigator.pop();
    return true;
  }
  return false;
});

var RouteMapper = function (route, navigationOperations, onComponentRef) {
  _navigator = navigationOperations;
  if (route.name === 'search') {
    return (
      <SearchScreen navigator={navigationOperations}
        providerKey={route.providerKey}
      />
    );
  }
  else if (route.name === 'about') {
    return (
      <View style={{ flex: 1 }}>
        <TitleBarWindows
          onPress={navigationOperations.pop}
          style={styles.toolbar}
          title={"關於"} />
        <About
          style={{ flex: 1 }}
          navigator={navigationOperations}
          movie={route.movie}
        />
      </View>
    )
  }
  else if (route.name === 'movie') {
    return (
      <View style={{ flex: 1 }}>
        <TitleBarWindows
          onPress={navigationOperations.pop}
          style={styles.toolbar}
          title={route.movie.title} />
        <MovieScreen
          style={{ flex: 1 }}
          navigator={navigationOperations}
          movie={route.movie}
        />
      </View>
    );
  }
};

var styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: 'white',
  },
  navigator: {
    flex: 1,
    backgroundColor: 'white',
  },
  toolbar: {
    backgroundColor: '#a9a9a9',
    height: 56,
  },
});

var ProgressBar = require('ProgressBarWindows');

class MoviesApp extends React.Component {
  constructor(props) {
    super(props);
    // Unfortunately, we can't set store to savedStore,
    // because it contains async calls.
    // We use useSavedStore for working around this issue.
    this.state = {
      providerKey: 0,
      showUpdateBar: false,
      updateProgress: 0,
      store: blankStore
    }
    this.useSavedStore()
  }

  async useSavedStore() {
    var savedStore = await getSavedStore()
    // We can't modifiy Provider's store.
    // Thus, we have to render a new Provider with a new key for using savedStore.
    this.setState({
      providerKey: this.state.providerKey + 1,
      store: savedStore
    })
  }

  codePushStatusDidChange(status) {
    switch (status) {
      /*
      case codePush.SyncStatus.CHECKING_FOR_UPDATE:
        console.log("Checking for updates.");
        break;
      case codePush.SyncStatus.DOWNLOADING_PACKAGE:
        console.log("Downloading package.");
        break;
      case codePush.SyncStatus.INSTALLING_UPDATE:
        console.log("Installing update.");
        break;
      case codePush.SyncStatus.UP_TO_DATE:
        console.log("Up-to-date.");
        break;
      */
      case codePush.SyncStatus.UPDATE_INSTALLED:
        Alert.alert("下載更新完成", "請重新啟動app。")
        break;
    }
  }

  codePushDownloadDidProgress(progress) {
    this.setState({ showUpdateBar: true })
    var percent = progress.receivedBytes / progress.totalBytes * 100
    this.setState({ updateProgress: percent })
  }

  render() {
    var initialRoute = { name: 'search', providerKey: this.state.providerKey };
    return (
      <Provider key={"provider" + this.state.providerKey} store={this.state.store}>
        <View style={styles.container}>
          <Navigator
            style={styles.navigator}
            initialRoute={initialRoute}
            configureScene={() => Navigator.SceneConfigs.FadeAndroid}
            renderScene={RouteMapper}
          />
          {this.state.showUpdateBar && <ProgressBar style={styles.toolbar} progress={this.state.updateProgress} />}
        </View>
      </Provider>
    );
  }
};

if (!(__DEV__)) {
  let codePushOptions = { checkFrequency: codePush.CheckFrequency.ON_APP_START, updateDialog: codePush.DEFAULT_UPDATE_DIALOG };
  MoviesApp = codePush(codePushOptions)(MoviesApp);
  codePush.sync({ updateDialog: true })
}

AppRegistry.registerComponent('taa', () => MoviesApp);

module.exports = MoviesApp;
