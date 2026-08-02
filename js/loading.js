"use strict";


/* =====================================================
   ELEMENTOS GENERALES
===================================================== */

const app =
    document.querySelector("#app");

const loadingScreen =
    document.querySelector("#loadingScreen");

const nextScreen =
    document.querySelector("#nextScreen");

const progressBar =
    document.querySelector("#progressBar");

const progressTrack =
    document.querySelector(".progress-track");

const percentage =
    document.querySelector("#percentage");

const loadingText =
    document.querySelector("#loadingText");

const loadingTip =
    document.querySelector("#loadingTip");

const continueButton =
    document.querySelector("#continueButton");

const repeatButton =
    document.querySelector("#repeatButton");

const particles =
    document.querySelector("#particles");


/* =====================================================
   ELEMENTOS DE LA SELECCIÓN DE NIVELES
===================================================== */

const levelButtons =
    document.querySelectorAll(".level-button");

const levelMessage =
    document.querySelector("#levelMessage");

const totalSolesText =
    document.querySelector("#totalSoles");


/* =====================================================
   ELEMENTOS DE MÚSICA
===================================================== */

const backgroundMusic =
    document.querySelector("#backgroundMusic");

const musicButton =
    document.querySelector("#musicButton");


/* =====================================================
   CONFIGURACIÓN DE LA CARGA
===================================================== */

let progress = 0;

let loadingAnimation;

let loadingStartTime =
    performance.now();

const loadingDuration = 4200;


/* =====================================================
   CONFIGURACIÓN DE LA MÚSICA
===================================================== */

let musicStarted = false;

let musicMuted =
    localStorage.getItem("marioPEMusicMuted") === "true";


backgroundMusic.volume = 0.25;

backgroundMusic.muted = musicMuted;


/* =====================================================
   CONFIGURACIÓN DE LOS NIVELES
===================================================== */

const levelNames = [
    "Zamora",
    "Zumbi",
    "paseo por el dorado",
    "mi natal PERU",
    "De regreso a mi natal PERU"
];


const levelRewards = [
    50,
    100,
    150,
    200,
    250
];


/*
    Al entrar por primera vez, solo estará
    desbloqueado el nivel 1.
*/

let highestUnlockedLevel =
    Number(
        localStorage.getItem(
            "marioPEHighestUnlockedLevel"
        )
    ) || 1;


/*
    Obtiene los niveles completados.
*/

let completedLevels = [];

try {

    completedLevels =
        JSON.parse(
            localStorage.getItem(
                "marioPECompletedLevels"
            )
        ) || [];

} catch (error) {

    completedLevels = [];

}


/*
    Obtiene los Soles PE guardados.
*/

let totalSoles =
    Number(
        localStorage.getItem(
            "marioPETotalSoles"
        )
    ) || 0;


/* =====================================================
   MENSAJES DE LA PANTALLA DE CARGA
===================================================== */

const loadingMessages = [
    "Preparando los caminos del Perú",
    "Despertando las monedas doradas",
    "Cargando montañas y ruinas",
    "Ajustando los controles",
    "La aventura está casi lista"
];


/* =====================================================
   CREAR MONEDAS DECORATIVAS
===================================================== */

function createParticles() {

    particles.replaceChildren();


    for (
        let index = 0;
        index < 18;
        index++
    ) {

        const particle =
            document.createElement("span");


        particle.style.left =
            `${4 + Math.random() * 92}%`;


        particle.style.top =
            `${45 + Math.random() * 52}%`;


        particle.style.setProperty(
            "--duration",
            `${3.2 + Math.random() * 3.8}s`
        );


        particle.style.setProperty(
            "--delay",
            `${Math.random() * -6}s`
        );


        particles.appendChild(particle);

    }

}


/* =====================================================
   ACTUALIZAR LA BARRA DE CARGA
===================================================== */

function updateProgress(value) {

    const roundedValue =
        Math.min(
            100,
            Math.round(value)
        );


    progressBar.style.width =
        `${roundedValue}%`;


    percentage.textContent =
        `${roundedValue}%`;


    progressTrack.setAttribute(
        "aria-valuenow",
        String(roundedValue)
    );


    const messagePosition =
        Math.min(
            loadingMessages.length - 1,
            Math.floor(roundedValue / 22)
        );


    loadingTip.textContent =
        loadingMessages[messagePosition];

}


