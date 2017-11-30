import css from "./css/index.css";
import less from "./css/index.less";
import sass from "./css/index.scss";
//import json from "./es6_proxy.json";
var json = require("./es6_proxy.json");
var webpack_p = document.getElementById("webpack_p");
webpack_p.style.color = "blue";
var webpack_div = document.getElementsByClassName("webpack_div")[0];
webpack_div.style.color = "black";
//es6
{
    let colortest = new Set(["red","green","block","gray","orange","yellow","blue","pink","purple","white"]);//数组转类数组
    let autocolor = parseInt((Math.random()*10));
    webpack_div.style.backgroundColor = [...colortest][autocolor];//类数组转成数组
}
//jq
$(".jq").html("jquery引入成功!");
//json
{
    var jsonDom = document.getElementsByClassName("json")[0];
    let handler = {
        has(target,prop){
            if(prop==="score" && target[prop]<60){     
                let info = `${target[name]} 成绩不及格,得到 ${target[prop]} 分`;
                console.log(info);
                return false;
            }
            return prop in target;
        }
    };
    let proxy1 = new Proxy(json,handler);//获取json操作之前,提供额外操作
    jsonDom.innerHTML = `${"score" in proxy1} 分数为${proxy1.score}`;//判断proxy1有没有score,低于60分的就没有,为false
}