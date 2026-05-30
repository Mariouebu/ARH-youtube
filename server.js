const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

// EJS（画面を表示するテンプレートエンジン）の設定
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use('/uploads', express.static('uploads')); // アップロードされた動画へのアクセスを許可

// 動画の保存先とファイル名の設定 (multer)
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        // ファイル名の重複を防ぐためにタイムスタンプを付与
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

// 1. トップページ（動画一覧と投稿フォーム）
app.get('/', (req, res) => {
    // uploadsフォルダ内のファイル一覧を読み込む
    fs.readdir('uploads', (err, files) => {
        if (err) {
            return res.status(500).send('動画の読み込みに失敗しました');
        }
        // 動画ファイルだけをフィルタリング
        const videos = files.filter(file => ['.mp4', '.mov', '.avi'].includes(path.extname(file).toLowerCase()));
        res.render('index', { videos: videos });
    });
});

// 2. 動画アップロード処理
app.post('/upload', upload.single('video'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('動画ファイルを選択してください');
    }
    // アップロードが終わったらトップページに戻る
    res.redirect('/');
});

// サーバー起動
app.listen(PORT, () => {
    console.log(`サーバーが起動しました: http://localhost:${PORT}`);
});