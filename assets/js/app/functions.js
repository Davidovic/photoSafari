/**
 * All functions used in the game are collected here.
 */
define(['jquery',
        'snapsvg',
        'elements'],
    function ($, Snap, elements) {

        var functions = {

            /**
             * Get overlay texts from a JSON file
             */
            getOverlayTexts: function () {
                $.ajax({
                    url: "assets/json/overlayTexts.json",
                    dataType: 'json',
                    success: function (json) {
                        elements.overlayTexts = json;
                    },
                    async: false
                });
            },


            /**
             * Set overlay texts depending on the current situation
             * Currently available: start / nextLevel / gameFinished / gameOver
             */
            setOverlay: function (action) {

                // Set overlay text based on the current action
                elements.overlayHeadline.text(elements.overlayTexts[action]["headline"]);
                elements.overlayText.text(elements.overlayTexts[action]["text"]);
                elements.overlayButton.text(elements.overlayTexts[action]["buttonText"]);

                // Show the cursor, because it was hidden during the game
                $("#svg").css("cursor", "auto");

                // Show the overlay
                elements.overlay.fadeIn( "slow");

                // Hide the viewfinder
                elements.viewfinderContainer.attr({"visibility": "hidden"});

                // While overlay is visible, the game is not running
                elements.gameRunning = false;

            },


            /**
             * Draw landscape: sky, grass, sun, trees
             */
            drawLandscape: function () {

                // Draw the sky with a glow for the sun
                var glow = elements.svg.paper.circle(500, 80, 700);
                var gradient = elements.svg.paper.gradient("r(0.5, 0.5, 0.2)#FFFF71-#CDEAF8:50");
                glow.attr({fill: gradient});
                elements.backgroundContainer.append(glow);

                // Draw the sun itself
                var sun = elements.svg.paper.circle(500, 80, 40).attr({fill: "#FFFF71", "fill-opacity": 0.5});
                elements.backgroundContainer.append(sun);

                // Load tree SVG and add it to the background
                Snap.load("assets/svg/landscape/acacia1.svg", function (file) {
                    var acacia1 = file.select("#acacia1");
                    var t = Snap.matrix().translate(-50, 180).scale(2.5);
                    acacia1.transform(t);
                    elements.backgroundContainer.append(acacia1);
                });

                // Load another tree and add it to the background
                Snap.load("assets/svg/landscape/acacia2.svg", function (file) {
                    var acacia2 = file.select("#acacia2");
                    var t = Snap.matrix().translate(550, 250).scale(0.7);
                    acacia2.transform(t);
                    elements.backgroundContainer.append(acacia2);
                });

                // Load grass SVG and create three grass elements
                Snap.load("assets/svg/landscape/grass.svg", function (file) {
                    var grass = file.select("path");

                    // Add grass to the background
                    var grass1 = grass.clone().attr({'fill': '#D0D887'});
                    var t1 = Snap.matrix().translate(0, 300).scale(1.3);
                    grass1.transform(t1);
                    elements.backgroundContainer.append(grass1);

                    // Create shadow for the foreground grass layers
                    var shadow = elements.svg.filter(Snap.filter.shadow(0, 0, 5, 0.4));

                    // Add grass to the foreground
                    var grass2 = grass.clone().attr({'fill': '#B6CF4D', filter: shadow});
                    var t2 = Snap.matrix().translate(-240, 310).scale(1.8);
                    grass2.transform(t2);
                    elements.foregroundContainer.append(grass2);

                    // Add more grass to the foreground
                    var grass3 = grass.clone().attr({'fill': '#94C11F', filter: shadow});
                    var t3 = Snap.matrix().translate(-50, 330).scale(2.1);
                    grass3.transform(t3);
                    elements.foregroundContainer.append(grass3);

                    // Prevent mouse events on the foreground elements
                    $("#foreground").css("pointer-events", "none");
                });

                // Apply slightly different shadow to the animals layer
                var shadow = elements.svg.filter(Snap.filter.shadow(0, 5, 5, 0.2));
                elements.animalContainer.attr({filter: shadow});
            },


            /**
             * Draw the viewfinder with Snap.svg
             */
            drawViewfinder: function () {

                // Draw framing lines and focus point in the viewfinder
                var viewfinder = elements.viewfinderContainer.group(

                    // Outer rectangle
                    elements.viewfinderContainer.rect(0, 0, 150, 100),

                    // Left upper framing corner
                    elements.viewfinderContainer.paper.line(35, 25, 45, 25),
                    elements.viewfinderContainer.paper.line(35, 25, 35, 35),
                    // Left lower framing corner
                    elements.viewfinderContainer.paper.line(35, 65, 35, 75),
                    elements.viewfinderContainer.paper.line(35, 75, 45, 75),
                    // Right upper framing corner
                    elements.viewfinderContainer.paper.line(115, 25, 105, 25),
                    elements.viewfinderContainer.paper.line(115, 25, 115, 35),
                    // Right lower framing corner
                    elements.viewfinderContainer.paper.line(115, 75, 105, 75),
                    elements.viewfinderContainer.paper.line(115, 75, 115, 65),

                    // Focus point
                    elements.viewfinderContainer.paper.circle(75, 50, 6),
                    elements.viewfinderContainer.paper.line(75, 40, 75, 60),
                    elements.viewfinderContainer.paper.line(65, 50, 85, 50)
                );

                viewfinder.attr({
                    fill: "none",
                    stroke: "#000",
                    strokeWidth: 0.7,
                    strokeLinecap: "square"
                });

                // Hide the viewfinder until the game is started
                elements.viewfinderContainer.attr({"visibility": "hidden"});

                elements.viewfinderContainer.append(viewfinder);

            },


            /**
             * Get the animals from a JSON file and load the SVG files
             */
            getAnimals: function () {

                // Get animal data from JSON file
                $.ajax({
                    url: "assets/json/animals.json",
                    dataType: 'json',
                    success: function (json) {
                        elements.animals = json;
                    },
                    async: false
                });

                // Get SVG from the referenced file and store it directly in the JSON elements.
                elements.animals.forEach(function (animal) {

                    Snap.load(animal.path, function (file) {

                        var thisAnimal = elements.animals.filter(function (currAnimal) {
                            return currAnimal.name == animal.name;
                        })[0];

                        thisAnimal.animalSvg = file.select("#" + animal.name);
                    });
                });
            },


            /**
             * Load sounds using SoundJS (CreateJS)
             */
            loadSounds: function() {
                var audioPath = "assets/audio/";
                var sounds = [
                    {id:"music", src:"music.ogg"},
                    {id:"beep", src:"beep.ogg"},
                    {id:"shutter", src:"shutter.ogg"},
                    {id:"elephant", src:"elephant.ogg"}
                ];

                // If ogg can't be played, play mp3
                createjs.Sound.alternateExtensions = ["mp3"];

                createjs.Sound.registerSounds(sounds, audioPath);
                createjs.Sound.addEventListener("fileload", handleLoad);

                // Play music as soon as it's loaded
                function handleLoad(event) {
                    if(event.src.includes("music")) {
                        var ppc = new createjs.PlayPropsConfig().set({loop: -1, volume: 1.0});
                        createjs.Sound.play(event.src, ppc);
                    }
                }
            },


            /**
             * Set several click/mouseover event handlers
             */
            setEventHandlers: function () {

                // Set event handler on the overlay button
                elements.overlayButton.click(function () {
                    functions.initLevel();
                });

                // When hovering over the animal
                elements.animalContainer.mouseover(function () {

                    // Show focus indicator
                    elements.focus.css("visibility", "visible");

                    // Play beep sound
                    if(elements.playSound && !elements.beepPlaying) {

                        elements.beepPlaying = true;

                        var ppc = new createjs.PlayPropsConfig().set({volume: 0.05});
                        createjs.Sound.play("beep", ppc);

                        // Prevent repeating the beep too soon
                        setTimeout(function() {
                            elements.beepPlaying = false
                        }, 500);
                    }
                });

                // Remove the focus indicator when hovering over the background
                elements.backgroundContainer.mouseover(function () {
                    elements.focus.css("visibility", "hidden");
                });

                // Set event handler to update the position of the viewfinder
                elements.svg.mousemove(function (event) {

                    // Viewfinder center is placed at the cursor position
                    var mouseX = event.pageX - elements.offset.left - 82;
                    var mouseY = event.pageY - elements.offset.top - 58;

                    var t = Snap.matrix().translate(mouseX, mouseY);
                    elements.viewfinderContainer.transform(t);

                    if (elements.gameRunning) {
                        // Show the viewfinder
                        elements.viewfinderContainer.attr({"visibility": "visible"});
                    }
                });

                // When any svg element other than an animal is clicked, register a miss.
                elements.svg.click(function () {
                    if (elements.gameRunning) {
                        functions.registerMiss();
                    }
                });

                // When an animal is clicked, check if it's the target animal
                elements.animalContainer.click(function () {

                    if(elements.animalContainer.data("animal") == elements.currentTargetAnimal.name) {
                        functions.registerHit();
                    } else {
                        functions.registerMiss();
                    }
                    event.stopPropagation();

                });

                // Toggle sound
                elements.soundButton.click(function() {

                    if(!elements.playSound) {
                        elements.playSound = true;
                        elements.soundButton.addClass("enabled");
                        var ppc = new createjs.PlayPropsConfig().set({loop: -1, volume: 1.0});
                        createjs.Sound.play("music", ppc);

                    } else {
                        elements.playSound = false;
                        elements.soundButton.removeClass("enabled");
                        createjs.Sound.stop("music");
                    }
                })
            },


            /**
             * Initialize a level
             */
            initLevel: function () {

                // Reset the levelAnimals and targetAnimals arrays
                elements.levelAnimals.length = 0;
                elements.targetAnimals.length = 0;

                // Clone the animals to tempAnimals
                var tempAnimals = elements.animals.slice(0);

                // Fill the levelAnimals array with random animals. Higher levels --> more animals
                for (var i = 0; i < elements.level; i++) {

                    // Select random animals from the ones remaining in tempAnimals
                    var random = Math.floor(Math.random() * tempAnimals.length);

                    // Push this animal in the levelAnimals array
                    elements.levelAnimals.push(tempAnimals[random]);

                    // Remove the animal from the tempAnimals array
                    tempAnimals.remove(random);

                }

                // Clone the levelAnimals to the targetAnimals
                elements.targetAnimals = elements.levelAnimals.slice(0);

                // Reset some level variables
                elements.targetShots = elements.level; // Higher level --> more shots needed
                elements.shots = 0;
                elements.errors = 0;
                elements.errorCounter.text(elements.errors + "/3");

                // Hide the cursor
                $("#svg").css("cursor", "none");

                // Hide the overlay
                elements.overlay.fadeOut( "slow");

                // Start playing level
                elements.gameRunning = true;
                functions.playLevel(true);

            },


            /**
             * Play the level
             */
            playLevel: function (levelStart) {

                // When no animal is currently present, show an animal
                if (!elements.animalVisible && elements.errors < 3 && elements.shots < elements.targetShots) {

                    elements.animalVisible = true; // Prevents other animals from showing up

                    // Select the next targetAnimal from the targetAnimals array when necessary
                    if (levelStart || elements.targetHit) {
                        elements.currentTargetAnimal = elements.targetAnimals.pop();
                        elements.targetHit = false;
                    }

                    // Update info in the status bar
                    elements.levelCounter.text(elements.level + "/9");
                    elements.shotCounter.text(elements.shots + "/" + elements.level);
                    elements.targetAnimalName.text(elements.currentTargetAnimal.name);

                    // Set animation speeds depending on level
                    var appearanceSpeed = 1000 - elements.level * 100;
                    var stayDuration = 1500 - elements.level * 70;

                    // Select a random animal from the levelAnimals.
                    var animalJson = elements.levelAnimals[Math.floor(Math.random() * elements.level)];

                    // Boredom prevention: if any "wrong" animal is shown three times in a row, show the right one.
                    if (animalJson.name != elements.currentTargetAnimal.name) {
                        elements.wrongAnimalCounter++;

                        if (elements.wrongAnimalCounter > 3) {

                            animalJson = elements.animals.filter(function (animal) {
                                return animal.name == elements.currentTargetAnimal.name;
                            })[0];

                            elements.wrongAnimalCounter = 0;
                        }
                    }

                    // Position and show the animal after a random timeout (getting faster at higher levels)
                    setTimeout(function () {

                        var animalSvg = animalJson.animalSvg;

                        // Calculate position of the animal. X is random, Y depends on the animal.
                        var xPosition = Math.floor(Math.random() * (630 - animalJson.width));
                        var yPosition = 400 - animalJson.translateY;

                        // Position the animal while still hidden below the grass
                        var t = Snap.matrix().translate(xPosition, 400).scale(animalJson.scale);
                        animalSvg.transform(t);

                        // Make the animal appear above the grass.
                        animalSvg.animate({
                            transform: 't' + xPosition + ' ' + yPosition + ' s' + animalJson.scale
                        }, appearanceSpeed, mina.easeinout, function () {

                            setTimeout(function () {

                                // Make the animal disappear. This speed increases at higher levels
                                animalSvg.animate({transform: t}, appearanceSpeed, mina.easeinout, function () {

                                    // At the end of the animation, remove the svg element
                                    animalSvg.remove();
                                    elements.animalVisible = false;

                                    // Continue playing the level
                                    functions.playLevel();
                                });

                                // Hide the focus indicator
                                elements.focus.css("visibility", "hidden");

                            }, stayDuration);
                        });

                        // Set data on the animalContainer, needed for the click event handler
                        elements.animalContainer.data("animal", animalJson.name);

                        elements.animalContainer.append(animalSvg);

                        // Show animalContainer in case it was invisible
                        elements.animalContainer.attr({"visibility": "visible"});

                    }, Math.random() * (5000 - elements.level * 450));
                }
            },


            /**
             * Register a hit
             */
            registerHit: function() {

                if (!elements.targetHit) {

                    elements.targetHit = true;
                    elements.wrongAnimalCounter = 0;

                    functions.closeShutter();
                    elements.shots++;
                    elements.shotCounter.text(elements.shots + "/" + elements.level);

                    // If the level is completed
                    if(elements.shots == elements.targetShots) {
                        functions.levelFinished("nextLevel");
                    }
                }
            },


            /**
             * Register a miss (error)
             */
            registerMiss: function() {

                functions.closeShutter();

                elements.errors++;
                elements.errorCounter.text(elements.errors + "/3");

                if (elements.errors == 3) {
                    functions.levelFinished("gameOver");
                }
            },


            /**
             * Play shutter sound and show short black flash
             */
            closeShutter: function() {

                // Show short black flash
                elements.shutter.css("visibility", "visible");
                setTimeout(function() {
                    elements.shutter.css("visibility", "hidden");
                }, 30);

                // Play shutter sound
                if (elements.playSound) {
                    var ppc = new createjs.PlayPropsConfig().set({loop: 0, volume: 1.0});
                    createjs.Sound.play("shutter", ppc);
                }
            },


            /**
             * Update/Reset game variables when level is finished
             */
            levelFinished: function(action) {

                // Update the status bar
                elements.animalContainer.attr({"visibility": "hidden"});
                elements.focus.css("visibility", "hidden");
                elements.targetAnimalName.text("_");

                // Increment level
                if (action == "nextLevel") {

                    // If the highest level is now completed, the game is finished
                    if (elements.level == 9) {
                        elements.level = 1;
                        action = "gameFinished";

                    } else {
                        // Otherwise increment level
                        elements.level++;
                    }

                } else if (action == "gameOver") {
                    elements.level = 1;

                    // Play sound
                    var ppc = new createjs.PlayPropsConfig().set({loop: 0, volume: 0.2});
                    createjs.Sound.play("elephant", ppc);
                }

                // Show the overlay for the current action
                functions.setOverlay(action);

            }
        };

        return functions;
    })
;