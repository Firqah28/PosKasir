const express = require('express');
const session = require('express-session');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Configure session middleware
app.use(session({
    secret: 'pos_super_secret_key_123',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, maxAge: 1000 * 60 * 60 * 24 } // 1 day session
}));

app.set('view engine', 'ejs');

const http = require('http');
const socketIo = require('socket.io');

const server = http.createServer(app);
const io = socketIo(server);

// Middleware to attach io to req
app.use((req, res, next) => {
    req.io = io;
    next();
});

// Import auth middleware
const { protectRoute } = require('./middleware/authMiddleware');

// Routes
const barangRoutes = require('./routes/barangRoutes');
const authRoutes = require('./routes/authRoutes');
const transaksiRoutes = require('./routes/transaksiRoutes');
const laporanRoutes = require('./routes/laporanRoutes');
const kategoriRoutes = require('./routes/kategoriRoutes');
const supplierRoutes = require('./routes/supplierRoutes');
const pembelianRoutes = require('./routes/pembelianRoutes');

app.use('/barang', protectRoute, barangRoutes);
app.use('/auth', authRoutes); // Auth routes should not be protected
app.use('/transaksi', protectRoute, transaksiRoutes);
app.use('/laporan', protectRoute, laporanRoutes);
app.use('/kategori', protectRoute, kategoriRoutes);
app.use('/supplier', protectRoute, supplierRoutes);
app.use('/pembelian', protectRoute, pembelianRoutes);

// View Routes
app.get('/', (req, res) => {
    if (req.session && req.session.user) {
        return res.redirect('/dashboard');
    }
    res.render('login');
});

app.get('/dashboard', protectRoute, (req, res) => {
    res.render('dashboard');
});

app.get('/barang-view', protectRoute, (req, res) => {
    res.render('barang');
});

app.get('/kategori-view', protectRoute, (req, res) => {
    res.render('kategori');
});

app.get('/supplier-view', protectRoute, (req, res) => {
    res.render('supplier');
});

app.get('/pembelian-view', protectRoute, (req, res) => {
    // Pass user to view to display who is active
    res.render('pembelian', { user: req.session.user });
});

app.get('/kasir', protectRoute, (req, res) => {
    res.render('kasir');
});

app.get('/laporan-view', protectRoute, (req, res) => {
    res.render('laporan');
});

io.on('connection', (socket) => {
    console.log('A user connected');
    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
