var saveCo=[];
var infPos={};
var gloCont=1;
var contaAritasG=1;
var savePos={};
var pointSize = 4; 
var radius = 5;
//var contPoly=1;
var contadorGloid=1;
var contadorGloEd=1;
var nodeInit=0;
var colors=['#009900','#995c00','#ff0066','#884EA0','#660033','#2471A3','#138D75','#cc00cc','#2E4053'];

var nodes = [];
var edges=[];

var nodeInicial={
    'x':-1,
    'y':-1,
    'estado':1
};
var nodeEnd={
    'x':-1,
    'y':-1,
    'estado':2
};


var data;

var dato = {
        id: -1, // Number of variables
        to: [], // z function
        from:[]
};

var strucPoly = {
    coordenadasPoly: [] 
};

var nodes = null;


var W = 670;
var H = 500;
var canvas = document.getElementById("canvas");
var g = canvas.getContext('2d');


/*window.onload = function()
{ 
    console.log("cargando load, paso uno");
    drawInit();
    //load();
    //$('.desaparecer').hide();
    selecion=[];
    infPos={
        'x':-1,
        'y':-1
    };
    
    //network.addNodeMode();
    canvas.addEventListener("click", ObtenerCoords, false);

};*/


function ObtenerCoords(event)
{
    $('#paz').hide();
    savePos={
    'estado':-1,
    'x':-1,
    'y':-1
    };
    var verificaB;
    var rect = canvas.getBoundingClientRect();
    if (event.x != undefined && event.y != undefined){

      
      x1 = event.clientX - rect.left;
      y2 = event.clientY - rect.top;
      
      console.log("Coordenada",x1,y2);
      if(nodeInit==1)
      {
        
        console.log("Nodo Inicial");
        verificaB=deleteNodesIniciales(1);
        console.log("valor de verifica",verificaB);
        if(verificaB!=-1){
            strucPoly.coordenadasPoly.splice(verificaB,1);
        }
            
            nodeInicial.x=x1;
            nodeInicial.y=y2;
            nodeInicial.estado=1;
            saveCo.push(nodeInicial);
            drawCoordinates(x1,y2);
            strucPoly.coordenadasPoly.push(
                    saveCo
            );
            
            //gloCont++;
            saveCo=[];
            nodeInit=0;
        
        
        
      }
      else if(nodeInit==2){
            verificaB=deleteNodesIniciales(2);
            console.log("valor de verifica",verificaB);
            if(verificaB!=-1){
                strucPoly.coordenadasPoly.splice(verificaB,2);
             }
            console.log("Nodo final");
            nodeEnd.x=x1;
            nodeEnd.y=y2;
            nodeEnd.estado=2;
            saveCo.push(nodeEnd);
            drawCoordinates(x1,y2);
            strucPoly.coordenadasPoly.push(
                            saveCo
            );
            //gloCont++;
            saveCo=[];
            nodeInit=0;
    }
    else{
        console.log("cualquie cosa");
        savePos.x=x1;
        savePos.y=y2;
        savePos.estado=0;
        saveCo.push(savePos);
        drawCoordinates(x1,y2);
        //gloCont++;
    }
      console.log("strucPoly",strucPoly);
 }


    
  }



