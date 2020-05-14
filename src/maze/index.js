const {
  Engine,
  Render,
  Runner,
  World,
  Bodies,
  Body,
  Events
} = Matter

const width = window.innerWidth
const height = window.innerHeight
const wallWidth = 10
const columns = 14
const rows = 14
const cellWidth = width / columns
const cellHeight = height / rows

const engine = Engine.create()
engine.world.gravity.y = 0
const { world } = engine
const render = Render.create({
  element: document.body,
  engine,
  options: {
    wireframes: false,
    width,
    height
  }
})
Render.run(render)
Runner.run(Runner.create(), engine)

const walls = [
  Bodies.rectangle(width / 2, 0, width, wallWidth, {isStatic: true}),
  Bodies.rectangle(width / 2, height, width, wallWidth, {isStatic: true}),
  Bodies.rectangle(0, height / 2, wallWidth, height, {isStatic: true}),
  Bodies.rectangle(width, height / 2, wallWidth, height, {isStatic: true}),
]
World.add(world, walls)


// Maze generation
const shuffle = (arr) => {
  let counter = arr.length
  while (counter > 0) {
    const index = Math.floor(Math.random() * counter)
    counter--
    const temp = arr[counter]
    arr[counter] = arr[index]
    arr[index] = temp
  }
  return arr
}

const grid = Array(rows)
  .fill(null)
  .map(() => Array(columns).fill(false))

const verticals = Array(rows)
  .fill(null)
  .map(() => Array(columns-1).fill(false))
const horizontals = Array(rows - 1)
  .fill(null)
  .map(() => Array(columns).fill(false))

const startRow = Math.floor(Math.random() * rows)
const startColumn = Math.floor(Math.random() * columns)

const stepThroughCell = (row, column) => {
  if (grid[row][column]) return
  grid[row][column] = true
  const neighbors = shuffle([
      [row - 1, column, 'up'],
      [row, column + 1, 'right'],
      [row + 1, column, 'down'],
      [row, column - 1, 'left']
  ])

  for (let neighbor of neighbors) {
    const [nextRow, nextColumn, direction] = neighbor
    if (
        nextRow < 0
        || nextRow >= rows
        || nextColumn < 0
        || nextColumn >= columns
    ) {
      continue
    }

    if (grid[nextRow][nextColumn]) {
      continue
    }

    if (direction === 'left') {
      verticals[row][column-1] = true
    } else if (direction === 'right') {
      verticals[row][column] = true
    } else if (direction === 'up') {
      horizontals[row-1][column] = true
    } else {
      horizontals[row][column] = true
    }

    stepThroughCell(nextRow, nextColumn )
  }
}
stepThroughCell(startRow,startColumn)
horizontals.forEach((row, rIndex) => {
  row.forEach((open, cIndex) => {
    if (open) return
    const wPadding = cellWidth * cIndex + cellWidth / 2
    const hPadding = cellHeight * (rIndex + 1)
    const wall = Bodies.rectangle(wPadding, hPadding, cellWidth, wallWidth, {
      isStatic: true,
      label: 'wall'
    })
    World.add(world, wall)
  })
})

verticals.forEach((column, cIndex) => {

  column.forEach((open, rIndex) => {
    if (open) return
    const wPadding = cellWidth * (rIndex + 1)
    const hPadding = cellHeight * cIndex + cellHeight / 2
    const wall = Bodies.rectangle(wPadding, hPadding, wallWidth, cellHeight, {
      isStatic: true,
      label: "wall"
    })
    World.add(world, wall)
  })
})

const goal = Bodies.rectangle(
  width - cellWidth / 2,
  height - cellHeight / 2,
  cellWidth * .6,
  cellHeight * .6,
    {
      isStatic: true,
      label: 'goal',
      render: {
        fillStyle: 'green'
      }
    }
)
World.add(world, goal)

const ball = Bodies.circle(
    cellWidth / 2,
    cellHeight / 2,
    cellWidth > cellHeight ? cellHeight / 3 : cellWidth / 3,
    {
      label: 'ball',
      render: {
        fillStyle: 'yellow'
      }
    }
)
World.add(world, ball)
document.addEventListener('keydown', event => {
  const { x, y } = ball.velocity
  if (event.code === 'KeyW') {
    Body.setVelocity(ball, {x, y: y - 5})
  }
  if (event.code === 'KeyD') {
    Body.setVelocity(ball, {x: x + 5, y})
  }
  if (event.code === 'KeyA') {
    Body.setVelocity(ball, {x: x - 5, y})
  }
  if (event.code === 'KeyS') {
    Body.setVelocity(ball, {x, y: y + 5})
  }
})


// Win Condition
Events.on(engine, 'collisionStart', event => {
  event.pairs.forEach(collision => {
    const labels = ['ball', 'goal']
    if (
      labels.includes(collision.bodyA.label)
      && labels.includes(collision.bodyB.label)
    ) {
      world.gravity.y = 1
      world.bodies.forEach(item => {
        if (item.label === 'wall') {
          Body.setStatic(item, false)
        }
      })
    }
  })
})
