// Jardim Interativo
// Uma animação interativa onde o usuário pode plantar e cultivar flores

let flowers = []; // Array para armazenar as flores
let clouds = []; // Array para armazenar as nuvens
let raindrops = []; // Array para armazenar as gotas de chuva
let isRaining = false; // Estado da chuva
let bgColor; // Cor de fundo

function setup() {
  createCanvas(800, 600);
  colorMode(HSB, 360, 100, 100, 1);
  bgColor = color(200, 30, 95); // Cor do céu
  
  // Criar algumas nuvens iniciais
  for (let i = 0; i < 3; i++) {
    clouds.push({
      x: random(width),
      y: random(50, 150),
      speed: random(0.2, 0.5),
      scale: random(0.7, 1.3)
    });
  }
  
  // Criar um texto de instruções
  let instructionP = createP('Clique na grama para plantar flores | Tecla R para chuva | Tecla C para colher');
  instructionP.style('transform', 'translateX(-50%)');
  instructionP.position(windowWidth/2, 0);
  instructionP.style('background', '#fff');
  instructionP.style('padding', '6px 12px');
  instructionP.style('border-radius', '6px');
  instructionP.style('align', 'center');
  instructionP.style('box-shadow', '0 2px 5px rgba(0,0,0,0.1)');
  instructionP.style('z-index', '10');
}

function draw() {
  // Desenhar o céu
  background(bgColor);
  
  // Desenhar e mover as nuvens (transformação: translate)
  drawClouds();
  
  // Desenhar o chão
  fill(120, 60, 40);
  rect(0, height - 100, width, 100);
  
  // Animação: atualizar e desenhar flores (usando transformações: scale e rotate)
  updateFlowers();
  
  // Gerar e desenhar chuva se estiver chovendo
  if (isRaining) {
    generateRain();
    updateRain();
  }
}

function drawClouds() {
  fill(0, 0, 100, 0.8);
  noStroke();
  
  for (let cloud of clouds) {
    push();
    translate(cloud.x, cloud.y); // Transformação: translate
    scale(cloud.scale); // Transformação: scale
    
    ellipse(0, 0, 70, 50);
    ellipse(-30, 0, 50, 40);
    ellipse(30, 0, 50, 40);
    
    cloud.x += cloud.speed;
    if (cloud.x > width + 100) {
      cloud.x = -100;
      cloud.y = random(50, 150);
    }
    pop();
  }
}

function generateRain() {
  // Adicionar novas gotas de chuva
  if (random() < 0.3) {
    for (let i = 0; i < 3; i++) {
      raindrops.push({
        x: random(width),
        y: random(-50, 0),
        speed: random(5, 15),
        length: random(10, 20)
      });
    }
  }
}

function updateRain() {
  // Atualizar e desenhar gotas de chuva
  stroke(220, 70, 90, 0.7);
  strokeWeight(2);
  
  for (let i = raindrops.length - 1; i >= 0; i--) {
    let drop = raindrops[i];
    line(drop.x, drop.y, drop.x, drop.y + drop.length);
    drop.y += drop.speed;
    
    // Remover gotas que saíram da tela
    if (drop.y > height - 100) {
      // Chance de fazer uma flor crescer mais rápido ao ser molhada
      for (let flower of flowers) {
        if (abs(flower.x - drop.x) < 30 && flower.size < flower.maxSize) {
          flower.size += 0.5;
        }
      }
      raindrops.splice(i, 1);
    }
  }
}

function updateFlowers() {
  for (let flower of flowers) {
    push();
    translate(flower.x, flower.y); // Transformação: translate
    
    // Desenhar o caule
    stroke(120, 70, 50);
    strokeWeight(3);
    line(0, 0, 0, -flower.stemHeight);
    
    // Desenhar a flor
    translate(0, -flower.stemHeight); // Translate para o topo do caule
    rotate(flower.angle); // Transformação: rotate
    flower.angle += flower.rotationSpeed; // Animação contínua: rotação
    
    // Desenhar pétalas
    noStroke();
    fill(flower.hue, 80, 90);
    for (let i = 0; i < flower.petalCount; i++) {
      push();
      rotate(i * TWO_PI / flower.petalCount);
      scale(flower.size / 30); // Transformação: scale
      ellipse(20, 0, 30, 15);
      pop();
    }
    
    // Desenhar o centro da flor
    fill(60, 100, 100);
    ellipse(0, 0, flower.size * 0.7);
    
    pop();
    
    // Fazer as flores crescerem lentamente até o tamanho máximo
    if (flower.size < flower.maxSize) {
      flower.size += 0.02;
    }
    if (flower.stemHeight < flower.maxStemHeight) {
      flower.stemHeight += 0.05;
    }
  }
}

function mousePressed() {
  // Plantar uma nova flor onde o usuário clicou
  if (mouseY > height - 100) {
    // Criar uma nova flor
    flowers.push({
      x: mouseX,
      y: height - 100,
      size: 5, // Tamanho inicial
      maxSize: random(20, 30), // Tamanho máximo
      stemHeight: 10, // Altura inicial do caule
      maxStemHeight: random(50, 100), // Altura máxima do caule
      angle: 0,
      rotationSpeed: random(-0.01, 0.01), // Velocidade de rotação
      petalCount: floor(random(5, 12)), // Número de pétalas
      hue: random(0, 360) // Cor da flor em HSB
    });
  }
}

function keyPressed() {
  // Alternar chuva ao pressionar 'R' ou 'r'
  if (key === 'r' || key === 'R') {
    isRaining = !isRaining;
    if (isRaining) {
      bgColor = color(200, 30, 75); // Céu mais escuro quando chove
    } else {
      bgColor = color(200, 30, 95); // Céu normal
      raindrops = []; // Limpar gotas de chuva existentes
    }
  }
  
  // Limpar todas as flores ao pressionar 'C' ou 'c'
  if (key === 'c' || key === 'C') {
    flowers = [];
  }
}