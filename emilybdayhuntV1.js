let xp = 0;
let health = 100;
let goods = 50;
let currentWeapon = 0;
let fighting;
let monsterHealth;
let inventory = ["existential dread"];

const cultNameOptions = ['Emlody', 'Harmelo', "Poseidon's Bane"];
let selectedCultName;

const controls = document.querySelector("#controls");
const button1 = document.querySelector("#button1");
const button2 = document.querySelector("#button2");
const button3 = document.querySelector("#button3");
const text = document.querySelector("#text");
const rankText = document.querySelector("#rankText");
const xpText = document.querySelector("#xpText");
const healthText = document.querySelector("#healthText");
const goodsText = document.querySelector("#goodsText");
const monsterStats = document.querySelector("#monsterStats");
const monsterName = document.querySelector("#monsterName");
const monsterHealthText = document.querySelector("#monsterHealth");
const weapons = [
  { name: 'existential dread', power: 5 },
  { name: 'group-think', power: 30 },
  { name: 'charisma and vision', power: 50 },
  { name: 'a fierce following of plebs', power: 100 }
];
const monsters = [
  {
    name: "independent thought",
    level: 2,
    health: 15
  },
  {
    name: "society",
    level: 8,
    health: 60
  },
  {
    name: "cult politics",
    level: 20,
    health: 300
  }
]

const locations = [
    {
      name: "yurt",
      "button text": ["Trade your worldly possessions", "Follow your truth", "Claim your throne"],
      "button functions": [goMarket, followTruth, claimThrone],
      text: ''
    },
    {
      name: "market",
      "button text": ["Buy 10 health (10 goods)", "Buy weapon (30 goods)", "Return to your yurt"],
      "button functions": [buyHealth, buyWeapon, goYurt],
      text: "You enter the market. Smiles and flower crowns are free."
    },
    {
      name: "truth",
      "button text": ["Fight independent thought", "Fight society", "Return to your yurt"],
      "button functions": [fightThought, fightSociety, goYurt],
      text: "You follow your truth, but it won't come easily."
    },
    {
      name: "fight",
      "button text": ["Attack", "Dodge", "Run"],
      "button functions": [attack, dodge, goYurt],
      text: "It is your commune against the world!"
    },
    {
      name: "kill monster",
      "button text": ["Return to your yurt", "Return to your yurt", "Return to your yurt"],
      "button functions": [goYurt, goYurt, goYurt],
      text: 'Victory is yours. You gain experience points and are gifted goods by your leader.'
    },
    {
      name: "lose",
      "button text": ["REPLAY?", "REPLAY?", "REPLAY?"],
      "button functions": [restart, restart, restart],
      text: "You have displeased your leader. You are never heard from again &#x2620;"
    },
    { 
      name: "win", 
      "button text": ["REPLAY?", "REPLAY?", "REPLAY?"], 
      "button functions": [restart, restart, restart], 
      text: "Congratulations! &#x1F389; You have mastered cult politics and now everyone is calling YOU messiah. <br><br>An offering has been made in your honour." 
    },
  ];


  
function update(location) {
    monsterStats.style.display = "none";
    button1.innerText = location["button text"][0];
    button2.innerText = location["button text"][1];
    button3.innerText = location["button text"][2];
    button1.onclick = location["button functions"][0];
    button2.onclick = location["button functions"][1];
    button3.onclick = location["button functions"][2];
    text.innerHTML = location.text;
  }

// storing and returning chosen cult name = doesn't work, needs debug

button1.addEventListener('click', () => {
  selectedCultName = cultNameOptions[0];
});

button2.addEventListener('click', () => {
  selectedCultName = cultNameOptions[1];
});

button3.addEventListener('click', () => {
  selectedCultName = cultNameOptions[2];
});

// initialize buttons
button1.onclick = goYurt;
button2.onclick = goYurt;
button3.onclick = goYurt;


