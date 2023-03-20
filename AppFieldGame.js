
var interval = 0;
function setTimeCountdown(timer) {
    var seconds = (timer/1000)-1;
            
    window.clearInterval(interval);
    
    interval = setInterval(function(){

        document.getElementById("check").innerHTML = seconds;
        if(seconds == 0) {
            document.getElementById("check").innerHTML = "CHECK";
            clearInterval(interval);
        }
        seconds--;
        
    }, 1000);
}

function compareArrays(arrayOne, arrayTwo) {

    arrayOne = arrayOne.sort();
    arrayTwo = arrayTwo.sort();

    if(arrayOne.length == arrayTwo.length) {
        for(var start = 0; start < arrayOne.length; start++) {
            if( arrayOne[start] == arrayTwo[start] ) {
                console.log("OK");
            }else {
                return false;
            }
        }
        return true;
    }else {
        return false;
    }
    
}

/* Funkcja losująca */
function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max+1 - min)) + min;
}

/* Funkcja sprawdzająca powtórzenia w tabeli*/

function checkSameNumber(table, randomNumber ) {
    for(var start = 0; start < table.length; start++) {
        if(table[start] == randomNumber) {
            return true; // jeśli jest taki element w tablicy to zwróć prawde losuj dalej az zwroci falsz
        }
    }
}


// mamy doczynienia z losowaniem bez powtórzeń
function randomWithoutRepetition(tableOfRandomNumbers, next) {

    var divBlock = document.getElementsByClassName("block");
    var randomNumber = getRandomIntInclusive(0, divBlock.length-1);

    for(var start = 0; start < next; start++){
        
        while(checkSameNumber(tableOfRandomNumbers, randomNumber)) {
            randomNumber = getRandomIntInclusive(0, divBlock.length-1);
        }
        tableOfRandomNumbers.push( randomNumber);
        randomNumber = getRandomIntInclusive(0, divBlock.length-1);
    }

    return tableOfRandomNumbers;
}

// logika gry
// 1 wylosuj najpierw 3 pola zaznaczone


function increm(n) {
    let long = n;
    function add() {
        long++;
        return long;
    }
    return add;
}

//wiem że zły nawyk ale to chwilowe rozwiązanie
var TIMER = 0;

function prepareBoardForLogic(long, timer ) {
    window.clearTimeout(TIMER);
    var tableOfRandomNumbers = [];
    
    tableOfRandomNumbers = randomWithoutRepetition(tableOfRandomNumbers, long);

   

    for(var start = 0; start < tableOfRandomNumbers.length; start++)
    {
        var itReturnBlock = document.getElementById(tableOfRandomNumbers[start]);
        document.getElementById(""+itReturnBlock.id+"").childNodes[0].style = "background-color:rgb(149, 7, 64);";
    }
    

    TIMER = setTimeout(function() {
        for(var start = 0; start < tableOfRandomNumbers.length; start++)
        {
            var itReturnBlock = document.getElementById(tableOfRandomNumbers[start]);
            document.getElementById(""+itReturnBlock.id+"").childNodes[0].style = "background-color:white;";
        }
        
    }, timer );
    
    return tableOfRandomNumbers;
}

var rememberObj = {
    v: 4,
    get prop() {
      return this.v;
    },
    set prop(newValue) {
      this.v = newValue;
    }
};

var interval = 0;

function removeLockChildren(timer) {
    
    setTimeout(function() {    
        var divContainerForFieldGame = document.getElementById("containerForFieldGame");
        for(var start = 1; start < divContainerForFieldGame.children.length; start++) {
            divContainerForFieldGame.children[start].remove();
        }
    }, timer);

}