/* =====================================================
   ANIMACIÓN DE CARGA
===================================================== */

function loadingLoop(currentTime) {

    const elapsedTime =
        currentTime - loadingStartTime;


    const normalizedProgress =
        Math.min(
            1,
            elapsedTime / loadingDuration
        );


    /*
        Avanza rápido al principio y reduce
        ligeramente su velocidad al final.
    */

    progress =
        100 *
        (
            1 -
            Math.pow(
                1 - normalizedProgress,
                1.35
            )
        );


    updateProgress(progress);


    if (progress < 100) {

        loadingAnimation =
            requestAnimationFrame(
                loadingLoop
            );

        return;

    }


    updateProgress(100);


    loadingText.textContent =
        "¡Aventura lista!";


    loadingScreen.classList.add(
        "ready"
    );

}


/* =====================================================
   INICIAR NUEVAMENTE LA CARGA
===================================================== */

function startLoading() {

    cancelAnimationFrame(
        loadingAnimation
    );


    progress = 0;


    loadingStartTime =
        performance.now();


    loadingScreen.classList.remove(
        "ready"
    );


    loadingScreen.classList.add(
        "active"
    );


    nextScreen.classList.remove(
        "active"
    );


    app.classList.remove(
        "curtains-closed"
    );


    loadingText.textContent =
        "Cargando aventura...";


    updateProgress(0);


    loadingAnimation =
        requestAnimationFrame(
            loadingLoop
        );

}


/* =====================================================
   INICIAR MÚSICA

   La música se ejecuta después de presionar
   "INICIAR JUEGO" para evitar el bloqueo de
   reproducción automática del navegador.
===================================================== */

function startMusic() {

    if (musicStarted) {

        return;

    }


    musicStarted = true;


    backgroundMusic
        .play()
        .catch(
            function (error) {

                console.log(
                    "El navegador bloqueó la música:",
                    error
                );

            }
        );

}


/* =====================================================
   ACTUALIZAR BOTÓN DE MÚSICA
===================================================== */

function updateMusicButton() {

    if (musicMuted) {

        musicButton.classList.add(
            "muted"
        );


        musicButton.textContent =
            "♪";

        musicButton.setAttribute(
            "aria-label",
            "Activar música"
        );

    } else {

        musicButton.classList.remove(
            "muted"
        );


        musicButton.textContent =
            "♪";

        musicButton.setAttribute(
            "aria-label",
            "Silenciar música"
        );

    }

}


/* =====================================================
   ACTIVAR O SILENCIAR MÚSICA
===================================================== */

function toggleMusic() {

    musicMuted = !musicMuted;


    backgroundMusic.muted =
        musicMuted;


    localStorage.setItem(
        "marioPEMusicMuted",
        String(musicMuted)
    );


    if (!musicMuted) {

        startMusic();


        backgroundMusic
            .play()
            .catch(
                function () {

                    console.log(
                        "No se pudo iniciar la música."
                    );

                }
            );

    }


    updateMusicButton();

}


/* =====================================================
   GUARDAR PROGRESO
===================================================== */

function saveProgress() {

    localStorage.setItem(
        "marioPEHighestUnlockedLevel",
        String(highestUnlockedLevel)
    );


    localStorage.setItem(
        "marioPECompletedLevels",
        JSON.stringify(completedLevels)
    );


    localStorage.setItem(
        "marioPETotalSoles",
        String(totalSoles)
    );

}


/* =====================================================
   ACTUALIZAR SELECCIÓN DE NIVELES
===================================================== */

