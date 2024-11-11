const express = require('express')
const cors = require('cors')

const app = express()

// Config JSON response
app.use(express.json())

// Solve cors 
app.use(cors({credentials: true, origin:'http://localhost:3000'}))

// public folder for images
app.use(express.static('public'))

// Routes

app.listen(5000)


// Ensure that the backend always runs on port 5555
const PORT = process.env.PORT || 5555;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});