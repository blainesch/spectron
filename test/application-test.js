var Application = require('..').Application
var assert = require('assert')
var fs = require('fs')
var helpers = require('./global-setup')
var path = require('path')
var temp = require('temp').track()

var describe = global.describe
var it = global.it
var beforeEach = global.beforeEach
var afterEach = global.afterEach
var expect = require('chai').expect

describe.only('application loading', function () {
  helpers.setupTimeout(this)

  var app = null
  var tempPath = null

  beforeEach(function () {
    tempPath = temp.mkdirSync('spectron-temp-dir-')

    return helpers.startApplication({
      cwd: path.join(__dirname, 'fixtures'),
      args: [
        path.join(__dirname, 'fixtures', 'app'),
        '--foo',
        '--bar=baz'
      ],
      env: {
        FOO: 'BAR',
        HELLO: 'WORLD',
        SPECTRON_TEMP_DIR: tempPath
      }
    }).then(function (startedApp) { app = startedApp })
  })

  afterEach(function () {
    return helpers.stopApplication(app)
  })

  describe('robot', function () {
    it('it can pick up a keypress event', function () {
      app.robot.keyTap('8', 'control')
      app.electron.remote.getGlobal('globalShortcutCount').should.eventually.equal(1)
    })
  })
})