function drawCoordinates(x,y){
    // Cambia el tamaño del punto
    var ctx = document.getElementById("canvas").getContext("2d");


    ctx.fillStyle = "#0B0B61"; // Color rojo

    ctx.beginPath(); // Iniciar trazo
    ctx.arc(x, y, pointSize, 0, Math.PI * 2, true); // Dibujar un punto usando la funcion arc
    ctx.fill(); // Terminar trazo
}
function drawInit() //Dibuja la linea
{
    if (!(W > 0 && H > 0 && W < 5000 && H < 5000 && W % 1 == 0 && H % 1 == 0)) return;

    canvas = document.getElementById("canvas");
    canvas.width = W;
    canvas.height = H;
    
    g.fillStyle = "white";
    g.fillRect(0, 0, W, H);
    drawGrid();
}
function drawGrid()
{
    for (var k = -50; k <= 50; k++) {
        if (k == 0) {
            g.lineWidth = 2;
            g.strokeStyle = "BLACK";
        } else {
            g.lineWidth = 1;
            g.strokeStyle = "#cccccc";
        }
        line({x: k * 20 + W / 2, y: 0}, {x: k * 20 + W / 2, y: H});
        line({x: 0, y: k * 20 + H / 2}, {x: W, y: k * 20 + H / 2});
    }
}
function line(a, b) 
{

        g.beginPath();
        g.moveTo(a.x, a.y);
        g.lineTo(b.x, b.y);
        g.stroke();
}

/*******************/
function draw() {
    'use strict';
    drawInit();
    drawGrid();
    if(saveCo.length>1){
        var hullPoints = convexHull(saveCo);
        strucPoly.coordenadasPoly.push(
                    hullPoints
        );
    }
    console.log("holaaaa strucPoly",strucPoly);

    function drawPoint(p) {
        //var p = transform(point);
        
        g.beginPath();
        g.moveTo(p.x - radius, p.y);
        g.lineTo(p.x, p.y + radius);
        g.lineTo(p.x + radius, p.y);
        g.lineTo(p.x, p.y - radius);
        g.closePath();
        g.fill();
    }

    drawGrid();
    
    
    
   for(var i=0 ; i<strucPoly.coordenadasPoly.length;i++){

        if(strucPoly.coordenadasPoly[i][0].estado==0){
            g.fillStyle = colors[i];
            strucPoly.coordenadasPoly[i].forEach(drawPoint);
            g.beginPath();
            strucPoly.coordenadasPoly[i].forEach(function (p) {
                //var p = transform(point);
                g.lineTo(p.x, p.y);
            });
            g.closePath();

            g.globalAlpha = 0.2;
            g.fill();
            g.globalAlpha = 1;
            g.strokeStyle = colors[i];
            g.stroke();
        }
        else if(strucPoly.coordenadasPoly[i][0].estado==1){
                radius=10;
                g.fillStyle = "#000066";
                drawPoint(nodeInicial);
                radius = 5;
        }
        else if(strucPoly.coordenadasPoly[i][0].estado==2){
                radius=10;
                g.fillStyle = "#00ffff";
                drawPoint(nodeEnd);
                        //strucPoly.coordenadasPoly[i].forEach(drawPoint);
                radius = 5;

        }
            
        
        
    }
    

    



    
    hullPoints=[];
    saveCo=[];
}

function checkLineIntersection(line1Start, line1End, line2Start, line2End) {    
    var denominator, a, b, numerator1, numerator2, result = {
        x: null,
        y: null,
        onLine1: false,
        onLine2: false
    };
    denominator = ((line2End.y - line2Start.y) * (line1End.x - line1Start.x)) - ((line2End.x - line2Start.x) * (line1End.y - line1Start.y));
    if (denominator == 0) {
        return result;
    }
    a = line1Start.y - line2Start.y;
    b = line1Start.x - line2Start.x;
    numerator1 = ((line2End.x - line2Start.x) * a) - ((line2End.y - line2Start.y) * b);
    numerator2 = ((line1End.x - line1Start.x) * a) - ((line1End.y - line1Start.y) * b);
    a = numerator1 / denominator;
    b = numerator2 / denominator;

    // if we cast these lines infinitely in both directions, they intersect here:
    result.x = line1Start.x + (a * (line1End.x - line1Start.x));
    result.y = line1Start.y + (a * (line1End.y - line1Start.y));
    if (a > 0 && a < 1) {
        result.onLine1 = true;
    }
    // if line2 is a segment and line1 is infinite, they intersect if:
    if (b > 0 && b < 1) {
        result.onLine2 = true;
    }
 // if line1 and line2 are segments, they intersect if both of the above are true
    return result;
};

