class RouteGame extends Phaser.Scene {
    constructor() {
        super('RouteGame')
    }
    create() {
        if(gameInfo.type == 'development') console.log('RouteGame created successfully')

        //try
        // gameInfo.game = 1
        // gameInfo.level = 1
        // gameInfo.currentQuest = 8
        // gameInfo.currentCorrect = 0,
        // gameInfo.currentWrong = 0,
        // gameInfo.score = 0

        // console.log('gameInfo.game: ' + gameInfo.game)
        // console.log('gameInfo.level: ' + gameInfo.level)

        gameJson = this.cache.json.get('game_' + (gameInfo.game + 1))[gameInfo.level]
        if (gameJson != null) {
            gameInfo.numQuest = gameJson.num_quest
            gameInfo.numLevel = this.cache.json.get('game_' + (gameInfo.game + 1)).length
            if (gameInfo.currentQuest == 0) {
                this.scene.start('PreloadGame')
            } else {
                this.scene.start(gameJson.scene)
            }
        } else {
            this.scene.start('ChoiceGame')
        }
    }
}

class PreloadGame extends Phaser.Scene {
    constructor() {
      super('PreloadGame')
    }
    preload() {
        this.loadingScreen = new LoadingScreen(this)
        if (gameJson.scene == 'MCGame' && !isLoaded.mc) {
            this.load.atlas('MCTexture', '../../asset/texture/MultipleChoicePack.png', '../../asset/texture/MultipleChoicePack.json')
            if (!isLoadedBird) {
                this.load.atlas('BirdTexture', '../../asset/texture/Bird.png', '../../asset/texture/Bird.json')
                this.load.atlas('BirdBuildingTexture', '../../asset/texture/BirdBuilding.png', '../../asset/texture/BirdBuilding.json')
                isLoadedBird = true
            }
        } else if (gameJson.scene == 'WAGame' && !isLoaded.wa) {
            this.load.atlas('WATexture', '../../asset/texture/WordAnalysisPack.png', '../../asset/texture/WordAnalysisPack.json')
        } else if (gameJson.scene == 'WFGame' && !isLoaded.wf) {
            this.load.atlas('WFTexture', '../../asset/texture/WordFindingPack.png', '../../asset/texture/WordFindingPack.json')
        } else if ((gameJson.scene == 'WG1Game' && !isLoaded.wg1) || (gameJson.scene == 'WG2Game' && !isLoaded.wg2)) {
            this.load.atlas('WGTexture', '../../asset/texture/WordGrouppingPack.png', '../../asset/texture/WordGrouppingPack.json')
        } else if ((gameJson.scene == 'WL1Game' && !isLoaded.wl1) || (gameJson.scene == 'WL2Game' && !isLoaded.wl2) || (gameJson.scene == 'WL3Game' && !isLoaded.wl3)) {
            this.load.atlas('WLTexture', '../../asset/texture/WordLabellingPack.png', '../../asset/texture/WordLabellingPack.json')
        } else if (gameJson.scene == 'WPGame' && !isLoaded.wp) {
            this.load.atlas('WPTexture', '../../asset/texture/WordPairingPack.png', '../../asset/texture/WordPairingPack.json')
        } else if (gameJson.scene == 'TFGame' && !isLoaded.tf) {
            this.load.atlas('TFTexture', '../../asset/texture/TrueFalsePack.png', '../../asset/texture/TrueFalsePack.json')
            if (!isLoadedBird) {
                this.load.atlas('BirdTexture', '../../asset/texture/Bird.png', '../../asset/texture/Bird.json')
                this.load.atlas('BirdBuildingTexture', '../../asset/texture/BirdBuilding.png', '../../asset/texture/BirdBuilding.json')
                isLoadedBird = true
            }
        }
    }
    create() {
        if(gameInfo.type == 'development') console.log('PreloadGame created successfully')
        this.time.delayedCall(300, goTo, [this, gameJson.scene])
    }
}