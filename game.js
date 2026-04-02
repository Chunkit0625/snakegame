if (typeof tt !== 'undefined') {
    const canvas = tt.createCanvas();
    const ctx = canvas.getContext('2d');
    const gridSize = 20; 
    const tileCount = Math.floor(canvas.width / gridSize);
    
    let snake = [{x: 10, y: 10}];
    let food = {x: 5, y: 5};
    let dx = 0, dy = 0, score = 0;
    let gameSpeed = 120;

    // 触摸控制：点击左半屏左转，右半屏右转
    tt.onTouchStart((res) => {
        const touchX = res.touches[0].clientX;
        if (touchX > canvas.width / 2) {
            if (dx === 0 && dy === -1) { dx = 1; dy = 0; }
            else if (dx === 1 && dy === 0) { dx = 0; dy = 1; }
            else if (dx === 0 && dy === 1) { dx = -1; dy = 0; }
            else if (dx === -1 && dy === 0) { dx = 0; dy = -1; }
            else { dx = 1; dy = 0; }
        } else {
            if (dx === 0 && dy === -1) { dx = -1; dy = 0; }
            else if (dx === -1 && dy === 0) { dx = 0; dy = 1; }
            else if (dx === 0 && dy === 1) { dx = 1; dy = 0; }
            else if (dx === 1 && dy === 0) { dx = 0; dy = -1; }
            else { dx = -1; dy = 0; }
        }
    });

    function main() {
        if (checkGameOver()) {
            snake = [{x: 10, y: 10}]; dx = 0; dy = 0; score = 0;
        }
        setTimeout(() => {
            render();
            main();
        }, gameSpeed);
    }

    function render() {
        ctx.fillStyle = "#000";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        // 画蛇
        ctx.fillStyle = "#25F4EE";
        snake.forEach(p => ctx.fillRect(p.x*gridSize, p.y*gridSize, gridSize-2, gridSize-2));
        // 移动
        const head = {x: snake[0].x + dx, y: snake[0].y + dy};
        snake.unshift(head);
        if (head.x === food.x && head.y === food.y) {
            score += 10;
            food = {x: Math.floor(Math.random()*tileCount), y: Math.floor(Math.random()*(canvas.height/gridSize))};
        } else { snake.pop(); }
        // 画食物
        ctx.fillStyle = "#FE2C55";
        ctx.fillRect(food.x*gridSize, food.y*gridSize, gridSize-2, gridSize-2);
    }

    function checkGameOver() {
        if (dx === 0 && dy === 0) return false;
        return snake[0].x < 0 || snake[0].x >= tileCount || snake[0].y < 0 || snake[0].y >= canvas.height/gridSize;
    }
    main();
}