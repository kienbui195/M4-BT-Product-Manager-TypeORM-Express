import { AppDataSource } from "./src/data-source";
import { Products } from "./src/entity/Product";
import multer from 'multer';
const upload = multer();
import express from "express";
import bodyParser from "body-parser";
import path from "path";
import { Like } from "typeorm";

const port = 8000;

AppDataSource.initialize().then(async  connection => {
    const app = express();
    app.set('view engine' , 'ejs');
    app.set('views', path.join(__dirname, 'views'));
    app.use(bodyParser.json());
    const ProductRepo = connection.getRepository(Products);

    app.get('/product/create', (req, res) => {
        res.render('create');
    });

    app.post('/product/create', upload.none() ,async (req, res) => {
        if (req.body.name && req.body.author && req.body.price) {
            const productData = {
                name: req.body.name,
                price: req.body.price,
                author: req.body.author,
                avatar: req.body.avatar
            };

            await ProductRepo.save(productData);
            res.redirect('/');
        } else res.redirect('/product/create');
    })

    app.get('/' , async (req, res) => {
        const products = await ProductRepo.find();
        res.render('list', {data: products})
    });

    app.get('/product/delete' , async (req, res) => {
        const id = req.query.id;
        const data = await ProductRepo.findBy({id: +id});
        await ProductRepo.remove(data);
        res.redirect('/')
    });

    app.get('/product/update', async (req, res) => {
        const id = req.query.id;
        const product = await ProductRepo.findOneBy({id: +id});
        res.render('update' , {data: product});
    });

    app.post('/product/update', upload.none(), async (req, res) => {
        const id = req.body.id;
        const dataUpdate = await ProductRepo.findOneBy({id: id});
        dataUpdate.name = req.body.name;
        dataUpdate.price = req.body.price;
        dataUpdate.author = req.body.author;
        dataUpdate.avatar = req.body.avatar;
        await ProductRepo.save(dataUpdate);
        res.redirect('/');
    });

    app.post('/product/search', upload.none() , async (req, res) => {
        let data = await ProductRepo.findBy({
            name: Like(`%${req.body.keyword}%`)
        });
        if (data.length > 0) {
            res.render('list', {data: data})
        } else res.render('search')
    })

    app.listen(port, () => {
        console.log(`running at http://localhost:${port}`);
    })
})