function logicGame(size, timer) {

    var tableOfRandomNumbers = []; 
    var long = increm(4);
    var heart = increm(-1);
    console.log("PIERWSZE URUCHOMIENIE LOGIC GAME: ");
    tableOfRandomNumbers = prepareBoardForLogic(4, timer);

    var tableToComparsion = [];

    for(var start = 0; start < size; start++)
    {
        document.getElementById(""+start+"").onclick = function(event){
        console.log( "Klikasz ", this.id);
        if( tableToComparsion.indexOf(parseInt(this.id)) > -1 ) {
            console.log("Znaleziono ", this.id);
            tableToComparsion.splice(tableToComparsion.indexOf( parseInt(this.id)), 1);
            }else {
                tableToComparsion.push(parseInt(this.id));
            }
        }
    }
    
    var check = document.getElementById("check");
    console.log("Tablica wylosowanych: ", tableOfRandomNumbers);
    console.log("Tablica wybranych: ", tableToComparsion);

    check.onclick = function() {
        // napisać teraz kod porównujący ze sobą tablice;
        var divContainerForFieldGame = document.getElementById("containerForFieldGame");

        var divToLock = document.createElement("div");
        divToLock.className = "lockFieldGame";
        divContainerForFieldGame.appendChild(divToLock);
        
        removeLockChildren(timer); // FUNKCJA KTÓRA USUWA BLOKADE
 
        if(compareArrays( tableToComparsion, tableOfRandomNumbers) ) {
            var nextLevel = long(); // następny poziom jest zwiększany w momencie gdy użytkownik odgadł prawidłowe ułożenie
            rememberObj.prop = nextLevel;
            
            // setter i getter przekazywanie danej liczby do funkcji która zapamięta aktualny poziom
            document.getElementById("check").style = "background-color: #14A76C;";
            document.getElementById("check").innerHTML = "GOOD!";
            setTimeout(function() {
                document.getElementById("check").style = "background-color: #950740;";
                document.getElementById("check").innerHTML = "Try to remember";
            }, 1200);
            console.log("Tablica wylosowanych: ", tableOfRandomNumbers);
            console.log("Tablica wybranych: ", tableToComparsion);
            tableToComparsion = [];
            for(var start = 0; start < size; start++)
            {
                var itReturnBlock = document.getElementById(tableOfRandomNumbers[start]);
                document.getElementById(""+start+"").childNodes[0].style = "background-color:white;";
            }
            setTimeout(function(){
                tableOfRandomNumbers = prepareBoardForLogic(nextLevel, timer);
                setTimeCountdown(timer);
            }, 1200);
            
            
        }else {
            // pobranie z getter aktualnego poziomu
            console.log( "Pobrano z getter rememberObj ", rememberObj.prop);
            
            var life = document.getElementById("life");
            
            // do zmiany rodzaju serca
            
            
            var nextHeart = heart();
            if(nextHeart == life.children.length-1) {
                //ta instrukcja odpowiada za game over
                heart = increm(-1);
                rememberObj.prop = 4;
                long = increm(4);
                life.children[nextHeart].children[0].children[0].className = "fas fa-heart-broken";
                var divContainerForFieldGame = document.getElementById("containerForFieldGame");
                var divToLock = document.createElement("div");
                divToLock.className = "lockFieldGame gameOver";
                divToLock.id = "lockFieldGame";
                divToLock.innerHTML = "GAME OVER";
                divContainerForFieldGame.appendChild(divToLock);

            } else {
                life.children[nextHeart].children[0].children[0].className = "fas fa-heart-broken";
            }

            document.getElementById("check").style = "background-color: #C3073F;";
            document.getElementById("check").innerHTML = "You lost life! Try again!";
            
            
            setTimeout(function() {
                document.getElementById("check").style = "background-color: #950740;";
                document.getElementById("check").innerHTML = "Try to remember";
                setTimeCountdown(timer);
            }, 1200);
            
            console.log("Tablica wylosowanych: ", tableOfRandomNumbers);
            console.log("Tablica wybranych: ", tableToComparsion);
            
            tableToComparsion = [];
            
            for(var start = 0; start < size; start++)
            {
                var itReturnBlock = document.getElementById(tableOfRandomNumbers[start]);
                document.getElementById(""+start+"").childNodes[0].style = "background-color:white;";
            }

            setTimeout(function(){
                long = increm(rememberObj.prop);
                tableOfRandomNumbers = prepareBoardForLogic(rememberObj.prop, timer);
            }, 1200);
            
        }
    }

    if(tableOfRandomNumbers.length == sizeXsize) {   
        for(var start = 0; start < tableOfRandomNumbers.length; start++)
        {
            var itReturnBlock = document.getElementById(tableOfRandomNumbers[start]);
            document.getElementById(""+itReturnBlock.id+"").childNodes[0].style = "background-color:white;";
        }
        tableOfRandomNumbers = [];
    }
}



function createFiledToGame(size, percentage, tableOfRandomNumbers, timer) {
    var randButton = document.getElementById("randMe");
    var divBlock = document.getElementsByClassName("block");
    var divBlockChild = document.getElementsByClassName("blockChild");
    var divContainerForFieldGame = document.getElementById("containerForFieldGame");

    var divToLock = document.createElement("div");
    divToLock.className = "lockFieldGame";
    divContainerForFieldGame.appendChild(divToLock);


    var life = document.getElementById("life");
    
    for(var start = 0; start <  life.children.length; start++ ) {
        life.children[start].children[0].children[0].className = "fas fa-heart";
    }

    removeLockChildren(timer);

    for(var start = 0; start < divBlock.length; start++) {
    
        divBlockChild[start].onclick = function(event){
            if(event.target.style.backgroundColor == "rgb(149, 7, 64)") 
            {
                event.target.style = "background-color:white;";
            }else {
                event.target.style = "background-color:rgb(149, 7, 64);";
            }
        };
    
    }
    sizeXsize = size*size;
    
    for(var start = 0; start < divBlock.length; start++) {
        divBlock[start].style = "width:" +percentage +"%; height:" + percentage +"%;";
    }

    logicGame(sizeXsize, timer); // łączy się z logiką gry wywołując funkcję za nią odpowiedzialną

}

