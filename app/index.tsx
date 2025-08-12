import { Redirect } from "expo-router";
import Home from "./(dashboard)";

export default function Index() {
  return <Redirect href="/(dashboard)" />;
}
