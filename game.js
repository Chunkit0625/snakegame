/**
 * 贪吃蛇双端兼容逻辑 (TikTok Mini-Game & Web)
 */

let canvas, ctx;

// 1. 环境初始化
if (typeof tt !== 'undefined') {
    // TikTok 环境
    canvas = tt.createCanvas();
    ctx = canvas.getContext('2d');
} else {
    // 手机浏览器/GitHub Pages 环境
    canvas = document.getElementById('gameCanvas');
    if (!canvas) {
        canvas = document.createElement('canvas');
        document.body.appendChild(canvas);
    }
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    ctx = canvas.getContext('2d');
}

// 2. 游戏配置
const gridSize = 20; 
const tileCountX = Math.floor(canvas.width / gridSize);
const tileCountY = Math.floor(canvas.height / gridSize);

let snake = [{x: 10, y: 10}];
let food = {x: 5, y: 5};
let dx = 0;
let dy = 0;
let score = 0;
let gameSpeed = 120; // 速度（毫秒）

// 3. 操控逻辑：点击左半边屏向左转，右半边向右转
const handleInput = (clientX) => {
    if (clientX > canvas.width / 2) {
        // 顺时针旋转方向
        if (dx === 0 && dy === -1) { dx = 1; dy = 0; }
        else if (dx === 1 && dy === 0) { dx = 0; dy = 1; }
        else if (dx === 0 && dy === 1) { dx = -1; dy = 0; }
        else if (dx === -1 && dy === 0) { dx = 0; dy = -1; }
        else { dx = 1; dy = 0; } // 初始启动
    } else {
        // 逆时针旋转方向
        if (dx === 0 && dy === -1) { dx = -1; dy = 0; }
        else if (dx === -1 && dy === 0) { dx = 0; dy = 1; }
        else if (dx === 0 && dy === 1) { dx = 1; dy = 0; }
        else if (dx === 1 && dy === 0) { dx = 0; dy = -1; }
        else { dx = -1; dy = 0; } // 初始启动
    }
};

// 监听 TikTok 触摸
if (typeof tt !== 'undefined') {
    tt.onTouchStart((res) => handleInput(res.touches[0].clientX));
} else {
    // 监听浏览器触摸与鼠标
    window.addEventListener('touchstart', (e) => handleInput(e.touches[0].clientX));
    window.addEventListener('mousedown', (e) => handleInput(e.clientX));
}

// 4. 游戏主循环
function main() {
    if (checkGameOver()) {
        alert("Game Over! Score: " + score);
        snake = [{x: 10, y: 10}];
        dx = 0; dy = 0; score = 0;
    }

    setTimeout(function onTick() {
        draw();
        advanceSnake();
        main();
    }, gameSpeed);
}

function draw() {
    // 背景
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 蛇身 (TikTok 青)
    ctx.fillStyle = "#25F4EE";
    snake.forEach(part => {
        ctx.fillRect(part.x * gridSize, part.y * gridSize, gridSize - 2, gridSize - 2);
    });

    // 食物 (TikTok 红)
    ctx.fillStyle = "#FE2C55";
    ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize - 2, gridSize - 2);

    // 分数显示
    ctx.fillStyle = "white";
    ctx.font = "16px Arial";
    ctx.fillText("Score: " + score, 10, 20);
}

function advanceSnake() {
    if (dx === 0 && dy === 0) return;
    const head = {x: snake[0].x + dx, y: snake[0].y + dy};
    snake.unshift(head);
    
    if (snake[0].x === food.x && snake[0].y === food.y) {
        score += 10;
        createFood();
    } else {
        snake.pop();
    }
}

function checkGameOver() {
    if (dx === 0 && dy === 0) return false;
    const hitWall = snake[0].x < 0 || snake[0].x >= tileCountX || snake[0].y < 0 || snake[0].y >= tileCountY;
    let hitSelf = false;
    for (let i = 4; i < snake.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) hitSelf = true;
    }
    return hitWall || hitSelf;
}

function createFood() {
    food.x = Math.floor(Math.random() * tileCountX);
    food.y = Math.floor(Math.random() * tileCountY);
}

// 启动游戏
main();
