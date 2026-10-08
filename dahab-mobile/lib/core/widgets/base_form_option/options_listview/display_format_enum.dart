enum DisplayFormatEnum {
  /// FlatList: The list of items will be displayed as a list of items with the name of the item
  flatList(0),

  /// TreeList: The list of items will be displayed as a tree with the name of the item
  treeList(1);

  final int value;

  const DisplayFormatEnum(this.value);

  factory DisplayFormatEnum.fromInt(int? value) {
    switch (value ?? 0) {
      case 0:
        return DisplayFormatEnum.flatList;
      case 1:
        return DisplayFormatEnum.treeList;
      default:
        return DisplayFormatEnum.flatList;
    }
  }
}
