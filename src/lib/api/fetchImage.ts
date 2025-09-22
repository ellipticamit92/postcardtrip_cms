const unsplashAccessKey = process.env.UNSPLASH_ACCESS_KEY;
export const fetchUnsplashImage = async (destination: string) => {
  if (!unsplashAccessKey) {
    console.warn("UNSPLASH_ACCESS_KEY not configured, skipping image fetch");
    return null;
  }

  const searchTerms = [
    `${destination} travel destination`,
    `${destination} tourism`,
    `${destination} landmarks`,
    `${destination} cityscape`,
    destination,
  ];

  for (const searchTerm of searchTerms) {
    try {
      const unsplashUrl = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(
        searchTerm
      )}&per_page=3&orientation=landscape&order_by=relevant&client_id=${unsplashAccessKey}`;

      const imageResponse = await fetch(unsplashUrl, {
        headers: {
          "Accept-Version": "v1",
        },
      });

      if (!imageResponse.ok) {
        console.warn(
          `Unsplash API error for "${searchTerm}":`,
          imageResponse.status
        );
        continue;
      }

      const imageData = await imageResponse.json();

      if (imageData.results && imageData.results.length > 0) {
        const photo = imageData.results[0]; // Get the most relevant result
        return {
          url: photo.urls.regular,
          thumbnailUrl: photo.urls.small,
          source: "Unsplash",
          downloadUrl: photo.links.download,
        };
      }
    } catch (error) {
      console.warn(`Failed to fetch image for term "${searchTerm}":`, error);
      continue;
    }
  }

  return null;
};
