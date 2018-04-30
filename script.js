$(document).ready(function(){

    //variables
    let animationReady = true;
    let hardMode = false;
    let colorArr = [] 

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
            }    
            counter--;
        }, 1000);
    });





    for(var i=1; i<=20; i++){
        $('h4').html('Stage'+i);
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
        colorArr.forEach(color => {
            flipAnimation(color, 500);
        });
    }   


    

    //main animation function on keypress
    $(document).keypress(function(e){
        if(animationReady == true && [97, 115, 108, 107].indexOf(e.keyCode) != -1){
            if(e.keyCode == 97) flipAnimation('red', 500);
            else if(e.keyCode == 115)flipAnimation('yellow', 500);
            else if(e.keyCode == 108)flipAnimation('blue', 500);
            else flipAnimation('green', 500);
        }
        function flipAnimation(id, speed){
            animationReady = false;
            $('.'+id).css('animation', 'jump  '+speed+'ms cubic-bezier(0.48, 0.16, 0.5, 0.75) alternate 2');
            $('.'+id).css('transition', 'color '+speed*2+'ms cubic-bezier(0.48, 0.16, 0.5, 0.75)');
            $('.'+id).css('background-color', 'var(--'+id+')');
            setTimeout(function(){
                $('.'+id).css('animation', '').css('background-color', '');
                animationReady = true;
            }, speed*1.6);
        }
    });
});
