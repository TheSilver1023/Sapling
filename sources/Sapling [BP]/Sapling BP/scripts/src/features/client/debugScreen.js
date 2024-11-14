import { world, system, packet, server } from "@script-api/server.js";
import { MemoryTier } from "@script-api/vanilla-data.js";
import { Chunk, Utils } from "@script-api/sapling.js";

const PlayersData = new Map();
packet.on('dataDrivenEntityTrigger', ({ entity, eventId }) => {
    if (!entity || entity.typeId !== 'minecraft:player' || !eventId.startsWith('sa:')) return;
    const playerName = entity.name;

    if (!PlayersData.has(playerName)) PlayersData.set(playerName, {});
    const newData = PlayersData.get(playerName);
    const [ , key, value ] = eventId.split(':');
    newData[key] = value;

    PlayersData.set(playerName, newData);
});


let [ i2, i3, i4 ] = [ 0, 0, 0 ];
system.interval(() => {
    const players = world.getPlayers();

    // Tick 1
    (() => {
        debugScreen(players, 0, 0);
        debugScreen(players, 0, 1);
    })();

    // Tick 2
    system.timeout(() => {
        i2 = debugScreen(players, 1, i2);
        debugScreen(players, 0, 1);
    }, 1)

    // Tick 3
    system.timeout(() => {
        i3 = debugScreen(players, 2, i3);
        debugScreen(players, 0, 1);
    }, 1)

    // Tick 4
    system.timeout(() => {
        i4 = debugScreen(players, 3, i4);
        debugScreen(players, 0, 1);
    }, 1)

}, 4);

function debugScreen(players, tick, i) {
    let elementsLength;
    for (const player of players) {
        if (!player) continue;
        
        const isDebug = player.hasTag('client:debugScreen');
        const playerData = getDataFromPlayer(player);
        const elements = generateElements(playerData)[`tick:${tick}`];
        elementsLength = elements.length;

        if (elementsLength === 0 || i >= elementsLength) continue;

        const { key, data, type } = elements[i];

        if (type === 'title') setTitle(player, `!${key}.${isDebug ? data : ''}`);
        else setSubtitle(player, `!${key}.${isDebug ? data : ''}`);
    }

    return i + 1 >= elementsLength ? 0 : i + 1;
}

function generateElements(data) {
    server.tps = Math.round(server.tps);
	const tps = server.tps >= 20 ? `§a20` : `§c${server.tps}`;

    return {
        'tick:0': [
            { key: 'lp00', data: 'Sapling Build: 2.0', type: 'title' },
            { key: 'lp04', data: `XYZ: ${data.x} / ${data.y} / ${data.z}`, type: 'subtitle' }
        ],
        'tick:1': [
            // Left panel
            { key: 'lp01', data: `TPS: ${tps}`, type: 'title' },
            { key: 'lp05', data: `Chunk: [ ${data.cx}, ${data.cz} ]${data.cs ? '  §aisSlime' : ''}`, type: 'title' },
            { key: 'lp08', data: `Biome: minecraft:${data.biome}`, type: 'title' },
            // Right panel
            { key: 'rp02', data: `Max render: ${data.maxRenderDistance}`, type: 'title', onlyOnce: 'maxRender' },
        ],
        'tick:2': [
            // Left panel
            { key: 'lp02', data: `E: ${data.viewEntities} / ${data.dimensionEntities}`, type: 'title' },
            { key: 'lp06', data: `Facing: ${data.facingDirection}`, type: 'title' },
            // Right panel
            { key: 'rp00', data: `Platform: ${data.platform}`, type: 'title', onlyOnce: 'platForm' },
        ],
        'tick:3': [
            // Left panel
            { key: 'lp03', data: data.dimension, type: 'title' },
            { key: 'lp07', data: `Client Light: ${data.light}`, type: 'title' },
            // Right panel
            { key: 'rp01', data: `Memory: ${data.memory} (${data.memoryEquivalent})`, type: 'title', onlyOnce: 'memory' },
        ],
    }
}

function getDataFromPlayer(player) {
    const { location, dimension, name } = player;
    const dynamicData = PlayersData.has(name) ? PlayersData.get(name) : { client_biome: 'plains', client_light: 15, isVillage: false, isUnderground: false };
    const chunk = new Chunk(location.x, location.z);
    const systemInfo = player.clientSystemInfo;

    const viewEntities = player.getEntitiesFromViewDirection({ ignoreBlockCollision: true }).length;
    const dimensionEntities = dimension.getEntities().length;
    const facingDirection = Utils.getDirection(player.getRotation().y);
    const memoryData = [ '???', 'max 1.5GBs', 'max 2GBs', 'max 4GBs', 'max 8GBs', 'above 8GBs' ];

    return {
        // Location
        x: Math.floor(location.x).toFixed(2),
        y: Math.floor(location.y).toFixed(2),
        z: Math.floor(location.z).toFixed(2),
        // Chunk data
        cx: chunk.worldX,
        cz: chunk.worldZ,
        cs: chunk.isSlime(),
        // World
        dimension: dimension.id,
        biome: dynamicData.client_biome,
        light: dynamicData.client_light,
        isVillage: dynamicData.isVillage,
        isUnderground: dynamicData.isUnderground,
        viewEntities,
        dimensionEntities,
        facingDirection,
        // System
        platform: systemInfo.platformType,
        memory: Object.keys(MemoryTier)[systemInfo.memoryTier],
        memoryEquivalent: memoryData[systemInfo.memoryTier],
        maxRenderDistance: systemInfo.maxRenderDistance,
        player
    }
}

function setTitle(player, text) {
    player.runCommand(`titleraw @s title { "rawtext": [{ "text": "${text}" }] }`);
}

function setSubtitle(player, text) {
    player.runCommand(`titleraw @s subtitle { "rawtext": [{ "text": "${text}" }] }`);
}