function updateLevelSelection() {

    totalSolesText.textContent =
        totalSoles;


    levelButtons.forEach(
        function (button) {

            const levelNumber =
                Number(
                    button.dataset.level
                );


            const levelCompleted =
                completedLevels.includes(
                    levelNumber
                );


            const levelUnlocked =
                levelNumber <=
                highestUnlockedLevel;


            const status =
                button.querySelector(
                    ".level-status"
                );


            if (levelUnlocked) {

                button.disabled = false;


                button.classList.remove(
                    "locked"
                );


                button.classList.add(
                    "unlocked"
                );


                if (levelCompleted) {

                    button.classList.add(
                        "completed"
                    );


                    status.textContent =
                        "✓";

                } else {

                    button.classList.remove(
                        "completed"
                    );


                    status.textContent =
                        "JUGAR";

                }


                button.setAttribute(
                    "aria-label",
                    `Nivel ${levelNumber}: ${levelNames[levelNumber - 1]}`
                );

            } else {

                button.disabled = true;


                button.classList.add(
                    "locked"
                );


                button.classList.remove(
                    "unlocked"
                );


                button.classList.remove(
                    "completed"
                );


                status.textContent =
                    "🔒";


                button.setAttribute(
                    "aria-label",
                    `Nivel ${levelNumber}: ${levelNames[levelNumber - 1]} bloqueado`
                );

            }

        }
    );

}


/* =====================================================
   MOSTRAR MENSAJES DEL MAPA
===================================================== */

function showLevelMessage(message) {

    levelMessage.textContent =
        message;


    levelMessage.classList.add(
        "show"
    );


    setTimeout(
        function () {

            levelMessage.classList.remove(
                "show"
            );

        },
        2500
    );

}


/* =====================================================
   ABRIR LA SELECCIÓN DE NIVELES
===================================================== */

function openNextScreen() {

    /*
        La música comienza inmediatamente dentro
        del clic del usuario.
    */

    startMusic();


    app.classList.add(
        "curtains-closed"
    );


    setTimeout(
        function () {

            loadingScreen.classList.remove(
                "active"
            );


            nextScreen.classList.add(
                "active"
            );


            updateLevelSelection();


            setTimeout(
                function () {

                    app.classList.remove(
                        "curtains-closed"
                    );

                },
                220
            );

        },
        720
    );

}


/* =====================================================
   SELECCIONAR UN NIVEL
===================================================== */

function selectLevel(levelNumber) {

    if (
        levelNumber >
        highestUnlockedLevel
    ) {

        showLevelMessage(
            "Completa el nivel anterior para desbloquearlo."
        );

        return;

    }


    const selectedLevelName =
        levelNames[levelNumber - 1];


    showLevelMessage(
        `Nivel ${levelNumber}: ${selectedLevelName}`
    );


    /*
        Más adelante, aquí iniciaremos el nivel.

        Por ejemplo:

        startLevel(levelNumber);
    */

    console.log(
        `Nivel seleccionado: ${selectedLevelName}`
    );

}


/* =====================================================
   COMPLETAR UN NIVEL

   Esta función se utilizará cuando construyamos
   el gameplay. La dejamos preparada desde ahora.
===================================================== */

function completeLevel(levelNumber) {

    const alreadyCompleted =
        completedLevels.includes(
            levelNumber
        );


    /*
        La recompensa solo se entrega una vez.
    */

    if (!alreadyCompleted) {

        completedLevels.push(
            levelNumber
        );


        totalSoles +=
            levelRewards[
                levelNumber - 1
            ];

    }


    /*
        Desbloquea el siguiente nivel.
    */

    if (
        levelNumber <
        levelNames.length
    ) {

        highestUnlockedLevel =
            Math.max(
                highestUnlockedLevel,
                levelNumber + 1
            );

    }


    saveProgress();


    updateLevelSelection();


    showLevelMessage(
        `¡Nivel ${levelNumber} completado!`
    );

}


/*
    Permite utilizar esta función cuando
    agreguemos el gameplay posteriormente.
*/

window.completeLevel =
    completeLevel;


/* =====================================================
   EVENTOS
===================================================== */

continueButton.addEventListener(
    "click",
    openNextScreen
);


repeatButton.addEventListener(
    "click",
    function () {

        createParticles();

        startLoading();

    }
);


musicButton.addEventListener(
    "click",
    toggleMusic
);


levelButtons.forEach(
    function (button) {

        button.addEventListener(
            "click",
            function () {

                const levelNumber =
                    Number(
                        button.dataset.level
                    );


                selectLevel(
                    levelNumber
                );

            }
        );

    }
);


/* =====================================================
   INICIAR EL PROYECTO
===================================================== */

createParticles();

updateMusicButton();

updateLevelSelection();

startLoading();