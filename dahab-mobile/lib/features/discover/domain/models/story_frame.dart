/// One photograph on the home stories mosaic (website: STORY_FRAMES).
class StoryFrame {
  final String image;
  final String captionEn;
  final String captionAr;

  const StoryFrame({required this.image, required this.captionEn, required this.captionAr});

  String caption(bool arabic) => arabic ? captionAr : captionEn;
}
