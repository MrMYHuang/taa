/**
 * The examples provided by Facebook are for non-commercial testing and
 * evaluation purposes only.
 *
 * Facebook reserves all rights not expressly granted.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
 * OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NON INFRINGEMENT. IN NO EVENT SHALL
 * FACEBOOK BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN
 * AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 *
 * @flow
 */
'use strict';

var React = require('react');
var ReactNative = require('react-native');
var {
  ActivityIndicator,
  ListView,
  Platform,
  StyleSheet,
  Text,
  View,
  Button,
} = ReactNative;

var invariant = require('fbjs/lib/invariant');
var dismissKeyboard = require('dismissKeyboard');

var AnimalCell = require('./AnimalCell');
var AnimalScreen = require('./AnimalScreen');
//var SearchBar = require('SearchBar');

/**
 * This is for demo purposes only, and rate limited.
 * In case you want to use the Rotten Tomatoes' API on a real app you should
 * create an account at http://developer.rottentomatoes.com/
 */
var API_URL = 'https://data.coa.gov.tw/Service/OpenData/TransService.aspx?UnitId=QcbUEzN6E6DL'

var LOADING = {};

import { NativeModules } from 'react-native'
import { SaveStoreFile } from './StoreFile'
import axios from 'axios'

import { connect } from "react-redux"

var ProgressBar = require('ProgressBarWindows');
if (Platform.OS == 'android')
  ProgressBar = require('ProgressBarAndroid')

var animalFile = 'Animals.json'
@connect((store) => {
  return {
    store: store,
    animalDbDate: store.settings.animalDbDate,
    favorites: store.settings.favorites
  };
})
class ListScreen extends React.Component {
  static navigationOptions = {
    title: '動物'
  }

  timeoutID = null

  constructor(props) {
    super(props);
    this.state = {
      listType: 0, // 0 random list, 1 favorite list
      dataSource: new ListView.DataSource({
        // Always redrawing, because listType can be changed when row is unchanged.
        rowHasChanged: (row1, row2) => true,
      }),
      isDownloading: false,
      downloadedSize: 0,
      downloadTotal: 0,
      downloadPercent: 0
    }
    this.initScreen()
  }

  animals = []

  async initScreen() {
    if (await NativeModules.NativeLocalFile.FileExistAsync(animalFile)) {
      var aDbStr = await NativeModules.NativeLocalFile.LoadStrAsync(animalFile)
      this.animals = JSON.parse(aDbStr)
      this.showRandomList()
    }
    else {
      await this.updateDb()
    }
  }

  async updateDb() {
    let config = {
      onDownloadProgress: progressEvent => {
        let percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        this.setState({
          isDownloading: true,
          downloadedSize: progressEvent.loaded,
          downloadTotal: progressEvent.total,
          downloadPercent: percentCompleted
        })
      }
    }

    await axios.get(API_URL, config)
      .then(async (res) => {
        await NativeModules.NativeLocalFile.SaveStrAsync(animalFile, JSON.stringify(res.data)).catch(err => {
          console.log('Fail to save file.')
        })

        var currTime = new Date()
        await this.props.dispatch({
          type: "SET_KEY_VAL",
          key: "animalDbDate",
          val: currTime.toLocaleDateString() + " " + currTime.toLocaleTimeString()
        })
        await SaveStoreFile(this.props.store)
        this.animals = res.data
        this.showRandomList()
        this.setState({ isDownloading: false })
      })
  }

  showRandomList() {
    var animalIds = this.getRandAnimals()
    var dispAnimals = []
    for (var i = 0; i < animalIds.length; i++) {
      dispAnimals.push(this.animals[animalIds[i]])
    }
    this.setState({ listType: 0, dataSource: this.state.dataSource.cloneWithRows(dispAnimals) })
  }

  showFavorites() {
    const favorites = this.props.favorites
    this.setState({ listType: 1 })
    if (favorites == undefined) {
      this.setState({ dataSource: this.state.dataSource.cloneWithRows([]) })
      return
    }

    var dispAnimals = []
    for (var i = 0; i < favorites.length; i++) {
      for (var j = 0; j < this.animals.length; j++) {
        if (this.animals[j]['animal_id'] == favorites[i]) {
          dispAnimals.push(this.animals[j])
          continue
        }
      }
    }
    this.setState({ dataSource: this.state.dataSource.cloneWithRows(dispAnimals) })
  }