function dibuj(l,m){

    for(var j=0; j<strucPoly.coordenadasPoly[l].length; j++) //Para verticce de figura inicial
        for(var i=0; i<strucPoly.coordenadasPoly[m].length; i++){//PAra para todos los vertices del la otra figuea
            var bad=false;
            var bandera=0;
            for(var k=1; k<=strucPoly.coordenadasPoly[l].length; k++){
                if(k==strucPoly.coordenadasPoly[l].length){
                    bad=checkLineIntersection(strucPoly.coordenadasPoly[l][j], strucPoly.coordenadasPoly[m][i],strucPoly.coordenadasPoly[l][0], strucPoly.coordenadasPoly[l][k-1]);  
                }
                else
                    bad=checkLineIntersection(strucPoly.coordenadasPoly[l][j], strucPoly.coordenadasPoly[m][i],strucPoly.coordenadasPoly[l][k-1], strucPoly.coordenadasPoly[l][k]);                
                if(bad.onLine1==true && bad.onLine2==true){     
                    bandera=1;   
                    break;
                }
            }
            if(bandera==0){
                for(var k=1; k<=strucPoly.coordenadasPoly[m].length; k++){//todos los vertices del otro triwnagulo
                    if(k==strucPoly.coordenadasPoly[m].length){
                        bad=checkLineIntersection(strucPoly.coordenadasPoly[l][j], strucPoly.coordenadasPoly[m][i],strucPoly.coordenadasPoly[m][0], strucPoly.coordenadasPoly[m][k-1]);                        
                    }
                    else{
                        bad=checkLineIntersection(strucPoly.coordenadasPoly[l][j], strucPoly.coordenadasPoly[m][i],strucPoly.coordenadasPoly[m][k-1], strucPoly.coordenadasPoly[m][k]);
                    }
                    if(bad.onLine1==true && bad.onLine2==true){     
                        bandera=1;   
                        break;
                    }
                }
            }
            if(bandera==0){
                for(var k=0; k<strucPoly.coordenadasPoly.length; k++){
                    if(k!=m && k!=l){
                        for(var n=1; n<=strucPoly.coordenadasPoly[k].length; n++){//todos los vertices del otro triwnagulo
                            if(n==strucPoly.coordenadasPoly[k].length){
                                bad=checkLineIntersection(strucPoly.coordenadasPoly[l][j], strucPoly.coordenadasPoly[m][i],strucPoly.coordenadasPoly[k][0], strucPoly.coordenadasPoly[k][n-1]);                        
                            }
                            else{
                                bad=checkLineIntersection(strucPoly.coordenadasPoly[l][j], strucPoly.coordenadasPoly[m][i],strucPoly.coordenadasPoly[k][n-1], strucPoly.coordenadasPoly[k][n]);
                            }
                            if(bad.onLine1==true && bad.onLine2==true){     
                                bandera=1;   
                                break;
                            }
                        } 
                    }
                }
            }

            if(bandera==0){
                line(strucPoly.coordenadasPoly[l][j], strucPoly.coordenadasPoly[m][i]);
                
                
                //dato.x.push(strucPoly.coordenadasPoly[l][j].x);
                //dato.y.push(strucPoly.coordenadasPoly[l][j].y);

                
                var from=findXY(strucPoly.coordenadasPoly[l][j].x,strucPoly.coordenadasPoly[l][j].y);
                var to=findXY(strucPoly.coordenadasPoly[m][i].x,strucPoly.coordenadasPoly[m][i].y);
                
                edges.push({
                    id:contadorGloEd,
                    from: from,
                    to: to,
                    colore:"blue"
                });
    
                contadorGloEd++;
               /* dato[contadorGloid]={
                    id:contadorGloid,
                    to: {x:strucPoly.coordenadasPoly[l][j].x,y:strucPoly.coordenadasPoly[l][j].y},
                    from:{x:strucPoly.coordenadasPoly[m][i].x,y:strucPoly.coordenadasPoly[m][i].y},
                };
                contadorGloid++;*/
                

            }
        }
}

