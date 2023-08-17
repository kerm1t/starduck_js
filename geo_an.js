//import { vec2 } from "./vec2.js";

var ctx = cnv.getContext("2d");
var data = ctx.createImageData(600,600);
var buf = new Uint32Array(data.data.buffer);

// https://stackoverflow.com/questions/39213661/canvas-using-uint32array-wrong-colors-are-being-rendered
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

function bresenham(x0, y0, x1, y1, col) // https://de.wikipedia.org/wiki/Bresenham-Algorithmus
{
    var dx =  Math.abs(x1-x0), sx = x0<x1 ? 1 : -1;
    var dy = -Math.abs(y1-y0), sy = y0<y1 ? 1 : -1;
    var err = dx+dy, e2; // error value e_xy

    while (true)
    {
        buf[y0*600+x0]=col;

        if (x0==x1 && y0==y1) break;
        e2 = 2*err;
        if (e2 > dy) { err += dy; x0 += sx; } // e_xy+e_x > 0
        if (e2 < dx) { err += dx; y0 += sy; } // e_xy+e_y < 0
    }
}

function bresenham_arr(x0, y0, x1, y1, xarr, col) // https://de.wikipedia.org/wiki/Bresenham-Algorithmus
{
  var dx = Math.abs(x1 - x0), sx = x0<x1 ? 1 : -1;
  var dy = -Math.abs(y1 - y0), sy = y0<y1 ? 1 : -1;
  var err = dx + dy, e2; // error value e_xy

  while (true)
  {
    buf[y0*600+x0]=col;
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
    bresenham(xarr[y], y, xarr2[y], y, col); // man kann sogar noch einfacher mit x-Schleife schreiben
  }
}

function lesson2() // draw 3 filled triangles
{

  triangle_filled(10,70, 50,160,70,80, reverseUint32(0xff0000ff)); // r
  triangle_filled(180,50,150,1,70,180, reverseUint32(0x00ff00ff)); // g
  triangle_filled(180,150,120,160,130,180, reverseUint32(0x0000ffff)); // b
}

