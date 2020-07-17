const db = require('../db/db_connection');

module.exports = {

    async create(req, res){
        const {name, email, adress, pass, categ, status, tipo, image, entrega} = req.body;
        //restCateg.toString();
        

        let {rows} = await db.query(
            'INSERT INTO restaurants (name, email, adress,pass, categ, status, tipo, entrega) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
            [name, email, adress, pass, categ, status, tipo, image, entrega]
        );

        rows = await db.query(
            'SELECT * FROM restaurants WHERE email=$1 AND pass=$2',
            [email, pass]
        );

        const restid = rows.rows[0].id;
        console.log(id);

        const string_categ = categ.toString();
        
        const categs = string_categ.split(',');
            
        for(let i = 0; i < categs.length; i++)
            categs[i]=Number(categs[i]);
        console.log(categs);    
            
        for(let i = 0; i < categs.length; i++){
            const insert = await db.query(
                'INSERT INTO restaurant_categ (restid, idcateg) VALUES ($1, $2)',
                [restid, categs[i]]
            );
        }
        
        res.send(rows.rows[0]);
    },

    async categs(req, res){
        const {rows} = await db.query(
            'SELECT * FROM categorias',[]
        );

        res.send(rows);
    },


    async index(req, res){

        const {rows} = await db.query(
            'SELECT * FROM restaurants', []
        );

        res.send(rows);
    
    },


    async searchBycateg(req, res){
        const { id } = req.params;
        const datas = []

        console.log('id back:'+ id);

        const {rows} = await db.query(
            'SELECT * FROM restaurant_categ WHERE idcateg=$1',
            [id]
        );

        for(let i = 0; i < rows.length; i++){
            const obj = await db.query(
                'SELECT * FROM restaurants WHERE id=$1 AND status=$2',
                [rows[i].id, true]
            );
            datas.push(obj.rows[0]);
        }
        res.send(datas);
            
    },

    async searchByName(req, res){

        const {name} = req.query;
        
        const {rows} = await db.query(
            'SELECT * FROM restaurants WHERE name LIKE $1 AND status = $2',
            [`%${name}%`, true]
        );

        res.send(rows);

    },

    async delivery(req, res){

        const {type} = req.query;

        const {rows} = await db.query(
            'SELECT * FROM restaurants WHERE entrega=$1',
            [type]
        );

        res.send(rows);

    },

    async popular(req, res){

        const populars = [];

        const rests = await db.query(
            'SELECT * FROM restaurants WHERE status=$1',
            [true]
        );

        for(let i = 0; i < rests.rows.length; i++){

            const foods = await db.query(
                'SELECT price FROM foods_restaurant WHERE restid=$1',
                [rests.rows[i].id]
            );

            let qnt = 0;

            for(let j = 0; j < foods.rows.length; j++)
                if(foods.rows[j].price > 10)
                    qnt++;
                
            if(!qnt)
                populars.push(rests.rows[i]);
            
        }

        res.send(populars);

    },

    async maisPedidos(req, res){

        let maisPedidos = [];

        const now = new Date();
        const yest = new Date(now - 86400000);
        
        
        const pedidos = await db.query(
            'SELECT * FROM pedido',
            []
        );
        
        for(let i = 0; i < pedidos.rows.length; i++){

            pedidos.rows[i].idfoods = JSON.parse(pedidos.rows[i].idfoods);

            for(let j = 0; j < pedidos.rows[i].idfoods.length; j = j + 2){

                let k = 0;
                while(k < maisPedidos.length){
                    
                    if(pedidos.rows[i].idfoods[j] === maisPedidos[k][0]){
                        maisPedidos[k][1] += pedidos.rows[i].idfoods[j+1];
                        break;
                    }
                    k++;

                }

                if(k === maisPedidos.length)
                    maisPedidos.push([pedidos.rows[i].idfoods[j], pedidos.rows[i].idfoods[j+1]]);

            }

        }

        maisPedidos = maisPedidos.sort((a, b)=>{
            return b[1] - a[1]
        });

        console.log(maisPedidos);
        
        const foods = await db.query(
            'SELECT * FROM foods_restaurant WHERE id=$1 OR id=$2 OR id=$3 OR id=$4 OR id=$5',
            [maisPedidos[0][0], maisPedidos[1][0], maisPedidos[2][0], maisPedidos[3][0], maisPedidos[4][0]]
        );

        console.log(foods.rows)
        
        const rests = await db.query(
            'SELECT * FROM restaurants WHERE id=$1 OR id=$2 OR id=$3 OR id=$4 OR id=$5',
            [foods.rows[0].restid, foods.rows[1].restid, foods.rows[2].restid, foods.rows[3].restid, foods.rows[4].restid]
        );
        console.log(rests.rows)
        res.send(rests.rows);

    },

    async rel1(req, res){

        const {id} = req.query; 

        let maisPedidos = [];

        const pedidos = await db.query(
            'SELECT * FROM pedido WHERE restid=$1',
            [id]
        );

        for(let i = 0; i < pedidos.rows.length; i++){

            pedidos.rows[i].idfoods = JSON.parse(pedidos.rows[i].idfoods);

            for(let j = 0; j < pedidos.rows[i].idfoods.length; j = j + 2){

                let k = 0;
                while(k < maisPedidos.length){
                    
                    if(pedidos.rows[i].idfoods[j] === maisPedidos[k][0]){
                        maisPedidos[k][1] += pedidos.rows[i].idfoods[j+1];
                        break;
                    }
                    k++;

                }

                if(k === maisPedidos.length)
                    maisPedidos.push([pedidos.rows[i].idfoods[j], pedidos.rows[i].idfoods[j+1]]);

            }

        }

        maisPedidos = maisPedidos.sort((a, b)=>{
            return b[1] - a[1]
        });

        const food = await db.query(
            'SELECT * FROM foods_restaurant WHERE id=$1',
            [maisPedidos[0][0]]
        );

        res.send({food: food.rows, qnt: maisPedidos[0][1]});

    }


}