function dibujarLineas(){
   saveNodes();
   edges = [];
   draw();
               
    var tam=strucPoly.coordenadasPoly.length;
    var combinada=new Array(tam);
    for(var i=0; i<tam; i++){
        combinada[i]=new Array(tam);
        for(var j=0; j<tam; j++)
            combinada[i][j]=-1;
    }
    for(i=0; i<tam; i++){
        g.strokeStyle =colors[i];
        setEdges(i);
        console.log('color de linea',colors[i]);
        for(j=0; j<tam; j++){            
            if(i!=j){
                if(combinada[i][j]==-1 && combinada[j][i]){
                    console.log("Combinada i ", i, j);
                    combinada[i][j]=1;
                    combinada[j][i]=1;
                    
                    dibuj(i,j);
                        
                }                
            }
            
        }        
    }
    console.log("hola struc final",dato);
    showGraphGeo();

}


function setNode_Init_End(tipo){
    if(tipo==1){
        nodeInit=1;
    }
    if(tipo==2){
        nodeInit=2;
    }


}

function deleteNodesIniciales(tipo)
{
    var tam=strucPoly.coordenadasPoly.length;
    var posi=-1;

    for(i=0; i<tam; i++){
        if(strucPoly.coordenadasPoly[i].length==1){
            if(strucPoly.coordenadasPoly[i][0].estado==tipo)
                posi=i;
            
            

        }
        
    }  
    return posi;

}
function saveNodes()
{
    
    nodes = [];
    var tam=strucPoly.coordenadasPoly.length;
    var idCont=1;
    for(var j=0; j<tam ; j++){
        for (var i = 0; i <strucPoly.coordenadasPoly[j].length; i++) {
            //console.log("buu",strucPoly.coordenadasPoly[j][i],j,i);
            nodes.push({
              id: idCont,
              label: String(idCont),
              x:strucPoly.coordenadasPoly[j][i].x,
              y:strucPoly.coordenadasPoly[j][i].y
            });
            idCont++;
            console.log("nodes",nodes);
        }
        console.log("--------------");
    }
}
function findXY(x1,y1)
{
    
    for(var j=0; j<nodes.length ; j++){
        if(nodes[j].x==x1 && nodes[j].y==y1){
            return nodes[j].id;
        }
    }
}
function saveGraph(){

    return {nodes:nodes, edges:edges};
}

function setEdges(base)
{
    var c1X;
    var c2X,from,to;
    if(strucPoly.coordenadasPoly[base].length>1){
        for(var i=0; i<strucPoly.coordenadasPoly[base].length; i++){

            if(i==strucPoly.coordenadasPoly[base].length-1)
            {
                c1X=strucPoly.coordenadasPoly[base][0];
                c2X=strucPoly.coordenadasPoly[base][strucPoly.coordenadasPoly[base].length-1];
                from=findXY(c1X.x,c1X.y);
                to=findXY(c2X.x,c2X.y);
                    
                
           
            
            }
            else{
                c1X=strucPoly.coordenadasPoly[base][i];
                c2X=strucPoly.coordenadasPoly[base][i+1];
                from=findXY(c1X.x,c1X.y);
                to=findXY(c2X.x,c2X.y);
                    
                    
                   
            }
            edges.push({
                        id:contadorGloEd,
                        from: from,
                        to: to,
                        colore:"blue"
                    });
            console.log("--------------------end-----------------");   
            contadorGloEd++;
                
        }
    }

}
function showGraphGeo(){

      e_init=findXY(nodeInicial.x,nodeInicial.y);
      e_end=findXY(nodeEnd.x,nodeEnd.y);

      data = saveGraph();
      data.nodes = new vis.DataSet(data.nodes);
      data.edges = new vis.DataSet(data.edges);
      network = tree(data,document.getElementById('tree'));
      console.log("aqui en data",data);
    
}




