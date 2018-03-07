var canvas;
var canvasContext;
var ballX = 400;
var ballY = 300;
var ballSpeedX = 10;
var ballSpeedY = 4;

var paddle1Y = 250;
var paddle2Y = 250;
const PADDLE_HEIGHT = 100;
const PADDLE_THICKNESS = 11;
const FPS = 30;

var player1Score = 0;
var player2Score = 0;
const WINNING_SCORE = 3;
var culoareB = "white";
var culoareP = "white";

var background = new Image();

var showingWinScreen = false;
var gamePaused = false;
var game;
var gameOn = false;
var net = false;

var menu;
var table;
var score = false;
var settings = false;

window.onload = function()
{
    canvas = document.getElementById("gameCanvas");
    canvasContext = canvas.getContext("2d");

    menu = document.getElementById("comenzi");

    table = document.getElementById("myTable");

    drawEverything();
    canvas.addEventListener("mousedown", handleMouseClick);
    canvas.addEventListener("mousemove", function(evt){var mousePos = calculateMousePos(evt); paddle1Y = mousePos.y - (PADDLE_HEIGHT/2);});

    document.addEventListener('keydown', function (evt) {
        if (evt.which === 32)
        {
            pauseGame();
        }
    });

    canvas.addEventListener('mousedown', function (evt) {
        if (!gameOn)
        {
            gameOn = true;
            game = setInterval(startGame, 1000 / FPS);
        }
    });

    var buton = document.getElementById("buton");
    buton.onclick = function()
    {
        var B = document.getElementsByName("ball");
        for (var i = 0; i < B.length; i++)
        {
            if (B[i].checked)
            {
                culoareB = B[i].value;
            }
        }
        var P = document.getElementsByName("palette");
        for (var j = 0; j < P.length; j++)
        {
            if (P[j].checked)
            {
                culoareP = P[j].value;
            }
        }
        var N = document.getElementsByName("net");
        if (N[0].checked)
            net = true;
        else
            net = false;

        setTimeout(function() {
            if(!settings)
            {
                var textContainer = document.getElementById("txt");
                var textNode = document.createTextNode("Settings saved");
                textContainer.appendChild(textNode);
                settings = true;
            }
        }, 1000);

        setTimeout(storage, 1000);

    }
    var today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    document.getElementById("date").innerHTML = date + ' ' + time;

}

function pauseGame()
{
    if (!gamePaused)
    {
        game = clearInterval(game);
        gamePaused = true;
    } else if (gamePaused)
    {
        game = setInterval(startGame, 1000 / FPS);
        gamePaused = false;
    }
}

function startGame()
{
    drawEverything();
    moveEverything();
}

function handleMouseClick(evt)
{
    //canvasContext.fillText("click to start", 350, 500);
    if (showingWinScreen)
    {
        player1Score = 0;
        player2Score = 0;
        showingWinScreen = false;
        canvasContext.fillText("click to continue", 350, 500);
    }
}

function calculateMousePos(evt)
{
    var rect = canvas.getBoundingClientRect();
    var root = document.documentElement;
    var mouseX = evt.clientX - rect.left - root.scrollLeft;
    var mouseY = evt.clientY - rect.top - root.scrollTop;
    return{
        x:mouseX,
        y:mouseY
    };
}

function ballReset()
{
    if (player1Score >= WINNING_SCORE || player2Score >= WINNING_SCORE)
    {
        showingWinScreen = true;
    }
    ballSpeedX = -ballSpeedX;
    ballX = canvas.width/2;
    ballY = canvas.height/2;
}

function computerMovement()
{
    var paddle2YCentre = paddle2Y + (PADDLE_HEIGHT/2);
    if (paddle2YCentre < ballY - 35)
        paddle2Y += 6;
    else if (paddle2YCentre > ballY + 35)
        paddle2Y -= 6;
}

function moveEverything()
{
    if (showingWinScreen)
    {
        return;
    }

    computerMovement();

    ballX += ballSpeedX;
    ballY -= ballSpeedY;

    if (ballX < 0) {
        if (ballY > paddle1Y && ballY < paddle1Y + PADDLE_HEIGHT) 
		{
            ballSpeedX = -ballSpeedX;
            var deltaY = ballY - (paddle1Y + PADDLE_HEIGHT / 2);
            ballSpeedY = deltaY * 0.25;
        }
        else 
		{
            player2Score++;
            ballReset();
        }
    }
    if (ballX > canvas.width) 
	{
        if (ballY > paddle2Y && ballY < paddle2Y + PADDLE_HEIGHT) 
		{
            ballSpeedX = -ballSpeedX;
            var delta = ballY - (paddle2Y + PADDLE_HEIGHT / 2);
            ballSpeedY = delta * 0.25;
        }
        else 
		{
            player1Score++;
            ballReset();
        }
    }

    if (ballY < 0)
        ballSpeedY = -ballSpeedY;
    if (ballY > canvas.height)
        ballSpeedY = -ballSpeedY;

}

