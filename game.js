// 1. 环境兼容处理
let canvas;
if (typeof tt !== 'undefined') {
    canvas = tt.createCanvas(); // TikTok 环境
} else {
    canvas = document.getElementById('gameCanvas'); // 浏览器环境
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

const ctx = canvas.getContext('2d');
const gridSize = 20;
const tileCountX = Math.floor(canvas.width / gridSize);
const tileCountY = Math.floor(canvas.height / gridSize);

let snake = [{x: 10, y: 10}];
let food = {x: 5, y: 5};
let dx = 0, dy = 0, score = 0;
let gameSpeed = 150;

// 2. 统一触摸事件 (适配 TikTok 和 手机浏览器)
const handleInput = (clientX) => {
    if (clientX > canvas.width / 2) {
        // 右转逻辑
        if (dx === 0 && dy === -1) { dx = 1; dy = 0; }
        else if (dx === 1 && dy === 0) { dx = 0; dy = 1; }
        else if (dx === 0 && dy === 1) { dx = -1; dy = 0; }
        else if (dx === -1 && dy === 0) { dx = 0; dy = -1; }
        else { dx = 1; dy = 0; }
    } else {
        // 左转逻辑
        if (dx === 0 && dy === -1) { dx = -1; dy = 0; }
        else if (dx === -1 && dy === 0) { dx = 0; dy = 1; }
        else if (dx === 0 && dy === 1) { dx = 1; dy = 0; }
        else if (dx === 1 && dy === 0) { dx = 0; dy = -1; }
        else { dx = -1; dy = 0; }
    }
};

if (typeof tt !== 'undefined') {
    tt.onTouchStart((res) => handleInput(res.touches[0].clientX));
} else {
    window.addEventListener('touchstart', (e) => handleInput(e.touches[0].clientX));
    window.addEventListener('mousedown', (e) => handleInput(e.clientX)); // 方便电脑调试
}

// 3. 游戏主循环
function main() {
    if (checkGameOver()) {
        snake = [{x: 10, y: 10}]; dx = 0; dy = 0; score = 0;
    }
    setTimeout(() => {
        draw();
        main();
    }, gameSpeed);
}

function draw() {
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 画蛇
    ctx.fillStyle = "#25F4EE";
    snake.forEach(p => ctx.fillRect(p.x * gridSize, p.y * gridSize, gridSize - 2, gridSize - 2));

    // 移动蛇
    const head = {x: snake[0].x + dx, y: snake[0].y + dy};
    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        score += 10;
        food = {x: Math.floor(Math.random() * tileCountX), y: Math.floor(Math.random() * tileCountY)};
    } else {
        snake.pop();
    }

    // 画食物
    ctx.fillStyle = "#FE2C55";
    ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize - 2, gridSize - 2);
}

function checkGameOver() {
    if (dx === 0 && dy === 0) return false;
    return snake[0].x < 0 || snake[0].x >= tileCountX || snake[0].y < 0 || snake[0].y >= tileCountY;
}

main();
