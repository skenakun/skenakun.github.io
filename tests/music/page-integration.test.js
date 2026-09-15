import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

const indexPath = new URL('../../index.html', import.meta.url)
const loaderPath = new URL('../../feature-loader.js', import.meta.url)

test('page exposes Music Center button and permanent mount points without eager provider scripts', async () => {
  const html = await readFile(indexPath, 'utf8')
  assert.match(html, /id="musicCenterBtn"/)
  assert.match(html, /id="music-center-root"/)
  assert.match(html, /id="music-mini-player"/)
  assert.match(html, /id="mc-playback-host"/)
  assert.doesNotMatch(html, /<script[^>]+(?:youtube\.com|open\.spotify\.com|soundcloud\.com|mixcloud\.com)/i)
  assert.doesNotMatch(html, /<script[^>]+music-center\.js/i)
})

test('feature loader lazy-loads Music Center CSS and module on user intent', async () => {
  const source = await readFile(loaderPath, 'utf8')
  assert.match(source, /musicCenterBtn/)
  assert.match(source, /music-center\.css/)
  assert.match(source, /loadModule\("\.\/music-center\.js/)
  assert.match(source, /import\(src\)/)
  assert.match(source, /openMusicCenter/)
})
