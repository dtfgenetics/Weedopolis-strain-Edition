/* Weedopolis: Strain City Edition data layer. */
(function () {
  const COLORS = {
    brown: '#8b5a2b',
    light_blue: '#84c7e8',
    pink: '#d64f95',
    orange: '#ed8b32',
    red: '#d83a35',
    yellow: '#efc84a',
    green: '#2f8f4e',
    dark_blue: '#254a91',
    category: '#c8a64b',
    utility: '#4c7f78',
    none: '#efe2bd'
  };

  const rent = {
    2:[2,10,30,90,160,250,30,50],4:[4,20,60,180,320,450,30,50],
    7:[6,30,90,270,400,550,50,50],9:[6,30,90,270,400,550,50,50],10:[8,40,100,300,450,600,60,50],
    12:[10,50,150,450,625,750,70,100],14:[10,50,150,450,625,750,70,100],15:[12,60,180,500,700,900,80,100],
    18:[14,70,200,550,750,950,90,100],19:[14,70,200,550,750,950,90,100],20:[16,80,220,600,800,1000,100,100],
    22:[18,90,250,700,875,1050,110,150],24:[18,90,250,700,875,1050,110,150],25:[20,100,300,750,925,1100,120,150],
    27:[22,110,330,800,975,1150,130,150],28:[22,110,330,800,975,1150,130,150],30:[24,120,360,850,1025,1200,140,150],
    32:[26,130,390,900,1100,1275,150,200],33:[26,130,390,900,1100,1275,150,200],35:[28,150,450,1000,1200,1400,160,200],
    38:[35,175,500,1100,1300,1500,175,200],40:[50,200,600,1400,1700,2000,200,200]
  };

  const rawSpaces = [
    [1,'Start Session','corner','bottom','none',0,0,'Collect 200 Bud Bucks when passing or landing.'],
    [2,'Acapulco Gold','property','bottom','brown',60,2,'First brown strain property.'],
    [3,'Community Stash','card','bottom','none',0,0,'Draw Community Stash.'],
    [4,'Maui Wowie','property','bottom','brown',60,4,'Second brown strain property.'],
    [5,'420 Tax','tax','bottom','none',0,0,'Pay 200 Bud Bucks.'],
    [6,'Indica','category','bottom','category',200,25,'Premium Line category space.'],
    [7,'Northern Lights','property','bottom','light_blue',100,6,'Light blue set.'],
    [8,'High Chance','card','bottom','none',0,0,'Draw High Chance.'],
    [9,'Jack Herer','property','bottom','light_blue',100,6,'Light blue set.'],
    [10,'Durban Poison','property','bottom','light_blue',120,8,'Light blue set.'],
    [11,'Trim Jail / Just Visiting','corner','left','none',0,0,'Trim Jail corner.'],
    [12,'White Widow','property','left','pink',140,10,'Pink set.'],
    [13,'Grow Lights','utility','left','utility',150,0,'Utility.'],
    [14,'Blueberry','property','left','pink',140,10,'Pink set.'],
    [15,'Granddaddy Purple','property','left','pink',160,12,'Pink set.'],
    [16,'Sativa','category','left','category',200,25,'Premium Line category space.'],
    [17,'Community Stash','card','left','none',0,0,'Draw Community Stash.'],
    [18,'Green Crack','property','left','orange',180,14,'Orange set.'],
    [19,'Pineapple Express','property','left','orange',180,14,'Orange set.'],
    [20,'Blue Dream','property','left','orange',200,16,'Orange set.'],
    [21,'Smoke Break','corner','top','none',0,0,'Rest space.'],
    [22,'GSC','property','top','red',220,18,'Red set.'],
    [23,'High Chance','card','top','none',0,0,'Draw High Chance.'],
    [24,'Cookies & Cream','property','top','red',220,18,'Red set.'],
    [25,'Gelato','property','top','red',240,20,'Red set.'],
    [26,'Hybrid','category','top','category',200,25,'Premium Line category space.'],
    [27,'Wedding Cake','property','top','yellow',260,22,'Yellow set.'],
    [28,'Runtz','property','top','yellow',260,22,'Yellow set.'],
    [29,'Water Works','utility','top','utility',150,0,'Utility.'],
    [30,'Zkittlez','property','top','yellow',280,24,'Yellow set.'],
    [31,'Compliance Check','corner','right','none',0,0,'Go to Trim Jail.'],
    [32,'Chemdawg','property','right','green',300,26,'Green set.'],
    [33,'Sour Diesel','property','right','green',300,26,'Green set.'],
    [34,'Community Stash','card','right','none',0,0,'Draw Community Stash.'],
    [35,'GG4','property','right','green',320,28,'Green set.'],
    [36,'Autoflower','category','right','category',200,25,'Premium Line category space.'],
    [37,'High Chance','card','right','none',0,0,'Draw High Chance.'],
    [38,'OG Kush','property','right','dark_blue',350,35,'Dark blue set.'],
    [39,'Lab Testing Fee','fee','right','none',0,0,'Pay 100 Bud Bucks.'],
    [40,'Permanent Marker','property','right','dark_blue',400,50,'Final dark blue strain property.']
  ];

  function enrich(row) {
    const [spaceNumber, name, type, side, colorGroup, price, baseRent, notes] = row;
    const ladder = rent[spaceNumber] || [baseRent,0,0,0,0,0,Math.floor(price / 2),0];
    return {
      index: spaceNumber - 1,
      spaceNumber, name, type, side, colorGroup,
      color: COLORS[colorGroup] || COLORS.none,
      price,
      rentBase: ladder[0],
      rent: ladder.slice(0,6),
      mortgageValue: ladder[6],
      upgradeCost: ladder[7],
      owner: null,
      mortgaged: false,
      upgrades: 0,
      notes
    };
  }

  const spaces = rawSpaces.map(enrich);

  const highChance = [
    ['Advance to Start Session. Collect 200 Bud Bucks.','moveTo',0],
    ['Advance to Indica. Collect 200 Bud Bucks if you pass Start Session.','moveTo',5],
    ['Advance to Hybrid. Collect 200 Bud Bucks if you pass Start Session.','moveTo',25],
    ['Advance to OG Kush.','moveTo',37],
    ['Advance to Gelato. Collect 200 Bud Bucks if you pass Start Session.','moveTo',24],
    ['Advance to nearest Premium Line. If owned, pay double rent.','nearestCategory',2],
    ['Advance to nearest Premium Line. If owned, pay double rent.','nearestCategory',2],
    ['Advance to nearest utility. If owned, pay 10x the dice roll.','nearestUtility',10],
    ['Go back three spaces.','moveRelative',-3],
    ['Compliance sweep. Go directly to Trim Jail.','jail',0],
    ['Pop-up promo hit. Collect 50 Bud Bucks.','money',50],
    ['Packaging delay. Pay 15 Bud Bucks.','money',-15],
    ['Brand collab pays off. Collect 150 Bud Bucks.','money',150],
    ['Influencer shoutout. Collect 100 Bud Bucks.','money',100],
    ['Event booth fee. Pay 50 Bud Bucks.','money',-50],
    ['Make repairs: 25 per Grow Tent and 100 per Dispensary.','repair',[25,100]],
    ['Pay each player 50 Bud Bucks for sample packs.','payEach',50],
    ['Collect 25 Bud Bucks consulting fee.','money',25],
    ['Seed drop sells out. Collect 200 Bud Bucks.','money',200],
    ['Lose a turn at Smoke Break.','moveTo',20],
    ['Advance to Blue Dream.','moveTo',19],
    ['Advance to Wedding Cake.','moveTo',26],
    ['Keep this card: Skip one Trim Jail fee.','jailFree','highChance'],
    ['Quality control win. Collect 75 Bud Bucks.','money',75]
  ].map((c, id) => ({ id, deck:'High Chance', text:c[0], action:c[1], value:c[2] }));

  const communityStash = [
    ['Community grow class fills up. Collect 100 Bud Bucks.','money',100],
    ['Birthday sesh. Collect 10 Bud Bucks from every player.','collectEach',10],
    ['Stash jar refund. Collect 20 Bud Bucks.','money',20],
    ['Genetics consultation. Collect 25 Bud Bucks.','money',25],
    ['Harvest bonus. Collect 100 Bud Bucks.','money',100],
    ['Local market day. Collect 50 Bud Bucks.','money',50],
    ['Lab paperwork issue. Pay 50 Bud Bucks.','money',-50],
    ['Equipment repair. Pay 100 Bud Bucks.','money',-100],
    ['Community support fund. Pay 50 Bud Bucks.','money',-50],
    ['Advance to Start Session. Collect 200 Bud Bucks.','moveTo',0],
    ['Trim crew helps out. Collect 75 Bud Bucks.','money',75],
    ['Giveaway costs more than planned. Pay 25 Bud Bucks.','money',-25],
    ['Keep this card: Skip one Trim Jail fee.','jailFree','communityStash'],
    ['Go directly to Trim Jail.','jail',0],
    ['Build-out inspection. Pay 40 per Grow Tent and 115 per Dispensary.','repair',[40,115]],
    ['Product review goes viral. Collect 200 Bud Bucks.','money',200],
    ['Supplies sale. Collect 45 Bud Bucks.','money',45],
    ['Event wristbands. Pay 30 Bud Bucks.','money',-30],
    ['Collect 10 Bud Bucks from every player for the smoke circle.','collectEach',10],
    ['Pay each player 25 Bud Bucks for munchies.','payEach',25],
    ['Advance to Grow Lights.','moveTo',12],
    ['Advance to Water Works.','moveTo',28],
    ['Stash audit passes. Collect 60 Bud Bucks.','money',60],
    ['Lost lighter tax. Pay 10 Bud Bucks.','money',-10]
  ].map((c, id) => ({ id, deck:'Community Stash', text:c[0], action:c[1], value:c[2] }));

  window.WEEDOPOLIS_EDITION = {
    gameName: 'Weedopolis',
    edition: 'Strain City Edition',
    startMoney: 1500,
    passStartBonus: 200,
    trimJailIndex: 10,
    categoryRent: [25,50,100,200],
    utilityMultipliers: { one: 4, both: 10 },
    colors: COLORS,
    spaces,
    decks: { highChance, communityStash }
  };
})();
