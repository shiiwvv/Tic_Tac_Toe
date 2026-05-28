const form = document.querySelector('form');
const board = document.querySelector('.board');
const main = document.querySelector('main');
const backgroundBlur = document.querySelector('.backgroundBlur');
const chunk = document.querySelectorAll('.chunk');

const winnerDisplayCard = document.createElement('div');
winnerDisplayCard.classList.add('winner-display');

const boardIdx = [
    {status : false , x : 0,y : 0,},
    {status : false ,x : 0,y : 1,},
    {status : false ,x : 0,y : 2,},
    {status : false , x : 1,y : 0,},
    {status : false , x : 1,y : 1,},
    {status : false , x : 1,y : 2,},
    {status : false , x : 2,y : 0,},
    {status : false , x : 2,y : 1,},
    {status : false , x : 2,y : 2,}
];

let grid = Array.from({length : 3} , () =>{
    return Array(3).fill('.')
    /*Here I've to use the return statement because I've opened a scope that's why..*/
});

let playStatus = false;
let GameMode = null;
let computerPlay = false;
let computerThinking = false;
let turn = 1;
let moves = 0;

form.addEventListener('submit' , (event)=>{
    event.preventDefault();

    const formData = new FormData(form);
    const choice = formData.get('choice');
    playStatus = true;
    GameMode = choice;
    if(GameMode === "computer"){
        computerPlay = true;
    }
})

board.addEventListener('click' , handleClick);

winnerDisplayCard.addEventListener('click' , startGame);

function handleClick(event){
    const Target = event.target;
    if(Target.classList.contains('chunk')){
        if(playStatus){
            if(computerPlay){
                computerPlays(Target);
            }
            else{
                UserPlays(Target);
            }
        }
        else{
            alert("Please Select a Mode");
        }
    }
}

function UserPlays(targetBlock){
    console.log("UserPlay");
    
    const idx = targetBlock.dataset.idx;
    const x = Number(targetBlock.dataset.x);
    const y = Number(targetBlock.dataset.y);
    grid[x][y] = turn;
    markMove(targetBlock ,idx);
    
    if(moves >= 5) calculateWinner();
}

function computerPlays(targetBlock){
    console.log("ComputerPlay");
    if(computerThinking) return;
    const idx = targetBlock.dataset.idx;
    const x = Number(targetBlock.dataset.x);
    const y = Number(targetBlock.dataset.y);
    grid[x][y] = turn;
    markMove(targetBlock ,idx);

    computerThinking = true;

    if(computerThinking){
        computerMakesMove();
    }

    computerThinking = false;

    if(moves >= 5) calculateWinner();
}

function markMove(target , idx){
    console.log("markMove");
    boardIdx[idx].status = true;
    console.log((boardIdx));
    if(turn == 1){
        target.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="100%" height="100%">
  <defs>
    <radialGradient id="bgGrad" cx="50%" cy="50%" r="70%">
      <stop offset="0%" stop-color="#1e1b4b" />
      <stop offset="100%" stop-color="#0f172a" />
    </radialGradient>

    <filter id="glowX" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="6" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>

    <linearGradient id="gradX" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#38bdf8" />
      <stop offset="100%" stop-color="#3b82f6" />
    </linearGradient>
  </defs>

  <rect width="100%" height="100%" fill="url(#bgGrad)" />

  <g filter="url(#glowX)">
    <g stroke="#000" stroke-width="18" stroke-linecap="round" opacity="0.4" transform="translate(2, 4)">
      <line x1="50" y1="50" x2="150" y2="150" />
      <line x1="150" y1="50" x2="50" y2="150" />
    </g>
    
    <g stroke="url(#gradX)" stroke-width="16" stroke-linecap="round">
      <line x1="50" y1="50" x2="150" y2="150" />
      <line x1="150" y1="50" x2="50" y2="150" />
    </g>
    
    <g stroke="#e0f2fe" stroke-width="4" stroke-linecap="round">
      <line x1="50" y1="50" x2="150" y2="150" />
      <line x1="150" y1="50" x2="50" y2="150" />
    </g>
  </g>
</svg>`;
    }
    else{
        target.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="100%" height="100%">
  <defs>
    <!-- Background Gradient -->
    <radialGradient id="bgGrad" cx="50%" cy="50%" r="70%">
      <stop offset="0%" stop-color="#1e1b4b" />
      <stop offset="100%" stop-color="#0f172a" />
    </radialGradient>

    <!-- Nought Glow Filter -->
    <filter id="glowO" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="6" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>

    <!-- Nought Gradient -->
    <linearGradient id="gradO" x1="0%" y1="100%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#f43f5e" />
      <stop offset="100%" stop-color="#fb7185" />
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="100%" height="100%" fill="url(#bgGrad)" />

  <!-- The Nought (O) -->
  <g filter="url(#glowO)">
    <!-- Drop Shadow for Depth -->
    <circle cx="100" cy="100" r="50" fill="none" stroke="#000" stroke-width="18" opacity="0.4" transform="translate(2, 4)" />
    
    <!-- Main Neon Nought -->
    <circle cx="100" cy="100" r="50" fill="none" stroke="url(#gradO)" stroke-width="16" />
    
    <!-- Inner Core Highlight -->
    <circle cx="100" cy="100" r="50" fill="none" stroke="#ffe4e6" stroke-width="4" />
  </g>
</svg>
`;
    }
    turn = (turn === 0) ? 1 : 0;
    moves += 1;
}

