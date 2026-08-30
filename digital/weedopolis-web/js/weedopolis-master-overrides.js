/* Weedopolis V1 master visual/data overrides. */
(function () {
  'use strict';

  const DATA = window.WEEDOPOLIS_EDITION;
  if (!DATA) throw new Error('WEEDOPOLIS_EDITION must load before master overrides.');

  const MASTER_COLORS = {
    brown: '#683417',
    light_blue: '#1C78A4',
    pink: '#7B1139',
    orange: '#E65101',
    red: '#B70405',
    yellow: '#CC9F19',
    green: '#3C8527',
    dark_blue: '#0C1179'
  };

  Object.assign(DATA.colors, MASTER_COLORS);
  DATA.spaces.forEach(function (space) {
    if (MASTER_COLORS[space.colorGroup]) {
      space.color = MASTER_COLORS[space.colorGroup];
    }
  });

  DATA.visualContract = {
    version: 'Weedopolis V1',
    structureStandard: '2026-08-29 premium responsive desktop/mobile shell',
    boardMaster: 'Weedopolis_Master_Board_20x20in_300dpi.pdf',
    boardRaster: [6000, 6000],
    cardMasterSource: '01_Property_Deed_Cards verified individual files',
    mockupArtworkApproved: false,
    masterArtworkRequired: true,
    v2HexAllowed: false,
    colors: MASTER_COLORS
  };
})();
