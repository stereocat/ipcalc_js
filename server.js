const express = require('express')
const app = express()

app.set('port', (process.env.PORT || 3000)) // process.env.PORT for Heroku
app.use('/', express.static('./dist'))

const server = app.listen(app.get('port'), () => {
  const host = server.address().address
  const port = server.address().port
  console.log(`Start app at http://${host}:${port}`)
})