function drawNet()
{
    for (var i = 0; i < canvas.height; i+=40)
    {
        colorRect(canvas.width/2 - 1, i, 2, 20, "white");
    }
}

function drawEverything()
{
    if (showingWinScreen)
    {
        canvasContext.fillStyle = "white";
        if (player1Score >= WINNING_SCORE)
        {
            canvasContext.fillText(player1Score, 100, 100);
            canvasContext.fillText("Player 1 won.", 350, 200);

            showScore();
        }
        else if(player2Score >= WINNING_SCORE)
        {
            canvasContext.fillText(player2Score, canvas.width - 100, 100);
            canvasContext.fillText("Player 2 won.", 350, 200);

            showScore();
        }
        canvasContext.fillText("click to continue", 350, 500);
        return;
    }

    //colorRect(0, 0, canvas.width, canvas.height, "black");

    var my_gradient = canvasContext.createLinearGradient(0,0,0,2500);
    my_gradient.addColorStop(0,"#4A7C17");
    my_gradient.addColorStop(1,"#bad281");
    canvasContext.fillStyle = my_gradient;
    canvasContext.fillRect(0, 0, canvas.width, canvas.height);

    if (net)
        drawNet();
    colorRect(0, paddle1Y, PADDLE_THICKNESS, PADDLE_HEIGHT, culoareP); //left paddle
    colorRect(canvas.width - PADDLE_THICKNESS, paddle2Y, PADDLE_THICKNESS, PADDLE_HEIGHT, culoareP); //right paddle
    colorCircle(ballX, ballY, PADDLE_THICKNESS, culoareB);

    canvasContext.fillStyle = "white";
    canvasContext.fillText(player1Score, 100, 100);
    canvasContext.fillText(player2Score, canvas.width - 100, 100);
    score = false;
}

function colorCircle(centerX, centerY, radius, drawColor)
{
    canvasContext.fillStyle = drawColor;
    canvasContext.beginPath();
    canvasContext.arc(centerX, centerY, radius, 0, Math.PI*2, true);
    canvasContext.fill();
}

function colorRect(leftX, topY, width, height, drawColor)
{
    canvasContext.fillStyle = drawColor;
    canvasContext.fillRect(leftX, topY, width, height);
}

function showScore()
{
    if(!score)
    {
        var x = document.getElementById("myTable").rows.length;
        var row = table.insertRow(x);
        var cell1 = row.insertCell(0);
        var cell2 = row.insertCell(1);
        cell1.innerHTML = player1Score;
        cell2.innerHTML = player2Score;
        score = true;
    }
}

function displayColor()
{
    var elem = document.getElementById("comenzi");
    alert(window.getComputedStyle(elem,null).getPropertyValue("background-color"));
}
function storage()
{
    if (typeof(Storage) !== "undefined")
    {
        if (localStorage.clickcount)
            localStorage.clickcount = Number(localStorage.clickcount) + 1;
        else
            localStorage.clickcount = 1;
        document.getElementById("Lcounter").innerHTML = "You have changed the settings " + localStorage.clickcount + " time(s).";
    }
    else
        document.getElementById("Lcounter").innerHTML = "Sorry, your browser does not support web storage...";

    if (typeof(Storage) !== "undefined")
    {
        if (sessionStorage.clickcount)
            sessionStorage.clickcount = Number(sessionStorage.clickcount)+1;
        else
            sessionStorage.clickcount = 1;
        document.getElementById("Scounter").innerHTML = "You have changed the settings " + sessionStorage.clickcount + " time(s) in this session.";
    }
    else
        document.getElementById("Scounter").innerHTML = "Sorry, your browser does not support web storage...";
}

function allowDrop(ev)
{
    ev.preventDefault();
}

function drag(ev)
{
    ev.dataTransfer.setData("text", ev.target.id);
}

function drop(ev)
{
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    ev.target.appendChild(document.getElementById(data));
}

