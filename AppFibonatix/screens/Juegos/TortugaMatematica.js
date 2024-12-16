import "react-native-gesture-handler";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Game from "../../assets/components/Game";

const TortugaMatematica = () => (
  <GestureHandlerRootView style={{ flex: 1 }}>
    <Game />
  </GestureHandlerRootView>
);

export default TortugaMatematica;

