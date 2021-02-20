const express = require('express');
const router = express.Router();
const User = require('../model/user');
const path = require('path')
const Topic = require('../model/topic')
const Collection = require('../model/collection')
const Follow = require('../model/follow')
const Comment = require('../model/comment')
var formidable = require('formidable');

const multer = require('multer');
//处理登录请求
router.post('/api/login',async (req, res) => {
    let result = await User.login(req.body)
    //登录成功
    if (result.code == 101){
        req.session.user = result.user;
        res.json(result);
    }
    //登录失败
    else{
        res.json(result);
    }
})
//处理注册请求
router.post("/api/register",async (req, res) => {
    let result = await User.register(req.body)
    res.json(result);
})
//获取session的数据请求
router.get("/api/getsession",async (req, res)=>{
    if (req.session.user) {
        var user = req.session.user
        res.json({code:101,msg:"查询成功",user})
    }
    else {
        res.json({code:100,msg:"请先登录"})
    }
})
//退出登录
router.get("/api/logout",(req, res) => {
    req.session.user = null;
    res.json({code:101,msg:"您已退出登录"})
})
//根据用户Id查用户信息
router.post('/api/userinfo',async(req, res) => {
    const id = req.query.id
    let result = await User.GetUserById(id)
    res.json(result)
})
//处理用户信息修改
router.post("/api/update", async (req, res) => {
    let result = await User.ModifyUserMessage(req.query.id, req.body);
    if (result.code == 101) {
        //当修改用户信息成功之后，我们需要将最新的user重新保存到session
        req.session.user = result.user;
        res.json({ code: 101, msg: "用户信息更新成功！" })
    }
    else {
        res.json({ code: 100, msg: "用户信息更新失败" })
    }
})
//用户头像上传
router.post('/api/upload', async (req, res, next) => {
    //创建表单解析对象
    var form = new formidable.IncomingForm();
    //配置上传文件的存放位置
    form.uploadDir = path.join(__dirname,'../','public','upload')
    //保留文件上传后缀
    form.keepExtensions = true
    form.parse(req,async (err,fields,files) =>{
        var url = "http://localhost:5000/public/"
        url +=files.file.path.split('public')[1]
        let result = await User.GetAvatar(url,req.query.id)
        res.json(result)
    })
    
});
//修改用户密码
router.post('/api/change',async (req, res)=>{
    var body = req.body;
    let result = await User.ModifyPwd(body.content, req.session.user._id);
    if (result.code == 101) {
        req.session.user.password = body.newpassword;
        res.json(result);
    }
})
//处理用户退出登录
router.post('/api/loginout',async (req, res)=>{
    req.session.user = null;
    res.json({ code: 101, msg: "已退出" })
})



//配置multer存储文件的信息(包含要存储的文件的名字已经文件存在哪里)
var storage = multer.diskStorage({
    //配置图片存储的位置
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../public/img'))
    },
    //配置图片保存的名字
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname)
    }
})

//创建一个multer对象用来处理文件上传
//multer 可以帮我们解析 content-type:mulipart/form-data这种方式提交的请求数据
var upload = multer({ storage: storage })
var uploadimg = multer({
    storage: multer.diskStorage({
        //配置图片存储的位置
        destination: function (req, file, cb) {
            cb(null, path.join(__dirname, '../public/img'))
        },
        //配置图片保存的名字
        filename: function (req, file, cb) {
            cb(null, Date.now() + "-" + file.originalname)
        }
    })
})
//发表文章
router.post('/api/post',uploadimg.array('file', 9),async (req, res, next)=>{
    if (req.session.user) {
        var user = req.session.user;
        var files = req.files;
        //获取文件保存的路径
        var img_src = [];
        files.map(item => {
            var url = "http://localhost:5000/"
            var savepath = path.join("public/img", item.filename);
            url += savepath
            img_src.push(url)
        })
        req.body.img_src = img_src;
        req.body.username = user.username;
        req.body.user_id = user._id;
        req.body.icon = user.avatar;
        req.body.img_src = img_src
        let result = await Topic.AddTopic(req.body);
        if (result.code == 101) {
            res.json({ code: 101, message: '发布成功！' })
        }
        else {
            res.json({ code: 100, message: '发布失败！' });
        }
    }
    else{
        res.json({ code: 102, message: '请先登录再发布帖子！' });
    }
})
//通过plate查询帖子
router.post('/api/article',async (req, res)=>{
    var plate = req.query.plate;
    var result = await Topic.GetTopicByPlate(plate)
    var topics = result.topic;
    res.json({ code: 101, message: '获取分类帖子成功', topics: topics })
})
//通过文章id查询帖子详情
router.post('/api/detail',async (req, res)=>{
    var _id = req.query.id;
    var result = await Topic.GetTopicById(_id);
    var topic = result.topic;
    res.json({ code: 101, message: '获取帖子内容成功！', topic: topic })

})
//通过用户ID查询帖子
router.post('/api/arctcleid',async (req, res)=>{
    var userID = req.query.id;
    var result = await Topic.GetTopicByUserID(userID);
    var topics = result.topics;
    res.json({ code: 101, message: '获取我的帖子成功！', topics: topics });
})
//根据用户ID删除帖子
router.post('/api/delete',async (req, res)=>{
    var topicID = req.query.id;
    var result = await Topic.DeleteTopic(topicID);
    if (result.code == 101) {
        res.json({ code: 101, message: '删除帖子成功！' });
    }
})

