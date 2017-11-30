const entry = {
    path : {
        entry : "./src/entry.js",//entery键值是可以随便写的
        jquery : 'jquery',//单独引入插件(不需要写路径npm会自动搜索node_modules下的)
        vue : 'vue'//单独引入插件
    }
};
module.exports = entry;