const jsdom = require('jsdom')
const markdownLinkExtractor = require('markdown-link-extractor')
const mhtml2html = require('mhtml2html')
const puppeteer = require('puppeteer')

/**
 * Represents a web archive containing various formats of a webpage.
 */
class WebArchive {
  /**
   * Create a web archive.
   * @param {string} name The name of the archive.
   * @param {string} url The URL of the webpage to archive.
   */
  constructor(name, url) {
    this.name = name
    this.url = url

    this.html = null
    this.pdf = null
    this.png = null
    this.txt = null
  }
}

/**
 * Represent a instance of puppeteer
 */
class PuppeteerInstance {
  async create() {
    const browser = await puppeteer.launch()

    // Launch the browser and open a new blank page
    const page = await browser.newPage()

    // This is needed to allow request interception --> https://github.com/puppeteer/puppeteer/issues/3811
    await page.setRequestInterception(true)

    page.on('request', (request) => {
      request.continue()
    })

    // Add Headers
    await page.setExtraHTTPHeaders({
      'user-agent':
        'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36',
      'upgrade-insecure-requests': '1',
      accept:
        'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
      'accept-encoding': 'gzip, deflate, br',
      'accept-language': 'en-US,en;q=0.9,en;q=0.8'
    })

    this.browser = browser
    this.page = page
  }
}

/**
 * Archives webpages from a markdown by converting them to different formats.
 * @param {string} markdown The markdown to search for URLs.
 * @param {string[]} include An array of formats to include in the archived object.
 * @returns {Object} An object containing archived formats.
 */
module.exports = async function(
  markdown,
  include = ['html', 'pdf', 'png', 'txt']
) {
  /* ========== CHECKS ========== */

  if (!markdown) return

  if (!Array.isArray(include)) {
    throw Error('Second argument must be an array')
  }

  if (
    !include.includes('html') &&
    !include.includes('pdf') &&
    !include.includes('png') &&
    !include.includes('txt')
  ) {
    throw Error(
      'Error - no valid value was entered in the -i / --include argument'
    )
  }

  /* ========== VARIABLES ========== */

  const puppeteerInstance = new PuppeteerInstance()
  await puppeteerInstance.create()
  const archives = []

  /* ========== SETUP ========== */

  // Read the markdown
  const { links: urls } = markdownLinkExtractor(markdown)

  // Setup JSDOM
  const { JSDOM } = jsdom
  const virtualConsole = new jsdom.VirtualConsole()
  virtualConsole.on('error', () => {
    // No-op to skip console errors.
  })

  /* ========== START PROCESS ========== */

  for (const url of urls) {
    try {
      await puppeteerInstance.page.goto(url, { waitUntil: 'load' })
    } catch (e) {
      throw Error(`Error navigating to ${url}: ${e}`)
    }

    const title = await puppeteerInstance.page.title()
    const archive = new WebArchive(title, url)

    // Archive 1 - HTML
    if (include.includes('html')) {
      try {
        const cdp = await puppeteerInstance.page.target().createCDPSession()
        const { data } = await cdp.send('Page.captureSnapshot', {
          format: 'mhtml'
        })
        const htmlDoc = await mhtml2html.convert(data, {
          parseDOM: (html) => new JSDOM(html, { virtualConsole })
        })
        archive.html = htmlDoc.serialize()
      } catch (e) {
        throw Error(`Error fetching HTML from ${url}: ${e}`)
      }
    }

    // Archive 2 - PDF
    if (include.includes('pdf')) {
      try {
        archive.pdf = await puppeteerInstance.page.pdf()
      } catch (e) {
        throw Error(`Error fetching PDF from ${url}: ${e}`)
      }
    }

    // Archive 3 - PNG
    if (include.includes('png')) {
      try {
        archive.png = await puppeteerInstance.page.screenshot({
          fullPage: true
        })
      } catch (e) {
        throw Error(`Error fetching PNG from ${url}: ${e}`)
      }
    }

    // Archive 4 - TEXT
    if (include.includes('txt')) {
      try {
        archive.txt = await puppeteerInstance.page.$eval(
          '*',
          (element) => element.innerText
        )
      } catch (e) {
        throw Error(`Error fetching TXT from ${url}: ${e}`)
      }
    }

    archives.push(archive)
  }

  puppeteerInstance.browser.close()
  return archives
}
