export function resetWithScreen(navigation, screenName, params) {
  navigation.reset({
    index: 0,
    routes: [{name: screenName, params}],
  });
}
