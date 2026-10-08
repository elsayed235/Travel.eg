import 'package:flutter/material.dart';

/// Shared category for home / explore rails.
class AppCategoryItem {
  final String id;
  final String label;
  final IconData icon;

  const AppCategoryItem({
    required this.id,
    required this.label,
    required this.icon,
  });
}

/// Default general marketplace categories (matches create-request).
class AppCategories {
  AppCategories._();

  static const all = AppCategoryItem(
    id: 'all',
    label: 'الكل',
    icon: Icons.apps_rounded,
  );

  static const items = <AppCategoryItem>[
    AppCategoryItem(id: 'clothes', label: 'ملابس', icon: Icons.checkroom_outlined),
    AppCategoryItem(id: 'food', label: 'مواد غذائية', icon: Icons.restaurant_outlined),
    AppCategoryItem(
      id: 'electronics',
      label: 'إلكترونيات',
      icon: Icons.devices_outlined,
    ),
    AppCategoryItem(id: 'furniture', label: 'أثاث', icon: Icons.chair_outlined),
    AppCategoryItem(id: 'home', label: 'أدوات منزلية', icon: Icons.kitchen_outlined),
    AppCategoryItem(
      id: 'auto',
      label: 'سيارات',
      icon: Icons.directions_car_outlined,
    ),
    AppCategoryItem(id: 'books', label: 'كتب', icon: Icons.menu_book_outlined),
    AppCategoryItem(id: 'other', label: 'أخرى', icon: Icons.more_horiz_rounded),
  ];

  static List<AppCategoryItem> get withAll => [all, ...items];

  static IconData iconFor(String id) {
    for (final c in withAll) {
      if (c.id == id) return c.icon;
    }
    return Icons.category_outlined;
  }
}
