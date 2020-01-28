import marked from 'marked'
import { sanitizeHtml } from './sanitizer'
import { ParsedRequest } from './types'
const twemoji = require('twemoji')
const twOptions = { folder: 'svg', ext: '.svg' }
const emojify = (text: string) => twemoji.parse(text, twOptions)

function getCss(theme: string, fontSize: string) {
  let background = '#ffffff'
  let radial = '#dde1e4'

  if (theme === 'dark') {
    background = '#17171d'
    radial = '#3c4858'
  }

  return `
    @font-face {
      font-family: 'Phantom Sans';
      src: url('https://hackclub.com/fonts/Phantom_Sans_0.4/Regular.woff')
          format('woff'),
        url('https://hackclub.com/fonts/Phantom_Sans_0.4/Regular.woff2')
          format('woff2');
      font-weight: normal;
      font-style: normal;
    }
    @font-face {
      font-family: 'Phantom Sans';
      src: url('https://hackclub.com/fonts/Phantom_Sans_0.4/Bold.woff')
          format('woff'),
        url('https://hackclub.com/fonts/Phantom_Sans_0.4/Bold.woff2')
          format('woff2');
      font-weight: bold;
      font-style: normal;
    }

    body {
      background: ${background};
      background-image: radial-gradient(${radial} 5%, transparent 0);
      background-size: 60px 60px;
      height: 100vh;
      display: flex;
      text-align: center;
      align-items: center;
      justify-content: center;
      font-family: 'Phantom Sans', sans-serif;
      font-size: ${sanitizeHtml(fontSize)};
      font-style: normal;
    }

    code {
      font-family: Menlo, Monaco, Lucida Console, Liberation Mono, DejaVu Sans Mono, Bitstream Vera Sans Mono, Courier New, monospace, sans-serif;
      font-size: .75em;
      white-space: pre-wrap;
    }

    code:before, code:after {
      content: '\`';
    }

    .img-wrapper {
      display: flex;
      align-items: center;
      align-content: center;
      justify-content: center;
    }

    .logo {
      width: 275px;
      height: 275px;
    }

    .plus {
      color: #7a8c97;
      font-size: 100px;
      padding: 0 50px;
    }

    .spacer {
      margin: 50px 150px 150px;
    }

    .brand {
      color: #e42d42;
      display: block;
      font-size: 100px;
      font-weight: bold;
      padding: 50px;
      text-align: center;
      text-transform: uppercase;
      position: absolute;
      top: 0;
      width: 100%;
    }

    .subbrand {
      color: #7a8c97;
    }
    
    .heading {
      background-image: linear-gradient(to bottom right, #e4732d 12.5%, #e42d42);
      background-repeat: no-repeat;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      margin: 50px 100px 25px;
      font-weight: bold;
      line-height: 0.875;
    }

    .heading * {
      margin: 0;
    }
    
    .author {
      font-size: ${Number(sanitizeHtml(fontSize).match(/\d+/)) * 0.375}px;
      text-transform: uppercase;
      color: #7a8c97;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .avatar {
      width: 125px;
      border-radius: 125px;
      margin: 0 25px 0 50px;
    }`
}

export function getHtml(parsedReq: ParsedRequest) {
  const { text, theme, md, fontSize, images, caption } = parsedReq
  return `<!DOCTYPE html>
  <html>
  <meta charset="utf-8">
  <title>Generated Image</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    ${getCss(theme, fontSize)}
  </style>
  <link rel="stylesheet" href="http://assets.lachlanjc.me/bf566c6457ac/gotham.css" />
  <body>
    <div class="brand">
      <img class="avatar" src="https://github.com/lachlanjc.png">
      @lachlanjc @ <span class="nyu">IMA</span>
    </div>
    <div class="spacer">
      ${
        images.length > 0
          ? `<div class="img-wrapper">
          <img class="logo" src="${sanitizeHtml(images[0])}" />
          ${images.slice(1).map(img => {
            return `<div class="plus">+</div>
            <img class="logo" src="${sanitizeHtml(img)}" />`
          })}
        </div>`
          : ''
      }
      <div class="heading">${emojify(
        md ? marked(text) : sanitizeHtml(text)
      )}</div>
      ${
        caption !== 'undefined'
          ? `<div class="caption">${emojify(sanitizeHtml(caption))}</div>`
          : ''
      }
    </div>
  </body>
</html>`
}
