const form = document.querySelector('form');
const board = document.querySelector('.board');
const main = document.querySelector('main');
const backgroundBlur = document.querySelector('.backgroundBlur');
const chunk = document.querySelectorAll('.chunk');

const winnerDisplayCard = document.createElement('div');
winnerDisplayCard.classList.add('winner-display');
const h2 = document.createElement('h2');
const p = document.createElement('p');
const button = document.createElement('button');
button.innerHTML = `Restart`;
button.classList.add('restart');
winnerDisplayCard.appendChild(h2);
winnerDisplayCard.appendChild(p);
winnerDisplayCard.appendChild(button);


const boardIdx = [
    {status : false ,x : 0,y : 0,index : 0},
    {status : false ,x : 0,y : 1,index : 1},
    {status : false ,x : 0,y : 2,index : 2},
    {status : false ,x : 1,y : 0,index : 3},
    {status : false ,x : 1,y : 1,index : 4},
    {status : false ,x : 1,y : 2,index : 5},
    {status : false ,x : 2,y : 0,index : 6},
    {status : false ,x : 2,y : 1,index : 7},
    {status : false ,x : 2,y : 2,index : 8}
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

    const idx = targetBlock.dataset.idx;
    const x = Number(targetBlock.dataset.x);
    const y = Number(targetBlock.dataset.y);

    if(boardIdx[idx].status) return;

    grid[x][y] = turn;
    markMove(targetBlock ,idx);

}


async function computerPlays(targetBlock){

    if(computerThinking == true) return;
    computerThinking = true;

    const idx = targetBlock.dataset.idx;
    const x = Number(targetBlock.dataset.x);
    const y = Number(targetBlock.dataset.y);

    if(boardIdx[idx].status) return;
    grid[x][y] = turn;
    markMove(targetBlock ,idx);


    if(computerThinking){
        await computerMakesMove();
    }

    computerThinking = false;

}

function markMove(target , idx){
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
    moves += 1;
    if(moves >= 5) calculateWinner();
    turn = (turn === 0) ? 1 : 0;
}

async function computerMakesMove(){
    await new Promise(resolve => setTimeout(resolve , 1000));

    const available = boardIdx.filter(cell => !cell.status);

    if(available.length === 0){
        return;
    }

    const randomIdx = available[Math.floor(Math.random() * available.length)].index;
    
    let x;
    let y;
    x = boardIdx[randomIdx].x;
    y = boardIdx[randomIdx].y;


    grid[x][y] = turn;
    markMove(chunk[randomIdx] , randomIdx);
}

function calculateWinner(){
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
    p.textContent = `Press Restart To Start New Game`;
    //Either Player wins
    if(winner === 0 || winner === 3){
        if(computerPlay){
            h2.textContent = `${(turn == 1) ? "Player - 1" : "Computer"} Won!!`;
        }
        else{
            h2.textContent = `${(turn == 1) ? "Player - 1" : "Player - 2"} Won!!`;
        }
    }
    //Draw..
    else{
        h2.textContent = `it's a Draw`;
        p.textContent = `Start again and find who's the winner`;
    }

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

        boardIdx.forEach((item) =>{
            item.status = false;
        })

        turn = 1;
    }


}
