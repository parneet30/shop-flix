const Product = require('../models/product');
const mongoose = require('mongoose');

const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/shop-flix';
// process.env.DB_URL

mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database Connected");
});

const products = [
    new Product({
        imagePath: 'https://media.rockstargames.com/rockstargames-newsite/uploads/d5c7e4dcecb612368aee64978f183250b6e643fe.jpg',
        title: 'Red Dead Redemption II',
        description: 'Red Dead Redemption 2 is a western-themed action-adventure video game developed and published by Rockstar Games. Red Dead Redemption 2 is set in an open world consisting of five American regions, which the player can explore as they proceed with the story, and can be played through both third-person and first-person view. As Arthur Morgan, players can interact with the game world in several ways, including story missions, side quests, challenges, randomized events, and hunting. An Honor system, returning from the previous game, changes accordingly to the player\'s actions towards non-player characters',
        price: '49',
        creator: 'Rockstar Games',
        seller: '63431cb5c269eaed4f4ddadc'
    }),
    new Product({
        imagePath: 'https://upload.wikimedia.org/wikipedia/en/b/b6/Ghost_of_Tsushima.jpg',
        title: 'Ghost of Tsushima',
        description: 'Uncover the hidden wonders of Tsushima in this open-world action adventure from Sucker Punch Productions and PlayStation Studios, available for PS5 and PS4. Forge a new path and wage an unconventional war for the freedom of Tsushima. Challenge opponents with your katana, master the bow to eliminate distant threats, develop stealth tactics to ambush enemies and explore a new story on Iki Island.',
        price: '39',
        creator: 'Sucker Punch Productions',
        seller: '63431cb5c269eaed4f4ddadc'
    }),
    new Product({
        imagePath: 'https://upload.wikimedia.org/wikipedia/en/a/a5/Grand_Theft_Auto_V.png',
        title: 'GTA V',
        description: 'Grand Theft Auto V is a 2013 action-adventure game developed by Rockstar North and published by Rockstar Games. It is the seventh main entry in the Grand Theft Auto series, following 2008\'s Grand Theft Auto IV, and the fifteenth instalment overall. Set within the fictional state of San Andreas, based on Southern California, the single-player story follows three protagonists—retired bank robber Michael De Santa, street gangster Franklin Clinton, and drug dealer and gunrunner Trevor Philips—and their attempts to commit heists while under pressure from a corrupt government agency and powerful criminals. The open world design lets players freely roam San Andreas\' open countryside and the fictional city of Los Santos, based on Los Angeles.',
        price: '20',
        creator: 'Rockstar Games',
        seller: '63431cb5c269eaed4f4ddadc'
    }),
    new Product({
        imagePath: 'https://image.api.playstation.com/vulcan/ap/rnd/202008/1423/cZaoNGoCXpClHpljuPVPSUlw.jpg',
        title: 'Spider-Man: Miles Morales',
        description: 'Experience the rise of Miles Morales as the new hero masters incredible, explosive new powers to become his own Spider-Man. In the latest adventure in the Marvel’s Spider-Man universe, teenager Miles Morales is adjusting to his new home while following in the footsteps of his mentor, Peter Parker, as a new Spider-Man.But when a fierce power struggle threatens to destroy his new home, the aspiring hero realizes that with great power, there must also come great responsibility. To save all of Marvel’s New York, Miles must take up the mantle of Spider-Man and own it.',
        price: '69',
        creator: 'Insomniac Games',
        seller: '63431cb5c269eaed4f4ddadc'
    }),
    new Product({
        imagePath: 'https://upload.wikimedia.org/wikipedia/en/4/46/Video_Game_Cover_-_The_Last_of_Us.jpg',
        title: 'The Last of Us',
        description: 'The Last of Us is a 2013 action-adventure game developed by Naughty Dog and published by Sony Computer Entertainment. Players control Joel, a smuggler tasked with escorting a teenage girl, Ellie, across a post-apocalyptic United States. The Last of Us is played from a third-person perspective. Players use firearms and improvised weapons, and can use stealth to defend against hostile humans and cannibalistic creatures infected by a mutated fungus in the genus Cordyceps. In the online multiplayer mode, up to eight players engage in cooperative and competitive gameplay.',
        price: '19',
        creator: 'Naughty Dog',
        seller: '63431cb5c269eaed4f4ddadc'
    }),
    new Product({
        imagePath: 'https://s3.gaming-cdn.com/images/products/6215/orig/the-last-of-us-part-ii-pc-game-steam-cover.jpg',
        title: 'The Last of Us Part II',
        description: 'The Last of Us Part II is a 2020 action-adventure game developed by Naughty Dog and published by Sony Interactive Entertainment for the PlayStation 4. Set five years after The Last of Us (2013), the game focuses on two playable characters in a post-apocalyptic United States whose lives intertwine: Ellie, who sets out for revenge after suffering a tragedy, and Abby, a soldier who becomes involved in a conflict between her militia and a religious cult. The game is played from the third-person perspective and allows the player to fight human enemies and cannibalistic zombie-like creatures with firearms, improvised weapons, and stealth.',
        price: '35',
        creator: 'Naughty Dog',
        seller: '63431cb5c269eaed4f4ddadc'
    }),
    new Product({
        imagePath: 'https://assets-prd.ignimgs.com/2021/12/08/horizonzerodawn-1638924347525.jpg',
        title: 'Horizon Zero Dawn',
        description: 'In an era where Machines roam the land and mankind is no longer the dominant species, a young hunter named Aloy embarks on a journey to discover her destiny. In a lush, post-apocalyptic world where nature has reclaimed the ruins of a forgotten civilization, pockets of humanity live on in primitive hunter-gatherer tribes. Their dominion over the new wilderness has been usurped by the Machines – fearsome mechanical creatures of unknown origin.',
        price: '29',
        creator: 'Guerrilla Games',
        seller: '63431cb5c269eaed4f4ddadc'
    }),
    new Product({
        imagePath: 'https://image.api.playstation.com/vulcan/img/rnd/202111/0822/zDXM9K2cQiq0vKTDwF0TkAor.png',
        title: 'Fifa 22',
        description: 'FIFA 22 is a football simulation video game published by Electronic Arts as part of the FIFA series. It is the 29th installment in the FIFA series, and was released worldwide on 1 October 2021 for Microsoft Windows, Nintendo Switch, PlayStation 4, PlayStation 5, Xbox One and Xbox Series X/S.',
        price: '55',
        creator: 'EA SPORTS',
        seller: '63431cb5c269eaed4f4ddadc'
    })
];

const seedDB = async () => {
    for (var i = 0; i < products.length; i++) {
        await products[i].save();
    }
}

seedDB().then(()=>{
    mongoose.connection.close();
});





// RDR2

// 

//GoT

// 

//GTA5

// 

// spiderman

// 

// last of us

// 

// lat of us 2

// 

// HZD

// 

// f22

// 