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
var API_URL = 'http://data.coa.gov.tw/Service/OpenData/AnimalOpenData.aspx'

var LOADING = {};

import { NativeModules } from 'react-native'
import { SaveStoreFile } from './StoreFile'

import { connect } from "react-redux"

var animalFile = 'Animals.json'
@connect((store) => {
  return {
    store: store,
    animalDbDate: store.settings.animalDbDate
  };
})
class ListScreen extends React.Component {
  timeoutID = null

  constructor(props) {
    super(props);
    this.state = {
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      }),
    }
    this.initScreen()
  }

  componentDidMount() {
  }

  animals = []

  async initScreen() {
    if (await NativeModules.NativeLocalFile.FileExistAsync(animalFile)) {
      var aDbStr = await NativeModules.NativeLocalFile.LoadStrAsync(animalFile)
      this.animals = JSON.parse(aDbStr)
      this.setState({
        dataSource: this.getDataSource(),
      });
    }
    else {
      await this.updateDb()
    }
  }

  async updateDb() {
    fetch(API_URL)
      .then((response) => {
        return response.json()
      })
      .then(async (doc) => {
        await NativeModules.NativeLocalFile.SaveStrAsync(animalFile, JSON.stringify(doc))
        var currTime = new Date()
        this.props.dispatch({
          type: "SET_KEY_VAL",
          key: "animalDbDate",
          val: currTime.toLocaleDateString() + " " + currTime.toLocaleTimeString()
        })
        await SaveStoreFile(this.props.store)
        return doc
      })
      .catch((error) => {
        this.setState({
          dataSource: this.getDataSource()
        });
        return
      })
      .then((responseData) => {
        if (responseData == null) {
          return;
        }
        this.animals = responseData

        this.setState({
          dataSource: this.getDataSource(),
        });
      })
      .done();
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

  getDataSource(): ListView.DataSource {
    var animalIds = this.getRandAnimals()
    var dispAnimals = []
    for (var i = 0; i < animalIds.length; i++) {
      dispAnimals.push(this.animals[animalIds[i]])
    }
    return this.state.dataSource.cloneWithRows(dispAnimals);
  }

  selectAnimal(animal: Object) {
    const title = '流水編號：' + animal.animal_id
    if (Platform.OS === 'ios') {
      this.props.navigator.push({
        title: title,
        component: AnimalScreen,
        passProps: { animal },
      });
    } else {
      dismissKeyboard();
      this.props.navigator.push({
        title: title,
        name: 'animal',
        animal: animal,
      });
    }
  }

  go2about() {
    if (Platform.OS === 'ios') {
      this.props.navigator.push({
        title: '關於',
        component: AnimalScreen,
      });
    } else {
      dismissKeyboard();
      this.props.navigator.push({
        title: '關於',
        name: 'about'
      });
    }
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
        key={animal.id}
        onSelect={() => this.selectAnimal(animal)}
        onHighlight={() => highlightRowFunc(sectionID, rowID)}
        onUnhighlight={() => highlightRowFunc(null, null)}
        animal={animal}
      />
    );
  }

  render() {
    var content = this.state.dataSource.getRowCount() === 0 ?
      <NoAnimals
        isLoading={this.state.isLoading}
      /> :
      <ListView
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
          <Button style={styles.button} title='與我有緣' onPress={() =>
            this.setState({
              dataSource: this.getDataSource(),
            })} />
          <Button style={styles.button} title='關於' onPress={this.go2about.bind(this)} />
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
