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
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} = ReactNative;

var getImageSource = require('./getImageSource');
var getStyleFromScore = require('./getStyleFromScore');
var getTextFromScore = require('./getTextFromScore');

var dispFields = ["流水編號", "區域編號", "所屬縣市代碼", "所屬收容所代碼", "實際所在地", "類型", "性別", "體型", "毛色", "年紀", "是否絕育", "是否施打狂犬病疫苗", "尋獲地", "網頁標題", "狀態", "資料備註", "其他說明", "開放認養時間(起)", "開放認養時間(迄)", "資料異動時間", "資料建立時間", "所屬收容所名稱", "圖片名稱(原始名稱)", "異動時間", "地址", "聯絡電話"]


var keys = ["animal_id", "animal_subid", "animal_area_pkid", "animal_shelter_pkid", "animal_place", "animal_kind", "animal_sex", "animal_bodytype", "animal_colour", "animal_age", "animal_sterilization", "animal_bacterin", "animal_foundplace", "animal_title", "animal_status", "animal_remark", "animal_caption", "animal_opendate", "animal_closeddate", "animal_update", "animal_createtime", "shelter_name", "album_name", "cDate", "shelter_address", "shelter_tel"]

class MovieScreen extends React.Component {
  render() {
    var rows = [];
    for (var i = 0; i < keys.length; i++) {
      rows.push(<Text key={i} style={styles.text}>&bull; {dispFields[i] + "：" + this.props.movie[keys[i]]}</Text>);
    }

    return (
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.mainSection}>
          <Image
            source={{ uri: this.props.movie.album_file }}
            style={styles.detailsImage}
            resizeMode='contain'
          />
        </View>
        <View style={styles.rightPane}>
          {rows}
        </View>
      </ScrollView>
    );
  }
}

var styles = StyleSheet.create({
  contentContainer: {
    padding: 10,
  },
  mainSection: {
    flex: 2,
  },
  detailsImage: {
    height: 300,
    backgroundColor: '#eaeaea',
    marginRight: 10,
  },
  rightPane: {
    justifyContent: 'space-between',
    flex: 1,
  },
  text: {
    fontSize: 20
  }
});

module.exports = MovieScreen;
