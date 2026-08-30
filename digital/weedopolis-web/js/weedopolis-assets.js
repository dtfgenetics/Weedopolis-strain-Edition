/* Canonical Weedopolis V1 ownership-card asset registry.
 * Runtime code must map to verified master artwork; do not regenerate card art.
 */
(function () {
  'use strict';

  const COLORS = {
    brown: '#683417',
    light_blue: '#1C78A4',
    pink: '#7B1139',
    orange: '#E65101',
    red: '#B70405',
    yellow: '#CC9F19',
    green: '#3C8527',
    dark_blue: '#0C1179'
  };

  // Only IDs in this table may trigger a browser request for a deed image.
  // This prevents 404 probes for verified masters whose browser exports have
  // not yet been recovered and checksum-approved.
  const VERIFIED_WEB_EXPORTS = {
    autoflower: {
      bytes: 39634,
      sha256: '84c0d05bfc26aa104351e3f9065e1ea8b2a94bacc566b5b66a57ff7ad98fca12'
    }
  };

  const cards = [
    ['acapulco-gold','Acapulco Gold','property',2,60,'brown','Property_Acapulco_Gold_Verified.png'],
    ['maui-wowie','Maui Wowie','property',4,60,'brown','Property_Maui_Wowie_Verified.png'],
    ['northern-lights','Northern Lights','property',7,100,'light_blue','Property_Northern_Lights_Verified.png'],
    ['jack-herer','Jack Herer','property',9,100,'light_blue','Property_Jack_Herer_Verified.png'],
    ['durban-poison','Durban Poison','property',10,120,'light_blue','Property_Durban_Poison_Verified.png'],
    ['white-widow','White Widow','property',12,140,'pink','Property_White_Widow_Verified.png'],
    ['blueberry','Blueberry','property',14,140,'pink','Property_Blueberry_Verified.png'],
    ['granddaddy-purple','Granddaddy Purple','property',15,160,'pink','Property_Granddaddy_Purple_Verified.png'],
    ['green-crack','Green Crack','property',18,180,'orange','Property_Green_Crack_Verified.png'],
    ['pineapple-express','Pineapple Express','property',19,180,'orange','Property_Pineapple_Express_Verified.png'],
    ['blue-dream','Blue Dream','property',20,200,'orange','Property_Blue_Dream_Verified.png'],
    ['gsc','GSC','property',22,220,'red','Property_GSC_Verified.png'],
    ['cookies-and-cream','Cookies & Cream','property',24,220,'red','Property_Cookies_and_Cream_Verified.png'],
    ['gelato','Gelato','property',25,240,'red','Property_Gelato_Card_Verified.png'],
    ['wedding-cake','Wedding Cake','property',27,260,'yellow','Property_Wedding_Cake_Verified.png'],
    ['runtz','Runtz','property',28,260,'yellow','Property_Runtz_Verified.png'],
    ['zkittlez','Zkittlez','property',30,280,'yellow','Property_Z_Candy_Verified.png'],
    ['chemdawg','Chemdawg','property',32,300,'green','Property_Chemdawg_Verified.png'],
    ['sour-diesel','Sour Diesel','property',33,300,'green','Property_Sour_Diesel_Verified.png'],
    ['gg4','GG4','property',35,320,'green','Property_GG4_Verified.png'],
    ['og-kush','OG Kush','property',38,350,'dark_blue','Property_OG_Kush_Verified.png'],
    ['permanent-marker','Permanent Marker','property',40,400,'dark_blue','Property_Permanent_Marker_Verified.png'],
    ['indica','Indica','category',6,200,null,'Premium_Line_Indica_Verified.png'],
    ['sativa','Sativa','category',16,200,null,'Premium_Line_Sativa_Verified.png'],
    ['hybrid','Hybrid','category',26,200,null,'Premium_Line_Hybrid_Verified.png'],
    ['autoflower','Autoflower','category',36,200,null,'Premium_Line_AutoFlower_Verified.png'],
    ['grow-lights','Grow Lights','utility',13,150,null,'Utility_Grow_Lights_Verified.png'],
    ['water-works','Water Works','utility',29,150,null,'Utility_Water_Works_Verified.png']
  ].map(function (row) {
    const [id, name, type, boardPosition, purchase, colorGroup, sourceFile] = row;
    const verifiedWebExport = VERIFIED_WEB_EXPORTS[id] || null;
    return {
      id,
      name,
      type,
      boardPosition,
      spaceIndex: boardPosition - 1,
      purchase,
      colorGroup,
      colorHex: colorGroup ? COLORS[colorGroup] : null,
      swatchPolicy: type === 'property' ? 'match-v1-master-board' : 'preserve-original-card-art',
      sourceFile,
      webImage: 'assets/property-cards/webp/' + id + '.webp',
      webReady: Boolean(verifiedWebExport),
      webBytes: verifiedWebExport ? verifiedWebExport.bytes : null,
      webSha256: verifiedWebExport ? verifiedWebExport.sha256 : null,
      masterImage: 'assets/property-cards/master/' + sourceFile
    };
  });

  const bySpaceIndex = Object.fromEntries(cards.map(function (card) { return [card.spaceIndex, card]; }));
  const byId = Object.fromEntries(cards.map(function (card) { return [card.id, card]; }));

  window.WEEDOPOLIS_ASSETS = {
    version: 'v1-master-ownership-registry',
    sourceOfTruth: 'verified individual ownership-card masters',
    generatedMockupArtAllowed: false,
    expectedOwnershipCards: 28,
    expectedProperties: 22,
    expectedPremiumLines: 4,
    expectedUtilities: 2,
    verifiedWebExportCount: Object.keys(VERIFIED_WEB_EXPORTS).length,
    verifiedWebExports: VERIFIED_WEB_EXPORTS,
    colors: COLORS,
    cards,
    bySpaceIndex,
    byId,
    decks: {
      highChance: { expected: 15, path: 'assets/decks/high-chance/' },
      communityStash: { expected: 16, path: 'assets/decks/community-stash/' }
    },
    money: { denominations: [1,5,10,20,50,100,500], path: 'assets/money/' }
  };
})();
