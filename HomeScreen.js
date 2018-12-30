var ListScreen = require('./ListScreen');
var AnimalScreen = require('./AnimalScreen');
import { StackNavigator } from "react-navigation";

const HomeScreen = StackNavigator ({
    List: { screen: ListScreen },
    Detail: {screen: AnimalScreen}
  }, {
    navigationOptions: {
      title: '首頁'
    },
      
    lazy: true
  });

 module.exports = HomeScreen
 