//收藏帖子
router.post('/api/addCollection',async (req, res)=>{
    var body = req.body;
    let result = await Collection.AddCollection(body);
    if (result.code == 101) {
        var topic_id = body.topic_id;
        var result2 = await Topic.GetTopicById(topic_id);
        var topic = result2.topic;
        var c = topic.likeNum;
        var likeNum = c + 1;
        let result3 = await Topic.GetLikeNumAndUpdate(topic_id, likeNum)
        res.json({ code: 101, message: '添加收藏成功！' })
    }
    else if (result.code == 100) {
        res.json({ code: 100, message: "您已经收藏过了！" });
    }
})
//获取我的收藏
router.post("/api/getCollection", async (req, res) => {
    var user_id = req.body.userID;
    let result = await Collection.getCollectionById(user_id);
    if (result.code == 101) {
        res.json({ code: 101, message: '查询我的收藏成功！', collection: result.collection })
    }
})
//删除收藏
router.post("/api/deleteCollection", async (req, res) => {
    var userid = req.body.userID;
    var articleid = req.body.articleID
    let result = await Collection.deleteCollection(userid,articleid);
    if (result.code == 101) {
        var result3 = await Topic.GetTopicById(articleid);
        var topic = result3.topic;
        var c = topic.likeNum;
        var likeNum = c - 1;
        let result4 = await Topic.GetLikeNumAndUpdate(articleid, likeNum)
        res.json({ code: 101, message: '取消收藏成功！' })
    }
})


//关注请求处理
router.post("/api/addFriend", async (req, res) => {
    if (req.session.user) {
        var body = req.body;
        body.userID = req.session.user._id.toString();
        body.user_username = req.session.user.username;
        body.user_avatar = req.session.user.avatar;
        var result = await Follow.AddFriend(body);
        res.json({ code: 101, message: '关注成功！' });
    }
    else {
        res.json({ code: 100, message: '您已经关注了' })
    }
})
//判断是否已经关注了
router.post("/api/judgeFriend", async (req, res) => {
    var body = req.body;
    if (req.session.user) {
        body.userID = req.session.user._id
        let friend_result = await Follow.JudgeFriend(body);
        var friend = friend_result.friend;
        res.json({ code: 101, message: '查询关注信息成功!', judgeInfor: friend })
    }
    else {
        res.json({ code: 100, message: '未登录，查询关注信息失败！' })
    }

})
//取消关注的处理
router.post("/api/deletefriend", async (req, res) => {
        var body = req.body;
        body.userID = req.body.userID;
        var result = await Follow.DeleteFriends(body);
        res.json({ code: 101, message: '取消关注成功' });
   
})
//来到我的关注
router.post("/api/getMyFriends", async (req, res) => {
    var userID = req.body.userID;
    var result = await Follow.GetFriends(userID);
    if (result.code == 101) {
        res.json({ code: 101, message: '获取我的帖子成功！', friends: result.Friends });
    }
})
//查看我的粉丝
router.post("/api/getMyFans", async (req, res) => {
    var userID = req.body.userID;
    var result = await Follow.GetFans(userID);
    if (result.code == 101) {
        res.json({ code: 101, message: '获取我的粉丝成功！', Fans: result.Fans });
    }
})

//提交评论处理
router.post("/api/commitComment", async (req, res) => {
    var commentData = req.body;
    if (req.session.user) {
        var user = req.session.user;
        commentData.conmmenter_avatar = user.avatar;
        commentData.comment_username = user.username;
        commentData.commenter_id = user._id;
        let result = await Comment.AddComment(commentData);

        if (result.code == 101) {
            var _id = commentData.topic_id;
            var result2 = await Topic.GetTopicById(_id);
            var topic = result2.topic;
            var c = topic.commentNum;
            var commentNum = c + 1;
            let result3 = await Topic.GetCommentNumAndUpdate(_id, commentNum)
            res.json({ code: 101, message: '提交成功！' })
        }
        else {
            res.json({ code: 100, message: '提交失败！' })
        }
    }
    else {
        res.json({ code: 102, message: '请先登录再评论！' })
    }
})
//通过帖子id查询本帖子的评论内容
router.post("/api/getComment", async (req, res) => {
    var _id = req.body._id;
    var result = await Comment.GetComment(_id);
    var comments = result.comment
    if (result.code == 101) {
        res.json({ code: 101, message: '获取成功！', comments })
    }
    else {
        res.json({ code: 100, message: '获取失败！' })
    }
})
////删除评论
router.post("/api/deleteComment", async (req, res) => {
    var commentID = req.body.commentID;
    var result2 = await Comment.GetCommentsByCommentId(commentID);
    var topicID = result2.comment[0].topic_id;
    let result3 = await Topic.GetTopicById(topicID);
    if (result3.topic) {
        var c = result3.topic.commentNum;
        var result = await Comment.DeleteComment(commentID);
        if (result.code == 101) {
            var commentNum = c - 1;
            let result4 = await Topic.GetCommentNumAndUpdate(topicID, commentNum)
            res.json({ code: 101, message: '删除我的评论成功！' });
        }
    }
    else {
        var result = await Comment.DeleteComment(commentID);
        if (result.code == 101) {
            res.json({ code: 101, message: '删除我的评论成功！' });
        }

    }

})
module.exports = router;