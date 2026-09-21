export default {
  layout: 'post.html',
  eleventyComputed: {
    // Keep the Jekyll post URLs: /:year/:month/:day/:title/. Jekyll built
    // these from the file name, so derive them the same way. Without this,
    // Eleventy falls back to the file path and serves /posts/<file name>/,
    // which breaks every old inbound link.
    permalink: (data) => {
      // Eleventy strips the date into fileSlug, so read it from the file name.
      const fileName = data.page.inputPath.split('/').pop()
      const date = fileName.match(/^(\d{4})-(\d{2})-(\d{2})-/)
      if (!date) {
        throw new Error(
          `Post "${fileName}" must be named YYYY-MM-DD-title.md to get a URL.`
        )
      }

      const [, year, month, day] = date
      return `/${year}/${month}/${day}/${data.page.fileSlug}/`
    },
    previous: (data) => {
      const posts = data.collections.posts || []
      const currentIndex = posts.findIndex((post) => post.url === data.page.url)
      if (currentIndex === -1 || currentIndex === 0) return null
      return posts[currentIndex - 1]
    },
    next: (data) => {
      const posts = data.collections.posts || []
      const currentIndex = posts.findIndex((post) => post.url === data.page.url)
      if (currentIndex === -1 || currentIndex === posts.length - 1) return null
      return posts[currentIndex + 1]
    },
  },
}
