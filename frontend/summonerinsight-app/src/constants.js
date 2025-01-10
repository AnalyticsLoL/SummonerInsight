import ironImage from "./assets/img/ranks/Iron.png";
import bronzeImage from "./assets/img/ranks/Bronze.png";
import silverImage from "./assets/img/ranks/Silver.png";
import goldImage from "./assets/img/ranks/Gold.png";
import platinumImage from "./assets/img/ranks/Platinum.png";
import diamondImage from "./assets/img/ranks/Diamond.png";
import masterImage from "./assets/img/ranks/Master.png";
import grandmasterImage from "./assets/img/ranks/Grandmaster.png";
import challengerImage from "./assets/img/ranks/Challenger.png";

import championMastery0 from "./assets/img/mastery/0.png";
import championMastery1 from "./assets/img/mastery/1.png";
import championMastery2 from "./assets/img/mastery/2.png";
import championMastery3 from "./assets/img/mastery/3.png";
import championMastery4 from "./assets/img/mastery/4.png";
import championMastery5 from "./assets/img/mastery/5.png";
import championMastery6 from "./assets/img/mastery/6.png";
import championMastery7 from "./assets/img/mastery/7.png";
import championMastery8 from "./assets/img/mastery/8.png";
import championMastery9 from "./assets/img/mastery/9.png";
import championMastery10 from "./assets/img/mastery/10.png";

import { ReactComponent as TopIcon } from "./assets/svg/position_icons/top.svg";
import { ReactComponent as JungleIcon } from "./assets/svg/position_icons/jungle.svg";
import { ReactComponent as MidIcon } from "./assets/svg/position_icons/mid.svg";
import { ReactComponent as AdcIcon } from "./assets/svg/position_icons/adc.svg";
import { ReactComponent as SupportIcon } from "./assets/svg/position_icons/support.svg";

import { ReactComponent as BrIcon } from "./assets/svg/region_icons/br.svg";
import { ReactComponent as EuneIcon } from "./assets/svg/region_icons/eune.svg";
import { ReactComponent as EuwIcon } from "./assets/svg/region_icons/euw.svg";
import { ReactComponent as JpIcon } from "./assets/svg/region_icons/jp.svg";
import { ReactComponent as KrIcon } from "./assets/svg/region_icons/kr.svg";
import { ReactComponent as LanIcon } from "./assets/svg/region_icons/lan.svg";
import { ReactComponent as LasIcon } from "./assets/svg/region_icons/las.svg";
import { ReactComponent as MeIcon } from "./assets/svg/region_icons/me.svg";
import { ReactComponent as NaIcon } from "./assets/svg/region_icons/na.svg";
import { ReactComponent as OceIcon } from "./assets/svg/region_icons/oce.svg";
import { ReactComponent as PhIcon } from "./assets/svg/region_icons/ph.svg";
import { ReactComponent as RuIcon } from "./assets/svg/region_icons/ru.svg";
import { ReactComponent as SiIcon } from "./assets/svg/region_icons/si.svg";
import { ReactComponent as TaIcon } from "./assets/svg/region_icons/ta.svg";
import { ReactComponent as ThIcon } from "./assets/svg/region_icons/th.svg";
import { ReactComponent as TrIcon } from "./assets/svg/region_icons/tr.svg";
import { ReactComponent as ViIcon } from "./assets/svg/region_icons/vi.svg";

import { faExclamationCircle, faInfoCircle } from '@fortawesome/free-solid-svg-icons';

// Fetch last version number of league of legends
let league_version;
try {
    let versionResponse = await fetch("https://ddragon.leagueoflegends.com/api/versions.json");
    versionResponse = await versionResponse.json();
    league_version = versionResponse[0];
    console.log(`League of Legends current version number: ${league_version}`);
} catch (error) {
    console.error('Failed to fetch league of legends current version number');
}
export { league_version };

// Url of the .Net application
export const api_url = "http://dev.summonerinsight.com:5151/api/RiotData";

// Path to get item icons
export const itemIconPath = `https://ddragon.leagueoflegends.com/cdn/${league_version}/img/item`;

// Path to get champion splash arts
export const championSplashPath = "https://ddragon.leagueoflegends.com/cdn/img/champion/splash"; // Add the champion name and the skin number '.jpg'

