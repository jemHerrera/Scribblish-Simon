$(document).ready(function(){

    //variables
    let animationReady = false;
    let hardMode = false;
    let colorArr = [];
    let colorInput = '';
    let inputArr = [];

    //game start button
    $('button').on('click', function(){
        if($(this).text() == 'Hard')  hardMode = true;
        $('.intro').css('display', 'none');
        $('.main').css('display', 'flex');
        let counter = 3;
        let countDown = setInterval(function(){
            if (counter >= 1){
                $('h4').html(counter);
            }
            else{
                $('h4').html('Stage 1');
                clearInterval(countDown);
                getColor();
                colorRoll(1000);
            }
            counter--;
        }, 1000);
    });





    //main animation function on keypress
    $(document).keypress(function(e){
        if(animationReady == true && [97, 115, 108, 107].indexOf(e.keyCode) != -1){
            if(e.keyCode == 97) colorInput = 'red';
            else if(e.keyCode == 115) colorInput = 'yellow';
            else if(e.keyCode == 108) colorInput = 'blue';
            else colorInput = 'green';

            inputArr.push(colorInput);
            if (colorArr[inputArr.length-1] != colorInput) {
                flipAnimation(colorInput, 500 ,false);
                animationReady = false;
                inputArr = [];
                setTimeout(() => colorRoll(1000),1000);
            }
            else{
                flipAnimation(colorInput, 500 ,true);
                if (colorArr.length == inputArr.length){
                    inputArr = [];
                    getColor();
                    colorRoll(1000);
                }
            }
        }
    });








    //FUNCTIONS
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

    function colorRoll(ms){
        let counter = 0;
        let roll = setInterval(function(){
            flipAnimation(colorArr[counter], 500, true);
            counter++;
            animationReady = false;
            if(counter == colorArr.length) {
                clearInterval(roll);
                animationReady = true;
                console.log(colorArr);
            }
        }, ms);
    }



    function colorCheck(input){

    }



    function flipAnimation(id, speed, boolean){
        animationReady = false;
        $('.'+id).css('animation', 'jump  '+speed+'ms cubic-bezier(0.48, 0.16, 0.5, 0.75) alternate 2');
        $('.'+id).css('transition', 'color '+speed*2+'ms cubic-bezier(0.48, 0.16, 0.5, 0.75)');
        if (boolean == true)$('.'+id).css('background-color', 'var(--'+id+')');
        else $('.'+id).css('background-color', 'none');
        setTimeout(function(){
            $('.'+id).css('animation', '').css('background-color', '');
            animationReady = true;
        }, speed*1.6);
    }
});

