/* =========================================================
   JACKSON QUISSSSPE
   MOTOR DEL JUEGO - NIVEL 1: ZAMORA
========================================================= */

(() => {
    "use strict";

    /* =====================================================
       ELEMENTOS HTML
    ===================================================== */

    const canvas = document.getElementById("gameCanvas");
    const gameScreen = document.getElementById("gameScreen");
    const levelScreen = document.getElementById("nextScreen");
    const pausePanel = document.getElementById("pausePanel");

    if (!canvas || !gameScreen) {
        console.warn("No se encontró el Canvas del juego.");
        return;
    }

    const ctx = canvas.getContext("2d");

    const hudHearts = document.getElementById("hudHearts");
    const hudCoins = document.getElementById("hudCoins");
    const hudSoles = document.getElementById("hudSoles");
    const hudTimer = document.getElementById("hudTimer");
    const gameMessage = document.getElementById("gameMessage");
        const lifeWarning =
        document.getElementById("lifeWarning");

    const lifeWarningSound =
        document.getElementById("lifeWarningSound");

    let lifeWarningTimeout = null;
    const pauseButton = document.getElementById("pauseButton");
    const continueButton = document.getElementById("continueGameButton");
    const restartButton = document.getElementById("restartLevelButton");
    const exitButton = document.getElementById("exitLevelButton");
    const musicButton = document.getElementById("gameMusicButton");
    const backgroundMusic = document.getElementById("backgroundMusic");

    /* =====================================================
       CONFIGURACIÓN GENERAL
    ===================================================== */

    const VIEW_HEIGHT = 720;
    const WORLD_WIDTH = 6500;
    const GRAVITY = 2200;

    let viewWidth = 1280;
    let viewHeight = VIEW_HEIGHT;
    let verticalOffset = 0;
    let gameState = "menu";
    let lastTime = 0;
    let levelTime = 0;
    let worldTime = 0;
    let coinsCollected = 0;
    let lives = 3;
    let messageTimer = 0;
    let resultPanel = null;

    const camera = {
        x: 0
    };

    /* =====================================================
       IMAGEN DEL PERSONAJE
    ===================================================== */

    const playerImage = new Image();
    let playerImageLoaded = false;

    playerImage.src = "assets/sprites/personaje.png";

    playerImage.addEventListener("load", () => {
        playerImageLoaded = true;
    });

    playerImage.addEventListener("error", () => {
        console.warn(
            "No se encontró assets/sprites/personaje.png. " +
            "Se utilizará un personaje dibujado con Canvas."
        );
    });
    /* Imagen personalizada de las monedas */

    const coinImage = new Image();
    let coinImageLoaded = false;

    coinImage.src = "assets/sprites/moneda.png";

    coinImage.addEventListener("load", () => {
        coinImageLoaded = true;
    });

    coinImage.addEventListener("error", () => {
        console.warn(
            "No se encontró assets/sprites/moneda.png. " +
            "Se utilizará la moneda dibujada con Canvas."
        );
    });
    /* =====================================================
       CONTROLES
    ===================================================== */

    const controls = {
        left: false,
        right: false,
        down: false,
        run: false,
        jump: false,
        jumpPressed: false
    };

    /* =====================================================
       JUGADOR
    ===================================================== */

    const player = {
        x: 120,
        y: 500,
        previousY: 500,

        width: 58,
        height: 88,

        velocityX: 0,
        velocityY: 0,

        direction: 1,
        onGround: false,
        standingPlatform: null,

        coyoteTime: 0,
        jumpBuffer: 0,

        invulnerable: 0,
        state: "idle",

        checkpointX: 120,
        checkpointY: 500
    };

    /* =====================================================
       OBJETOS DEL NIVEL
    ===================================================== */

    let platforms = [];
    let coins = [];
    let enemies = [];
    let spikes = [];
    let particles = [];
    let checkpoints = [];
    let tutorialSigns = [];

    const goal = {
        x: 6210,
        y: 430,
        width: 100,
        height: 190
    };

    /* =====================================================
       CREACIÓN DEL NIVEL 1: ZAMORA
    ===================================================== */

    function createLevelOne() {
        platforms = [
            createPlatform(0, 620, 880, 120, "ground"),
            createPlatform(1030, 620, 770, 120, "ground"),
            createPlatform(1950, 620, 950, 120, "ground"),
            createPlatform(3080, 620, 850, 120, "ground"),
            createPlatform(4080, 620, 900, 120, "ground"),
            createPlatform(5140, 620, 1360, 120, "ground"),

            createPlatform(470, 495, 190, 30, "stone"),
            createPlatform(760, 420, 155, 30, "stone"),

            createPlatform(1130, 510, 170, 28, "wood"),
            createPlatform(1390, 440, 170, 28, "wood"),
            createPlatform(1630, 520, 120, 28, "stone"),

            createPlatform(2070, 500, 170, 30, "stone"),
            createPlatform(2340, 420, 180, 30, "stone"),
            createPlatform(2630, 500, 170, 30, "stone"),

            createMovingPlatform(
                2900,
                520,
                150,
                26,
                120,
                0,
                1.3
            ),

            createPlatform(3210, 490, 180, 30, "stone"),
            createPlatform(3500, 410, 190, 30, "stone"),
            createPlatform(3760, 500, 120, 30, "wood"),

            createPlatform(4210, 500, 150, 30, "stone"),
            createMovingPlatform(
                4470,
                445,
                165,
                27,
                0,
                90,
                1.6
            ),
            createPlatform(4720, 520, 160, 30, "stone"),

            createPlatform(5250, 500, 160, 30, "stone"),
            createPlatform(5500, 420, 170, 30, "stone"),
            createPlatform(5770, 500, 160, 30, "stone"),

            createBlock(330, 440),
            createBlock(385, 440),
            createBlock(440, 440),

            createBlock(1180, 365),
            createBlock(1235, 365),

            createBlock(2170, 350),
            createBlock(2225, 350),

            createBlock(4290, 350),
            createBlock(4345, 350)
        ];

        coins = [
            createCoin(240, 545),
            createCoin(310, 545),
            createCoin(380, 545),

            createCoin(520, 440),
            createCoin(585, 440),
            createCoin(825, 365),

            createCoin(920, 520),
            createCoin(1080, 545),
            createCoin(1180, 455),
            createCoin(1260, 455),
            createCoin(1440, 385),
            createCoin(1510, 385),
            createCoin(1700, 465),

            createCoin(2040, 545),
            createCoin(2130, 445),
            createCoin(2210, 445),
            createCoin(2395, 365),
            createCoin(2470, 365),
            createCoin(2690, 445),
            createCoin(2790, 545),

            createCoin(2980, 460),
            createCoin(3160, 545),
            createCoin(3280, 435),
            createCoin(3350, 435),
            createCoin(3560, 355),
            createCoin(3630, 355),
            createCoin(3820, 445),

            createCoin(4160, 545),
            createCoin(4270, 445),
            createCoin(4530, 370),
            createCoin(4790, 465),
            createCoin(4910, 545),

            createCoin(5200, 545),
            createCoin(5310, 445),
            createCoin(5570, 365),
            createCoin(5640, 365),
            createCoin(5830, 445),
            createCoin(5990, 545),
            createCoin(6100, 545)
        ];

        enemies = [
            createEnemy(690, 568, 580, 820, 65),
            createEnemy(1260, 568, 1090, 1600, 75),
            createEnemy(1730, 568, 1590, 1780, 70),

            createEnemy(2140, 568, 2010, 2280, 85),
            createEnemy(2720, 568, 2570, 2860, 90),

            createEnemy(3300, 568, 3140, 3470, 85),
            createEnemy(3710, 568, 3650, 3900, 95),

            createEnemy(4210, 568, 4130, 4430, 100),
            createEnemy(4760, 568, 4640, 4930, 100),

            createEnemy(5360, 568, 5200, 5480, 105),
            createEnemy(5900, 568, 5740, 6120, 110)
        ];

        spikes = [
            createSpike(1500, 592, 75),
            createSpike(2510, 592, 80),
            createSpike(3410, 592, 80),
            createSpike(4620, 592, 80),
            createSpike(5660, 592, 80)
        ];

        checkpoints = [
            {
                x: 3160,
                y: 470,
                active: false
            }
        ];

        tutorialSigns = [
            {
                x: 170,
                y: 530,
                text: "A / D para caminar"
            },
            {
                x: 700,
                y: 530,
                text: "ESPACIO para saltar"
            },
            {
                x: 1310,
                y: 530,
                text: "SHIFT para correr"
            },
            {
                x: 2040,
                y: 530,
                text: "Salta sobre los enemigos"
            }
        ];

        particles = [];
    }

    function createPlatform(x, y, width, height, type) {
        return {
            x,
            y,
            width,
            height,
            type,
            moving: false,
            deltaX: 0,
            deltaY: 0,
            used: false
        };
    }

    function createMovingPlatform(
        x,
        y,
        width,
        height,
        rangeX,
        rangeY,
        speed
    ) {
        return {
            x,
            y,
            startX: x,
            startY: y,
            width,
            height,
            type: "wood",
            moving: true,
            rangeX,
            rangeY,
            speed,
            deltaX: 0,
            deltaY: 0,
            used: false
        };
    }

    function createBlock(x, y) {
        return {
            x,
            y,
            width: 52,
            height: 52,
            type: "block",
            moving: false,
            deltaX: 0,
            deltaY: 0,
            used: false
        };
    }

    function createCoin(x, y) {
        return {
            x,
            y,
            radius: 15,
            collected: false,
            animation: Math.random() * Math.PI * 2
        };
    }

    function createEnemy(x, y, minimumX, maximumX, speed) {
        return {
            x,
            y,
            width: 52,
            height: 52,
            minimumX,
            maximumX,
            speed,
            direction: Math.random() > 0.5 ? 1 : -1,
            defeated: false,
            disappearTime: 0
        };
    }

    function createSpike(x, y, width) {
        return {
            x,
            y,
            width,
            height: 28
        };
    }

    /* =====================================================
       COMENZAR EL NIVEL
    ===================================================== */

    function startLevel(levelNumber = 1) {
            /* =====================================================
       PANTALLA COMPLETA EN TELÉFONOS
    ===================================================== */

    async function enterFullscreenLandscape() {
        const isTouchDevice =
            window.matchMedia("(pointer: coarse)").matches;

        if (!isTouchDevice) {
            return;
        }

        const page = document.documentElement;

        try {
            if (!document.fullscreenElement) {
                if (page.requestFullscreen) {
                    await page.requestFullscreen({
                        navigationUI: "hide"
                    });
                } else if (page.webkitRequestFullscreen) {
                    await page.webkitRequestFullscreen();
                }
            }
        } catch (error) {
            console.log(
                "El navegador no permitió la pantalla completa."
            );
        }

        try {
            if (
                screen.orientation &&
                typeof screen.orientation.lock === "function"
            ) {
                await screen.orientation.lock("landscape");
            }
        } catch (error) {
            console.log(
                "La orientación deberá cambiarse manualmente."
            );
        }
    }
        if (Number(levelNumber) !== 1) {
            return;
        }
        enterFullscreenLandscape();
        createLevelOne();
        resizeCanvas();
        resetPlayer();

        levelTime = 0;
        worldTime = 0;
        coinsCollected = 0;
        lives = 3;
        camera.x = 0;
        gameState = "playing";

        closeResultPanel();
        pausePanel?.classList.remove("visible");

        levelScreen?.classList.remove("active");
        gameScreen.classList.add("active");

        updateHUD();
        showMessage("Usa A y D o las flechas para caminar", 4);

        if (backgroundMusic) {
            backgroundMusic.volume = 0.25;

            backgroundMusic.play().catch(() => {
                console.log(
                    "La música comenzará cuando el navegador lo permita."
                );
            });
        }

        lastTime = performance.now();
    }

    window.startLevel = startLevel;

    function resetPlayer() {
        player.x = 120;
        player.y = 500;
        player.previousY = 500;

        player.velocityX = 0;
        player.velocityY = 0;

        player.direction = 1;
        player.onGround = false;
        player.standingPlatform = null;

        player.coyoteTime = 0;
        player.jumpBuffer = 0;

        player.invulnerable = 0;
        player.state = "idle";

        player.checkpointX = 120;
        player.checkpointY = 500;
    }

    /* =====================================================
       ACTUALIZACIÓN DEL JUEGO
    ===================================================== */

    function update(deltaTime) {
        worldTime += deltaTime;
        levelTime += deltaTime;

        updatePlatforms();
        updatePlayer(deltaTime);
        updateEnemies(deltaTime);
        updateCoins(deltaTime);
        updateCheckpoints();
        updateParticles(deltaTime);
        updateCamera(deltaTime);
        updateMessages(deltaTime);
        checkDangerZones();

        updateHUD();
    }

    function updatePlatforms() {
        platforms.forEach((platform) => {
            platform.deltaX = 0;
            platform.deltaY = 0;

            if (!platform.moving) {
                return;
            }

            const previousX = platform.x;
            const previousY = platform.y;
            const movement = Math.sin(worldTime * platform.speed);

            platform.x =
                platform.startX + movement * platform.rangeX;

            platform.y =
                platform.startY + movement * platform.rangeY;

            platform.deltaX = platform.x - previousX;
            platform.deltaY = platform.y - previousY;
        });
    }

    function updatePlayer(deltaTime) {
        player.previousY = player.y;

        if (player.invulnerable > 0) {
            player.invulnerable -= deltaTime;
        }

        if (
            player.onGround &&
            player.standingPlatform?.moving
        ) {
            player.x += player.standingPlatform.deltaX;
            player.y += player.standingPlatform.deltaY;
        }

        const horizontalDirection =
            Number(controls.right) - Number(controls.left);

        const running = controls.run;
        const crouching = controls.down && player.onGround;

        const maximumSpeed = running ? 520 : 320;
        const acceleration = player.onGround ? 1900 : 1150;
        const deceleration = player.onGround ? 2300 : 600;

        let targetSpeed =
            horizontalDirection * maximumSpeed;

        if (crouching) {
            targetSpeed *= 0.2;
        }

        if (horizontalDirection !== 0) {
            player.velocityX = moveTowards(
                player.velocityX,
                targetSpeed,
                acceleration * deltaTime
            );

            player.direction = horizontalDirection;
        } else {
            player.velocityX = moveTowards(
                player.velocityX,
                0,
                deceleration * deltaTime
            );
        }

        if (player.onGround) {
            player.coyoteTime = 0.12;
        } else {
            player.coyoteTime -= deltaTime;
        }

        if (controls.jumpPressed) {
            player.jumpBuffer = 0.14;
            controls.jumpPressed = false;
        } else {
            player.jumpBuffer -= deltaTime;
        }

        if (
            player.jumpBuffer > 0 &&
            player.coyoteTime > 0 &&
            !crouching
        ) {
            player.velocityY = running ? -900 : -840;
            player.onGround = false;
            player.coyoteTime = 0;
            player.jumpBuffer = 0;

            playSound("jump");
            createDust(player.x + player.width / 2, player.y + player.height);
        }

        if (
            !controls.jump &&
            player.velocityY < -250
        ) {
            player.velocityY += GRAVITY * 1.7 * deltaTime;
        } else {
            player.velocityY += GRAVITY * deltaTime;
        }

        player.velocityY = Math.min(player.velocityY, 1200);

        movePlayerHorizontally(deltaTime);
        movePlayerVertically(deltaTime);

        if (crouching) {
            player.state = "crouching";
        } else if (!player.onGround) {
            player.state =
                player.velocityY < 0 ? "jumping" : "falling";
        } else if (Math.abs(player.velocityX) > 400) {
            player.state = "running";
        } else if (Math.abs(player.velocityX) > 30) {
            player.state = "walking";
        } else {
            player.state = "idle";
        }

        player.x = Math.max(0, player.x);
    }

    function movePlayerHorizontally(deltaTime) {
        player.x += player.velocityX * deltaTime;

        platforms.forEach((platform) => {
            if (!rectanglesCollide(player, platform)) {
                return;
            }

            if (player.velocityX > 0) {
                player.x = platform.x - player.width;
            } else if (player.velocityX < 0) {
                player.x = platform.x + platform.width;
            }

            player.velocityX = 0;
        });
    }

    function movePlayerVertically(deltaTime) {
        const previousTop = player.y;
        const previousBottom = player.y + player.height;

        player.y += player.velocityY * deltaTime;
        player.onGround = false;
        player.standingPlatform = null;

        platforms.forEach((platform) => {
            const overlapsHorizontally =
                player.x + player.width > platform.x + 4 &&
                player.x < platform.x + platform.width - 4;

            if (!overlapsHorizontally) {
                return;
            }

            const playerBottom = player.y + player.height;
            const platformBottom =
                platform.y + platform.height;

            if (
                player.velocityY >= 0 &&
                previousBottom <= platform.y + 16 &&
                playerBottom >= platform.y
            ) {
                player.y = platform.y - player.height;
                player.velocityY = 0;
                player.onGround = true;
                player.standingPlatform = platform;
            } else if (
                player.velocityY < 0 &&
                previousTop >= platformBottom - 14 &&
                player.y <= platformBottom
            ) {
                player.y = platformBottom;
                player.velocityY = 40;

                if (platform.type === "block") {
                    activateBlock(platform);
                }
            }
        });
    }

    function activateBlock(block) {
        if (block.used) {
            return;
        }

        block.used = true;
        coinsCollected += 1;

        createCoinParticles(
            block.x + block.width / 2,
            block.y
        );

        playSound("coin");
        showMessage("¡Encontraste una moneda!", 2);
    }

    /* =====================================================
       MONEDAS
    ===================================================== */

    function updateCoins(deltaTime) {
        coins.forEach((coin) => {
            coin.animation += deltaTime * 1.8;

            if (
                !coin.collected &&
                circleTouchesPlayer(coin)
            ) {
                coin.collected = true;
                coinsCollected += 1;

                createCoinParticles(coin.x, coin.y);
                playSound("coin");
            }
        });
    }

    /* =====================================================
       ENEMIGOS
    ===================================================== */

    function updateEnemies(deltaTime) {
        enemies.forEach((enemy) => {
            if (enemy.defeated) {
                enemy.disappearTime += deltaTime;
                return;
            }

            enemy.x +=
                enemy.speed *
                enemy.direction *
                deltaTime;

            if (enemy.x <= enemy.minimumX) {
                enemy.x = enemy.minimumX;
                enemy.direction = 1;
            }

            if (
                enemy.x + enemy.width >=
                enemy.maximumX
            ) {
                enemy.x =
                    enemy.maximumX - enemy.width;

                enemy.direction = -1;
            }

            if (!rectanglesCollide(player, enemy)) {
                return;
            }

            const previousPlayerBottom =
                player.previousY + player.height;

            if (
                player.velocityY > 100 &&
                previousPlayerBottom <= enemy.y + 20
            ) {
                enemy.defeated = true;
                player.velocityY = -620;

                createEnemyParticles(
                    enemy.x + enemy.width / 2,
                    enemy.y + enemy.height / 2
                );

                playSound("enemy");
            } else {
                damagePlayer(enemy.x, false);
            }
        });
    }

    /* =====================================================
       CHECKPOINT
    ===================================================== */

    function updateCheckpoints() {
        checkpoints.forEach((checkpoint) => {
            const distance =
                Math.abs(
                    player.x +
                    player.width / 2 -
                    checkpoint.x
                );

            if (!checkpoint.active && distance < 55) {
                checkpoint.active = true;

                player.checkpointX =
                    checkpoint.x - player.width / 2;

                player.checkpointY = 500;

                showMessage("¡Checkpoint guardado!", 3);
                playSound("checkpoint");

                createCelebrationParticles(
                    checkpoint.x,
                    checkpoint.y
                );
            }
        });
    }

    /* =====================================================
       DAÑO Y PELIGROS
    ===================================================== */
    function showLastLifeWarning() {
        if (!lifeWarning) {
            return;
        }

        clearTimeout(lifeWarningTimeout);

        lifeWarning.classList.remove("visible");

        /* Reinicia la animación */
        void lifeWarning.offsetWidth;

        lifeWarning.classList.add("visible");

        if (lifeWarningSound) {
            lifeWarningSound.pause();
            lifeWarningSound.currentTime = 0;
            lifeWarningSound.volume = 0.85;

            lifeWarningSound.play().catch(() => {
                console.log(
                    "El navegador no pudo reproducir la alerta."
                );
            });
        }

        lifeWarningTimeout = setTimeout(() => {
            lifeWarning.classList.remove("visible");
        }, 3000);
    }
    function checkDangerZones() {
        spikes.forEach((spike) => {
            if (
                player.invulnerable <= 0 &&
                rectanglesCollide(player, spike)
            ) {
                damagePlayer(spike.x, true);
            }
        });

        if (player.y > 820) {
            damagePlayer(player.x, true);
        }

        if (
            player.x + player.width > goal.x &&
            player.x < goal.x + goal.width &&
            player.y + player.height > goal.y
        ) {
            completeLevelOne();
        }
    }

    function damagePlayer(sourceX, respawnImmediately) {
        if (
            player.invulnerable > 0 ||
            gameState !== "playing"
        ) {
            return;
        }

            lives -= 1;
        player.invulnerable = 1.8;

        if (lives === 1) {
            showLastLifeWarning();
        }

        playSound("damage");
        updateHUD();

        if (lives <= 0) {
            showGameOver();
            return;
        }

        if (respawnImmediately) {
            respawnPlayer();
        } else {
            player.velocityX =
                player.x < sourceX ? -480 : 480;

            player.velocityY = -560;
        }
    }

    function respawnPlayer() {
        player.x = player.checkpointX;
        player.y = player.checkpointY;

        player.velocityX = 0;
        player.velocityY = 0;

        camera.x = Math.max(
            0,
            player.x - viewWidth * 0.3
        );

        showMessage("¡Ten más cuidado!", 2);
    }

    /* =====================================================
       CÁMARA
    ===================================================== */

    function updateCamera(deltaTime) {
        const desiredX = clamp(
            player.x - viewWidth * 0.34,
            0,
            Math.max(0, WORLD_WIDTH - viewWidth)
        );

        const smoothness =
            1 - Math.exp(-5 * deltaTime);

        camera.x +=
            (desiredX - camera.x) * smoothness;
    }

    /* =====================================================
       PARTÍCULAS
    ===================================================== */

    function createParticle(
        x,
        y,
        color,
        size,
        velocityX,
        velocityY,
        duration
    ) {
        particles.push({
            x,
            y,
            color,
            size,
            velocityX,
            velocityY,
            duration,
            maximumDuration: duration
        });
    }

    function createCoinParticles(x, y) {
        for (let i = 0; i < 12; i += 1) {
            createParticle(
                x,
                y,
                i % 2 === 0 ? "#ffd83d" : "#fff6a1",
                4 + Math.random() * 5,
                (Math.random() - 0.5) * 260,
                -100 - Math.random() * 300,
                0.7 + Math.random() * 0.5
            );
        }
    }

    function createEnemyParticles(x, y) {
        for (let i = 0; i < 15; i += 1) {
            createParticle(
                x,
                y,
                i % 2 === 0 ? "#725238" : "#85c94a",
                5 + Math.random() * 6,
                (Math.random() - 0.5) * 330,
                -100 - Math.random() * 260,
                0.7 + Math.random() * 0.5
            );
        }
    }

    function createDust(x, y) {
        for (let i = 0; i < 7; i += 1) {
            createParticle(
                x,
                y,
                "#e7d8a6",
                5 + Math.random() * 5,
                (Math.random() - 0.5) * 170,
                -40 - Math.random() * 90,
                0.45
            );
        }
    }

    function createCelebrationParticles(x, y) {
        const colors = [
            "#ff4055",
            "#ffd83d",
            "#29d17d",
            "#35bfff",
            "#ffffff"
        ];

        for (let i = 0; i < 35; i += 1) {
            createParticle(
                x,
                y,
                colors[i % colors.length],
                5 + Math.random() * 7,
                (Math.random() - 0.5) * 500,
                -100 - Math.random() * 430,
                1.2 + Math.random()
            );
        }
    }

    function updateParticles(deltaTime) {
        particles.forEach((particle) => {
            particle.velocityY += 800 * deltaTime;
            particle.x += particle.velocityX * deltaTime;
            particle.y += particle.velocityY * deltaTime;
            particle.duration -= deltaTime;
        });

        particles = particles.filter(
            (particle) => particle.duration > 0
        );
    }

    /* =====================================================
       DIBUJADO DEL NIVEL
    ===================================================== */

    function draw() {
        const scaleX = canvas.width / viewWidth;
        const scaleY = canvas.height / viewHeight;

        ctx.setTransform(
            scaleX,
            0,
            0,
            scaleY,
            0,
            0
        );

        ctx.clearRect(
            0,
            0,
            viewWidth,
         viewHeight
        );

        drawBackground();

        ctx.save();
        ctx.translate(
        -camera.x,
        -verticalOffset
        );

        drawRiver();
        drawTutorialSigns();
        drawPlatforms();
        drawCoins();
        drawSpikes();
        drawCheckpoints();
        drawGoal();
        drawEnemies();
        drawPlayer();
        drawParticles();

        ctx.restore();
    }

    function drawBackground() {
        const sky = ctx.createLinearGradient(
            0,
            0,
            0,
            VIEW_HEIGHT
        );

        sky.addColorStop(0, "#2fc4f5");
        sky.addColorStop(0.56, "#a3ecff");
        sky.addColorStop(1, "#f0fcff");

        ctx.fillStyle = sky;
        ctx.fillRect(0, 0, viewWidth, VIEW_HEIGHT);

        drawSun();
        drawClouds();
        drawMountains(0.12, 350, "#4c9b7a");
        drawMountains(0.23, 430, "#34785f");
        drawMountains(0.36, 515, "#225b4c");
    }

    function drawSun() {
        const x = viewWidth - 150;
        const y = 135;

        const glow = ctx.createRadialGradient(
            x,
            y,
            15,
            x,
            y,
            95
        );

        glow.addColorStop(0, "rgba(255,247,155,1)");
        glow.addColorStop(1, "rgba(255,247,155,0)");

        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(x, y, 95, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "#ffe65c";
        ctx.beginPath();
        ctx.arc(x, y, 42, 0, Math.PI * 2);
        ctx.fill();
    }

    function drawClouds() {
        const cloudOffset =
            (camera.x * 0.08) % 520;

        for (let i = -1; i < 5; i += 1) {
            const x =
                i * 520 -
                cloudOffset +
                140;

            const y =
                110 + (i % 2) * 75;

            ctx.fillStyle =
                "rgba(255,255,255,0.82)";

            ctx.beginPath();
            ctx.arc(x, y, 34, 0, Math.PI * 2);
            ctx.arc(x + 38, y - 18, 45, 0, Math.PI * 2);
            ctx.arc(x + 82, y, 35, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function drawMountains(parallax, baseY, color) {
        const offset =
            (camera.x * parallax) % 480;

        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.moveTo(0, VIEW_HEIGHT);

        for (let i = -2; i < 7; i += 1) {
            const x = i * 480 - offset;
            const height =
                170 + ((i + 8) % 3) * 55;

            ctx.lineTo(x, baseY);
            ctx.lineTo(x + 240, baseY - height);
            ctx.lineTo(x + 480, baseY);
        }

        ctx.lineTo(viewWidth, VIEW_HEIGHT);
        ctx.closePath();
        ctx.fill();
    }

    function drawRiver() {
        const water = ctx.createLinearGradient(
            0,
            610,
            0,
            720
        );

        water.addColorStop(0, "#46dcf4");
        water.addColorStop(1, "#0874bd");

        ctx.fillStyle = water;
        ctx.fillRect(
            0,
            610,
            WORLD_WIDTH,
            110
        );

        ctx.strokeStyle =
            "rgba(255,255,255,0.55)";

        ctx.lineWidth = 4;

        for (let x = 0; x < WORLD_WIDTH; x += 100) {
            ctx.beginPath();
            ctx.moveTo(
                x + Math.sin(worldTime * 2) * 15,
                650
            );
            ctx.lineTo(x + 55, 650);
            ctx.stroke();
        }
    }

    function drawPlatforms() {
        platforms.forEach((platform) => {
            if (platform.type === "ground") {
                drawGround(platform);
            } else if (platform.type === "stone") {
                drawStonePlatform(platform);
            } else if (platform.type === "wood") {
                drawWoodPlatform(platform);
            } else if (platform.type === "block") {
                drawInteractiveBlock(platform);
            }
        });
    }

    function drawGround(platform) {
        ctx.fillStyle = "#72503a";
        ctx.fillRect(
            platform.x,
            platform.y,
            platform.width,
            platform.height
        );

        ctx.fillStyle = "#3ba449";
        ctx.fillRect(
            platform.x,
            platform.y,
            platform.width,
            18
        );

        ctx.fillStyle = "#79d64d";
        ctx.fillRect(
            platform.x,
            platform.y,
            platform.width,
            7
        );

        ctx.fillStyle = "rgba(58,33,24,0.24)";

        for (
            let x = platform.x + 25;
            x < platform.x + platform.width;
            x += 70
        ) {
            ctx.beginPath();
            ctx.arc(
                x,
                platform.y + 55,
                8,
                0,
                Math.PI * 2
            );
            ctx.fill();
        }
    }

    function drawStonePlatform(platform) {
        ctx.fillStyle = "#6b7280";
        ctx.fillRect(
            platform.x,
            platform.y,
            platform.width,
            platform.height
        );

        ctx.strokeStyle = "#343a46";
        ctx.lineWidth = 4;
        ctx.strokeRect(
            platform.x,
            platform.y,
            platform.width,
            platform.height
        );

        ctx.strokeStyle =
            "rgba(255,255,255,0.28)";

        for (
            let x = platform.x + 35;
            x < platform.x + platform.width;
            x += 55
        ) {
            ctx.beginPath();
            ctx.moveTo(x, platform.y);
            ctx.lineTo(
                x,
                platform.y + platform.height
            );
            ctx.stroke();
        }
    }

    function drawWoodPlatform(platform) {
        ctx.fillStyle = "#b86d32";
        ctx.fillRect(
            platform.x,
            platform.y,
            platform.width,
            platform.height
        );

        ctx.fillStyle = "#e6a04e";
        ctx.fillRect(
            platform.x,
            platform.y,
            platform.width,
            7
        );

        ctx.strokeStyle = "#603519";
        ctx.lineWidth = 4;
        ctx.strokeRect(
            platform.x,
            platform.y,
            platform.width,
            platform.height
        );

        for (
            let x = platform.x + 35;
            x < platform.x + platform.width;
            x += 40
        ) {
            ctx.beginPath();
            ctx.moveTo(x, platform.y);
            ctx.lineTo(
                x,
                platform.y + platform.height
            );
            ctx.stroke();
        }
    }

    function drawInteractiveBlock(block) {
        ctx.fillStyle =
            block.used ? "#886c54" : "#f8b62d";

        ctx.fillRect(
            block.x,
            block.y,
            block.width,
            block.height
        );

        ctx.strokeStyle =
            block.used ? "#4d3b2f" : "#9c5517";

        ctx.lineWidth = 5;
        ctx.strokeRect(
            block.x,
            block.y,
            block.width,
            block.height
        );

        if (!block.used) {
            ctx.fillStyle = "#fff2a6";
            ctx.font = "900 29px Arial";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";

            ctx.fillText(
                "S/",
                block.x + block.width / 2,
                block.y + block.height / 2
            );
        }
    }
    function drawCoins() {
        coins.forEach((coin) => {
            if (coin.collected) {
                return;
            }

            const horizontalScale =
                0.28 +
                Math.abs(
                    Math.sin(coin.animation)
                ) * 0.72;

            const floatingMovement =
                Math.sin(
                    coin.animation * 0.65
                ) * 4;

            ctx.save();

            ctx.translate(
                coin.x,
                coin.y + floatingMovement
            );

            /* Resplandor suave */
            ctx.shadowColor =
                "rgba(255, 210, 45, 0.85)";

            ctx.shadowBlur = 13;

            /* Simula que la moneda está girando */
            ctx.scale(horizontalScale, 1);

            if (coinImageLoaded) {
                const coinSize = 44;

                ctx.drawImage(
                    coinImage,
                    -coinSize / 2,
                    -coinSize / 2,
                    coinSize,
                    coinSize
                );
            } else {
                /* Moneda de respaldo */
                ctx.fillStyle = "#ffd43b";
                ctx.strokeStyle = "#b96c13";
                ctx.lineWidth = 4;

                ctx.beginPath();

                ctx.ellipse(
                    0,
                    0,
                    coin.radius,
                    coin.radius + 4,
                    0,
                    0,
                    Math.PI * 2
                );

                ctx.fill();
                ctx.stroke();
            }

            ctx.restore();
        });
    }
   
    function drawSpikes() {
        spikes.forEach((spike) => {
            const quantity =
                Math.max(
                    1,
                    Math.floor(spike.width / 24)
                );

            const spikeWidth =
                spike.width / quantity;

            for (let i = 0; i < quantity; i += 1) {
                const x =
                    spike.x + i * spikeWidth;

                ctx.fillStyle = "#dce8ee";
                ctx.strokeStyle = "#53646e";
                ctx.lineWidth = 3;

                ctx.beginPath();
                ctx.moveTo(x, spike.y + spike.height);
                ctx.lineTo(
                    x + spikeWidth / 2,
                    spike.y
                );
                ctx.lineTo(
                    x + spikeWidth,
                    spike.y + spike.height
                );
                ctx.closePath();

                ctx.fill();
                ctx.stroke();
            }
        });
    }

    function drawEnemies() {
        enemies.forEach((enemy) => {
            if (
                enemy.defeated &&
                enemy.disappearTime > 0.45
            ) {
                return;
            }

            ctx.save();

            if (enemy.defeated) {
                const scale =
                    Math.max(
                        0.1,
                        1 - enemy.disappearTime * 2
                    );

                ctx.translate(
                    enemy.x + enemy.width / 2,
                    enemy.y + enemy.height / 2
                );

                ctx.scale(1.2, scale);
                ctx.translate(
                    -enemy.width / 2,
                    -enemy.height / 2
                );
            } else {
                ctx.translate(enemy.x, enemy.y);
            }

            ctx.fillStyle = "#714c32";
            ctx.strokeStyle = "#36271e";
            ctx.lineWidth = 4;

            ctx.beginPath();
            ctx.roundRect(
                2,
                7,
                enemy.width - 4,
                enemy.height - 9,
                18
            );

            ctx.fill();
            ctx.stroke();

            ctx.fillStyle = "#84c847";
            ctx.fillRect(8, 3, enemy.width - 16, 13);

            ctx.fillStyle = "white";

            ctx.beginPath();
            ctx.arc(18, 25, 8, 0, Math.PI * 2);
            ctx.arc(35, 25, 8, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = "#1e292d";

            ctx.beginPath();
            ctx.arc(20, 27, 3, 0, Math.PI * 2);
            ctx.arc(37, 27, 3, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = "#35261f";
            ctx.fillRect(5, 46, 16, 7);
            ctx.fillRect(32, 46, 16, 7);

            ctx.restore();
        });
    }

    function drawCheckpoints() {
        checkpoints.forEach((checkpoint) => {
            ctx.fillStyle = "#6e4c33";
            ctx.fillRect(
                checkpoint.x,
                checkpoint.y,
                8,
                150
            );

            ctx.fillStyle =
                checkpoint.active
                    ? "#ffdb3d"
                    : "#e7eef1";

            ctx.beginPath();
            ctx.moveTo(
                checkpoint.x + 8,
                checkpoint.y + 10
            );

            ctx.lineTo(
                checkpoint.x + 78,
                checkpoint.y + 35
            );

            ctx.lineTo(
                checkpoint.x + 8,
                checkpoint.y + 61
            );

            ctx.closePath();
            ctx.fill();

            if (checkpoint.active) {
                ctx.fillStyle = "#e53d4e";
                ctx.beginPath();
                ctx.arc(
                    checkpoint.x + 35,
                    checkpoint.y + 35,
                    10,
                    0,
                    Math.PI * 2
                );
                ctx.fill();
            }
        });
    }

    function drawGoal() {
        const glow =
            0.75 +
            Math.sin(worldTime * 4) * 0.15;

        ctx.save();
        ctx.globalAlpha = glow;

        ctx.fillStyle =
            "rgba(255,215,60,0.32)";

        ctx.beginPath();
        ctx.ellipse(
            goal.x + goal.width / 2,
            goal.y + goal.height / 2,
            90,
            125,
            0,
            0,
            Math.PI * 2
        );
        ctx.fill();

        ctx.restore();

        ctx.strokeStyle = "#f1b82d";
        ctx.lineWidth = 18;

        ctx.beginPath();
        ctx.arc(
            goal.x + goal.width / 2,
            goal.y + 75,
            48,
            Math.PI,
            0
        );

        ctx.lineTo(
            goal.x + goal.width - 2,
            goal.y + goal.height
        );

        ctx.moveTo(
            goal.x + 2,
            goal.y + 75
        );

        ctx.lineTo(
            goal.x + 2,
            goal.y + goal.height
        );

        ctx.stroke();

        ctx.fillStyle = "#ef3340";
        ctx.fillRect(
            goal.x + 4,
            goal.y + 80,
            22,
            goal.height - 80
        );

        ctx.fillStyle = "#ffffff";
        ctx.fillRect(
            goal.x + 39,
            goal.y + 80,
            22,
            goal.height - 80
        );

        ctx.fillStyle = "#d71028";
        ctx.fillRect(
            goal.x + 74,
            goal.y + 80,
            22,
            goal.height - 80
        );

        ctx.fillStyle = "#173f52";
        ctx.font = "900 22px Arial";
        ctx.textAlign = "center";

        ctx.fillText(
            "META",
            goal.x + goal.width / 2,
            goal.y - 24
        );
    }

    function drawTutorialSigns() {
        tutorialSigns.forEach((sign) => {
            ctx.fillStyle = "#674327";
            ctx.fillRect(
                sign.x + 72,
                sign.y + 42,
                10,
                60
            );

            ctx.fillStyle = "#f2d29a";
            ctx.strokeStyle = "#76502c";
            ctx.lineWidth = 4;

            ctx.beginPath();
            ctx.roundRect(
                sign.x,
                sign.y,
                155,
                52,
                8
            );

            ctx.fill();
            ctx.stroke();

            ctx.fillStyle = "#34291f";
            ctx.font = "bold 13px Arial";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";

            drawWrappedText(
                sign.text,
                sign.x + 77,
                sign.y + 26,
                140,
                15
            );
        });
    }
    function drawPlayer() {
        const centerX =
            player.x + player.width / 2;

        const bottomY =
            player.y + player.height;

        let bounce = 0;
        let rotation = 0;
        let scaleY = 1;

        if (player.state === "idle") {
            bounce =
                Math.sin(worldTime * 3) * 2;
        }

        if (
            player.state === "walking" ||
            player.state === "running"
        ) {
            bounce =
                Math.abs(
                    Math.sin(
                        worldTime *
                        (player.state === "running" ? 14 : 9)
                    )
                ) * 5;
        }

        if (player.state === "jumping") {
            rotation = player.direction * 0.08;
        }

        if (player.state === "falling") {
            rotation = -player.direction * 0.05;
        }

        if (player.state === "crouching") {
            scaleY = 0.72;
        }

        /* Dibujar personaje */
        ctx.save();

        if (
            player.invulnerable > 0 &&
            Math.floor(player.invulnerable * 12) % 2 === 0
        ) {
            ctx.globalAlpha = 0.35;
        }

        ctx.translate(
            centerX,
            bottomY - bounce
        );

        ctx.rotate(rotation);
        ctx.scale(player.direction, scaleY);

        if (playerImageLoaded) {
            const drawWidth = 76;
            const drawHeight = 95;

            ctx.drawImage(
                playerImage,
                -drawWidth / 2,
                -drawHeight,
                drawWidth,
                drawHeight
            );
        } else {
            drawFallbackPlayer();
        }

        ctx.restore();

        /* Nombre discreto encima del personaje */
        const playerName = "Jackson QuissssPE";
        const nameX = player.x + player.width / 2;
        const nameY = player.y - 12 - bounce;

        ctx.save();

        ctx.font = "700 12px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        ctx.strokeStyle = "rgba(0, 0, 0, 0.55)";
        ctx.lineWidth = 3;
        ctx.strokeText(
            playerName,
            nameX,
            nameY
        );

        ctx.fillStyle =
            "rgba(255, 255, 255, 0.88)";

        ctx.fillText(
            playerName,
            nameX,
            nameY
        );

        ctx.restore();
    }

    function drawFallbackPlayer() {
        ctx.fillStyle = "#1d5fbf";
        ctx.fillRect(-20, -55, 40, 45);

        ctx.fillStyle = "#c98555";

        ctx.beginPath();
        ctx.arc(0, -70, 21, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "#e33e3e";
        ctx.fillRect(-24, -91, 48, 14);

        ctx.fillStyle = "#3d2a20";
        ctx.fillRect(-25, -12, 20, 12);
        ctx.fillRect(5, -12, 20, 12);
    }

    function drawParticles() {
        particles.forEach((particle) => {
            ctx.save();

            ctx.globalAlpha =
                particle.duration /
                particle.maximumDuration;

            ctx.fillStyle = particle.color;

            ctx.beginPath();
            ctx.arc(
                particle.x,
                particle.y,
                particle.size,
                0,
                Math.PI * 2
            );

            ctx.fill();
            ctx.restore();
        });
    }

    /* =====================================================
       PANTALLAS DE RESULTADO
    ===================================================== */

    function completeLevelOne() {
        if (gameState !== "playing") {
            return;
        }

        gameState = "completed";
        player.state = "celebrating";

        createCelebrationParticles(
            goal.x + goal.width / 2,
            goal.y + 80
        );

        playSound("complete");

        if (typeof window.completeLevel === "function") {
            window.completeLevel(1);
        }

        showResultPanel(`
            <h2>¡NIVEL COMPLETADO!</h2>
            <p><strong>Zamora</strong></p>
            <p>Recompensa: <strong>50 Soles PE</strong></p>
            <p>Monedas recogidas: <strong>${coinsCollected}</strong></p>
            <p>Tiempo: <strong>${formatTime(levelTime)}</strong></p>

            <button type="button" data-result="next">
                IR AL NIVEL 2
            </button>

            <button type="button" data-result="repeat">
                REPETIR
            </button>

            <button type="button" data-result="map">
                VOLVER AL MAPA
            </button>
        `);
    }

    function showGameOver() {
        gameState = "gameover";

        showResultPanel(`
            <h2>GAME OVER</h2>
            <p>Jackson necesita intentarlo nuevamente.</p>

            <button type="button" data-result="repeat">
                REINICIAR NIVEL
            </button>

            <button type="button" data-result="map">
                VOLVER AL MAPA
            </button>
        `);
    }

    function showResultPanel(content) {
        closeResultPanel();

        resultPanel = document.createElement("div");
        resultPanel.className = "game-panel visible";

        resultPanel.innerHTML = `
            <div class="game-panel-content">
                ${content}
            </div>
        `;

        gameScreen.appendChild(resultPanel);

        resultPanel.addEventListener("click", (event) => {
            const button =
                event.target.closest("[data-result]");

            if (!button) {
                return;
            }

            const action =
                button.dataset.result;

            if (action === "repeat") {
                startLevel(1);
            }

            if (
                action === "map" ||
                action === "next"
            ) {
                returnToMap();
            }
        });
    }

    function closeResultPanel() {
        if (resultPanel) {
            resultPanel.remove();
            resultPanel = null;
        }
    }

    /* =====================================================
       PAUSA
    ===================================================== */

    function togglePause(forcePause = null) {
        if (
            gameState !== "playing" &&
            gameState !== "paused"
        ) {
            return;
        }

        const shouldPause =
            forcePause === null
                ? gameState === "playing"
                : forcePause;

        if (shouldPause) {
            gameState = "paused";
            pausePanel?.classList.add("visible");

            if (backgroundMusic) {
                backgroundMusic.volume = 0.1;
            }
        } else {
            gameState = "playing";
            pausePanel?.classList.remove("visible");

            if (backgroundMusic) {
                backgroundMusic.volume = 0.25;
            }

            lastTime = performance.now();
        }
    }

    function restartLevel() {
        pausePanel?.classList.remove("visible");
        startLevel(1);
    }

    function returnToMap() {
        gameState = "menu";

        pausePanel?.classList.remove("visible");
        closeResultPanel();

        gameScreen.classList.remove("active");
        levelScreen?.classList.add("active");

        if (backgroundMusic) {
            backgroundMusic.volume = 0.25;
        }
    }

    /* =====================================================
       HUD Y MENSAJES
    ===================================================== */

    function updateHUD() {
        if (hudCoins) {
            hudCoins.textContent =
                String(coinsCollected);
        }

        if (hudTimer) {
            hudTimer.textContent =
                formatTime(levelTime);
        }

        if (hudHearts) {
            hudHearts.innerHTML = "";

            for (let i = 0; i < 3; i += 1) {
                const heart =
                    document.createElement("span");

                heart.textContent =
                    i < lives ? "♥" : "♡";

                if (i >= lives) {
                    heart.style.color = "#80909b";
                }

                hudHearts.appendChild(heart);
            }
        }

        if (hudSoles && !hudSoles.textContent) {
            hudSoles.textContent = "0";
        }
    }

    function showMessage(text, duration = 3) {
        if (!gameMessage) {
            return;
        }

        gameMessage.textContent = text;
        gameMessage.classList.remove("hidden");
        messageTimer = duration;
    }

    function updateMessages(deltaTime) {
        if (messageTimer <= 0) {
            return;
        }

        messageTimer -= deltaTime;

        if (messageTimer <= 0) {
            gameMessage?.classList.add("hidden");
        }
    }

    /* =====================================================
       SONIDOS CREADOS MEDIANTE CÓDIGO
    ===================================================== */

    let audioContext = null;

    function playSound(type) {
        if (
            backgroundMusic?.muted ||
            gameState === "menu"
        ) {
            return;
        }

        try {
            audioContext =
                audioContext ||
                new (
                    window.AudioContext ||
                    window.webkitAudioContext
                )();

            const oscillator =
                audioContext.createOscillator();

            const gain =
                audioContext.createGain();

            const frequencies = {
                jump: 440,
                coin: 880,
                enemy: 190,
                damage: 120,
                checkpoint: 650,
                complete: 980
            };

            oscillator.type =
                type === "damage" ? "sawtooth" : "sine";

            oscillator.frequency.setValueAtTime(
                frequencies[type] || 440,
                audioContext.currentTime
            );

            gain.gain.setValueAtTime(
                0.07,
                audioContext.currentTime
            );

            gain.gain.exponentialRampToValueAtTime(
                0.001,
                audioContext.currentTime + 0.22
            );

            oscillator.connect(gain);
            gain.connect(audioContext.destination);

            oscillator.start();
            oscillator.stop(
                audioContext.currentTime + 0.23
            );
        } catch (error) {
            console.log("Audio no disponible:", error);
        }
    }

    function toggleMusic() {
        if (!backgroundMusic) {
            return;
        }

        backgroundMusic.muted =
            !backgroundMusic.muted;

        if (!backgroundMusic.muted) {
            backgroundMusic.play().catch(() => {});
        }

        if (musicButton) {
            musicButton.textContent =
                backgroundMusic.muted ? "🔇" : "♪";
        }
    }

    /* =====================================================
       TECLADO
    ===================================================== */

    window.addEventListener("keydown", (event) => {
        if (
            gameState !== "playing" &&
            gameState !== "paused"
        ) {
            return;
        }

        const key = event.key.toLowerCase();

        if (
            [
                "arrowleft",
                "arrowright",
                "arrowup",
                "arrowdown",
                " "
            ].includes(key)
        ) {
            event.preventDefault();
        }

        if (key === "escape") {
            togglePause();
            return;
        }

        if (key === "m") {
            toggleMusic();
            return;
        }

        if (gameState !== "playing") {
            return;
        }

        if (key === "a" || key === "arrowleft") {
            controls.left = true;
        }

        if (key === "d" || key === "arrowright") {
            controls.right = true;
        }

        if (key === "s" || key === "arrowdown") {
            controls.down = true;
        }

        if (key === "shift") {
            controls.run = true;
        }

        if (
            key === "w" ||
            key === "arrowup" ||
            key === " "
        ) {
            if (!controls.jump && !event.repeat) {
                controls.jumpPressed = true;
            }

            controls.jump = true;
        }
    });

    window.addEventListener("keyup", (event) => {
        const key = event.key.toLowerCase();

        if (key === "a" || key === "arrowleft") {
            controls.left = false;
        }

        if (key === "d" || key === "arrowright") {
            controls.right = false;
        }

        if (key === "s" || key === "arrowdown") {
            controls.down = false;
        }

        if (key === "shift") {
            controls.run = false;
        }

        if (
            key === "w" ||
            key === "arrowup" ||
            key === " "
        ) {
            controls.jump = false;
        }
    });

    /* =====================================================
       CONTROLES TÁCTILES
    ===================================================== */

    document
        .querySelectorAll("[data-control]")
        .forEach((button) => {
            const control =
                button.dataset.control;

            function pressControl(event) {
                event.preventDefault();

                if (
                    control === "jump" &&
                    !controls.jump
                ) {
                    controls.jumpPressed = true;
                }

                controls[control] = true;
                button.classList.add("pressed");

                try {
                    button.setPointerCapture(
                        event.pointerId
                    );
                } catch (error) {
                    /* El navegador no necesita captura */
                }
            }

            function releaseControl(event) {
                event.preventDefault();

                controls[control] = false;
                button.classList.remove("pressed");
            }

            button.addEventListener(
                "pointerdown",
                pressControl
            );

            button.addEventListener(
                "pointerup",
                releaseControl
            );

            button.addEventListener(
                "pointercancel",
                releaseControl
            );

            button.addEventListener(
                "contextmenu",
                (event) => event.preventDefault()
            );
        });

    /* =====================================================
       BOTONES DEL HUD
    ===================================================== */

    pauseButton?.addEventListener(
        "click",
        () => togglePause()
    );

    continueButton?.addEventListener(
        "click",
        () => togglePause(false)
    );

    restartButton?.addEventListener(
        "click",
        restartLevel
    );

    exitButton?.addEventListener(
        "click",
        returnToMap
    );

    musicButton?.addEventListener(
        "click",
        toggleMusic
    );

    /* =====================================================
       CONECTAR NIVEL 1 CON LA SELECCIÓN DE NIVELES
    ===================================================== */

    document
        .querySelectorAll(
            '.level-button[data-level="1"], [data-level="1"].level-button'
        )
        .forEach((button) => {
            button.addEventListener(
                "click",
                (event) => {
                    if (
                        button.disabled ||
                        button.classList.contains("locked")
                    ) {
                        return;
                    }

                    event.preventDefault();
                    event.stopImmediatePropagation();

                    startLevel(1);
                },
                true
            );
        });

    /* =====================================================
       FUNCIONES AUXILIARES
    ===================================================== */

    function rectanglesCollide(first, second) {
        return (
            first.x < second.x + second.width &&
            first.x + first.width > second.x &&
            first.y < second.y + second.height &&
            first.y + first.height > second.y
        );
    }

    function circleTouchesPlayer(circle) {
        const closestX = clamp(
            circle.x,
            player.x,
            player.x + player.width
        );

        const closestY = clamp(
            circle.y,
            player.y,
            player.y + player.height
        );

        const distanceX = circle.x - closestX;
        const distanceY = circle.y - closestY;

        return (
            distanceX * distanceX +
            distanceY * distanceY
            <
            circle.radius * circle.radius
        );
    }

    function moveTowards(
        current,
        target,
        maximumDifference
    ) {
        if (
            Math.abs(target - current) <=
            maximumDifference
        ) {
            return target;
        }

        return (
            current +
            Math.sign(target - current) *
            maximumDifference
        );
    }

    function clamp(value, minimum, maximum) {
        return Math.max(
            minimum,
            Math.min(maximum, value)
        );
    }

    function formatTime(seconds) {
        const minutes =
            Math.floor(seconds / 60);

        const remainingSeconds =
            Math.floor(seconds % 60);

        return (
            String(minutes).padStart(2, "0") +
            ":" +
            String(remainingSeconds).padStart(2, "0")
        );
    }

    function drawWrappedText(
        text,
        x,
        y,
        maximumWidth,
        lineHeight
    ) {
        const words = text.split(" ");
        const lines = [];
        let currentLine = "";

        words.forEach((word) => {
            const testLine =
                currentLine + word + " ";

            if (
                ctx.measureText(testLine).width >
                maximumWidth
            ) {
                lines.push(currentLine.trim());
                currentLine = word + " ";
            } else {
                currentLine = testLine;
            }
        });

        lines.push(currentLine.trim());

        const initialY =
            y - ((lines.length - 1) * lineHeight) / 2;

        lines.forEach((line, index) => {
            ctx.fillText(
                line,
                x,
                initialY + index * lineHeight
            );
        });
    }

    /* =====================================================
       CANVAS RESPONSIVO
    ===================================================== */
    function resizeCanvas() {
        const screenWidth =
            Math.max(window.innerWidth, 320);

        const screenHeight =
            Math.max(window.innerHeight, 240);

        const isPhoneLandscape =
            screenWidth > screenHeight &&
            window.matchMedia(
                "(pointer: coarse)"
            ).matches;

        /*
         * En teléfonos horizontales se utiliza
         * mayor resolución y una cámara más cercana.
         */
        const pixelRatio = Math.min(
            window.devicePixelRatio || 1,
            isPhoneLandscape ? 3 : 2
        );

        if (isPhoneLandscape) {
            viewHeight = 560;
            verticalOffset = 160;
        } else {
            viewHeight = VIEW_HEIGHT;
            verticalOffset = 0;
        }

        viewWidth =
            viewHeight *
            (screenWidth / screenHeight);

        canvas.width =
            Math.floor(
                screenWidth * pixelRatio
            );

        canvas.height =
            Math.floor(
                screenHeight * pixelRatio
            );

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";
    }
  
    window.addEventListener(
        "resize",
        resizeCanvas
    );

    document.addEventListener(
        "visibilitychange",
        () => {
            if (
                document.hidden &&
                gameState === "playing"
            ) {
                togglePause(true);
            }
        }
    );

    /* =====================================================
       BUCLE PRINCIPAL A 60 FPS
    ===================================================== */

    function gameLoop(currentTime) {
        const deltaTime = Math.min(
            (currentTime - lastTime) / 1000 || 0,
            1 / 30
        );

        lastTime = currentTime;

        if (gameState === "playing") {
            update(deltaTime);
        }

        if (
            gameState === "playing" ||
            gameState === "paused" ||
            gameState === "completed" ||
            gameState === "gameover"
        ) {
            draw();
        }

        requestAnimationFrame(gameLoop);
    }

    resizeCanvas();
    requestAnimationFrame(gameLoop);
})();