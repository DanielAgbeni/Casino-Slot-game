'use strict'
const cash = document.querySelector('.cash')
const stake = document.querySelector('.stake')
const bet = document.querySelector('.bet')
const money = document.querySelector('.money')
const btn = document.querySelector('.btn')
const roll = document.querySelector('.roll')
const overlay = document.querySelector('.overlay')
const fruit0 = document.querySelector('.fruit0')
const fruit1 = document.querySelector('.fruit1')
const fruit2 = document.querySelector('.fruit2')
const replay = document.querySelector('.again')


//Initializing
let actualMoney = 1000
let deposit = 0
let startPlaying = false
let space =0
let space1 =0
let space2 = 0
btn.addEventListener('click', function () {
    deposit = Number(money.value)
    console.log(deposit);
    start()
    
})
document.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
            deposit = Number(money.value)
                    start()
            }
        })
    roll.addEventListener('click', function () {
        space =  Math.trunc(Math.random()*3+1)
        space1 = Math.trunc(Math.random()*3+1)
        space2 = Math.trunc(Math.random()*3+1)
    
        if (space == 1) {
            space = '🍓'
        }else if (space == 2) {
            space = '🍇'
        }else if (space == 3) {
            space = '🍩'
        }
        if (space1 == 1) {
            space1 = '🍓'
        }else if (space1 == 2) {
            space1 = '🍇'
        }else if (space1 == 3) {
            space1 = '🍩'
        }
        if (space2 == 1) {
            space2 = '🍓'
        }else if (space2 == 2) {
            space2 = '🍇'
        }else if (space2 == 3) {
            space2 = '🍩'
        }
        if (actualMoney >= deposit) {
        fruit0.classList.add('hidden')
        fruit1.classList.add('hidden')
        fruit2.classList.add('hidden')
        setTimeout(() => {
            fruit0.classList.remove('hidden')
            fruit1.classList.remove('hidden')
            fruit2.classList.remove('hidden')
        }, 1500)
        if (space === space1 && space === space2 && space1 == space2) {
            setTimeout(() => {
                roll.classList.add('hidden')
                actualMoney = (deposit*10) + actualMoney
                cash.textContent = `$${actualMoney}`
                document.querySelector('.text').textContent = `YOU WON: $${deposit*10}`
                document.querySelector('.win').classList.remove('hidden')
                overlay.classList.remove('hidden')
            }, 4500)
        }else{
            
          actualMoney = actualMoney -  deposit
           cash.textContent = `$${actualMoney}`
        }
        fruit0.textContent = space, 
        fruit1.textContent = space1, 
        fruit2.textContent = space2
    }else{
        document.querySelector('.msg').textContent = 'You are broke nigga get out!!!'
        document.querySelector('.msg').style.fontSize = '1.8rem'
        document.querySelector('.msg').style.color= '#fff'
        bet.classList.remove('hidden')
        bet.style.backgroundColor = '#a011309'
        money.classList.add('hidden')
        btn.classList.add('hidden')
        overlay.classList.remove('hidden')
    }
        console.log(fruit0,fruit1,fruit2);
    }) 
replay.addEventListener('click', function(){
    bet.classList.remove('hidden')
    overlay.classList.remove('hidden') 
    document.querySelector('.win').classList.add('hidden')
})

function start() {
    if (deposit <= 100 && deposit >= 10 && actualMoney > 10) {
        actualMoney -= deposit
        cash.textContent = `$${actualMoney}`
        stake.textContent = `$${deposit}`
        bet.classList.add('hidden')
        overlay.classList.add('hidden')
        roll.classList.remove('hidden')
        startPlaying = true
    } else {
        money.classList.add('hidden')
        bet.style.backgroundColor = 'red'
        btn.classList.add('hidden')
        document.querySelector('.retry').classList.remove('hidden')
        document.querySelector('.msg').textContent = 'You are Either out of cash or your staking is wrong'
        document.querySelector('.retry').addEventListener('click', function () {
            bet.style.backgroundColor = 'green'
            money.classList.remove('hidden')
            btn.classList.remove('hidden')
            document.querySelector('.retry').classList.add('hidden')
            document.querySelector('.msg').textContent = 'Stake between $10 and $100'
        })
    }
}