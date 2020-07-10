let cr = 300;
let ang = 1.57,
  dang = 0.5;
let x = 200;
let y = 200;
let r = 150;
let npuntos = 6;
let contador = 0;
let cooldown;
let cool;

let colorP;

let cooldownP;
let coolP;

let puntos = [];
let ex;
let ey;

let mic;

var input1;
var input2;

//playmode
var playON = false;

//checkbox y estatus
var checkbox, statusText;

function setup() {
  var canvas = createCanvas(600, 600);
  canvas.center();
  contador = 0;
  cooldown = 0;
  cooldownP = 0;
  colorP = color(120, 120, 100);
  coolP = false;
  input1 = createInput();
  input1.position(canvas.x + 20, canvas.y + 20);
  /////// EL PRIMER INPUTS ES PARA MODIFICAR EL NUMERO MÁXIMO DE PUNTOS
  button = createButton('Aceptar');
  button.position(input1.x + input1.width, input1.y);
  button.mousePressed(cambioNum);

  input2 = createInput();
  input2.position(canvas.x + 20, canvas.y + 40);
  /////// EL SEGUNDO INPUTS ES PARA MODIFICAR LA VELOCIDAD
  button2 = createButton('Aceptar');
  button2.position(input2.x + input2.width, canvas.y + 40);
  button2.mousePressed(cambioVel);

  mic = new p5.AudioIn();

  button3 = createButton('Activar Micrófono');
  button3.position(input2.x, input2.y + canvas.height - 100);
  button3.mousePressed(micro);


  ///CHECKBOX para playmode y texto de status
  checkbox = createCheckbox('', false);
  checkbox.changed(playMode);
  checkbox.position(canvas.x + canvas.width / 2, button3.y);
  statusText = createP("Play Mode : ❌");
  statusText.position(checkbox.x + 30, button3.y - 18);
}

function draw() {
  background(220);
  stroke(0);
  fill(0);
  text('Nº Golpes: ' + npuntos, canvas.width / 2, 35);
  text('Velocidad: ' + dang, canvas.width / 2, 55);
  circle(canvas.width / 2, canvas.height / 2, 50);
  noFill();
  circle(canvas.width / 2, canvas.height / 2, 300);
  fill(250, 150, 0);
  noStroke();

  //////// Mostrar Puntos Naranja
  for (let i = 0; i < puntos.length; i++) {
    puntos[i].mostrar(puntos[i].relleno);
  }

  ////////////////// LINEAS
  stroke(250, 150, 0);
  for (let h = 0; h < puntos.length; h++) {
    if (h == puntos.length - 1) {
      line(puntos[h].x, puntos[h].y, puntos[0].x, puntos[0].y);
    } else {
      line(puntos[h].x, puntos[h].y, puntos[h + 1].x, puntos[h + 1].y);
    }
  }

  ////////// PUNTO DE TIEMPO
  ex = cr + r * cos(ang);
  ey = cr + r * sin(ang);
  ang += dang / 28.2;
  fill(colorP);
  noStroke();
  circle(ex, ey, 25);

  ////////// BORRAR PUNTOS LUEGO DE UN CICLO
  for (let i = puntos.length - 1; i >= 0; i--) {
    if (puntos[i].contiene(ex, ey) && puntos[i].inmV == false) {
      if (playON === false) {
        puntos.splice(i, 1);
      }
    }
  }

  /////////////////// COOLDOWN ENTRE PUNTO Y PUNTO
  if (cool) {
    cooldown++;
  }
  if (cooldown > 10) {
    cool = false;
    cooldown = 0;
  }

  /////////////////// COOLDOWN ACERTADO O NO
  if (coolP) {
    cooldownP++;
  }
  if (cooldownP > 5) {
    coolP = false;
    cooldownP = 0;
    colorP = color(120, 120, 100);
  }

  /////////////////// PONER PUNTO POR INPUT DEL MICRO
  let vol = mic.getLevel();
  if (vol > 0.02) {
    if (!playON){
    marca();
    } else { chequear();}
  }

}


function marca() {
  if (!cool) {
    if (puntos.length < npuntos) {
      let b = new DOT(ex, ey);
      puntos.push(b);
      contador++;
      if (contador > puntos) {
        contador = 0;
      }
      cool = true;
    } else {
      ///////////////// ACÁ ESTÁ EL PROBLEMA DE QUÉ HACER
      /// UNA VEZ YA SE COLOCARON TODOS LOS PUNTOS DEFINIDOS
      puntos[0].x = ex;
      puntos[0].y = ey;
      puntos[0].inm = 0;
      puntos[0].inmV = true;
      contador++;
      if (contador > puntos) {
        contador = 0;
      }
      cool = true;
    }
  }
}

function chequear(){
    /////////////////// Play Mode
    for (let i = 0; i < puntos.length; i++) {
      if (puntos[i].contiene(ex, ey)) {
        //puntos[i].relleno = color(0,255,0);
        colorP = color(0, 255, 0);
        coolP = true;
      }
    }
    if (!coolP) {
      colorP = color(255, 0, 0);
      coolP = true;
    }
}


function cambioNum() {
  let num = input1.value();
  npuntos = num;
}

function cambioVel() {
  let num = input2.value();
  dang = num;
}


class DOT {
  constructor(px, py) {
    this.x = px;
    this.y = py;
    this.inm = 0;
    this.inmV = true;
    this.relleno = color(250, 150, 0);
  }

  contiene(px, py) {
    let d = dist(px, py, this.x, this.y);
    if (d < 15) {
      return true;
    } else {
      return false;
    }
  }

  mostrar(relleno) {
    fill(relleno);
    ellipse(this.x, this.y, 15, 15);
    if (this.inm < 100) {
      this.inm++;
      if (this.inm == 100) {
        this.inmV = false;
      }
    }
    //print(this.inmV);
  }
}


function mousePressed() {
  if (!playON) {
    let d = dist(canvas.width / 2, canvas.height / 2, mouseX, mouseY);
    if (d < 25) {
      marca();
    }
  } else {
    chequear();
  }
}

function micro() {
  mic.start(null, errMic)
}

//CALLBACK PARA MICROFONO NO DETECTADO
function errMic() {
  alert("Microfono no detectado");
}

function playMode() {
  if (this.checked()) {
    //console.log('playmodeON!');
    playON = true;
    statusText.html('Play Mode : ✅', null);
  } else {
    //console.log('playmodeOFF!');
    playON = false;
    statusText.html('Play Mode : ❌', null);
  }
}
