import pluginRss from '@11ty/eleventy-plugin-rss'
import markdownItAnchor from 'markdown-it-anchor'

export default function (eleventyConfig) {
  // Allow missing file extensions (like Jekyll)
  eleventyConfig.configureErrorReporting({ allowMissingExtensions: true })

  // Add anchor IDs to headings, and render image captions
  eleventyConfig.amendLibrary('md', (mdLib) => {
    mdLib.use(markdownItAnchor)

    // Writers write a caption as italic alt text: ![*Caption*](/path.jpg).
    // Kramdown showed this text under the image. markdown-it flattens the
    // emphasis into the alt attribute, so the caption becomes invisible.
    // The asterisks are gone by render time, so the alt string cannot match.
    // Detect the emphasis in the token children instead.
    const isCaptionedImage = (token) => {
      const children = token.children || []
      return (
        children.length >= 2 &&
        children[0].type === 'em_open' &&
        children[children.length - 1].type === 'em_close'
      )
    }

    const defaultImage = mdLib.renderer.rules.image
    mdLib.renderer.rules.image = function (tokens, idx, options, env, self) {
      const token = tokens[idx]
      if (!isCaptionedImage(token)) {
        return defaultImage(tokens, idx, options, env, self)
      }

      // Drop the wrapping emphasis, but keep any inline markup in the caption.
      const children = token.children
      const caption = self.renderInline(children.slice(1, -1), options, env)

      // The figcaption carries the text, so an identical alt would make a
      // screen reader announce the same words twice. The default renderer
      // rebuilds alt from token.children, so empty the children to get
      // alt="", then restore them.
      token.children = []
      const image = defaultImage(tokens, idx, options, env, self)
      token.children = children

      return `<figure>${image}<figcaption>${caption}</figcaption></figure>`
    }

    // A figure cannot go inside a paragraph. When a paragraph holds only a
    // captioned image, hide the paragraph tags so the figure stands alone.
    // An image among other text keeps its paragraph.
    mdLib.core.ruler.push('unwrap_figure_paragraph', (state) => {
      const tokens = state.tokens

      for (let i = 0; i < tokens.length - 2; i++) {
        if (
          tokens[i].type !== 'paragraph_open' ||
          tokens[i + 1].type !== 'inline' ||
          tokens[i + 2].type !== 'paragraph_close'
        ) {
          continue
        }

        const children = tokens[i + 1].children || []
        const images = children.filter((child) => child.type === 'image')
        if (images.length !== 1 || images.length !== children.length) continue
        if (!isCaptionedImage(images[0])) continue

        tokens[i].hidden = true
        tokens[i + 2].hidden = true
      }
    })
  })

  // Add RSS plugin
  eleventyConfig.addPlugin(pluginRss)

  // Add global site data
  eleventyConfig.addGlobalData('site', {
    title: 'Lords of the Pit',
    description:
      "The Lords of the Pit are the United States' premiere Old School Magic: the Gathering club based out of Chicago, IL. Members of this group include current club members ('Lords') as well as prospective new members ('Thrulls').",
    baseurl: '/',
    url: 'https://lordsofthepit.com',
    cdnBaseUrl: 'https://assets.lordsofthepit.com',
    lang: 'en',
  })

  // Copy static assets
  eleventyConfig.addPassthroughCopy('src/assets')
  eleventyConfig.addPassthroughCopy('src/*.png')
  eleventyConfig.addPassthroughCopy('src/*.jpg')
  eleventyConfig.addPassthroughCopy('src/*.ico')
  eleventyConfig.addPassthroughCopy('src/*.svg')
  eleventyConfig.addPassthroughCopy('src/*.webmanifest')

  // Create posts collection
  eleventyConfig.addCollection('posts', function (collectionApi) {
    return collectionApi.getFilteredByGlob('src/posts/*.md').sort((a, b) => {
      return b.date - a.date // Sort by date descending (newest first)
    })
  })

  // Date filters to match Jekyll behavior
  eleventyConfig.addFilter('date', function (date, format) {
    const d = new Date(date)
    const monthNames = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ]

    // Handle format strings
    if (format === '%Y') {
      return d.getFullYear().toString()
    } else if (format === '%b %-d, %Y' || format === '%b %-d') {
      const day = d.getDate()
      const month = monthNames[d.getMonth()]
      return format === '%b %-d, %Y'
        ? `${month} ${day}, ${d.getFullYear()}`
        : `${month} ${day}`
    }

    // Default format
    return `${monthNames[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`
  })

  eleventyConfig.addFilter('date_to_xmlschema', function (date) {
    return new Date(date).toISOString()
  })

  // Add relative_url filter (Jekyll compatibility)
  eleventyConfig.addFilter('relative_url', function (url) {
    return url
  })

  // Add escape filter for HTML escaping
  eleventyConfig.addFilter('escape', function (text) {
    if (!text) return ''
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;')
  })

  // Add strip_html filter
  eleventyConfig.addFilter('strip_html', function (text) {
    if (!text) return ''
    return text.replace(/<[^>]+>/g, '')
  })

  // Add limit filter for arrays
  eleventyConfig.addFilter('limit', function (array, limit) {
    return array.slice(0, limit)
  })

  // Add where filter
  eleventyConfig.addFilter('where', function (array, key, value) {
    return array.filter((item) => item.data[key] === value)
  })

  // Ignore template files and documentation
  eleventyConfig.ignores.add('_editors/**')
  eleventyConfig.ignores.add('README.md')
  eleventyConfig.ignores.add('MIGRATION.md')
  eleventyConfig.ignores.add('CLAUDE.md')

  // Watch for changes
  eleventyConfig.addWatchTarget('./src/assets/stylesheets/')

  // Configure browsersync
  eleventyConfig.setBrowserSyncConfig({
    files: './dist/assets/stylesheets/**/*.css',
  })

  return {
    dir: {
      input: 'src',
      output: 'dist',
      includes: 'includes',
      layouts: 'layouts',
      data: 'data',
    },
    templateFormats: ['md', 'html', 'liquid', 'njk', 'xml'],
    markdownTemplateEngine: 'liquid',
    htmlTemplateEngine: 'liquid',
    dataTemplateEngine: 'liquid',
    pathPrefix: '/',
  }
}
