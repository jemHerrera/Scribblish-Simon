$(document).ready(function(){

    //variables
    let playerReady = false;
    let hardMode = false;
    let colorArr = [];
    let colorInput = '';
    let inputArr = [];
    let stage = 1;
    let phase = 1;
    let speed = 500;
    let pose = 0;
    let random = 0;

    //CURRENTLY SOUND EFFECTS ARE COMMENTED-OUT BECAUSE OF BROWSER INCONSISTENCIES

    // let countSound = new Audio();
    // let yellowSound = new Audio();
    // let redSound = new Audio();
    // let greenSound = new Audio();
    // let blueSound = new Audio();

    //sound effects
    // countSound.src = 'Sounds/tom.wav';
    // yellowSound.src = 'Sounds/snare.wav';
    // redSound.src = 'Sounds/hihat.wav';
    // greenSound.src = 'Sounds/tick.wav';
    // blueSound.src = 'Sounds/switchphase.wav';


    //game start button
    $('button').on('click', function(){
        if($(this).text() == 'Strict') hardMode = true;
        $(this).css('background-color', '#e9d9ad');
        $('button').css('display', 'none');
        $('.restart').fadeIn(1000);

        //countdown timer, player must not be able to do anything on this phase
        let counter = 3;
        let countDown = setInterval(function(){
            // countSound.play();
            if (counter >= 1){
                $('h4').html(counter);
            }
            //once timer is done, get random color and animate it
            else{
                $('h4').html('Stage '+stage);
                clearInterval(countDown);
                getColor();
                colorRoll();
            }
            counter--;
        }, 1000);
    });

    $('.restart').on('click', () => location.reload());

    //IF it's the player's turn.. on A, S, K or L press
    $(document).keypress((e) =>{
        if(playerReady == true && [97, 115, 108, 107].indexOf(e.keyCode) != -1){
            if(e.keyCode == 97) colorInput = 'red';
            else if(e.keyCode == 115) colorInput = 'yellow';
            else if(e.keyCode == 108) colorInput = 'blue';
            else colorInput = 'green';
            execute();
        }
    });

    $('.keys').children().on('click', (e) => {
        if (playerReady == true){
            if ($(e.target).text() == 'A') colorInput = 'red';
            else if ($(e.target).text() == 'S') colorInput = 'yellow';
            else if ($(e.target).text() == 'K') colorInput = 'green';
            else colorInput = 'blue';
            execute();
        }
    });

    //FUNCTIONS
    //function to pick a random color
    function getColor(){
        let randomKey = Math.floor((Math.random()*4)+1);
        let color = '';
        switch(randomKey){
            case 1:
                color = 'red';
                break;
            case 2:
                color =  'yellow';
                break;
            case 3:
                color = 'green';
                break;
            case 4:
                color = 'blue';
                break;
        }
        colorArr.push(color);
    }

    //function to execute the color array in series of animations
    function colorRoll(){
        // change game phase depending on colorArr length
        if (colorArr.length <= 5) {
            phase = 1;
            speed = 500;
        }
        else if (colorArr.length <= 10 && colorArr.length >5) {
            phase = 2;
            speed = 400;
        }
        else if (colorArr.length <= 14 && colorArr.length >10) {
            phase = 3;
            speed = 300;
        }
        else {
            phase = 4;
            speed = 240;
        }
        let counter = 0;
        let roll = setInterval(() => {
            flipAnimation(colorArr[counter], speed, phase, false, true, false);
            counter++;
            playerReady = false;
            if(counter == colorArr.length) {
                clearInterval(roll);
                setTimeout(() => {
                    playerReady = true;
                    $('.underLine').css('width', 'inherit');
                    $('img').attr('src', 'Images/simon.png');
                    // countSound.play();
                }, speed*2);
            }
        }, speed*2);
    }

    //animation function (color, speed, phase player'sTurn? isCorrect lastPlay)
    function flipAnimation(id, spd, phase, isPlayer, isCorrect, lastPlay){
        playerReady = false;
        //animate the respective key
        $('.'+id).css('animation', 'jump'+phase+' '+spd+'ms cubic-bezier(0.48, 0.16, 0.5, 0.75) alternate 2');
        $('.'+id).css('transition', 'color '+spd*2+'ms cubic-bezier(0.48, 0.16, 0.5, 0.75)');

        //dance moves
        while(random == pose){
            random = Math.floor((Math.random()*4)+1);
        }
        pose = random;
        $('img').attr('src', 'Images/simon'+pose+'.png');

        if (phase == 4) {
            $('img').css({
                'position': 'absolute',
                'height': '20%',
                'top': '60%'
            });
            $('body').css('background-color', 'var(--L'+id+')');
        }

        //add new css style(background color). Set to transparent if isCorrect is false
        if (isCorrect){
            if (isPlayer) $('.'+id).css('background-color', 'var(--'+id+')');
            else $('.'+id).css('background-color', 'var(--L'+id+')');

            //play sounds
            // if (id == 'red') redSound.play();
            // else if (id == 'yellow') yellowSound.play();
            // else if (id == 'blue') blueSound.play();
            // else greenSound.play();
            }
        else {
            $('.'+id).css('background-color', 'none');
            $('img').attr('src', 'Images/simon5.png');
        }

        //after few moments, remove the applied css style to reset and set playerReady
        // if not player's turn yet, player can't make any key inputs
        // if player is incorrect, a colorless animation will display
        setTimeout(function(){
            $('.'+id).css('animation', '').css('background-color', '');
            if(isPlayer && isCorrect) playerReady = true;
            if (lastPlay) playerReady = false;
        }, spd*1.7);
    }

    //execution on player input
    function execute(){
        //add player input to the input array and compare with the 'random' colorArray
        inputArr.push(colorInput);
        //if player made a mistake
        if (colorArr[inputArr.length-1] != colorInput) {

            //flipAnimation is the main animation function, arguments are color, speed, isPlayerTurn and isCorrect
            inputArr = [];
            flipAnimation(colorInput, speed, phase, true, false, false);
            $('.underLine').css('width', '0');
            if (!hardMode) setTimeout(() => colorRoll(),1000);
            // if hardmode, reset to intro
            else{
                $('h4').hide().html('Game Over').fadeIn(2000);
                setTimeout(() =>  location.reload(), 4000);
            }
        }
        //if correctly played
        else{
            //if end of the array
            if (colorArr.length == inputArr.length){
                flipAnimation(colorInput, speed, phase, true, true ,true);
                inputArr = [];

                //if stage 15, victory
                if (colorArr.length == 15){
                    setTimeout(() => {
                        $('h4').hide().html('Victory!').fadeIn(2000);
                        $('.underLine').css('width', '0');
                        // countSound.play();
                    },speed*2);
                    setTimeout(() =>  location.reload(), 4000);
                }

                else{
                    getColor();
                    stage++;
                    setTimeout(() => {
                        colorRoll();
                        if (stage == 15) $('h4').hide().html('Final Stage').fadeIn(2000);
                        else $('h4').hide().html('Stage '+stage).fadeIn(2000);
                        $('.underLine').css('width', '0');
                        $('img').attr('src', 'Images/simon.png');
                        // countSound.play();
                    },speed*2);
                }
            }
            else flipAnimation(colorInput, speed, phase, true, true, false);
        }
    }
});



