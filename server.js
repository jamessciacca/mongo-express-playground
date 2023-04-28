const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');

const app = express();
const PORT = 3001;

const connectionStringURI = `mongodb://127.0.0.1:27017`;
const client = new MongoClient(connectionStringURI);

let db;

const dbName = 'mlbplayersDB';

client.connect()
    .then(() => {
        console.log("Succesfully Connected to MongoDB!")
        db = client.db(dbName)

app.listen(PORT, () => {
    console.log(`MLB Player Base is Running on PORT ${PORT}`)
    });
}).catch((err) => {
    console.error('Mongo Connection Error: ', err.message);
});

app.use(express.json());

app.get('/players', (req, res) => {
    db.collection('playerCollection')
    .find()
    .toArray()
    .then(results => res.json(results))
    .catch(err => {
        if (err) throw err;
    })
});

app.post('/players', async (req, res) => {
    const player = req.body;
    db.collection('playerCollection').insertOne({
        name: player.name,
        team: player.team,
        number: player.number,
        position: player.position
    })
    .then(results => res.json(results))
    .catch(err => {
        if (err) throw err;
    })
});

app.put('/players/:id', async (req, res) => {
    const updatePlayer = req.body;
    try{
    await db.collection('playerCollection')
    .updateOne({
        _id: new ObjectId(req.params.id)
    },
    {
        $set: {
            name: updatePlayer.name,
	        team: updatePlayer.team,
	        number: updatePlayer.number,
	        position: updatePlayer.position
        }
    });
    res.send('Player Succesfully Updated');
    }catch(err){
        console.log(err);
    }
});

app.delete('/players/:id', (req, res) => {
    const player = req.body;
    db.collection('playerCollection')
    .deleteOne(
        {
            _id: new ObjectId(req.params.id)
        }
    )
    res.send('Player Deleted!')
})

app.get('/players/yankees', (req, res) => {
    const yankee = req.body.team;
    db.collection('playerCollection')
    .find({
        "team": "New York Yankees"
    })
    .toArray()
    .then(results => res.json(results))
    .catch(err => {
        if (err) throw err;
    })
});

//still working on this
// app.get('/teams', (req, res) => {
//     const team = req.body
//     db.collection('playerCollection')
//     .find({}, {team: 1})
//     .toArray()
//     .then(results => res.json(results))
//     .catch(err => {
//         if (err) throw err;
//     })
// });