function defaultStartBoard() {
    document.getElementById("lockFieldGame").remove();
    var boardsId = {"board_4": 4, "board_5":5, "board_10":10 };
    var blockList = document.getElementsByClassName("block");
    var parent = document.getElementsByClassName("fieldGame");
    var parentNode = parent[0];
    var counter = 0;

    var size = parent[0].childElementCount;

    while(size) 
    {
        size--;
        parent[0].children[size].remove();
    }

    var size = 4;
    
    for(var first_start = 0; first_start < size; first_start++) {
        for(var second_start = 0; second_start < size; second_start++) {
            var divBlock = document.createElement("div");
            divBlock.className = "block";
            divBlock.id = ""+counter;
            var divChildBlock = document.createElement("div");
            divChildBlock.className = "blockChild";
            divBlock.appendChild(divChildBlock);
            parentNode.appendChild(divBlock);
            counter++;
        }
    }

    var divBlock = document.getElementsByClassName("block");
    var divBlockChild = document.getElementsByClassName("blockChild");


    for(var start = 0; start < divBlock.length; start++) {

        divBlockChild[start].onclick = function(event){
            if(event.target.style.backgroundColor == "rgb(149, 7, 64)") 
            {
                event.target.style = "background-color:white;";
            }else {
                event.target.style = "background-color:rgb(149, 7, 64);";
            }
        };

    }
    next = 1;
    var tableOfRandomNumbers = [];
    var percentage = 25;
    var size = 4;
    const timer = 5000; // 5 sekund
    createFiledToGame(size, percentage, tableOfRandomNumbers, timer); // Tworzy pole do gry
    setTimeCountdown(timer);
}



window.onload = defaultStartBoard;

var boardsId = {"board_4": 4, "board_5":5, "board_10":10 };

for( const id in boardsId )
{
    var board = document.getElementById(""+`${id}`+"");
    
    board.onclick = function(event) {

        var blockList = document.getElementsByClassName("block");
        var parent = document.getElementsByClassName("fieldGame");
        var parentNode = parent[0];
        var counter = 0;

        var size = parent[0].childElementCount;

        while(size) 
        {
            size--;
            parent[0].children[size].remove();
        }
        
        var size = `${boardsId[id]}`;
        
        for(var first_start = 0; first_start < size; first_start++) {
            for(var second_start = 0; second_start < size; second_start++) {
                var divBlock = document.createElement("div");
                divBlock.className = "block";
                divBlock.id = ""+counter;
                var divChildBlock = document.createElement("div");
                divChildBlock.className = "blockChild";
                divBlock.appendChild(divChildBlock);
                parentNode.appendChild(divBlock);
                counter++;
            }
        }
        
        var divBlock = document.getElementsByClassName("block");
        var divBlockChild = document.getElementsByClassName("blockChild");
        

        for(var start = 0; start < divBlock.length; start++) {
        
            divBlockChild[start].onclick = function(event){
                if(event.target.style.backgroundColor == "rgb(149, 7, 64)") 
                {
                    event.target.style = "background-color:white;";
                }else {
                    event.target.style = "background-color:rgb(149, 7, 64);";
                }
            };
        
        }
        
        if(this.id == "board_4") {
            if(document.getElementById("lockFieldGame")) {
                document.getElementById("lockFieldGame").remove();
            }
            document.getElementById("check").innerHTML = "Try to remember";
            next = 1;
            var tableOfRandomNumbers = [];
            var percentage = 25;
            var size = 4;
            const timer = 7000; // 7sekund;
            removeLockChildren(timer);
            console.log("Ustawiam: ", timer/1000, " sek");
            createFiledToGame(size, percentage, tableOfRandomNumbers, timer); // Tworzy pole do gry
            setTimeCountdown(timer);

        }
        
        if(this.id == "board_5") {
            if(document.getElementById("lockFieldGame")) {
                document.getElementById("lockFieldGame").remove();
            }
            document.getElementById("check").innerHTML = "Try to remember";
            next = 1;
            tableOfRandomNumbers = [];
            var percentage = 20;
            var size = 5;
            const timer = 10000; // 10sekund;
            removeLockChildren(timer);
            console.log("Ustawiam: ", timer/1000, " sek");
            createFiledToGame(size, percentage, tableOfRandomNumbers, timer); // Tworzy pole do gry
            setTimeCountdown(timer);
        }
        
        if(this.id == "board_10") {
            if(document.getElementById("lockFieldGame")) {
                document.getElementById("lockFieldGame").remove();
            }
            document.getElementById("check").innerHTML = "Try to remember";
            next = 1;
            tableOfRandomNumbers = [];
            var percentage = 10;
            var size = 10;
            const timer = 15000; // 15ekund;
            removeLockChildren(timer);
            console.log("Ustawiam: ", timer/1000, " sek");
            createFiledToGame(size, percentage, tableOfRandomNumbers, timer); // Tworzy pole do gry
            setTimeCountdown(timer);
        }
    }
}
