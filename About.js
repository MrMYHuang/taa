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
  Platform,
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableNativeFeedback,
  View,
  Linking
} = ReactNative;

import HyperLink from './HyperLink'

import { connect } from "react-redux"
@connect((store) => {
  return {
    animalDbDate: store.settings.animalDbDate
  };
})
class About extends React.Component {
  render() {
    const { animalDbDate } = this.props;
    return (
      <View>
{(__DEV__) ? <Text>開發模式</Text> : null}
<Text>{`*版本歷史：
1.4.1:
  * 解決有時"我的最愛"的按鈕非"刪除"的bug。
1.4.0:
  * 新增"我的最愛"功能。
1.3.1:
  * 修正資料庫下載進度條顯示問題。
1.3.0:
  * 新增下載資料庫會顯示進度。
  * 修正更新進度有可能不顯示的問題。
1.2.2:
  * 修正下載更新完成對話窗重複出現的bug。
1.2.0:
  * CodePush更新會顯示確認視窗與下載進度。
1.1.0:
  * 支援CodePush更新app。
  * 修正"下載資料庫"鈕無法更新資料庫的問題。
  * 關於頁面顯示上次下載資料之時間。
1.0.8：
  * 第一版。`}</Text>
        <Text />
        <Text>* 作者：Meng-Yuan Huang</Text>
        <Text>* 作者信箱：<HyperLink>mailto:myhDev@live.com</HyperLink></Text>
        <Text>* App開放原始碼：<HyperLink>https://github.com/MrMYHuang/taa</HyperLink></Text>
        <Text>* 版權宣告：</Text>
        <Text>  動物資料來源：<HyperLink>http://data.gov.tw/node/9842</HyperLink></Text>
        <Text>  動物資料庫下載日期：{animalDbDate}</Text>
        <Text>  Logo來源：<HyperLink>http://www.freepik.com</HyperLink></Text>
      </View>
    );
  }
}

var styles = StyleSheet.create({
  imgContainer: {
    flex: 1,
  },
  textContainer: {
    flex: 2,
  }
});

module.exports = About;