// functions

  function goYurt() {
    
    // Update the text property of the locations object
    locations[0].text = `You are in your yurt, ${selectedCultName}. The Followers of Truth are holding a market in yonder canola fields. What goods have you to barter?.`;

    update(locations[0]);
    
    //goYurt audio
    document.getElementById('yayaBeySnippet').pause();
    document.getElementById('backgroundMusic').play();
    document.getElementById('windSounds').pause();
    document.getElementById('knifeSounds').pause();
    
    
}
  
  function goMarket() {
    update(locations[1]);
  }
  
  function followTruth() {
    update(locations[2]);
    document.getElementById('backgroundMusic').pause();
    document.getElementById('yayaBeySnippet').pause();
    document.getElementById('knifeSounds').pause();
    document.getElementById('windSounds').play();
  }
  
  function buyHealth() {
    if (goods >= 10) {
      goods -= 10;
      health += 10;
      goodsText.innerText = goods;
      healthText.innerText = health;
      document.getElementById('coinSounds').play();
    } else {
      text.innerText = "You do not have enough goods to buy health.";
    }
  }
  
  function buyWeapon() {
    if (currentWeapon < weapons.length - 1) {
      if (goods >= 30) {
        goods -= 30;
        currentWeapon++;
        goodsText.innerText = goods;
        let newWeapon = weapons[currentWeapon].name;
        text.innerText = "You now have " + newWeapon + ".";
        inventory.push(newWeapon);
        text.innerText += " In your inventory you have: " + inventory;
        document.getElementById('coinSounds').play();
      } else {
        text.innerText = "You do not have enough goods to buy a weapon.";
      }
    } else {
      text.innerText = "You already have the most powerful weapon!";
      button2.innerText = "Sell weapon for 15 goods";
      button2.onclick = sellWeapon;
    }
  }
  
  function sellWeapon() {
    if (inventory.length > 1) {
      goods += 15;
      goodsText.innerText = goods;
      let currentWeapon = inventory.shift();
      text.innerText = "You sold " + currentWeapon + ".";
      text.innerText += " In your inventory you have: " + inventory;
    } else {
      text.innerText = "Don't sell your only weapon!";
    }
  }
  
  function fightThought() {
    fighting = 0;
    goFight();
  }
  
  function fightSociety() {
    fighting = 1;
    goFight();
  }
  
  function claimThrone() {
    fighting = 2;
    goFight();
    document.getElementById('backgroundMusic').pause();
    document.getElementById('yayaBeySnippet').pause();
    document.getElementById('knifeSounds').pause();
    document.getElementById('windSounds').play();
  }
  
  function goFight() {
    update(locations[3]);
    monsterHealth = monsters[fighting].health;
    monsterStats.style.display = "block";
    monsterName.innerText = monsters[fighting].name;
    monsterHealthText.innerText = monsterHealth;
  }
  
  function attack() {
    text.innerText = "You attack " + monsters[fighting].name + " with " + weapons[currentWeapon].name + ".";
    health -= getMonsterAttackValue(monsters[fighting].level);
    if (isMonsterHit()) {
      monsterHealth -= weapons[currentWeapon].power + Math.floor(Math.random() * xp) + 1;    
    } else {
      text.innerText += " You miss.";
    }
    healthText.innerText = health;
    monsterHealthText.innerText = monsterHealth;
    if (health <= 0) {
      lose();
    } else if (monsterHealth <= 0) {
      if (fighting === 2) {
        winGame();
      } else {
        defeatMonster();
      }
    }
    if (Math.random() <= .1 && inventory.length !== 1) {
      text.innerText += "\n\nWait! Oh no! You have lost " + inventory.pop() + "!";
      currentWeapon--;
    }
  }
  
  function getMonsterAttackValue(level) {
    const hit = (level * 5) - (Math.floor(Math.random() * xp));
    console.log(hit);
    return hit > 0 ? hit : 0;
  }
  
  function isMonsterHit() {
    return Math.random() > .2 || health < 20;
  }
  
  function dodge() {
    text.innerText = "You dodge the attack from " + monsters[fighting].name;
  }
  
  function defeatMonster() {
    goods += Math.floor(monsters[fighting].level * 6.7);
    xp += monsters[fighting].level;
    goodsText.innerText = goods;
    xpText.innerText = xp;
    update(locations[4]);
    if (xp >= 2) {
        rankText.innerText = "[pleb]"
      };
    
      if (xp >= 6) {
        rankText.innerText = "[favoured]"
      };
    
      if (xp >= 20) {
        rankText.innerText = "[advisor]"
      };

      if (xp >= 30) {
        rankText.innerText = "[right-hand]"
      };

      if (xp >= 40) {
        rankText.innerText = "[rival]"
      };

      if (xp >= 50) {
        rankText.innerText = "[ready to lead]"
      };
  }
  
  function lose() {
    update(locations[5]);
    document.getElementById('backgroundMusic').pause();
    document.getElementById('windSounds').pause();
    document.getElementById('knifeSounds').play();
  }
  
 
  function winGame() {
    update(locations[6]);
    document.getElementById('windSounds').pause();
    document.getElementById('yayaBeySnippet').play();
    const winImg = document.getElementById('win-img');
    leader.src = "https://preview.redd.it/what-is-rataus-history-with-his-cult-and-ratoo-v0-au38e19g4zjc1.gif?width=360&auto=webp&s=c8bbc859a9ce2851b0d5f699c0eb9a8f4f011b00";
    follower1.src = "https://preview.redd.it/patch-notes-1-1-5-v0-f8awrb2dfcsa1.gif?width=194&auto=webp&s=34ea76918584d5b33804319d1ec59a0bf9b48914";
    follower2.src = "https://preview.redd.it/patch-notes-1-1-5-v0-f8awrb2dfcsa1.gif?width=194&auto=webp&s=34ea76918584d5b33804319d1ec59a0bf9b48914";
    follower3.src = "https://preview.redd.it/patch-notes-1-1-5-v0-f8awrb2dfcsa1.gif?width=194&auto=webp&s=34ea76918584d5b33804319d1ec59a0bf9b48914";
    follower4.src = "https://preview.redd.it/patch-notes-1-1-5-v0-f8awrb2dfcsa1.gif?width=194&auto=webp&s=34ea76918584d5b33804319d1ec59a0bf9b48914";
    follower5.src = "https://preview.redd.it/patch-notes-1-1-5-v0-f8awrb2dfcsa1.gif?width=194&auto=webp&s=34ea76918584d5b33804319d1ec59a0bf9b48914";
     
winImg.style.display = "inline-block";
  leader.style.display = "inline-block";
  follower1.style.display = "inline-block";
  follower2.style.display = "inline-block";
  follower3.style.display = "inline-block";
  follower4.style.display = "inline-block";
  follower5.style.display = "inline-block";

const giftButton = document.createElement('button'); 
document.body.appendChild(giftButton);
giftButton.textContent = "OFFERING 🎁";
giftButton.style.display = "block";
giftButton.style.margin = "0 auto";
giftButton.style.width = "12rem";
giftButton.style.height = "3rem";
giftButton.style.color = "#d4af37";
giftButton.style.backgroundImage = "linear-gradient(#232b2b, #0e1111)";
giftButton.style.border = "4px dashed #d4af37";
giftButton.style.fontSize = "1.2rem";
giftButton.style.fontWeight = "800";
giftButton.style.fontFamily = "Cambria, Cochin, Georgia, Times, 'Times New Roman', serif";
giftButton.addEventListener('mouseenter', function() {
  giftButton.textContent = "OFFERING ❤️";
   giftButton.style.backgroundImage = "linear-gradient(#d4af37, #b38e2e)";
  giftButton.style.border = "4px dashed #232b2b";
  giftButton.style.color = "#232b2b";
});
giftButton.addEventListener('mouseleave', function() {
  giftButton.textContent = "OFFERING 🎁";
  giftButton.style.backgroundImage = "linear-gradient(#232b2b, #0e1111)";
  giftButton.style.border = "4px dashed #d4af37";
  giftButton.style.color = "#d4af37";
});
giftButton.onclick = function() {
  window.location.href = 'https://92passionfruit.github.io/offering/';
};
  }
  
  function restart() {
    xp = 0;
    health = 100;
    goods = 50;
    currentWeapon = 0;
    inventory = ["existential dread"];
    goodsText.innerText = goods;
    healthText.innerText = health;
    xpText.innerText = xp;
    rankText.innerText = ["[wormling]"];
    goYurt();
    const winImg = document.getElementById('win-img');
    winImg.style.display = "none";
  }

  