import { Dust, Fire, Splash } from './particles.js';

const states = {
    IDLE: 0,
    RUNNING: 1,
    JUMPING: 2,
    FALLING: 3,
    HIT: 4,
    // ATTACKING: 4,
    // DIVING: 5,
}

class State {
    constructor(state, game){
        this.state = state;
        this.game = game;
    }
}

export class Idle extends State {
    constructor(game){
        super('IDLE', game);
    }
    enter(){
        // this.game.player.frameX = 0;
        this.game.player.width = 1500/16;
        this.game.player.maxFrame = 15;
        this.game.player.frameY = 0;
    }
    handleInput(input){
        if (input.includes(`ArrowLeft`) || input.includes(`ArrowRight`) || input.includes(`swipe left`) || input.includes(`swipe right`)){
            this.game.player.setState(states.RUNNING,1 );
        } 
    }
}

export class Running extends State {
    constructor(game){
        super('RUNNING', game);
    }
    enter(){
        // this.game.player.frameX = 0;
        this.game.player.width = 1126/11;
        this.game.player.maxFrame = 10;
        this.game.player.frameY = 2;
    }
    handleInput(input){
        this.game.particles.push(new Dust(this.game, this.game.player.x + this.game.player.width * 0.6, this.game.player.y + this.game.player.height));
        if (input.includes(`ArrowDown`)){
            this.game.player.setState(states.IDLE, 0);
        } else if (input.includes(`ArrowUp`) || input.includes(` `) || input.includes('swipe up')){
            this.game.player.setState(states.JUMPING, 1);
            // and sound effect for jump
            // https://stackoverflow.com/questions/32077459/play-sound-only-once
            var jumpSound = new Audio('../assets/jump.wav');
            jumpSound.loop = false;
            jumpSound.play();
        } 
    }
}

export class Jumping extends State {
    constructor(game){
        super('JUMPING', game);    }
    enter(){
        if (this.game.player.onGround()) this.game.player.vy -= 21;
        // this.game.player.frameX = 0;
        this.game.player.width = 1724/16;
        this.game.player.maxFrame = 15;
        this.game.player.frameY = 3;
    }
    handleInput(input){
        if (this.game.player.vy > this.game.player.weight){
            this.game.player.setState(states.FALLING, 1);
        } 
    }
}

export class Falling extends State {
    constructor(game){
        super('FALLING', game);
    }
    enter(){
        // this.game.player.frameX = 0
        this.game.player.width = 1724/16;
        this.game.player.maxFrame = 15;
        this.game.player.frameY = 3;
    }
    handleInput(input){
        if (this.game.player.onGround()){
            this.game.player.setState(states.RUNNING, 1);
        } 
    }
}

export class Hit extends State {
    constructor(game){
        super('HIT', game);
    }
    enter(){
        // this.game.player.frameX = 0
        this.game.player.width = 3096/17;
        this.game.player.maxFrame = 16;
        this.game.player.frameY = 5;
    }
    handleInput(input){

        if (this.game.player.frameX >= 16 && this.game.player.onGround()){
            this.game.player.setState(states.RUNNING, 1);

        } else if (this.game.player.frameX >= 16 && !this.game.player.onGround()){
            this.game.player.setState(states.FALLING, 1);
        }
    } 
}