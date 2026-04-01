// Snake body logic JavaScript
const directions = {
  UP: 'UP',
  DOWN: 'DOWN',
  LEFT: 'LEFT',
  RIGHT: 'RIGHT'
};

const snake = [{x: 5, y: 5}];
let direction = directions.RIGHT;
let food = {x: 10, y: 10};

function moveSnake() {
  const head = {x: snake[0].x, y: snake[0].y};

  switch (direction) {
    case directions.UP:
      head.y -= 1;
      break;
    case directions.DOWN:
      head.y += 1;
      break;
    case directions.LEFT:
      head.x -= 1;
      break;
    case directions.RIGHT:
      head.x += 1;
      break;
  }

  snake.unshift(head);
}

function removeTail() {
  if (snake.length > 1) {
    snake.pop();
  }
}

function checkSelfCollision() {
  for (let i = 1; i < snake.length; i++) {
    if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
      return true;
    }
  }
  return false;
}

function checkWallCollision(width, height) {
  if (snake[0].x < 0 || snake[0].x >= width || snake[0].y < 0 || snake[0].y >= height) {
    return true;
  }
  return false;
}

function growSnake() {
  const tail = snake[snake.length - 1];
  snake.push({x: tail.x, y: tail.y});
}

function checkFoodCollision() {
  if (snake[0].x === food.x && snake[0].y === food.y) {
    growSnake();
    placeFood();
    return true;
  }
  return false;
}

function placeFood() {
  food.x = Math.floor(Math.random() * width);
  food.y = Math.floor(Math.random() * height);
}

module.exports = {
  moveSnake,
  removeTail,
  checkSelfCollision,
  checkWallCollision,
  checkFoodCollision
};