const WebSocket = require("ws")
const http = require("http")
let id = 0
let pairs = []
let onlinePlayers = []

const server = http.createServer(function(request, response) {})
server.listen(8080, function() {
  console.log(new Date() + " Server is listening on port " + 8080)
})

const wss = new WebSocket.Server({ server: server })

wss.on("connection", function connection(ws) {
  assignID(ws)
  console.log(`Client ${ws.id} connected`)

  ws.on("message", function incoming(data) {
    let loser = "rematch loser"
    let winner = "rematch winner"
    let client = findOpponent(ws.id)
    if (data.includes("play")) {
      onlinePlayers.push(ws.id)
      let wsIDIndex = onlinePlayers.indexOf(ws.id)
      if (wsIDIndex % 2 === 1) {
        client = parseClients(onlinePlayers[wsIDIndex - 1])
        if (client !== undefined) {
          client.send("found p2")
          ws.send("found p1")
          pairs.push(`${ws.id}-${client.id}`)
        }
      }
    }
    if (client !== undefined) {
      if (data.includes("move")) {
        client.send(data)
      } else if (data.includes("won")) {
        client.send(loser)
        ws.send(winner)
      } else if (data.includes("lost")) {
        client.send(winner)
        ws.send(loser)
      } else if (data.includes("tie")) {
        if (Math.random() * (10 - 1) + 1 >= 6) {
          client.send(loser)
          ws.send(winner)
        }
        client.send(winner)
        ws.send(loser)
      }
    }
    //console.log(`New message from ${ws.id}: ${data}`)
  })

  ws.on("close", function close() {
    removeClient(ws.id)
    console.log(`Client ${ws.id} disconnected`)
  })

  ws.on("error", function error(error) {
    removeClient(ws.id)
    console.log("An error occured:", error)
  })
})

wss.on("listening", ws => {
  console.log("Websocket Server has been bound")
})

function assignID(ws) {
  wss.clients.forEach(client => {
    if (client.id === undefined && ws.id === undefined) {
      client.id = id
      ws.id = id
      id++
    }
  })
}

function parseClients(id) {
  let returnValue
  wss.clients.forEach(client => {
    if (client.id == id) {
      returnValue = client
    }
  })
  return returnValue
}

function removeClient(wsID) {
  //remove websocketID/ left
  let wsIDIndex = onlinePlayers.indexOf(wsID)
  if (wsIDIndex !== -1) {
    onlinePlayers.splice(wsIDIndex)
  }

  //remove clientID/ stayed
  let client = findOpponent(wsID)
  if (client !== undefined) {
    client.send("disconnected")
    let clientIDIndex = onlinePlayers.indexOf(client.id)
    if (clientIDIndex !== -1) {
      onlinePlayers.splice(clientIDIndex)
    }
  }

  //remove their pair
  pairs.forEach(element => {
    if (element.includes(wsID)) {
      pairs.splice(pairs.indexOf(element))
    }
  })
}

function findPair(wsID) {
  return pairs.find(function(element) {
    let splitElement = element.split("-")
    for (let i = 0; i <= 1; i++) {
      if (splitElement[i] == wsID.toString()) {
        return true
      }
    }
  })
}

function findOpponent(wsID) {
  let pair = findPair(wsID)
  if (pair !== undefined) {
    if (pair.indexOf(wsID) == 0) {
      return parseClients(pair[2])
    } else if (pair.indexOf(wsID) == 2) {
      return parseClients(pair[0])
    }
  }
  return undefined
}
