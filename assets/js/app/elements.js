/**
 * The "elements" object contains all kinds of elements/variables used throughout the game.
 */
define(['jquery', 'snapsvg'], function ($, Snap) {

    var elements = {};

    // Get Snap elements
    elements.svg                    = Snap.select('#svg');
    elements.backgroundContainer    = Snap.select('#background');
    elements.animalContainer        = Snap.select('#animal');
    elements.foregroundContainer    = Snap.select('#foreground');
    elements.viewfinderContainer    = Snap.select('#viewfinder');

    // Get JQuery elements
    elements.overlay                = $("#overlay");
    elements.overlayHeadline        = $("#overlayHeadline");
    elements.overlayText            = $("#overlayText");
    elements.overlayButton          = $("#overlayButton");
    elements.shutter                = $('#shutter');
    elements.focus                  = $("#focus");
    elements.levelCounter           = $("#levelCounter span");
    elements.shotCounter            = $("#shotCounter span");
    elements.errorCounter           = $("#errorCounter span");
    elements.targetAnimalName       = $("#target span");
    elements.soundButton            = $("#sound");

    elements.offset                 = $("#svg").offset();   // Used for calculation of mouse position within game

    elements.animals                = [];       // Array to hold the animals
    elements.animalVisible          = false;    // Boolean to keep track of animal visibility
    elements.levelAnimals           = [];       // Array of animals to be used in a level
    elements.targetAnimals          = [];       // Array of targets to be used in a level
    elements.currentTargetAnimal    = {};       // Current target, will be a JSON object
    elements.wrongAnimalCounter     = 0;        // Counter used for boredom prevention
    elements.targetHit              = false;

    elements.level                  = 1;        // Level counter
    elements.targetShots            = 0;        // Exposures needed in a level
    elements.shots                  = 0;        // Shot counter
    elements.errors                 = 0;        // Error counter

    elements.gameRunning            = false;
    elements.beepPlaying            = false;
    elements.playSound              = true;

    return elements;

});