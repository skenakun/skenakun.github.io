import test from 'node:test'
import assert from 'node:assert/strict'
import { createMixcloudAdapter } from '../../music/providers/mixcloud.js'

test('loads a Mixcloud show key and exposes ended-event support', async () => {
  const calls = []
  const widget = {
    ready: Promise.resolve(),
    load: (key, start) => calls.push(['load', key, start]),
    play: () => calls.push(['play']),
    pause: () => calls.push(['pause']),
    seek: value => calls.push(['seek', value]),
    getPosition: async () => 0,
    getDuration: async () => 300,
    events: {
      play: { on: () => {}, off: () => {} },
      pause: { on: () => {}, off: () => {} },
      progress: { on: () => {}, off: () => {} },
      ended: { on: () => {}, off: () => {} },
      error: { on: () => {}, off: () => {} }
    }
  }
  const adapter = createMixcloudAdapter({
    host: {},
    emit: () => {},
    widgetFactory: () => widget,
    iframeFactory: () => ({})
  })
  await adapter.load({ sourceId: '/spartacus/party-time/' })
  assert.equal(adapter.capabilities.endedEvent, true)
  assert.deepEqual(calls[0], ['load', '/spartacus/party-time/', false])
})

test('forwards Mixcloud progress values that are already seconds', async () => {
  const handlers = {}
  const events = []
  const channel = name => ({ on: fn => { handlers[name] = fn }, off: () => {} })
  const widget = {
    ready: Promise.resolve(), load: async () => {}, play: async () => {}, pause: async () => {}, seek: async () => {},
    getPosition: async () => 0, getDuration: async () => 300,
    events: { play: channel('play'), pause: channel('pause'), progress: channel('progress'), ended: channel('ended'), error: channel('error') }
  }
  const adapter = createMixcloudAdapter({ host: {}, emit: (type, detail) => events.push([type, detail]), widgetFactory: () => widget, iframeFactory: () => ({}) })
  await adapter.load({ sourceId: '/spartacus/party-time/' })
  handlers.progress(42, 300)
  const progress = events.find(([type]) => type === 'progress')
  assert.equal(progress[1].position, 42)
  assert.equal(progress[1].duration, 300)
})

test('fails Mixcloud load when the widget ready promise stalls', async () => {
  const adapter = createMixcloudAdapter({
    host: {},
    readinessTimeoutMs: 5,
    widgetFactory: () => ({ ready: new Promise(() => {}) }),
    iframeFactory: () => ({ remove() {} })
  })
  const outerTimeout = new Promise((_, reject) => setTimeout(() => reject(new Error('outer timeout')), 40))
  await assert.rejects(
    Promise.race([
      adapter.load({ sourceId: '/spartacus/party-time/' }),
      outerTimeout
    ]),
    error => error?.code === 'PLAYER_API_TIMEOUT'
  )
})