  getRandAnimals(): Array<any> {
    var animalIds = []
    var dispNum = Math.min(10, this.animals.length)
    for (var i = 0; i < dispNum; i++) {

      var randNum = Math.random() * this.animals.length
      animalIds.push(Math.floor(randNum))
    }
    return animalIds;
  }

  selectAnimal(animal: Object) {
    const title = '流水編號：' + animal.animal_id
    this.props.navigation.navigate("Detail", {
      title: title,
      name: 'animal',
      animal: animal,
    })
  }

  renderFooter() {
    /*
    if (!this.state.isLoadingTail) {
      return <View style={styles.scrollSpinner} />;
    }*/

    return <ActivityIndicator style={styles.scrollSpinner} />;
  }

  renderSeparator(
    sectionID: number | string,
    rowID: number | string,
    adjacentRowHighlighted: boolean
  ) {
    var style = styles.rowSeparator;
    if (adjacentRowHighlighted) {
      style = [style, styles.rowSeparatorHide];
    }
    return (
      <View key={'SEP_' + sectionID + '_' + rowID} style={style} />
    );
  }

  renderRow(
    animal: Object,
    sectionID: number | string,
    rowID: number | string,
    highlightRowFunc: (sectionID: ?number | string, rowID: ?number | string) => void,
  ) {
    return (
      <AnimalCell
        onSelect={() => this.selectAnimal(animal)}
        onHighlight={() => highlightRowFunc(sectionID, rowID)}
        onUnhighlight={() => highlightRowFunc(null, null)}
        updateFavoList={() => this.showFavorites.bind(this)()}
        animal={animal}
        listType={this.state.listType}
      />
    );
  }

  render() {
    var content
    if (this.state.isDownloading == 1)
      content = <View style={{ flex: 1, flexDirection: "column", alignItems: 'center', justifyContent: 'center' }}>
        <Text>資料庫下庫進度：</Text>
        <ProgressBar style={{ height: 50 }} progress={this.state.downloadPercent} />
        <Text>{Math.round(this.state.downloadedSize / 1024)} / {Math.round(this.state.downloadTotal / 1024)} KB</Text>
      </View>
    else
      content = <ListView
        ref="listview"
        renderSeparator={this.renderSeparator.bind(this)}
        dataSource={this.state.dataSource}
        renderRow={this.renderRow.bind(this)}
        automaticallyAdjustContentInsets={false}
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      />;

    return (
      <View style={styles.container}>
        <View style={styles.buttonRow}>
          <Button style={styles.button} title='下載資料庫' onPress={this.updateDb.bind(this)} />
          <Button style={styles.button} title='與我有緣' onPress={this.showRandomList.bind(this)} />
          <Button style={styles.button} title='我的最愛' onPress={this.showFavorites.bind(this)} />
        </View>
        <View style={styles.container2}>
          {content}
        </View>
      </View>
    );
  }
};

/**
        <SearchBar
          onSearchChange={this.onSearchChange}
          isLoading={this.state.isLoading}
          onFocus={() =>
            this.refs.listview && this.refs.listview.getScrollResponder().scrollTo({ x: 0, y: 0 })}
        /> */

class NoAnimals extends React.Component {
  render() {
    var text = '';
    if (this.props.filter) {
      text = `No results for "${this.props.filter}"`;
    } else if (!this.props.isLoading) {
      // If we're looking at the latest animals, aren't currently loading, and
      // still have no results, show a message
      text = 'Loading...';
    }

    return (
      <View style={[styles.container, styles.centerText]}>
        <Text style={styles.noAnimalsText}>{text}</Text>
      </View>
    );
  }
}

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  container2: {
    flex: 5,
    backgroundColor: 'white',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  button: {
    flex: 2,
    margin: 5,
    width: 200,
    fontSize: 50
  },
  centerText: {
    alignItems: 'center',
  },
  noAnimalsText: {
    marginTop: 80,
    color: '#888888',
  },
  separator: {
    height: 1,
    backgroundColor: '#eeeeee',
  },
  scrollSpinner: {
    marginVertical: 20,
  },
  rowSeparator: {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    height: 1,
    marginLeft: 4,
  },
  rowSeparatorHide: {
    opacity: 0.0,
  },
});

module.exports = ListScreen;