function draw_quads()
{
  var p0 = vec2(100,100);
  var p1 = vec2(150,100);
  var p2 = vec2(150,150);
  var p3 = vec2(100,150);
  col = reverseUint32(0x0000ffff);
  buf[p0.y*600+p0.x]=col;//randomColor;//0xFF000000;
  buf[p1.y*600+p1.x]=col;//randomColor;//0xFF000000;
  buf[p2.y*600+p2.x]=col;//randomColor;//0xFF000000;
  buf[p3.y*600+p3.x]=col;//randomColor;//0xFF000000;
  triangle_filled(p0.x,p0.y, p1.x,p1.y,p2.x,p2.y, reverseUint32(0xff0000ff)); // r
  triangle_filled(p2.x,p2.y, p3.x,p3.y,p0.x,p0.y, reverseUint32(0xff0000ff)); // r

/*  z = 10;
  f = 5.0;
  var pp0 = vec2(f*p0.x/z,f*p0.y/z);
  var pp1 = vec2(f*p1.x/z,f*p1.y/z);
  var pp2 = vec2(f*p2.x/z,f*p2.y/z);
  var pp3 = vec2(f*p3.x/z,f*p3.y/z);
  buf[pp0.y*600+pp0.x]=col;//randomColor;//0xFF000000;
  buf[pp1.y*600+pp1.x]=col;//randomColor;//0xFF000000;
  buf[pp2.y*600+pp2.x]=col;//randomColor;//0xFF000000;
  buf[pp3.y*600+pp3.x]=col;//randomColor;//0xFF000000;
  */

  var p0 = new vec3(100,100,10);
  var p1 = new vec3(150,100,20);
  var p2 = new vec3(150,150,20);
  var p3 = new vec3(100,150,10);
  f = 5.0;
  var pp0 = vec2(f*p0.x/p0.z,f*p0.y/p0.z);
  var pp1 = vec2(f*p1.x/p0.z,f*p1.y/p0.z);
  var pp2 = vec2(f*p2.x/p0.z,f*p2.y/p0.z);
  var pp3 = vec2(f*p3.x/p0.z,f*p3.y/p0.z);
  buf[pp0.y*600+pp0.x]=col;
  buf[pp1.y*600+pp1.x]=col;
  buf[pp2.y*600+pp2.x]=col;
  buf[pp3.y*600+pp3.x]=col;
  triangle_filled(pp0.x,pp0.y, pp1.x,pp1.y,pp2.x,pp2.y, reverseUint32(0xff0ff0ff)); // r
  triangle_filled(pp2.x,pp2.y, pp3.x,pp3.y,pp0.x,pp0.y, reverseUint32(0xff0ff0ff)); // r


  var p0 = new vec3(-30,30,1);
  var p1 = new vec3(30,30,1);
  var p2 = new vec3(30,-30,1);
  var p3 = new vec3(-30,-30,1);
  f = 1.0;
  var pp0 = vec2(100+f*p0.x/p0.z,100+f*p0.y/p0.z);
  var pp1 = vec2(100+f*p1.x/p0.z,100+f*p1.y/p0.z);
  var pp2 = vec2(100+f*p2.x/p0.z,100+f*p2.y/p0.z);
  var pp3 = vec2(100+f*p3.x/p0.z,100+f*p3.y/p0.z);
  buf[pp0.y*600+pp0.x]=col;
  buf[pp1.y*600+pp1.x]=col;
  buf[pp2.y*600+pp2.x]=col;
  buf[pp3.y*600+pp3.x]=col;
  triangle_filled(pp0.x,pp0.y, pp1.x,pp1.y,pp2.x,pp2.y, reverseUint32(0xff0ff0ff)); // r
  triangle_filled(pp2.x,pp2.y, pp3.x,pp3.y,pp0.x,pp0.y, reverseUint32(0xff0ff0ff)); // r
}
bars = 3;
barwdth = 10;
const piano_up = new Array(20);
//const piano_low = new Array(10);
/*for (i=0;i<=bars;i++)
{
  piano_up[i] = i*10;
//  piano_low[i] = i*15;
}*/
bufidx = 0;

setInterval(function(){
  var start=Date.now();
//    bresenham(20,20,200,400, reverseUint32(0x00ff00ff));

//    var p0 = vec2(100,100);
//    var p1 = vec2(150,100);

//    bresenham(Math.floor(Math.random()*100),Math.floor(Math.random()*100),Math.floor(Math.random()*10),Math.floor(Math.random()*10));
//    lesson2();

//    draw_quads();
sl = slider.value;
for (i=0;i<=bars;i++) {
piano_up[i] = (i+sl)*10;
//piano_up[i] = (i*10)+sl;
}
    for (j=0;j<bars;j++)
{
  i = j;
  i2 = (j+1);
  var p0 = vec2(piano_up[i],10);
  var p1 = vec2(piano_up[i2],10);
  var p2 = vec2(piano_up[i2],100); // 2do: low
  var p3 = vec2(piano_up[i],100); // 2do: low
  if (i%2==1) col = reverseUint32(0x0000ffff); else col = reverseUint32(0xff00ffff);
  buf[p0.y*600+p0.x]=col;
  buf[p1.y*600+p1.x]=col;
  buf[p2.y*600+p2.x]=col;
  buf[p3.y*600+p3.x]=col;
  triangle_filled(p0.x,p0.y, p1.x,p1.y,p2.x,p2.y, col); // r
  triangle_filled(p2.x,p2.y, p3.x,p3.y,p0.x,p0.y, col); // r
}
/*
for (i=0;i<bars;i++)
{
  piano_up[i]+=1;
//  piano_low[i]+=2;
  if (piano_up[i]>(bars*barwdth)) {
    piano_up[i]=(piano_up[0]%(bars*barwdth));
    bufidx = i;
  }
//  if (piano_low[i]>200) piano_low[i]=piano_low[0]-20;
}
*/
    ctx.putImageData(data,0,0);
  t.innerText="Frame time:"+(Date.now()-start)+"ms";
},20);

