$(document).ready(function(){

    //variables
    let playerReady = false;
    let hardMode = false;
    let colorArr = [];
    let colorInput = '';
    let inputArr = [];
    let stage = 1;

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
                flipAnimation(colorInput, 500, true, false, false);
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
                    flipAnimation(colorInput, 500, true, true ,true);
                    inputArr = [];

                    //if stage 20, victory
                    if (colorArr.length == 20){
                        setTimeout(() => {
                            $('h4').hide().html('Victory!').fadeIn(2000);
                            $('.underLine').css('width', '0');
                        },1000);
                        setTimeout(() => reset(),4000);
                    }

                    //if not stage 20,
                    else{
                        getColor();
                        stage++;
                        setTimeout(() => {
                            colorRoll(1000);
                            if (stage == 20) $('h4').hide().html('Final Stage').fadeIn(2000);
                            else $('h4').hide().html('Stage '+stage).fadeIn(2000);
                            $('.underLine').css('width', '0');
                        },1000);
                    }
                }
                else flipAnimation(colorInput, 500, true, true, false);
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
            flipAnimation(colorArr[counter], 500, false, true, false);
            counter++;
            playerReady = false;
            if(counter == colorArr.length) {
                clearInterval(roll);
                setTimeout(() => {
                    playerReady = true;
                    $('.underLine').css('width', 'inherit');
                }, 1000);
            }
        }, ms);
    }

    //animation function (color, speed, player'sTurn? isCorrect lastPlay)
    function flipAnimation(id, speed, isPlayer, isCorrect, lastPlay){
        playerReady = false;

        //animate the respective key
        $('.'+id).css('animation', 'jump  '+speed+'ms cubic-bezier(0.48, 0.16, 0.5, 0.75) alternate 2');
        $('.'+id).css('transition', 'color '+speed*2+'ms cubic-bezier(0.48, 0.16, 0.5, 0.75)');
        
        //add new css style(background color). Set to transparent if isCorrect is false
        if (isCorrect && isPlayer) $('.'+id).css('background-color', 'var(--'+id+')');
        else if(isCorrect && !isPlayer) $('.'+id).css('background-color', 'var(--L'+id+')');
        else $('.'+id).css('background-color', 'none');
        
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
        $('body').css('background-color', 'var(--white)');
        $('.intro').css('display', 'grid');
        $('.main').css('display', 'none');
        $('h4').html('');
        playerReady = false;
        hardMode = false;
        colorArr = [];
        stage = 1;
    }
});

