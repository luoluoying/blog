const http = require('http')
const url = require('url')
const queryString = require('querystring')

const hostname = '127.0.0.1'
const port = 3000

const server = http.createServer((req, res) => {
  console.log(req.url)
  // const query = queryString.parse(url.parse(req.url).query)
  // const query = url.parse(req.url, true).query
  const query = url.parse(req.url, true)
  console.log(query, 'query')
  res.statusCode = 200; 
  res.setHeader('Content-Type', 'text/plain')
  // res.setHeader('Set-Cookie', 'isvisit=1')
  res.setHeader('Set-Cookie', serialize('isvisit', 2))
  res.end('Hello World\n')
})

server.listen(port, hostname, () => {
  console.log(`Server running at http:// ${hostname}:${port}`)
})

const serialize = (name, val, opt) => {
  const pairs = [name + '=' + encodeURI(val)]
  opt = opt || {}
  if (opt.maxAge) pairs.push('Max-Age=' + opt.maxAge)
  return pairs.join('; ')
}