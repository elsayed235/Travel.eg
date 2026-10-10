import 'package:flutter/material.dart';
import 'package:flutter_keyboard_visibility/flutter_keyboard_visibility.dart';
import 'package:rehla/core/theme/app_radius.dart';
import 'package:rehla/core/theme/app_spacing.dart';
import 'package:rehla/core/theme/colors/colors_extension.dart';
import 'package:rehla/core/theme/text/app_text_style.dart';
import 'package:rehla/core/widgets/app_icon.dart';

class SearchFormField extends StatefulWidget {
  final Function(String)? onSubmit;
  final Function(String)? onChange;
  final Function(bool)? onFocus;
  final String? searchHint;

  const SearchFormField({
    super.key,
    this.onSubmit,
    this.onChange,
    this.onFocus,
    this.searchHint,
  });

  @override
  State<SearchFormField> createState() => _SearchFormFieldState();
}

class _SearchFormFieldState extends State<SearchFormField> {
  final TextEditingController _searchController = TextEditingController();
  final FocusNode _focusNode = FocusNode();

  final double _collapsedSearchFieldWidth = 124;
  late double _expandSearchFieldWidth;
  bool _isSearchFieldExpand = false;
  final _keyboardVisibilityController = KeyboardVisibilityController();

  @override
  void initState() {
    super.initState();
    _handleDismissKeyboard();

    _focusNode.addListener(() {
      if (mounted) {
        setState(() {
          _isSearchFieldExpand = _focusNode.hasFocus;
          if (widget.onFocus != null) {
            widget.onFocus!(!_isSearchFieldExpand);
          }
        });
      }
    });
  }

  void _handleDismissKeyboard() {
    _keyboardVisibilityController.onChange.listen((visible) {
      if (mounted) {
        if (!visible) {
          if (widget.onFocus != null) {
            widget.onFocus!(false);
          }
          FocusScope.of(context).requestFocus(FocusNode());
        }
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    _expandSearchFieldWidth = MediaQuery.of(context).size.width;
    return AnimatedContainer(
      duration: const Duration(milliseconds: 400),
      width: _isSearchFieldExpand ? _expandSearchFieldWidth : _collapsedSearchFieldWidth,
      height: _isSearchFieldExpand ? 32 : 28,
      padding: EdgeInsets.zero,
      child: TextField(
        focusNode: _focusNode,
        controller: _searchController,
        style: AppTextStyle.body(color: context.colors.text),
        maxLines: 1,
        onChanged: widget.onChange,
        textInputAction: TextInputAction.search,
        onSubmitted: widget.onSubmit,
        decoration: InputDecoration(
          hintText: widget.searchHint ?? "Search",
          contentPadding: const EdgeInsets.symmetric(vertical: 0, horizontal: AppSpacing.md),
          fillColor: context.colors.surface2,
          filled: true,
          hintStyle: AppTextStyle.caption(color: context.colors.text2),
          prefixIcon: InkWell(
            splashColor: Colors.transparent,
            highlightColor: Colors.transparent,
            onTap: () {
              if (widget.onSubmit != null) {
                widget.onSubmit!(_searchController.text);
              }
            },
            child: AppIcon.ui(AppIcons.search, color: context.colors.text2, size: 20),
          ),
          border: OutlineInputBorder(
            borderRadius: AppRadius.buttonAll,
            borderSide: BorderSide.none,
          ),
          enabledBorder: OutlineInputBorder(
            borderRadius: AppRadius.buttonAll,
            borderSide: BorderSide(color: context.colors.line),
          ),
          focusedBorder: OutlineInputBorder(
            borderRadius: AppRadius.buttonAll,
            borderSide: BorderSide(color: context.colors.line2),
          ),
        ),
      ),
    );
  }
}
