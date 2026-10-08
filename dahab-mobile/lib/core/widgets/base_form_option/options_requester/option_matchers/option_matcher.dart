abstract class OptionMatcher<T, S> {
  bool match(T option, S? searchParams, List<T> allOptions);

  bool matchText(T option, String? searchParams, List<T> allOptions);

  S? stringToSearchParam(String? str);
}
