// Setting for API
const express = require ('express') //dia akan return sebuah function karena express adalah sebuah function
const app = express() //
const port = 2020
app.use(express.json()) // pengganti body-parser //untuk membaca req.body pada app.post

//create route
//NODEMON adalah pengganti node tapi lebih simpel karen bgtu di save maka dia akan jalan otomatis
app.listen(port, () =>{ //running API here //untuk  menunjukkan apakah port kita running apa tidak
    console.log('API berhasil dihidupkan di port ' + port);
    
})

// app.get('/users', (req,res) => { //END POINT
//     console.log('berhasil di GET');
//     //req: akan berisi parameter, data yang dikirim bersamaan proses request
//     //res: object berisi method untuk memberikan respon ke client

//     res.send({ //yang di send adalah sebuah object
//         message: 'hallo',
//     })
// })

// app.post('/users', (req, res) => { // ditulis di body pada postman dalam bentuk object
//     console.log(req.body);   
// })

// app.get('/getuser', (req,res) => { //untuk get, ditulis di params pada postman
//     console.log(req.query);   
// })

// app.get('/users/:age', (req,res) => {
//     console.log("umur yang masuk",req.params.age); 
// })

// //for BODY
// const bodyParser = require ('body-parser') // agar kita bisa membaca object saat axios.post
// app.use (bodyParser.json())


// Setting for mongodb
const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient

const URL = 'mongodb://127.0.0.1:27017' //mongodb will run
const databaseName = 'API-MongoDB' //database name 

MongoClient.connect (URL, {useNewUrlParser: true}, (err, client) => {
     if (err) {
         return console.log('gagal bikin koneksi ke MongoDB');
     }
     console.log('berhasil koneksi');
     
     const db =client.db (databaseName)

    app.get('/initdata', (req,res) => {
        db.collection ('users').insertMany([
            {name: 'Alfred', age: 28},
            {name: 'Aldy', age: 23},
            {name: 'Azarya', age: 22},
            {name: 'Atta', age: 27},
            {name: 'Ashiap', age: 23},
            {name: 'Alfonso', age: 21},
            {name: 'budi', age: 22},
        ]).then (resp => {
            res.send({
                executedStatus: resp.result.ok,
                insertedCount: resp.insertedCount,
                insertedIds: resp.insertedIds,
                docs: resp.ops
            })
        }). catch (err => {
            res.send({
                err: "unable to do operation: insertMany"
            })
        })
        
    })

    app.get('/users', (req, res) => {
        db.collection('users').find({}).toArray() //select All
            .then(doc => {
                if(doc.length === 0) {
                    return res.send({
                        err: 'data not found'
                    })
                }
                res.send(doc)
            }).catch (err => {
                res.send({
                    err
                })
            })
    })

    app.get('/usersparams', (req, res) => {
        var {age, name} = req.query
        age = parseInt(age) //string to integer

        if(!age || !name) { //if age or id or both undefined
            return res.send({
                err:'please, provide name and age params'
            })
        }
        db.collection('users').find({name, age}).toArray()
            .then(doc => { //not found, [] || found: array of object
                if(doc.length === 0) {
                    return res.send({
                        err: `data not found age: ${age} & name: ${name}`
                    })
                }
                res.send(doc) // send the data
            }).catch(err =>{
                res.send({
                    err
                })
            })
    })

    app.get('/getuserwithid', (req, res) => {
        var {id, name, age} = req.query
        age = parseInt(age)
        if(!id || !name || !age) { //without name params, undefined
            return res.send({
                err: "please provide \'id\', \'name\', \'age\' params for searching "
            })
        }
        db.collection('users').findOne({_id: new objectID(id), name: name, age: age})
            .then(doc => { //not found, null || found: one object
                if(doc) { // found the user
                    return res.send({
                        err:"",
                        keyword: name,
                        doc: doc
                    })
                }
                res.send({
                    err: `can not find the user with keyword: name: ${name} & age: ${age}`
                })
            }). catch (err => {
                res.send({
                    err: "unable to do findOne operation"
                })
            })
    })

    app.post('/postoneuser', (req, res) => {
        var {name, age} = req.body   
        age = parseInt(age)

        if (!name || !age) { // if age or id or both undefined
            return res.send({
                err: "Please, provide name and age params"
            })
        }
        
        db.collection('users').insertOne({name, age})
            .then(resp => {
                res.send({
                    err: "",
                    executedStatus: resp.result.ok, // 1 : correctly
                    insertedCount: resp.insertedCount,
                    insertedId: resp.insertedId,
                    user: resp.ops[0]
                })
            }).catch(err => {
                res.send({
                    err
                })
            })
    })

    app.delete('/user/:umur', (req, res) => {
        const age = parseInt(req.params.umur)

        if(!age){
            return res.send({
                err: "Please, provide params: age"
            })
        }
        
        db.collection('users').deleteOne({age: age}).then((resp) => {
            
            res.send({
                message: "Success delete",
                executedStatus: resp.result.ok,
                count: resp.deletedCount
            })
        }).catch(err => {
            res.send({
                err: "Unable to do operation: deleteOne, collection: users"
            })
        })

    })


    app.put('/users/:nama', (req, res) =>{    
        const {nama} = req.params
        const newName = req.body.name
        

        db.collection('users').updateOne({
            name: nama
        },{
            $set: {
                name: newName
            }
        }).then(resp => {
            res.send({
                executedStatus: resp.result.ok,
                scanned: resp.matchedCount,
                modified: resp.modifiedCount

            })
        }).catch(err => {
            res.send({
                err: "Unable to do operation: updateOne"
            })
        })
    })

})
