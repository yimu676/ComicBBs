const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser')
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
const expressSession = require('express-session')
// const cors = require('cors')



const router = require('./router/router');


// app.use(cors())

//使用express-session 中间件
app.use(expressSession({
	//cookie的名字
    name : "gaofei", 
    //cookie签名的信息
    secret : 'secret',
    //cookie的有效时间
    cookie : {
        maxAge : 1000 * 60 * 60 * 24, 
    },
    //即使session的信息没有变化，也会重新保存session
    resave : false,
    //如果saveUninitialized为true，他会将没有初始化的session的数据保存到storage中
    saveUninitialized: false,
    //主要作用：每次请求都重置cookie过期时间
    rolling: true,
    //指定session数据存储的地方(数据库),默认情况下session会话数据是保存在服务器的内存中
    store:null
}))
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
    extended: false
}))
// parse application/json
app.use(bodyParser.json())

app.use("/public", express.static(path.join(__dirname, './public')))
app.use("/node_modules", express.static(path.join(__dirname, './node_modules')))

//配置art-template
app.engine('html', require('express-art-template'))
app.set('views', path.join(__dirname, './views/')) // 默认就是 ./views 目录

app.use("/", router)

app.listen(5000, function () {
    console.log("服务器正在运行中....")
})