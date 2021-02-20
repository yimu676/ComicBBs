const mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);

mongoose.connect('mongodb://localhost/comic',{useNewUrlParser:true});
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("已连接数据库......")
});
var Schema = mongoose.Schema;
var topicSchema = new Schema({
    plate: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: [true, "标题不能为空"]
    },
    content: {
        type: String,
        required: [true, "内容不能为空"]
    },
    img_src: {
        type: Array,
    },
    user_id: {
        type: String,
        required: [true, "发帖人id不能为空"]
    },
    username: {
        type: String,
        required: [true, "发帖人名字不能为空"]
    },
    icon: {
        type: String,
        required: [true, "发帖人头像不能为空"]
    },
    classify:{
        type: Number,
        enum: [0, 1,2],
        default: 0
    },
    clickNum: {
        type: Number,
        default: 0
    },
    commentNum: {
        type: Number,
        default: 0
    },
    likeNum: {
        type: Number,
        default: 0
    },
    created_time: {
        type: Date,
        default: Date.now
    },
    last_modified_time: {
        type: Date,
        default: Date.now
    },
})
var Topic = mongoose.model('Topic', topicSchema);

//处理文章的新增
async function AddTopic(topic) {
    var t = new Topic(topic);
    let result = await t.save();
    return { code: 101, msg: "文章保存成功" };
}


//根据id获取文章的具体内容
async function GetTopicById(id) {
    let topic = await Topic.findById(id);
    return { code: 101, msg: "查找topic成功", topic: topic };
}
//根据页数查找规定个数的文章列表
async function GetTopicByPage(page) {
    var page = page;
    var skipnumber = page - 1;
    let topic = await Topic.find().sort({ _id: -1 }).limit(10).skip(skipnumber * 10);
    return { code: 101, msg: "查找成功！", topic: topic };
}

//根据搜索内容查询相应的帖子
async function GetTopicBySearch(searchContent) {
    var searchContent = searchContent;
    var Reg = new RegExp(searchContent);
    let topics = await Topic.find({ title: Reg })
    return { code: 101, msg: "查找成功！", topics: topics };
}
//根据用户的ID查询我的帖子
async function GetTopicByUserID(userID) {
    var userID = userID;
    let topics = await Topic.find({ user_id: userID }).sort({ _id: -1 });
    return { code: 101, msg: "查找成功！", topics: topics };
}
//根据帖子id删除帖子的操作
async function DeleteTopic(topicID) {
    var topicID = topicID;
    let result = await Topic.deleteMany({ _id: topicID });
    return { code: 101, msg: "删除成功！" };
}
//根据plate查找相应的文章
async function GetTopicByPlate(plate) {
    let topic = await Topic.find({ plate: plate }).sort({ _id: -1 });
    return { code: 101, msg: "查找成功！", topic: topic };
}
//增加帖子的点击量
async function GetClickNumAndUpdate(_id, clickNum) {
    let result = await Topic.findByIdAndUpdate(_id, { $set: { clickNum: clickNum } });
    return { code: 101, msg: "更新点击量成功！" };
}
//更新评论数量
async function GetCommentNumAndUpdate(_id,commentNum){
    let result = await Topic.findByIdAndUpdate(_id,{ $set: { commentNum: commentNum } });
    return { code: 101, msg: "更新评论数量成功！" };
}
//更新收藏数量
async function GetLikeNumAndUpdate(_id,likeNum){
    let result = await Topic.findByIdAndUpdate(_id,{ $set: { likeNum: likeNum } });
    return { code: 101, msg: "更新收藏数量成功！" };
}


exports.AddTopic = AddTopic;
exports.GetTopicById = GetTopicById;
exports.GetTopicByPage = GetTopicByPage;
exports.GetTopicByPlate = GetTopicByPlate;
exports.GetTopicBySearch = GetTopicBySearch;
exports.GetTopicByUserID = GetTopicByUserID;
exports.DeleteTopic = DeleteTopic;
exports.GetClickNumAndUpdate = GetClickNumAndUpdate;
exports.GetCommentNumAndUpdate = GetCommentNumAndUpdate;
exports.GetLikeNumAndUpdate = GetLikeNumAndUpdate;

