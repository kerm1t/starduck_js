//import { vec2 } from "./vec2.js";

var ctx = cnv.getContext("2d");
var data = ctx.createImageData(600,600);
var buf = new Uint32Array(data.data.buffer);

function reverseUint32 (uint32) {
    var s32 = new Uint32Array(4);
    var s8 = new Uint8Array(s32.buffer);
    var t32 = new Uint32Array(4);
    var t8 = new Uint8Array(t32.buffer);        
    reverseUint32 = function (x) {
        s32[0] = x;
        t8[0] = s8[3];
        t8[1] = s8[2];
        t8[2] = s8[1];
        t8[3] = s8[0];
        return t32[0];
    }
    return reverseUint32(uint32);
};

function bresenham(x0, y0, x1, y1) // https://de.wikipedia.org/wiki/Bresenham-Algorithmus
{
    var dx =  Math.abs(x1-x0), sx = x0<x1 ? 1 : -1;
    var dy = -Math.abs(y1-y0), sy = y0<y1 ? 1 : -1;
    var err = dx+dy, e2; // error value e_xy

    while (true)
    {
//        var randomColor = Math.floor(Math.random()*16777215).toString(16);
//        var randomColor = "#" + ((1 << 24) * Math.random() | 0).toString(16).padStart(6, "0");
        var randomColor = reverseUint32(0xff80d7ff);//(16777215 * Math.random() | 0));
//        var randomColor = '#' + Math.random().toString(16).substr(-6);
        buf[y0*600+x0]=randomColor;//0xFF000000;

        if (x0==x1 && y0==y1) break;
        e2 = 2*err;
        if (e2 > dy) { err += dy; x0 += sx; } // e_xy+e_x > 0
        if (e2 < dx) { err += dx; y0 += sy; } // e_xy+e_y < 0
    }
}

function bresenham_arr(x0, y0, x1, y1, xarr) // https://de.wikipedia.org/wiki/Bresenham-Algorithmus
{
  var dx = Math.abs(x1 - x0), sx = x0<x1 ? 1 : -1;
  var dy = -Math.abs(y1 - y0), sy = y0<y1 ? 1 : -1;
  var err = dx + dy, e2; // error value e_xy

  while (true)
  {
    buf[y0*600+x0]=0xFF000000;
    xarr[y0] = x0; // <-- wichtig! x-pos merken!

    if (x0 == x1 && y0 == y1) break;
    e2 = 2 * err;
    if (e2 > dy) { err += dy; x0 += sx; } // e_xy+e_x > 0
    if (e2 < dx) { err += dx; y0 += sy; } // e_xy+e_y < 0
  }
}

function triangle_filled(x0,y0,x1,y1,x2,y2, col)
{
  var p0 = vec2(x0,y0);
  var p1 = vec2(x1,y1);
  var p2 = vec2(x2,y2);
  // sortiere nach y
  var top, middle, bottom, tmp;
  if (p1.y < p0.y)
  {
    top = p1;
    middle = p0;
  }
  else
  {
    top = p0;
    middle = p1;
  }
  if (p2.y < middle.y)
  {
    if (p2.y < top.y)
    {
      bottom = middle;
      middle = top;
      top = p2;
    }
    else
    {
      bottom = middle;
      middle = p2;
    }
  }
  else
  {
    bottom = p2;
  }

  // 2do: vector instead of fixed array (depends on screen dimensions)
  const xarr = new Array(1000);
  const xarr2 = new Array(1000);
  bresenham_arr(top.x, top.y, middle.x, middle.y, xarr, col);
  bresenham_arr(top.x, top.y, bottom.x, bottom.y, xarr2, col);
  bresenham_arr(middle.x, middle.y, bottom.x, bottom.y, xarr, col);
  for (var y = top.y; y < bottom.y; y++)
  {
    bresenham(xarr[y], y, xarr2[y], y);//, col); // man kann sogar noch einfacher mit x-Schleife schreiben
  }
}

function lesson2() // draw 3 filled triangles
{

  triangle_filled(10,70, 50,160,70,80);
  triangle_filled(180,50,150,1,70,180);
  triangle_filled(180,150,120,160,130,180);
}

//setInterval(function(){
  var start=Date.now();
    bresenham(20,20,200,400);

//    bresenham(Math.floor(Math.random()*100),Math.floor(Math.random()*100),Math.floor(Math.random()*10),Math.floor(Math.random()*10));
    lesson2();

  ctx.putImageData(data,0,0);
  t.innerText="Frame time:"+(Date.now()-start)+"ms";
//},20);