// Path to get champion loading arts
export const championLoadingPath = "https://ddragon.leagueoflegends.com/cdn/img/champion/loading"; // Add the champion name and the skin number '.jpg'

// Path to get champion icon
export const championIconPath = `https://ddragon.leagueoflegends.com/cdn/${league_version}/img/champion`;

// Path to get profile icon
export const profileIconPath = `https://ddragon.leagueoflegends.com/cdn/${league_version}/img/profileicon`;

// Path to get champion passives icons
export const championPassivePath = `https://ddragon.leagueoflegends.com/cdn/${league_version}/img/passive`;

// Path to get champion/summoner spells icons
export const championSpellPath = `https://ddragon.leagueoflegends.com/cdn/${league_version}/img/spell`;

// Path to get champion general data
export const ddragonChampionGlobalPath = `https://ddragon.leagueoflegends.com/cdn/${league_version}/data/en_US/champion.json`;

// Data object of champions fetched from ddragonChampionGlobalPath
console.log(`Fetching champion Data from: ${ddragonChampionGlobalPath}`);
let championFullData;
try {
    let championResponse = await fetch(ddragonChampionGlobalPath);
    championFullData = await championResponse.json();
} catch (error) {
    console.error('Failed to fetch champion data');
}
export { championFullData };

// Path to get champion specific data
export const ddragonChampionSpecificPath = `https://ddragon.leagueoflegends.com/cdn/${league_version}/data/en_US/champion`;

// Path to get item data
export const ddragonItemPath = `https://ddragon.leagueoflegends.com/cdn/${league_version}/data/en_US/item.json`;

// Data object of items fetched from ddragonItemPath
console.log(`Fetching item Data from: ${ddragonItemPath}`);
let itemFullData;
try {
    let itemResponse = await fetch(ddragonItemPath);
    itemFullData = await itemResponse.json();
} catch (error) {
    console.error('Failed to fetch item data');
}
export { itemFullData };

// Path to get summoner spells data
export const ddragonSummonerSpellPath = `https://ddragon.leagueoflegends.com/cdn/${league_version}/data/en_US/summoner.json`;

// Path to get map data
export const ddragonMapPath = `https://ddragon.leagueoflegends.com/cdn/${league_version}/data/en_US/map.json`;

// Path to get map img
export const ddragonMapImgPath = `https://ddragon.leagueoflegends.com/cdn/${league_version}/img/map`;

// All the regions of league of legends
export const regions = [
    {regionName: "North America", regionTag: "NA1", regionRoute: "americas", regionIcon: NaIcon},
    {regionName: "Middle East", regionTag: "ME1", regionRoute: "asia", regionIcon: MeIcon},
    {regionName: "Europe West", regionTag: "EUW1", regionRoute: "europe", regionIcon: EuwIcon},
    {regionName: "Europe Nordic & East", regionTag: "EUN1", regionRoute: "europe", regionIcon: EuneIcon},
    {regionName: "Oceania", regionTag: "OC1", regionRoute: "asia", regionIcon: OceIcon},
    {regionName: "Korea", regionTag: "KR1", regionRoute: "asia", regionIcon: KrIcon},
    {regionName: "Japan", regionTag: "JP1", regionRoute: "asia", regionIcon: JpIcon},
    {regionName: "Brazil", regionTag: "BR1", regionRoute: "americas", regionIcon: BrIcon},
    {regionName: "LAS", regionTag: "LA2", regionRoute: "americas", regionIcon: LasIcon},
    {regionName: "LAN", regionTag: "LA1", regionRoute: "americas", regionIcon: LanIcon},
    {regionName: "Russia", regionTag: "RU", regionRoute: "europe", regionIcon: RuIcon},
    {regionName: "Turkey", regionTag: "TR1", regionRoute: "asia", regionIcon: TrIcon},
    {regionName: "Singapore", regionTag: "SG2", regionRoute: "asia", regionIcon: SiIcon},
    {regionName: "Philippines", regionTag: "PH2", regionRoute: "asia", regionIcon: PhIcon},
    {regionName: "Taiwan", regionTag: "TW2", regionRoute: "asia", regionIcon: TaIcon},
    {regionName: "Vietnam", regionTag: "VN2", regionRoute: "asia", regionIcon: ViIcon},
    {regionName: "Thailand", regionTag: "TH2", regionRoute: "asia", regionIcon: ThIcon}
];

