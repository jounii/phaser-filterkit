var background;
var filter = [];
var FILTER_VIGNETTE = 0;
var FILTER_FILMGRAIN = 1;
var FILTER_SNOISE = 2;
var game = new Phaser.Game(800, 600, Phaser.AUTO, 'filter-example', { preload: preload, create: create, update: update });

function preload() {

    game.load.image('phaser', 'phaser2.png');
    game.load.image('background', '8710000952_a7830143dd_b.jpg');
    game.load.script('filter-vignette', '../src/Vignette.js');
    //game.load.script('filter-snoise', '../src/SNoise.js');
    game.load.script('filter-filmgrain', '../src/FilmGrain.js');

}

function create() {

    background = game.add.sprite(0, 0, 'background');
    background.width = 800;
    background.height = 600;

    filter[FILTER_VIGNETTE] = game.add.filter('Vignette');
    filter[FILTER_VIGNETTE].size = 0.3;
    filter[FILTER_VIGNETTE].amount = 0.5;
    filter[FILTER_VIGNETTE].alpha = 1.0;

    //filter[FILTER_SNOISE] = game.add.filter('SNoise');

    filter[FILTER_FILMGRAIN] = game.add.filter('FilmGrain');
    filter[FILTER_FILMGRAIN].color = 0.6;
    filter[FILTER_FILMGRAIN].amount = 0.04;
    filter[FILTER_FILMGRAIN].luminance = 0.8;

    //background.filters = [filter[FILTER_FILMGRAIN], filter[FILTER_VIGNETTE]];
    game.stage.filters = [filter[FILTER_FILMGRAIN], filter[FILTER_VIGNETTE]];

    var logo = game.add.sprite(game.world.centerX, game.world.centerY, 'phaser');
    logo.anchor.setTo(0.5, 0.5);

}

var direction = -1;

function update() {
    var f = filter[FILTER_FILMGRAIN];
    /*
    f.amount += 0.01 * direction;
    if (f.amount <= 0) {
        f.amount = 0;
        direction = 1;
    } else if (f.amount >= 1.0) {
        f.amount = 1.0;
        direction = -1;
    }
    */

    f.update();

}

