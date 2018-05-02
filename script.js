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
    let countSound = new Audio();
    let yellowSound = new Audio();
    let redSound = new Audio();
    let greenSound = new Audio();
    let blueSound = new Audio();

    //sound effects
    countSound.src = 'Sounds/321.wav';
    yellowSound.src = 'Sounds/snare.wav';
    redSound.src = 'Sounds/hihat.wav';
    greenSound.src = 'Sounds/tom.wav';
    blueSound.src = 'Sounds/switchphase.wav';
    

    //game start button
    $('button').on('click', function(){
        if($(this).text() == 'Hard'){
            hardMode = true;
            $('body').css('background-color', '#e9d9ad');
        }
        $('.intro').css('display', 'none');
        $('.main').css('display', 'flex');

        //countdown timer, player must not be able to do anything on this phase
        let counter = 3;
        let countDown = setInterval(function(){
            countSound.play();
            if (counter >= 1){
                $('h4').html(counter);
            }
            //once timer is done, get random color and animate it
            else{
                $('h4').html('Stage '+stage);
                clearInterval(countDown);
                getColor();
                colorRoll(1000);
            }
            counter--;
        }, 1000);
    });

    //IF it's the player's turn.. on A, S, K or L press
    $(document).keypress(function(e){
        if (colorArr.length <= 3) phase = 1
        else if (colorArr.length <= 6 && colorArr.length >3) phase = 2;
        else if (colorArr.length <= 9 && colorArr.length >6) phase = 3;
        else phase = 4;

        if (phase == 1) speed = 500;
        else if (phase == 2) speed = 350;
        else if (phase == 3) speed = 200;
        else speed = 100;
        if(playerReady == true && [97, 115, 108, 107].indexOf(e.keyCode) != -1){
            if(e.keyCode == 97) colorInput = 'red';
            else if(e.keyCode == 115) colorInput = 'yellow';
            else if(e.keyCode == 108) colorInput = 'blue';
            else colorInput = 'green';

            //add player input to the input array and compare with the 'random' colorArray
            inputArr.push(colorInput);

            //if player made a mistake
            if (colorArr[inputArr.length-1] != colorInput) {

                //flipAnimation is the main animation function, arguments are color, speed, isPlayerTurn and isCorrect
                inputArr = [];
                flipAnimation(colorInput, 500, phase, true, false, false);
                $('.underLine').css('width', '0');
                if (!hardMode) setTimeout(() => colorRoll(1000),1000);
                // if hardmode, reset to intro
                else{
                    $('h4').html('Game Over');
                    setTimeout(() => reset(),4000);
                }
            }

            //if correctly played
            else{
                //if end of the array
                if (colorArr.length == inputArr.length){
                    flipAnimation(colorInput, 500, phase, true, true ,true);
                    inputArr = [];

                    //if stage 20, victory
                    if (colorArr.length == 20){
                        setTimeout(() => {
                            $('h4').hide().html('Victory!').fadeIn(2000);
                            $('.underLine').css('width', '0');
                            countSound.play();
                        },1000);
                        setTimeout(() => reset(),4000);
                    }

                    else{
                        getColor();
                        stage++;
                        setTimeout(() => {
                            colorRoll(1000);
                            if (stage == 20) $('h4').hide().html('Final Stage').fadeIn(2000);
                            else $('h4').hide().html('Stage '+stage).fadeIn(2000);
                            $('.underLine').css('width', '0');
                            $('img').attr('src', 'Images/simon.png');
                            countSound.play();
                        },1000);
                    }
                }
                else flipAnimation(colorInput, 500, phase, true, true, false);
            }
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
    function colorRoll(ms){
        let counter = 0;
        let roll = setInterval(() => {
            flipAnimation(colorArr[counter], 500, phase, false, true, false);
            counter++;
            playerReady = false;
            if(counter == colorArr.length) {
                clearInterval(roll);
                setTimeout(() => {
                    playerReady = true;
                    $('.underLine').css('width', 'inherit');
                    $('img').attr('src', 'Images/simon.png');
                    countSound.play();
                }, 1000);
            }
        }, ms);
    }

    //animation function (color, speed, phase player'sTurn? isCorrect lastPlay)
    function flipAnimation(id, speed, phase, isPlayer, isCorrect, lastPlay){
        playerReady = false;
        console.log(phase);
        //animate the respective key
        $('.'+id).css('animation', 'jump'+phase+' '+speed+'ms cubic-bezier(0.48, 0.16, 0.5, 0.75) alternate 2');
        $('.'+id).css('transition', 'color '+speed*2+'ms cubic-bezier(0.48, 0.16, 0.5, 0.75)');
        
        //dance moves
        while(random == pose){
            random = Math.floor((Math.random()*4)+1);
        }
        pose = random;
        $('img').attr('src', 'Images/simon'+pose+'.png');

        if (phase == 3) {
            $('img').css({
                'height': '30%',
                'top': '50%'
            });
            $('body').css('background-color', 'var(--L'+id+')');
        }

        //add new css style(background color). Set to transparent if isCorrect is false
        if (isCorrect){
            if (isPlayer) $('.'+id).css('background-color', 'var(--'+id+')');
            else $('.'+id).css('background-color', 'var(--L'+id+')');

            //play sounds
            if (id == 'red') redSound.play();
            else if (id == 'yellow') yellowSound.play();
            else if (id == 'blue') blueSound.play();
            else greenSound.play();
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
        }, speed*1.7);
    }

    //reset after winning or losing in hard mode
    function reset(){
        $('img').attr('src', 'Images/simon.png');
        $('body').css('background-color', 'var(--white)');
        $('.intro').css('display', 'grid');
        $('.main').css('display', 'none');
        $('h4').html('');
        $('img').css({
            'height': '7%',
            'top': '13%'
        });
        playerReady = false;
        hardMode = false;
        colorArr = [];
        stage = 1;
        phase = 1;
        speed = 500;
        pose = 0;
        random = 0;
    }
});

