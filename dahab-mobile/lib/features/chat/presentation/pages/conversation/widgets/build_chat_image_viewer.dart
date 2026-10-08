part of 'conversation_widgets_imports.dart';

class BuildChatImageViewer extends StatelessWidget {
  final String path;

  const BuildChatImageViewer({super.key, required this.path});

  @override
  Widget build(BuildContext context) {
    final isNetwork = path.startsWith('http://') || path.startsWith('https://');
    return Scaffold(
      backgroundColor: Colors.transparent,
      body: Stack(
        children: [
          Center(
            child: InteractiveViewer(
              child: isNetwork
                  ? CachedImage(
                      url: path,
                      fit: BoxFit.contain,
                      width: MediaQuery.sizeOf(context).width,
                      height: MediaQuery.sizeOf(context).height * 0.8,
                      borderRadius: BorderRadius.zero,
                      bgColor: Colors.transparent,
                      haveRadius: false,
                    )
                  : Image.file(File(path), fit: BoxFit.contain),
            ),
          ),
          SafeArea(
            child: Align(
              alignment: AlignmentDirectional.topStart,
              child: IconButton(
                onPressed: () => Navigator.of(context).pop(),
                icon: const Icon(Icons.close_rounded, color: Colors.white),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