async function computerMakesMove(){

    await new Promise(resolve => setTimeout(resolve , 1000));

    let x;
    let y;
    let idx;
    while(true){
        const randomIdx = Math.floor(Math.random() * 8);
        console.log(`randomIdx: ${randomIdx}`);
        if(boardIdx[randomIdx].status != true){
            x = boardIdx[randomIdx].x;
            y = boardIdx[randomIdx].y;
            idx = randomIdx;
            break;
        }
    }

    grid[x][y] = turn;
    console.log('computerMakesMove');
    markMove(chunk[idx] , idx);
}

function calculateWinner(){
    console.log("calculating winner");
    //Checking Row Wise
    for(let row = 0 ; row < 3 ; row++){
        let sum = 0;
        for(let col = 0 ; col < 3 ; col ++){
            sum += Number(grid[row][col]);
        }
        if(sum === 0 || sum === 3){
            displayWinner(sum);
            return;
        }
    }
    
    //Checking Col Wise
    for(let col = 0 ; col < 3 ; col++){
        let sum = 0;
        for(let row = 0 ; row < 3 ; row++){
            sum += Number(grid[row][col]);
        }
        if(sum === 0 || sum === 3){
            displayWinner(sum);
            return;
        }
    }
    
    //Checking Diagonals
    let sumRightDiagonal = 0;
    for(let i = 0 ; i < 3 ; i++){
        sumRightDiagonal += Number(grid[i][i]);
    }
    if(sumRightDiagonal === 0 || sumRightDiagonal === 3){
        displayWinner(sumRightDiagonal);
        return;
    }
    
    let sumLeftDiagonal = 0;
    for(let i = 2 ; i >= 0 ; i--){
        sumLeftDiagonal += Number(grid[3 - i - 1][i]);
    }
    // console.log(`left Diagonal: ${sumLeftDiagonal}`);
    if(sumLeftDiagonal === 0 || sumLeftDiagonal === 3){
        displayWinner(sumLeftDiagonal);
        return;
    }

    if(moves == 9){
        displayWinner(NaN);
        endGame();
    }

}

function displayWinner(winner){
    console.log("Winner is" , winner);

    //Either Player wins
    if(winner === 0 || winner === 3){
        winnerDisplayCard.innerHTML = `
            <h2>${(winner == 0) ? "Player - 2" : "Player - 1"}</h2>
            <p>Want to Play Again</p>
            <button class="restart">Restart</button>
        `;
    }
    //Draw..
    else{
        winnerDisplayCard.innerHTML = `
            <h2>it's a Draw</h2>
            <p>Play Again to find out who wins</p>
            <button class="restart">Restart</button>
        `;
    }

    backgroundBlur.classList.add('enable');
    main.appendChild(winnerDisplayCard);
    endGame();
}


function endGame(){
    board.removeEventListener('click' , handleClick);
    playStatus = false;
    GameMode = null;
    computerThinking = false;
    computerPlay = false;
    turn = 1;
    moves = 0;
}

function startGame(event){
    event.preventDefault();

    const Target = event.target;

    if(Target.classList.contains('restart')){
        board.addEventListener('click' , handleClick);
        backgroundBlur.classList.remove('enable');
        main.removeChild(winnerDisplayCard);

        //Returning the Div's grid to its initial State.
        chunk.forEach((item)=>{
            item.innerHTML = "";
        });

        //Returning the LocalGrid to Its initial State.
        for(let row = 0 ; row < 3 ; row++){
            for(let col = 0 ; col < 3 ; col++){
                grid[row][col] = '.';
            }
        }
    }
}
