const path = require("path");//路径检索(node语法)
const htmlplugin = require("html-webpack-plugin");//打包html的插件
const uglify = require("uglifyjs-webpack-plugin");//压缩js,用于打包压缩开发环境代码,生产生产环境压缩代码
const extractTextPlugin = require("extract-text-webpack-plugin");//打包分离css、less、sass与js插件
const glob = require("glob");//引入node的glob对象方法
const PurifyCssPlugin = require("purifycss-webpack");//去除多余无用css的插件
const webpack_entry = require("./webpack_config_modules/webpack_entry.js");//模块化开发引入
const webpack = require("webpack");//引入webpack,使用其中自带的插件
const copyWebpackPlugin = require("copy-webpack-plugin");//打包静态文件
//开发环境与生存环境并行
var website = {
    publicpath : "",
}
if(process.env.type=="build") website.publicpath = "http://www.gmall88.com/";
else website.publicpath = "http://172.16.8.214:1992/";
module.exports = {
    devtool : 'eval-source-map',//打包调试功能
    //入口文件的配置项
    entry : webpack_entry.path,
    //出口文件的配置项
    output : {
        path: path.resolve(__dirname,'dist'),//获取项目出口的绝对路径
        filename: '[name].js',//编译出口文件名称([name]意思是与入口文件名称相同)
        publicPath: website.publicpath,//设置出口文件中的所有静态文件的绝对路径地址
    },
    //模块:例如解析css,img,js,html压缩
    module : {
        rules : [
            {//css打包
                test : /\.css$/,//文件后缀匹配css文件
                use : extractTextPlugin.extract({//css与js打包分离写法
                    fallback : 'style-loader',
                    use: [
                        {
                            loader: 'css-loader',
                            options: {
                                importLoaders: 1
                            }
                        },
                        {
                            loader : 'postcss-loader',
                        }
                    ]
                })
                /*use : [//css与js打包不分离写法
                    {
                        loader : 'style-loader',//将js字符串生成为style节点
                    },
                    {
                        loader : 'css-loader',//将css转化成CommonJS模块
                    }
                ]*/
            },
            {//图片打包
                test : /\.(png|jpg|gif)$/,
                use :[
                    {//css中图片路径及图片压缩
                        loader : 'url-loader',
                        options : {
                            limit: 10000,//小于10000B的将被转为Base64的格式存在js中,减少请求img接口数
                            outputPath: './img/',//指定生成环境下的图片存储地址
                        }
                    }
                ]
            },
            {//html打包
                test : /\.(html|htm)$/i,
                use : [
                    {//html中的img路径
                        loader : 'html-withimg-loader'
                    }
                ]
            },
            {//babel编译es6
                test : /\.(js|jsx)$/,
                use :[
                    {
                        loader : 'babel-loader',
                        /*options:{//.babelrc文件替代改参数(可能配置参数很多)
                            presets:[
                                "es2015","react"
                            ]
                        }*/
                    }
                ],
                exclude : /node_modules/,
            },
            {//less打包
                test: /\.less$/,
                use: extractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [
                        {
                            loader: "css-loader",
                            options: {
                                importLoaders: 1
                            }
                        },
                        {
                            loader: 'less-loader',
                        },
                        {
                            loader : 'postcss-loader'
                        }
                    ]
                })
            },
            {//sass打包
                test: /\.scss$/,
                use: extractTextPlugin.extract({
                    use: [
                        {
                            loader: "css-loader",
                            options :{
                                importLoaders :1
                            }
                        },
                        {
                            loader: 'sass-loader',
                        },
                        {
                            loader : 'postcss-loader'
                        }
                    ],
                    fallback: 'style-loader',//开发环境使用
                })
            }
        ]
    },
    //插件,用于生产模板和各项功能
    plugins : [
        //new uglify(),//压缩js
        new htmlplugin({
            minify:{//html中再压缩那些内容
                removeAttributeQuotes : true,//html中属性的双引号
            },
            hash : true,//不缓存
            template : "./src/index.html",//html模板目录文件
        }),
        new extractTextPlugin("./css/index.css"),//路径为打包之后css分离的路径
        new PurifyCssPlugin({//删除多余无用css样式
            paths : glob.sync(path.join(__dirname,'src/*.html')),//必须安装上面这个插件才能使用
        }),
        new webpack.BannerPlugin('************blues_enao编写***********'),//添加注释
        new webpack.ProvidePlugin({//插件全局引入
            $ : "jquery",
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name : ["jquery","vue"],//一一对应入口文件中的名字
            filename : "assets/js/[name].js",//-一一对应出口文件目录
            minChunks : 2,//最小打包的文件模块数,这里直接写2就好
        }),
        new copyWebpackPlugin([{//打包静态资源
            from : __dirname+"/src/public",
            to : "./public",
        }]),
        new webpack.HotModuleReplacementPlugin(),//热更新(非页面自动刷新的更新)而是更新视图的修改部分
    ],
    //配置webpack开发服务功能
    devServer : {
        contentBase : path.resolve(__dirname,'dist'),//设置基本目录结构(编译后的出口文件)
        host: '172.16.8.214',//服务器的IP地址,(开发中为本机ip或localhost)
        port: '1992',//端口(防占用)
        compress : true,//服务端压缩是否开启
        hot: true,
    }
}