const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require("dotenv");

dotenv.config(); 

// Create Express app
const app = express();
app.use(cors());
app.use(express.json());


app.get("/",(req,res)=>{
    res.send({
        msg: "server is running sucessfully 🔥"
    })
})
// MongoDB connection setup
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('\n\t MongoDB connected...!'))
    .catch(err => console.error('MongoDB connection error:', err));

// Define Schema for text editor documents
const editorSchema = new mongoose.Schema({
    editorId: String,
    content: String
});

// Create a model for text editor documents
const Editor = mongoose.model('Editor', editorSchema);

// Create HTTP server
const server = http.createServer(app);
const io = socketIo(server);

// Socket.io event handlers
io.on('connection', socket => {
    console.log('A user connected');

    socket.on('fetchScript', async (username) => {
        try {
            let editor = await Editor.findOne({ username });
            if (!editor) {
                editor = new Editor({ username, editorId: socket.id });
                await editor.save();
            }
            socket.emit('scriptContent', editor.content);
        } catch (err) {
            console.error('Error fetching script:', err);
        }
    });

    socket.on('updateScript', async content => {
        try {
            const editor = await Editor.findOne({ editorId: socket.id });
            if (editor) {
                editor.content = content;
                await editor.save();
                socket.broadcast.emit('scriptContent', content);
            }
        } catch (err) {
            console.error('Error updating script:', err);
        }
    });

    socket.on('disconnect', async () => {
        console.log('A user disconnected');
        try {
            // Delete editor document associated with disconnected socket id
            await Editor.deleteOne({ editorId: socket.id });
        } catch (err) {
            console.error('Error deleting editor:', err);
        }
    });
});

// API endpoint to save script content to MongoDB
app.post('/saveScript', async (req, res) => {
    try {
        const { content } = req.body;
        const editorId = req.query.editorId; // Extract editorId from query parameter
        if (!content || !editorId) {
            return res.status(400).send('Content and editorId are required');
        }
        let editor = await Editor.findOne({ editorId });
        if (!editor) {
            editor = new Editor({ editorId, content });
        } else {
            editor.content = content;
        }
        await editor.save();
        res.status(200).send('Script saved successfully');
    } catch (error) {
        console.error('Error saving script:', error);
        res.status(500).send('An error occurred while saving the script.');
    }
});

// API endpoint to retrieve script content from MongoDB
app.get('/getScript', async (req, res) => {
    try {
        const editorId = req.query.editorId; // Extract editorId from query parameter
        const editor = await Editor.findOne({ editorId });
        res.status(200).send(editor ? editor.content : '');
    } catch (error) {
        console.error('Error fetching script:', error);
        res.status(500).send('An error occurred while fetching the script.');
    }
});

// Set up server to listen on port
const PORT = process.env.PORT || 8080;
server.listen(PORT, () => console.log(`\n\t Server running on port ${PORT}`));