import { IncomingMessage } from 'http'
import { parse } from 'url'
import { ParsedRequest } from './types'

export function parseRequest(req: IncomingMessage) {
  console.log('HTTP ' + req.url)
  const { pathname = '/', query = {} } = parse(req.url || '', true)
  const { fontSize, images, theme, md, caption } = query

  if (Array.isArray(fontSize)) {
    throw new Error('Expected a single fontSize')
  }
  if (Array.isArray(theme)) {
    throw new Error('Expected a single theme')
  }

  const arr = pathname.slice(1).split('.')
  let extension = ''
  let text = ''
  if (arr.length === 0) {
    text = ''
  } else if (arr.length === 1) {
    text = arr[0]
  } else {
    extension = arr.pop() as string
    text = arr.join('.')
  }

  const parsedRequest: ParsedRequest = {
    fileType: extension === 'jpeg' ? extension : 'png',
    text: decodeURIComponent(text),
    theme: theme === 'dark' ? 'dark' : 'light',
    md: md === '1' || md === 'true',
    fontSize: fontSize || '200px',
    caption: decodeURIComponent(caption as string),
    images: getArray(images)
  }
  parsedRequest.images = getDefaultImages(parsedRequest.images)
  return parsedRequest
}

function getArray(stringOrArray: string[] | string): string[] {
  return Array.isArray(stringOrArray) ? stringOrArray : [stringOrArray]
}

function getDefaultImages(images: string[]) {
  return images.length > 0 && images[0] ? images : []
}
