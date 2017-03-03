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
var TimerMixin = require('react-timer-mixin');

var invariant = require('fbjs/lib/invariant');
var dismissKeyboard = require('dismissKeyboard');

var MovieCell = require('./MovieCell');
var MovieScreen = require('./MovieScreen');
var SearchBar = require('SearchBar');

/**
 * This is for demo purposes only, and rate limited.
 * In case you want to use the Rotten Tomatoes' API on a real app you should
 * create an account at http://developer.rottentomatoes.com/
 */
var API_URL = 'http://data.coa.gov.tw/Service/OpenData/AnimalOpenData.aspx'

// Results should be cached keyed by the query
// with values of null meaning "being fetched"
// and anything besides null and undefined
// as the result of a valid query
var resultsCache = {
  dataForQuery: {},
  nextPageNumberForQuery: {},
  totalForQuery: {},
};

var LOADING = {};

import { NativeModules } from 'react-native';

var SearchScreen = React.createClass({
  mixins: [TimerMixin],

  timeoutID: (null: any),

  getInitialState: function() {
    return {
      isLoading: false,
      isLoadingTail: false,
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      }),
      filter: '',
      queryNumber: 0,
    };
  },

  componentDidMount: function() {
    this.searchMovies('');
  },

  _urlForQueryAndPage: function(query: string, pageNumber: number): string {
    return (API_URL)
  },

  animals: [],

  updateDb: async function(query: string) {
    try {
      var aDbStr = await NativeModules.NativeLocalFile.LoadStrAsync('Animals.json')
      this.animals = JSON.parse(aDbStr)
    }
    catch (ex) {
      // No availabe database.

      fetch(this._urlForQueryAndPage(query, 1))
        .then(async (response) => {
          await NativeModules.NativeLocalFile.SaveStrAsync('Animals.json', response._bodyText)
          response.json()
        })
        .catch((error) => {
          LOADING[query] = false;
          resultsCache.dataForQuery[query] = undefined;

          this.setState({
            dataSource: this.getDataSource([]),
            isLoading: false,
          });
          return
        })
        .then((responseData) => {
          LOADING[query] = false;
          if (responseData == null) {
            return;
          }
          this.animals = responseData

          resultsCache.totalForQuery[query] = responseData.length;
          resultsCache.dataForQuery[query] = responseData;
          resultsCache.nextPageNumberForQuery[query] = 2;

          if (this.state.filter !== query) {
            // do not update state if the query is stale
            return;
          }
        })
        .done();
    }

    this.setState({
      isLoading: false,
      dataSource: this.getDataSource(this.animals),
    });
  },

  searchMovies: async function(query: string) {
    this.timeoutID = null;

    this.setState({ filter: query });

    var cachedResultsForQuery = resultsCache.dataForQuery[query];
    if (cachedResultsForQuery) {
      if (!LOADING[query]) {
        this.setState({
          dataSource: this.getDataSource(cachedResultsForQuery),
          isLoading: false
        });
      } else {
        this.setState({ isLoading: true });
      }
      return;
    }

    LOADING[query] = true;
    resultsCache.dataForQuery[query] = null;
    this.setState({
      isLoading: true,
      queryNumber: this.state.queryNumber + 1,
      isLoadingTail: false,
    });

    await this.updateDb(query)
  },

  hasMore: function(): boolean {
    var query = this.state.filter;
    if (!resultsCache.dataForQuery[query]) {
      return true;
    }
    return (
      resultsCache.totalForQuery[query] !==
      resultsCache.dataForQuery[query].length
    );
  },

  onEndReached: function() {
    var query = this.state.filter;
    if (!this.hasMore() || this.state.isLoadingTail) {
      // We're already fetching or have all the elements so noop
      return;
    }

    if (LOADING[query]) {
      return;
    }

    LOADING[query] = true;
    this.setState({
      queryNumber: this.state.queryNumber + 1,
      isLoadingTail: true,
    });

    var page = resultsCache.nextPageNumberForQuery[query];
    invariant(page != null, 'Next page number for "%s" is missing', query);
    fetch(this._urlForQueryAndPage(query, page))
      .then((response) => response.json())
      .catch((error) => {
        console.error(error);
        LOADING[query] = false;
        this.setState({
          isLoadingTail: false,
        });
      })
      .then((responseData) => {
        var moviesForQuery = resultsCache.dataForQuery[query].slice();

        LOADING[query] = false;
        // We reached the end of the list before the expected number of results
        if (!responseData.movies) {
          resultsCache.totalForQuery[query] = moviesForQuery.length;
        } else {
          for (var i in responseData.movies) {
            moviesForQuery.push(responseData.movies[i]);
          }
          resultsCache.dataForQuery[query] = moviesForQuery;
          resultsCache.nextPageNumberForQuery[query] += 1;
        }

        if (this.state.filter !== query) {
          // do not update state if the query is stale
          return;
        }

        this.setState({
          isLoadingTail: false,
          dataSource: this.getDataSource(resultsCache.dataForQuery[query]),
        });
      })
      .done();
  },

  getRandAnimals: function(): Array<any> {
    var animalIds = []
    var dispNum = Math.min(10, this.animals.length)
    for (var i = 0; i < dispNum; i++) {

      var randNum = Math.random() * this.animals.length
      animalIds.push(Math.floor(randNum))
    }
    return animalIds;
  },

  getDataSource: function(movies: Array<any>): ListView.DataSource {
    var animalIds = this.getRandAnimals()
    var dispAnimals = []
    for (var i = 0; i < animalIds.length; i++) {
      dispAnimals.push(this.animals[animalIds[i]])
    }
    return this.state.dataSource.cloneWithRows(dispAnimals);
  },

  selectMovie: function(movie: Object) {
    if (Platform.OS === 'ios') {
      this.props.navigator.push({
        title: movie.title,
        component: MovieScreen,
        passProps: { movie },
      });
    } else {
      dismissKeyboard();
      this.props.navigator.push({
        title: movie.title,
        name: 'movie',
        movie: movie,
      });
    }
  },

  go2about: function() {
    if (Platform.OS === 'ios') {
      this.props.navigator.push({
        title: movie.title,
        component: MovieScreen,
        passProps: { movie },
      });
    } else {
      dismissKeyboard();
      this.props.navigator.push({
        name: 'about'
      });
    }
  },

  onSearchChange: function(event: Object) {
    var filter = event.nativeEvent.text.toLowerCase();

    this.clearTimeout(this.timeoutID);
    this.timeoutID = this.setTimeout(() => this.searchMovies(filter), 100);
  },

  renderFooter: function() {
    if (!this.hasMore() || !this.state.isLoadingTail) {
      return <View style={styles.scrollSpinner} />;
    }

    return <ActivityIndicator style={styles.scrollSpinner} />;
  },

  renderSeparator: function(
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
  },

  renderRow: function(
    movie: Object,
    sectionID: number | string,
    rowID: number | string,
    highlightRowFunc: (sectionID: ?number | string, rowID: ?number | string) => void,
  ) {
    return (
      <MovieCell
        key={movie.id}
        onSelect={() => this.selectMovie(movie)}
        onHighlight={() => highlightRowFunc(sectionID, rowID)}
        onUnhighlight={() => highlightRowFunc(null, null)}
        movie={movie}
      />
    );
  },

        //onEndReached={this.onEndReached}
  render: function() {
    var content = this.state.dataSource.getRowCount() === 0 ?
      <NoMovies
        filter={this.state.filter}
        isLoading={this.state.isLoading}
      /> :
      <ListView
        ref="listview"
        renderSeparator={this.renderSeparator}
        dataSource={this.state.dataSource}
        renderFooter={this.renderFooter}
        renderRow={this.renderRow}
        automaticallyAdjustContentInsets={false}
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      />;

    return (
      <View style={styles.container}>
        <View style={styles.buttonRow}>
          <Button style={styles.button} title='下載資料庫' onPress={() => this.updateDb('')} />
          <Button style={styles.button} title='與我有緣' onPress={() =>
            this.setState({
              dataSource: this.getDataSource(this.animals),
            })} />
          <Button style={styles.button} title='關於' onPress={this.go2about} />
        </View>
        <View style={styles.container2}>
          {content}
        </View>
      </View>
    );
  },
});

/**
        <SearchBar
          onSearchChange={this.onSearchChange}
          isLoading={this.state.isLoading}
          onFocus={() =>
            this.refs.listview && this.refs.listview.getScrollResponder().scrollTo({ x: 0, y: 0 })}
        /> */

class NoMovies extends React.Component {
  render() {
    var text = '';
    if (this.props.filter) {
      text = `No results for "${this.props.filter}"`;
    } else if (!this.props.isLoading) {
      // If we're looking at the latest movies, aren't currently loading, and
      // still have no results, show a message
      text = 'No data found';
    }

    return (
      <View style={[styles.container, styles.centerText]}>
        <Text style={styles.noMoviesText}>{text}</Text>
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
  noMoviesText: {
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

module.exports = SearchScreen;