// To link the ranks to their respective emblems
export const ranks = [
    {tier: "Iron", rankEmbleme: ironImage},
    {tier: "Bronze", rankEmbleme: bronzeImage},
    {tier: "Silver", rankEmbleme: silverImage},
    {tier: "Gold", rankEmbleme: goldImage},
    {tier: "Platinum", rankEmbleme: platinumImage},
    {tier: "Diamond", rankEmbleme: diamondImage},
    {tier: "Master", rankEmbleme: masterImage},
    {tier: "Grandmaster", rankEmbleme: grandmasterImage},
    {tier: "Challenger", rankEmbleme: challengerImage},
];

// To translate generic game modes names to their respective names (gameModes are very simplified)
export const gameModes = [
    {gameMode: "CLASSIC", gameModeName: "Summoner's Rift"},
    {gameMode: "ARAM", gameModeName: "ARAM"},
    {gameMode: "URF", gameModeName: "URF"},
    {gameMode: "ONEFORALL", gameModeName: "One For All"},
    {gameMode: "NEXUSBLITZ", gameModeName: "Nexus Blitz"},
    {gameMode: "TUTORIAL", gameModeName: "Tutorial"},
    {gameMode: "ULTBOOK", gameModeName: "Ultimate Spellbook"},
]

// To link the queueTypes to their respective type of game and map
export const gameTypesPath = "https://static.developer.riotgames.com/docs/lol/queues.json";

console.log(`Fetching gameTypes from: ${gameTypesPath}`);
let gameTypes;
try {
    let gameTypesResponse = await fetch(gameTypesPath);
    gameTypes = await gameTypesResponse.json();
} catch (error) {
    console.error('Failed to fetch gameTypes data');
}
export { gameTypes };

// To link the champions masteries Icon to their respective levels
export const championMasteriesIcons = [
    {masteryId: 0, masteryIcon: championMastery0},
    {masteryId: 1, masteryIcon: championMastery1},
    {masteryId: 2, masteryIcon: championMastery2},
    {masteryId: 3, masteryIcon: championMastery3},
    {masteryId: 4, masteryIcon: championMastery4},
    {masteryId: 5, masteryIcon: championMastery5},
    {masteryId: 6, masteryIcon: championMastery6},
    {masteryId: 7, masteryIcon: championMastery7},
    {masteryId: 8, masteryIcon: championMastery8},
    {masteryId: 9, masteryIcon: championMastery9},
    {masteryId: 10, masteryIcon: championMastery10}
]

export const positions = [
    {API_name: "TOP", positionIcon: TopIcon, positionName: "Top"},
    {API_name: "JUNGLE", positionIcon: JungleIcon, positionName: "Jungle"},
    {API_name: "MIDDLE", positionIcon: MidIcon, positionName: "Mid"},
    {API_name: "BOTTOM", positionIcon: AdcIcon, positionName: "ADC"},
    {API_name: "UTILITY", positionIcon: SupportIcon, positionName: "Support"}
]

export const rewardTypes = [
    {type: "HEXTECH_CHEST", name: "Coffre Hextech"},
]

export const gradeGPA = {
    "S+": 4.3,
    "S": 4.3,
    "S-": 4.0,
    "A+": 3.7,
    "A": 3.5,
    "A-": 3.2,
    "B+": 2.7,
    "B": 2.5,
    "B-": 2.2,
    "C+": 1.7,
    "C": 1.5,
    "C-": 1.2,
    "D+": 0,
    "D": 0,
    "D-": 0
};

export const messages = [
    {name: "error", icon: faExclamationCircle},
    {name: "info", icon: faInfoCircle}
];

export const errors = [
    {statusText: "Too Many Requests", message: 'Too many requests. Please try again in a few seconds.'},
    {statusText: "Not Found", message: 'Summoner not found: Please enter your tag numbers using the format #0000 or select the right region.'},
    {statusText: "Service Unavailable", message: 'Connection to Riot failed. Please try again.'}
];