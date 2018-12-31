var ListScreen = require('./ListScreen');
var AnimalScreen = require('./AnimalScreen');
import { createStackNavigator } from "react-navigation";

const HomeScreen = createStackNavigator ({
    List: { screen: ListScreen },
    Detail: {screen: AnimalScreen}
  }, {      
    lazy: true
  });

  HomeScreen.navigationOptions = {
    title: '首頁'
  }

 module.exports = HomeScreen
 