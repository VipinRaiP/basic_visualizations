
function onAlcoholAllDist(){
    $.get("/alcoholAllDist",function(res,status){
        console.log(status);
    })
}