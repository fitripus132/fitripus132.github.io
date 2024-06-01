var game, infoJson, gameJson
var gameInfo = {
  size : {w : 1280, h: 720},
  center : {x: 640, y: 360},
  type: "production", //development or production
  game : null,
  level: null,
  numLevel: null,
  currentQuest:null,
  numQuest:null,
  currentCorrect: null,
  currentWrong: null,
  score: null
}
var isLoaded = { mc : false, wa : false, wf : false, wg1 : false, wg2 : false, wl1 : false, wl2 : false, wl3 : false, wp : false, tf : false}; var isLoadedBird = false
var isComplete = {}

window.onload = function() {
  var gameConfig = {
    width: 1280,
    height: 720,
    backgroundColor: 0x000000,
    scene: [Preload, BootGame, MenuGame, ChoiceGame, RouteGame, PreloadGame, MCGame, WAGame, WFGame, WG1Game, WG2Game, WL1Game, WL2Game, WL3Game, WPGame, TFGame],
  }
  game = new Phaser.Game(gameConfig)
  window.focus()
  resizeGame()
  window.addEventListener("resize", resizeGame)
}

class Preload extends Phaser.Scene {
  constructor() {
    super('Preload')
  }
  preload() {
    this.add.text(this.game.config.width/2, this.game.config.height/2, "Loading Game ...", 
    {
        font: "30px", 
        color: '#ffffff',
        align: 'left'
    }).setOrigin(0.5,0.5)
    this.load.bitmapFont('arial', '../../asset/font/arial.png', '../../asset/font/arial.xml')
    this.load.atlas('MenuTexture', '../../asset/texture/MenuPack.png', '../../asset/texture/MenuPack.json')
    this.load.multiatlas('OwlMenuAnim', '../../asset/texture/OwlMenuAnim.json', '../../asset/texture')
    this.load.plugin('rexbuttonplugin', '../../lib/rex/rexbuttonplugin.min.js', true);
    this.load.audio('pop', '../../asset/sfx/pop.mp3')
    this.load.atlas('LoadingAnim', '../../asset/texture/LoadingAnim.png', '../../asset/texture/LoadingAnim.json')
    this.load.json('info_json', 'json/info.json')
  }
  create() {
    if(gameInfo.type == 'development') console.log('Preload created successfully')
    infoJson = this.cache.json.get('info_json')
    this.scene.start('MenuGame')
    // this.scene.start('BootGame')
  }
}

class BootGame extends Phaser.Scene {
  constructor() {
    super('BootGame')
  }
  preload() {
    this.loadingScreen = new LoadingScreen(this)
    this.load.atlas('texture', '../../asset/texture/TexturePack.png', '../../asset/texture/TexturePack.json')
    this.load.atlas('StarTexture', '../../asset/texture/star.png', '../../asset/texture/star.json')
    this.load.atlas('gamePack', 'texture/game_pack.png', 'texture/game_pack.json')
    this.load.plugin('rexroundrectangleplugin', '../../lib/rex/rexroundrectangleplugin.min.js', true)
    this.load.plugin('rexdragplugin', '../../lib/rex/rexdragplugin.min.js', true);
    this.load.audio('true', '../../asset/sfx/true.mp3')
    this.load.audio('false', '../../asset/sfx/false.mp3')
    this.load.audio('win', '../../asset/sfx/win.wav')
    for (var i = 1; i <= infoJson.game.length; i++) {
      this.load.json('game_'+i, 'json/game_'+i+'.json')
    }
  }
  create() {
    if(gameInfo.type == 'development') console.log('BootGame created successfully')
    this.time.delayedCall(300, goTo, [this, 'ChoiceGame'], this)
  }
}