// Add a "Handshake" store
let pendingHolePunches = {};

app.post('/request-connection', (req, res) => {
    const { targetLobbyId, myUsername, myInternalPort } = req.body;
    const clientPublicIp = req.ip.replace('::ffff:', '');
    const clientPublicPort = req.socket.remotePort; // This is the port the router used

    const host = lobbies[targetLobbyId];
    if (!host) return res.status(404).send("Lobby not found");

    // Store the request so the host can find it
    pendingHolePunches[targetLobbyId] = {
        clientIp: clientPublicIp,
        clientPort: clientPublicPort,
        clientUsername: myUsername
    };

    // Give the Client the Host's info
    res.json({
        hostIp: host.ip,
        hostPort: host.port
    });
});

// Host polls this to see if anyone is trying to join
app.get('/check-requests/:lobbyId', (req, res) => {
    const request = pendingHolePunches[req.params.lobbyId];
    if (request) {
        delete pendingHolePunches[req.params.lobbyId]; // Clear it
        res.json(request);
    } else {
        res.json(null);
    }
});
